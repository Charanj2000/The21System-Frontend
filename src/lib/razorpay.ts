
export type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions,
    ) => { open: () => void };
  }
}

export async function loadRazorpayCheckout(): Promise<void> {
  if (window.Razorpay) return;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay checkout."));
    document.head.appendChild(script);
  });

  if (!window.Razorpay) {
    throw new Error("Razorpay checkout failed to initialize.");
  }
}
