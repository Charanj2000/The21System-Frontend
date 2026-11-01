import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!WEBHOOK_SECRET || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("Missing webhook environment variables.");
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

async function verifyWebhookSignature(rawBody: string, signatureHex: string): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/i.test(signatureHex)) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expected = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const a = encoder.encode(expected);
  const b = encoder.encode(signatureHex.toLowerCase());
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      if (req.method !== "POST") {
        return json({ success: false, error: "Method not allowed" }, 405);
      }

      const signature = req.headers.get("x-razorpay-signature") ?? "";
      const rawBody = await req.text();

      if (!signature || !(await verifyWebhookSignature(rawBody, signature))) {
        return json({ success: false, error: "Invalid signature" }, 401);
      }

      let event: {
        event?: string;
        payload?: { payment?: { entity?: Record<string, unknown> } };
      };
      try {
        event = JSON.parse(rawBody);
      } catch {
        return json({ success: false, error: "Invalid payload" }, 400);
      }

      const payment = event.payload?.payment?.entity;
      if (!event.event || !payment) {
        return json({ success: true, ignored: true });
      }

      if (event.event !== "payment.captured" && event.event !== "payment.failed") {
        return json({ success: true, ignored: true });
      }

      const razorpayOrderId = typeof payment.order_id === "string" ? payment.order_id : "";
      const razorpayPaymentId = typeof payment.id === "string" ? payment.id : "";
      const amount = typeof payment.amount === "number" ? payment.amount : Number(payment.amount);
      const currency = typeof payment.currency === "string" ? payment.currency : "";
      const method = typeof payment.method === "string" ? payment.method : null;

      if (!razorpayOrderId || !razorpayPaymentId) {
        return json({ success: false, error: "Payment missing identifiers" }, 400);
      }

      const { data: record, error: lookupError } = await admin
        .from("payments")
        .select("id, user_id, product_id, cohort_id, amount, currency, status")
        .eq("razorpay_order_id", razorpayOrderId)
        .eq("payment_provider", "razorpay")
        .maybeSingle();

      if (lookupError) {
        console.error("Webhook payment lookup failed:", lookupError);
        return json({ success: false, error: "Lookup failed" }, 500);
      }
      if (!record) {
        console.error("Webhook received for unknown order:", razorpayOrderId);
        return json({ success: true, ignored: true });
      }

      if (event.event === "payment.failed") {
        if (record.status === "pending") {
          await admin.from("payments").update({
            status: "failed",
            razorpay_payment_id: razorpayPaymentId,
            payment_method: method,
            updated_at: new Date().toISOString(),
          }).eq("id", record.id).eq("status", "pending");
        }
        return json({ success: true });
      }

      // payment.captured — validate the amount/currency match what we recorded.
      if (Number(amount) !== Number(record.amount) || currency !== record.currency) {
        console.error("Webhook amount/currency mismatch for payment:", record.id);
        return json({ success: false, error: "Payment details do not match" }, 400);
      }

      if (record.status === "paid") {
        // Already settled by verify-payment. Make sure enrollment exists.
        if (record.cohort_id) {
          await admin.from("enrollments").upsert({
            user_id: record.user_id,
            product_id: record.product_id,
            cohort_id: record.cohort_id,
            status: "active",
            enrolled_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id,cohort_id", ignoreDuplicates: true });
        }
        return json({ success: true, status: "already_paid" });
      }

      if (!record.cohort_id) {
        console.error("Webhook payment has no cohort attached:", record.id);
        return json({ success: false, error: "Payment missing cohort" }, 500);
      }

      // Capacity hard-check before enrolling.
      const { data: cohortRecord } = await admin
        .from("cohorts")
        .select("max_students")
        .eq("id", record.cohort_id)
        .maybeSingle();

      if (cohortRecord && typeof cohortRecord.max_students === "number" && cohortRecord.max_students > 0) {
        const { count: paidCount } = await admin
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("cohort_id", record.cohort_id)
          .in("status", ["active", "completed"]);

        if ((paidCount ?? 0) >= cohortRecord.max_students) {
          await admin.from("payments").update({
            status: "paid_overbooked",
            razorpay_payment_id: razorpayPaymentId,
            payment_method: method,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq("id", record.id).neq("status", "paid");
          console.error("Webhook: cohort overbooked, needs manual refund:", record.cohort_id);
          return json({ success: true, status: "overbooked" });
        }
      }

      const { error: paidUpdateError } = await admin.from("payments").update({
        status: "paid",
        razorpay_payment_id: razorpayPaymentId,
        payment_method: method,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("id", record.id).neq("status", "paid");

      if (paidUpdateError) {
        console.error("Webhook payment update failed:", paidUpdateError);
        return json({ success: false, error: "Payment update failed" }, 500);
      }

      const { error: enrollError } = await admin.from("enrollments").upsert({
        user_id: record.user_id,
        product_id: record.product_id,
        cohort_id: record.cohort_id,
        status: "active",
        enrolled_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,cohort_id", ignoreDuplicates: true });

      if (enrollError) {
        console.error("Webhook enrollment upsert failed:", enrollError);
        return json({ success: false, error: "Enrollment failed" }, 500);
      }

      return json({ success: true, status: "paid" });
    } catch (error) {
      console.error("razorpay-webhook error:", error);
      return json({ success: false, error: "Internal server error" }, 500);
    }
  },
};
