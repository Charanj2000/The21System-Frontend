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
      const productSlug = typeof body.product_slug === "string" ? body.product_slug.trim() : "";
      let cohortId = typeof body.cohort_id === "string" ? body.cohort_id.trim() : "";
      const couponCode = typeof body.coupon_code === "string" ? body.coupon_code.trim().toUpperCase() : "";
      if (!productSlug) {
        return json({
          success: false,
          error: "product_slug is required"
        }, 400);
      }
      // 1. Load active product. Price is stored in paise.
      const { data: product, error: productError } = await ctx.supabase.from("products").select("id, name, slug, price, currency, active").eq("slug", productSlug).eq("active", true).maybeSingle();
      if (productError || !product) {
        return json({
          success: false,
          error: "Product not found"
        }, 404);
      }
      const originalAmount = Number(product.price);
      if (!Number.isSafeInteger(originalAmount) || originalAmount < 100 || product.currency !== "INR") {
        return json({
          success: false,
          error: "Invalid product price or currency"
        }, 400);
      }
      // 2. Load authenticated customer's profile.
      const { data: profile, error: profileError } = await ctx.supabaseAdmin.from("profiles").select("full_name, email, phone").eq("id", userId).maybeSingle();
      if (profileError || !profile) {
        return json({
          success: false,
          error: "User profile not found"
        }, 404);
      }
      if (!profile.email || !profile.phone) {
        return json({
          success: false,
          error: "Email and phone number are required before payment"
        }, 400);
      }
      // 3a. If the client didn't send a cohort_id, auto-pick (or create) the next cohort.
      //     Rule: cohorts start on the 1st and 16th of every month. Pick the next start
      //     date >= today for this product, upsert the row if it doesn't exist.
      if (!cohortId) {
        const now = new Date();
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth();
        const d = now.getUTCDate();
        let sY: number, sM: number, sD: number;
        if (d <= 1) {
          sY = y; sM = m; sD = 1;
        } else if (d <= 16) {
          sY = y; sM = m; sD = 16;
        } else if (m === 11) {
          sY = y + 1; sM = 0; sD = 1;
        } else {
          sY = y; sM = m + 1; sD = 1;
        }
        const eD = sD === 1 ? 15 : new Date(Date.UTC(sY, sM + 1, 0)).getUTCDate();
        const pad = (n: number) => String(n).padStart(2, "0");
        const nextStartDate = `${sY}-${pad(sM + 1)}-${pad(sD)}`;
        const nextEndDate = `${sY}-${pad(sM + 1)}-${pad(eD)}`;
        const monthLong = ["January","February","March","April","May","June","July","August","September","October","November","December"][sM];
        const monthShort = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][sM];
        const nextCohortName = `${monthLong} ${sD === 1 ? "1st" : "16th"} Cohort`;
        const nextCohortSlug = `${monthShort}-${pad(sD)}-${sY}`;

        const { data: existing, error: existingError } = await ctx.supabaseAdmin.from("cohorts").select("id").eq("product_id", product.id).eq("start_date", nextStartDate).maybeSingle();
        if (existingError) {
          console.error("Cohort lookup failed:", existingError);
          return json({ success: false, error: "Unable to resolve the next cohort." }, 500);
        }
        if (existing) {
          cohortId = existing.id;
        } else {
          const { data: created, error: createError } = await ctx.supabaseAdmin.from("cohorts").insert({
            product_id: product.id,
            name: nextCohortName,
            slug: nextCohortSlug,
            start_date: nextStartDate,
            end_date: nextEndDate,
            status: "upcoming",
            max_students: 100,
          }).select("id").single();
          if (createError || !created) {
            // Race: another request may have just inserted the same row.
            const { data: raced } = await ctx.supabaseAdmin.from("cohorts").select("id").eq("product_id", product.id).eq("start_date", nextStartDate).maybeSingle();
            if (raced) {
              cohortId = raced.id;
            } else {
              console.error("Cohort creation failed:", createError);
              return json({ success: false, error: "Could not open the next cohort." }, 500);
            }
          } else {
            cohortId = created.id;
          }
        }
      }

      // 3b. Validate the cohort belongs to this product and is current.
      const { data: cohort, error: cohortError } = await ctx.supabaseAdmin.from("cohorts").select("id, name, product_id, status, start_date, end_date, max_students").eq("id", cohortId).eq("product_id", product.id).maybeSingle();
      if (cohortError || !cohort) {
        return json({
          success: false,
          error: "Invalid cohort for this product"
        }, 400);
      }
      const today = new Date().toISOString().slice(0, 10);
      if (![
        "upcoming",
        "active"
      ].includes(cohort.status) || !cohort.start_date || !cohort.end_date || cohort.end_date < today) {
        return json({
          success: false,
          error: "This cohort is not accepting enrollments. Select an available cohort."
        }, 400);
      }
      // 4. Prevent duplicate enrollment.
      const { data: enrollment, error: enrollmentError } = await ctx.supabase.from("enrollments").select("id").eq("user_id", userId).eq("cohort_id", cohortId).maybeSingle();
      if (enrollmentError) {
        console.error("Enrollment lookup failed:", enrollmentError);
        return json({
          success: false,
          error: "Unable to check enrollment"
        }, 500);
      }
      if (enrollment) {
        return json({
          success: false,
          error: "Already enrolled in this cohort"
        }, 409);
      }
      // 4b. Capacity preflight. Hard check also runs in verify-payment to
      //     handle races between concurrent create-order calls.
      if (typeof cohort.max_students === "number" && cohort.max_students > 0) {
        const { count: paidCount, error: capacityError } = await ctx.supabaseAdmin
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("cohort_id", cohortId)
          .in("status", ["active", "completed"]);
        if (capacityError) {
          console.error("Capacity check failed:", capacityError);
          return json({
            success: false,
            error: "Unable to verify cohort availability. Please try again."
          }, 500);
        }
        if ((paidCount ?? 0) >= cohort.max_students) {
          return json({
            success: false,
            error: "This cohort is full. Please choose the next available cohort."
          }, 409);
        }
      }
      // 5. Validate coupon on the server. Discount is derived from the product
      //    price, not hardcoded, so price changes propagate automatically.
      let finalAmount = originalAmount;
      let discountAmount = 0;
      let appliedCoupon: string | null = null;
      if (couponCode) {
        if (couponCode !== "THE21SYSTEM50") {
          return json({
            success: false,
            error: "Invalid coupon code"
          }, 400);
        }
        finalAmount = Math.max(100, Math.round(originalAmount * 0.5));
        discountAmount = originalAmount - finalAmount;
        appliedCoupon = couponCode;
      }
      if (finalAmount < 100 || discountAmount < 0 || finalAmount > originalAmount) {
        return json({
          success: false,
          error: "Invalid final amount"
        }, 400);
      }
      // 6. Reuse a matching pending Razorpay order when available.
      const { data: pending, error: pendingError } = await ctx.supabaseAdmin.from("payments").select("id, razorpay_order_id, amount, currency, coupon_code").eq("user_id", userId).eq("product_id", product.id).eq("cohort_id", cohortId).eq("payment_provider", "razorpay").eq("status", "pending").order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (pendingError) {
        console.error("Pending payment lookup failed:", pendingError);
        return json({
          success: false,
          error: "Unable to check pending payments"
        }, 500);
      }
      if (pending?.razorpay_order_id && Number(pending.amount) === finalAmount && pending.currency === product.currency && (pending.coupon_code ?? null) === appliedCoupon) {
        return json({
          success: true,
          payment_id: pending.id,
          order_id: pending.razorpay_order_id,
          key_id: KEY_ID,
          amount: finalAmount,
          original_amount: originalAmount,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          coupon_applied: Boolean(appliedCoupon),
          currency: product.currency
        });
      }
      // 7. Create order directly through Razorpay REST API.
      const receipt = `ts_${crypto.randomUUID().replaceAll("-", "").slice(0, 32)}`;
      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${KEY_ID}:${KEY_SECRET}`)}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: product.currency,
          receipt,
          notes: {
            user_id: userId,
            product_id: product.id,
            cohort_id: cohortId,
            coupon_code: appliedCoupon ?? ""
          }
        })
      });
      if (!razorpayResponse.ok) {
        const details = await razorpayResponse.text();
        console.error("Razorpay order creation failed:", details);
        return json({
          success: false,
          error: "Razorpay could not create the order. Check server logs."
        }, 502);
      }
      const razorpayOrder = await razorpayResponse.json();
      if (!razorpayOrder.id || Number(razorpayOrder.amount) !== finalAmount || razorpayOrder.currency !== product.currency) {
        console.error("Unexpected Razorpay order response");
        return json({
          success: false,
          error: "Invalid Razorpay order response"
        }, 502);
      }
      // 8. Persist a pending Razorpay payment.
      const { data: payment, error: paymentError } = await ctx.supabaseAdmin.from("payments").insert({
        user_id: userId,
        product_id: product.id,
        cohort_id: cohortId,
        payment_provider: "razorpay",
        razorpay_order_id: razorpayOrder.id,
        amount: finalAmount,
        currency: product.currency,
        status: "pending",
        coupon_code: appliedCoupon,
        original_amount: originalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount
      }).select("id").single();
      if (paymentError || !payment) {
        console.error("Payment record insertion failed:", paymentError);
        return json({
          success: false,
          error: "Order created, but payment record could not be saved. Contact support before retrying."
        }, 500);
      }
      return json({
        success: true,
        payment_id: payment.id,
        order_id: razorpayOrder.id,
        key_id: KEY_ID,
        amount: finalAmount,
        original_amount: originalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        coupon_applied: Boolean(appliedCoupon),
        currency: product.currency
      });
    } catch (error) {
      console.error("create-order error:", error);
      return json({
        success: false,
        error: "Internal server error"
      }, 500);
    }
  })
};
