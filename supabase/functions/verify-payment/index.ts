import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server";
const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
if (!KEY_ID || !KEY_SECRET) {
  throw new Error("Missing Razorpay environment variables.");
}
const json = (data, status = 200)=>Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
async function verifySignature(orderId, paymentId, signature) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(KEY_SECRET), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, [
    "sign"
  ]);
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(`${orderId}|${paymentId}`));
  const expected = Array.from(new Uint8Array(digest)).map((byte)=>byte.toString(16).padStart(2, "0")).join("");
  const a = encoder.encode(expected);
  const b = encoder.encode(signature.toLowerCase());
  if (a.length !== b.length) return false;
  let diff = 0;
  for(let i = 0; i < a.length; i++)diff |= a[i] ^ b[i];
  return diff === 0;
}
export default {
  fetch: withSupabase({
    auth: "user"
  }, async (req, ctx)=>{
    try {
      if (req.method !== "POST") {
        return json({
          success: false,
          error: "Method not allowed"
        }, 405);
      }
      const userId = ctx.userClaims?.id;
      if (!userId) {
        return json({
          success: false,
          error: "Unauthorized"
        }, 401);
      }
      let body;
      try {
        body = await req.json();
      } catch  {
        return json({
          success: false,
          error: "Invalid JSON body"
        }, 400);
      }
      const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id.trim() : typeof body.order_id === "string" ? body.order_id.trim() : "";
      const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id.trim() : "";
      const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature.trim() : "";
      if (!orderId) {
        return json({
          success: false,
          error: "order_id is required"
        }, 400);
      }
      const { data: record, error: lookupError } = await ctx.supabaseAdmin.from("payments").select("id, user_id, product_id, cohort_id, amount, currency, status, razorpay_order_id, razorpay_payment_id").eq("razorpay_order_id", orderId).eq("user_id", userId).eq("payment_provider", "razorpay").maybeSingle();
      if (lookupError) {
        console.error("Payment lookup failed:", lookupError);
        return json({
          success: false,
          error: "Unable to look up payment"
        }, 500);
      }
      if (!record) {
        return json({
          success: false,
          error: "Payment not found"
        }, 404);
      }
      // Idempotent retry: ensure a previously paid customer has an enrollment.
      if (record.status === "paid" && record.razorpay_payment_id) {
        const { data: existing, error: enrollmentLookupError } = await ctx.supabaseAdmin.from("enrollments").select("id").eq("user_id", userId).eq("cohort_id", record.cohort_id).maybeSingle();
        if (enrollmentLookupError) {
          console.error("Enrollment lookup failed:", enrollmentLookupError);
          return json({
            success: false,
            error: "Payment is paid; enrollment recovery needs retry",
            payment_id: record.id
          }, 500);
        }
        if (!existing) {
          const { error: insertError } = await ctx.supabaseAdmin.from("enrollments").insert({
            user_id: userId,
            product_id: record.product_id,
            cohort_id: record.cohort_id,
            status: "active",
            enrolled_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          if (insertError) {
            console.error("Enrollment recovery failed:", insertError);
            return json({
              success: false,
              error: "Payment is paid; enrollment recovery needs retry",
              payment_id: record.id
            }, 500);
          }
        }
        return json({
          success: true,
          status: "paid",
          payment_id: record.id,
          order_id: orderId,
          enrolled: true,
          message: "Payment already verified."
        });
      }
      if (!paymentId || !signature) {
        return json({
          success: true,
          status: "pending",
          payment_id: record.id,
          order_id: orderId,
          message: "Payment verification details are not available yet."
        });
      }
      const validSignature = await verifySignature(record.razorpay_order_id, paymentId, signature);
      if (!validSignature) {
        return json({
          success: false,
          error: "Invalid payment signature"
        }, 400);
      }
      // Independently verify payment details with Razorpay.
      const auth = btoa(`${KEY_ID}:${KEY_SECRET}`);
      const razorpayResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json"
        }
      });
      if (!razorpayResponse.ok) {
        console.error("Razorpay payment lookup failed:", razorpayResponse.status);
        return json({
          success: false,
          error: "Unable to confirm payment status. Please retry."
        }, 502);
      }
      const rpPayment = await razorpayResponse.json();
      if (rpPayment.id !== paymentId || rpPayment.order_id !== record.razorpay_order_id || Number(rpPayment.amount) !== Number(record.amount) || rpPayment.currency !== record.currency) {
        return json({
          success: false,
          error: "Payment details do not match the stored order"
        }, 400);
      }
      if (rpPayment.status !== "captured") {
        if (rpPayment.status === "failed") {
          const { error: failedUpdateError } = await ctx.supabaseAdmin.from("payments").update({
            status: "failed",
            razorpay_payment_id: paymentId,
            payment_method: rpPayment.method ?? null,
            updated_at: new Date().toISOString()
          }).eq("id", record.id).eq("status", "pending");
          if (failedUpdateError) {
            console.error("Failed status update:", failedUpdateError);
          }
          return json({
            success: true,
            status: "failed",
            payment_id: record.id,
            order_id: orderId
          });
        }
        return json({
          success: true,
          status: "pending",
          payment_id: record.id,
          order_id: orderId
        });
      }
      if (!record.cohort_id) {
        return json({
          success: false,
          error: "Payment has no cohort attached"
        }, 500);
      }
      // Capacity hard-check: close the race where multiple paid orders beat
      // the preflight check in create-order. If the cohort is full, keep the
      // payment captured (money already debited) but flag it for refund.
      const { data: cohortRecord, error: cohortReadError } = await ctx.supabaseAdmin.from("cohorts").select("max_students").eq("id", record.cohort_id).maybeSingle();
      if (cohortReadError) {
        console.error("Cohort read failed:", cohortReadError);
        return json({
          success: false,
          error: "Payment verified, but cohort check failed. Please contact support."
        }, 500);
      }
      if (cohortRecord && typeof cohortRecord.max_students === "number" && cohortRecord.max_students > 0) {
        const { count: existingCount, error: countError } = await ctx.supabaseAdmin
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("cohort_id", record.cohort_id)
          .in("status", ["active", "completed"]);
        if (countError) {
          console.error("Capacity recheck failed:", countError);
          return json({
            success: false,
            error: "Payment verified, but capacity check failed. Please contact support."
          }, 500);
        }
        if ((existingCount ?? 0) >= cohortRecord.max_students) {
          await ctx.supabaseAdmin.from("payments").update({
            status: "paid_overbooked",
            razorpay_payment_id: paymentId,
            payment_method: rpPayment.method ?? null,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).eq("id", record.id).eq("user_id", userId);
          console.error("Cohort overbooked at verify-payment:", record.cohort_id);
          return json({
            success: false,
            error: "This cohort filled up before we could confirm your seat. Our team will refund you shortly — please email billing@the21system.com if you don't hear back within one business day."
          }, 409);
        }
      }
      // Persist verified payment.
      const { error: paidUpdateError } = await ctx.supabaseAdmin.from("payments").update({
        status: "paid",
        razorpay_payment_id: paymentId,
        payment_method: rpPayment.method ?? null,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq("id", record.id).eq("user_id", userId);
      if (paidUpdateError) {
        console.error("Payment update failed:", paidUpdateError);
        return json({
          success: false,
          error: "Payment verified, but database update failed. Please retry."
        }, 500);
      }
      // Create enrollment if it does not already exist.
      const { data: existingEnrollment, error: existingError } = await ctx.supabaseAdmin.from("enrollments").select("id").eq("user_id", userId).eq("cohort_id", record.cohort_id).maybeSingle();
      if (existingError) {
        console.error("Enrollment lookup failed:", existingError);
        return json({
          success: false,
          error: "Payment is paid; enrollment recovery needs retry",
          payment_id: record.id
        }, 500);
      }
      if (!existingEnrollment) {
        const { error: insertError } = await ctx.supabaseAdmin.from("enrollments").insert({
          user_id: userId,
          product_id: record.product_id,
          cohort_id: record.cohort_id,
          status: "active",
          enrolled_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        if (insertError) {
          console.error("Enrollment creation failed:", insertError);
          return json({
            success: false,
            error: "Payment is paid; enrollment recovery needs retry",
            payment_id: record.id
          }, 500);
        }
      }
      return json({
        success: true,
        status: "paid",
        payment_id: record.id,
        razorpay_payment_id: paymentId,
        order_id: orderId,
        enrolled: true
      });
    } catch (error) {
      console.error("verify-payment error:", error);
      return json({
        success: false,
        error: "Internal server error"
      }, 500);
    }
  })
};
