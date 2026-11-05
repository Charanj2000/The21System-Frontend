
import { supabase } from "@/lib/supabase";
import type { RazorpayPaymentResponse } from "@/lib/razorpay";

export type CreatedPaymentOrder = {
  success: boolean;
  payment_id: string;
  order_id: string;
  key_id: string;
  amount: number;
  currency: string;
  original_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  coupon_applied?: boolean;
};

export type CreateSleepResetOrderOptions = {
  cohortId?: string;
  couponCode?: string;
};

export type VerifiedPayment = {
  success: true;
  status: "paid";
  payment_id: string;
  order_id: string;
  razorpay_payment_id?: string;
  enrolled?: boolean;
  message?: string;
};

type PaymentFunctionResponse = {
  success?: boolean;
  status?: string;
  error?: string;
  message?: string;
  payment_id?: string;
  order_id?: string;
  key_id?: string;
  amount?: number;
  currency?: string;
  original_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  coupon_applied?: boolean;
  enrolled?: boolean;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

async function getFunctionErrorDetails(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("context" in error) ||
    !(error.context instanceof Response)
  ) {
    return {
      status: undefined as number | undefined,
      body: "",
    };
  }

  const response = error.context;
  const body = await response.clone().text().catch(() => "");

  return {
    status: response.status,
    body,
  };
}

function extractServerMessage(body: string, fallback: string): string {
  if (!body.trim()) return fallback;

  try {
    const parsed: unknown = JSON.parse(body);

    if (typeof parsed === "object" && parsed !== null) {
      if ("error" in parsed && typeof parsed.error === "string") {
        return parsed.error;
      }

      if ("message" in parsed && typeof parsed.message === "string") {
        return parsed.message;
      }
    }
  } catch {
    // The response may be plain text instead of JSON.
  }

  return body;
}

async function requireAuthenticatedSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Unable to retrieve Supabase session:", error);
    throw new Error("Unable to verify your sign-in. Please try again.");
  }

  if (!data.session) {
    throw new Error("Please sign in with Google before checking out.");
  }

  return data.session;
}

export async function createSleepResetOrder(
  options: CreateSleepResetOrderOptions = {},
): Promise<CreatedPaymentOrder> {
  await requireAuthenticatedSession();

  let data: PaymentFunctionResponse | null;
  let error: unknown;

  try {
    const body: Record<string, string> = {
      product_slug: "sleep-reset",
    };

    if (options.cohortId?.trim()) {
      body.cohort_id = options.cohortId.trim();
    }

    if (options.couponCode?.trim()) {
      body.coupon_code = options.couponCode.trim().toUpperCase();
    }

    const result = await supabase.functions.invoke("create-order", {
      body,
    });

    data = result.data as PaymentFunctionResponse | null;
    error = result.error;
  } catch (caughtError) {
    console.error("Create-order request failed:", caughtError);

    throw new Error(
      "Could not contact the payment service. Please check your connection and try again.",
    );
  }

  if (error) {
    console.error("Create-order function error:", error);

    const details = await getFunctionErrorDetails(error);

    console.error("Create-order HTTP status:", details.status);
    console.error("Create-order response body:", details.body);

    const serverMessage = extractServerMessage(
      details.body,
      getErrorMessage(
        error,
        "Unable to create your payment order. Please try again.",
      ),
    );

    throw new Error(serverMessage);
  }

  if (
    data?.success !== true ||
    typeof data.order_id !== "string" ||
    !data.order_id ||
    typeof data.key_id !== "string" ||
    !data.key_id ||
    typeof data.amount !== "number" ||
    !Number.isFinite(data.amount) ||
    data.amount <= 0
  ) {
    console.error("Unexpected create-order response:", data);

    throw new Error(
      data?.error ||
        "The payment service returned an invalid order. Please try again later.",
    );
  }

  if (data.currency && data.currency !== "INR") {
    console.error("Unexpected payment currency:", data.currency);
    throw new Error("The payment currency is invalid. Please contact support.");
  }

  return data as CreatedPaymentOrder;
}

export async function verifySleepResetPayment(
  response: RazorpayPaymentResponse,
): Promise<VerifiedPayment> {
  if (
    !response?.razorpay_order_id ||
    !response?.razorpay_payment_id ||
    !response?.razorpay_signature
  ) {
    throw new Error(
      "Razorpay returned incomplete payment details. Please check your payment status before retrying.",
    );
  }

  await requireAuthenticatedSession();

  let data: PaymentFunctionResponse | null;
  let error: unknown;

  try {
    const result = await supabase.functions.invoke("verify-payment", {
      body: {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      },
    });

    data = result.data as PaymentFunctionResponse | null;
    error = result.error;
  } catch (caughtError) {
    console.error("Payment verification request failed:", caughtError);

    throw new Error(
      "We couldn't confirm your payment with the server. Check your payment status before trying again.",
    );
  }

  if (error) {
    console.error("Payment verification function error:", error);

    const details = await getFunctionErrorDetails(error);

    console.error("Verify-payment HTTP status:", details.status);
    console.error("Verify-payment response body:", details.body);

    throw new Error(
      "We couldn't confirm your payment with the server. Check your payment status before trying again.",
    );
  }

  if (data?.success !== true || data?.status !== "paid") {
    console.error("Payment is not confirmed as paid:", data);

    const statusMessage = data?.status
      ? ` Current status: ${data.status}.`
      : "";

    throw new Error(
      `${data?.error || "Your payment has not been confirmed."}${statusMessage} Check your payment status before retrying.`,
    );
  }

  return data as VerifiedPayment;
}
