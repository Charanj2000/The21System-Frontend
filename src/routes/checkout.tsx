import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/useSession";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Check,
  Hash,
  Loader2,
  Lock,
  MessageCircle,
  PlayCircle,
  RefreshCw,
  Users,
  X,
} from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { COHORT } from "@/lib/cohort";
import { supabase } from "@/lib/supabase";
import { createSleepResetOrder, verifySleepResetPayment } from "@/lib/payments";
import { loadRazorpayCheckout } from "@/lib/razorpay";

const title = "Checkout — The 21-Day Sleep Reset";
const description =
  "Reserve your place in The 21-Day Sleep Reset. Secure Razorpay checkout.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: CheckoutPage,
});

type PayState = "idle" | "opening" | "processing" | "success" | "failed" | "cancelled";

const included = [
  "21-day guided journey",
  "WhatsApp accountability",
  "Discord community",
  "Weekly live sessions on Google Meet",
  "Reflection journal",
  "Lifetime community access",
] as const;

const reservationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "That name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "We need an email to send your nights to.")
    .email("That doesn't look like an email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
});

type Reservation = z.infer<typeof reservationSchema>;

function CheckoutPage() {
  const [state, setState] = useState<PayState>("idle");
  const { session, loading: sessionLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionLoading && !session) {
      void navigate({
        to: "/login",
        search: { redirect: "/checkout" },
        replace: true,
      });
    }
  }, [sessionLoading, session, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Reservation>({
    resolver: zodResolver(reservationSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "" },
  });

  const busy = state === "opening" || state === "processing";
  const lastReservationRef = useRef<Reservation | null>(null);

  const startPayment = async (reservation: Reservation) => {
    lastReservationRef.current = reservation;
    setState("opening");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!sessionData.session) {
        throw new Error("Please sign in with Google before checking out.");
      }

      setState("processing");

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: sessionData.session.user.id,
        full_name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile upsert failed:", profileError);
        throw new Error("Could not save your contact details. Please try again.");
      }

      const order = await createSleepResetOrder();

      await loadRazorpayCheckout();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout could not be initialized.");
      }

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "The 21 System",
        description: `The 21-Day Sleep Reset — ${COHORT.name}`,
        order_id: order.order_id,
        prefill: {
          name: reservation.name,
          email: reservation.email,
          contact: reservation.phone,
        },
        theme: { color: "#C6A96B" },

        handler: async (response) => {
          setState("processing");

          try {
            await verifySleepResetPayment(response);
            setState("success");
          } catch (error) {
            console.error("Payment verification error:", error);
            setState("failed");
          }
        },

        modal: {
          ondismiss: () => {
            setState("cancelled");
          },
        },
      });

      checkout.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setState("failed");
    }
  };

  if (sessionLoading || !session) {
    return (
      <main
        id="content"
        className="relative flex min-h-dvh items-center justify-center bg-night px-6 py-16 md:px-10 md:py-24"
      >
        <p className="text-[0.8rem] tracking-[0.14em] text-night-muted uppercase">
          {sessionLoading ? "Checking your session…" : "Redirecting to sign in…"}
        </p>
      </main>
    );
  }

  return (
    <main
      id="content"
      className="relative min-h-dvh bg-night px-6 py-16 md:px-10 md:py-24"
    >
      <div
        aria-hidden
        className="halo -top-20 left-[8%] h-80 w-80 animate-breathe"
      />

      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <Link
            to="/"
            className="font-display text-[0.9rem] font-semibold tracking-[0.18em] text-night-foreground uppercase"
          >
            The<span className="text-gold">21</span>System
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-gold">Your reservation</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-5 font-display text-[2rem] leading-[1.06] font-extralight text-night-foreground text-balance-tight sm:text-4xl">
                The 21-Day Sleep Reset
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-4 text-[0.8rem] tracking-[0.16em] text-gold uppercase">
                {COHORT.name} · begins {COHORT.startsOn}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-10 border-t border-night-hairline">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 border-b border-night-hairline py-4"
                  >
                    <Check
                      className="size-4 shrink-0 text-gold"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <span className="text-[0.95rem] font-light text-night-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-8 flex items-start gap-3 text-[0.78rem] leading-relaxed font-light text-night-muted">
                <Users
                  className="mt-0.5 size-4 shrink-0 text-gold"
                  strokeWidth={1.25}
                  aria-hidden
                />
                You&rsquo;re reserving a place. The cohort starts together on{" "}
                {COHORT.startsOn}.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <aside className="border border-night-hairline bg-night-surface p-7 md:p-8">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.8rem] tracking-[0.14em] text-night-muted uppercase">
                  One time
                </span>
                <span className="font-display text-4xl font-light text-night-foreground">
                  {COHORT.price}
                </span>
              </div>

              <div className="mt-6 space-y-2 border-t border-night-hairline pt-6 text-[0.85rem] font-light text-night-muted">
                <div className="flex justify-between">
                  <span>Programme</span>
                  <span>{COHORT.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>
              </div>

              <form
                noValidate
                onSubmit={handleSubmit(startPayment)}
                className="mt-7 space-y-5 border-t border-night-hairline pt-7"
              >
                <Field
                  id="name"
                  label="Full name"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <Field
                  id="email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Field
                  id="phone"
                  label="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <button
                  type="submit"
                  disabled={busy || isSubmitting}
                  className="flex min-h-13 w-full items-center justify-center gap-3 bg-gold px-8 text-[0.8rem] tracking-[0.14em] text-night uppercase transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:bg-gold-hover disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Lock className="size-3.5" strokeWidth={1.5} aria-hidden />
                  )}
                  Reserve with Razorpay
                </button>
              </form>

              <p className="mt-5 text-center text-[0.72rem] font-light text-night-muted">
                UPI · Cards · Netbanking · Wallets
              </p>

              <p className="mt-3 text-center text-[0.72rem] leading-relaxed font-light text-night-muted">
                We only email you about your cohort. Cancel any time before{" "}
                {COHORT.startsOn} for a full refund.
              </p>
            </aside>
          </Reveal>
        </div>
      </div>

      <PaymentOverlay
        state={state}
        onClose={() => setState("idle")}
        onRetry={() => {
          const last = lastReservationRef.current;
          if (last) void startPayment(last);
          else setState("idle");
        }}
      />
    </main>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

function Field({ id, label, error, ...props }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.7rem] tracking-[0.16em] text-night-muted uppercase"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 min-h-12 w-full border bg-night px-4 text-[0.95rem] font-light text-night-foreground transition-colors duration-500 ease-calm outline-none placeholder:text-night-muted/70 focus-visible:border-gold ${
          error ? "border-destructive" : "border-night-hairline"
        }`}
        {...props}
      />

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 text-[0.78rem] font-light text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PaymentOverlay({
  state,
  onClose,
  onRetry,
}: {
  state: PayState;
  onClose: () => void;
  onRetry: () => void;
}) {
  const open = state !== "idle";
  const busy = state === "opening" || state === "processing";
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [open, busy, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-night/92 px-6 py-10 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-status-title"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{
              duration: reduced ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative my-auto w-full max-w-sm border border-night-hairline bg-night-surface p-8 text-center outline-none"
          >
            <div aria-live="polite" aria-atomic="true">
              {busy ? (
                <>
                  <Loader2
                    className="mx-auto size-6 animate-spin text-gold"
                    aria-hidden
                  />
                  <h2
                    id="payment-status-title"
                    className="mt-8 font-display text-2xl font-light text-night-foreground"
                  >
                    {state === "opening"
                      ? "Opening Razorpay"
                      : "Confirming your payment"}
                  </h2>
                  <p className="mt-4 text-[0.85rem] font-light text-night-muted">
                    Stay on this page. This takes a few seconds.
                  </p>
                </>
              ) : null}

              {state === "success" ? (
                <>
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-gold/40">
                    <Check
                      className="size-5 text-gold"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h2
                    id="payment-status-title"
                    className="mt-8 font-display text-2xl font-light text-night-foreground"
                  >
                    You&rsquo;re in.
                  </h2>
                  <p className="mt-4 text-[0.85rem] leading-relaxed font-light text-night-muted">
                    Your place in the {COHORT.name} has been reserved. A
                    confirmation email is on its way.
                  </p>

                  <ul className="mt-7 space-y-3 text-left">
                    {[
                      { icon: MessageCircle, label: "Join WhatsApp" },
                      { icon: Hash, label: "Join Discord" },
                      { icon: Users, label: "Meet your cohort" },
                      { icon: PlayCircle, label: "Watch your welcome video" },
                      {
                        icon: Check,
                        label: `Programme begins ${COHORT.startsOn}`,
                      },
                    ].map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-3 border-b border-night-hairline pb-3 text-[0.85rem] font-light text-night-muted last:border-b-0"
                      >
                        <Icon
                          className="size-4 shrink-0 text-gold"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                        {label}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/"
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center bg-gold px-8 text-[0.8rem] tracking-[0.14em] text-night uppercase transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:bg-gold-hover"
                  >
                    Back to The21System
                  </Link>
                </>
              ) : null}

              {state === "cancelled" ? (
                <>
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-night-hairline">
                    <X
                      className="size-5 text-night-muted"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h2
                    id="payment-status-title"
                    className="mt-8 font-display text-2xl font-light text-night-foreground"
                  >
                    Payment cancelled.
                  </h2>
                  <p className="mt-4 text-[0.85rem] leading-relaxed font-light text-night-muted">
                    No charge was made. You can reserve your spot whenever you&rsquo;re ready.
                  </p>

                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-gold px-8 text-[0.8rem] tracking-[0.14em] text-night uppercase transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:bg-gold-hover"
                  >
                    <RefreshCw
                      className="size-3.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    Try again
                  </button>
                </>
              ) : null}

              {state === "failed" ? (
                <>
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-night-hairline">
                    <X
                      className="size-5 text-night-muted"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h2
                    id="payment-status-title"
                    className="mt-8 font-display text-2xl font-light text-night-foreground"
                  >
                    That payment didn&rsquo;t go through.
                  </h2>
                  <p className="mt-4 text-[0.85rem] leading-relaxed font-light text-night-muted">
                    If you were charged, email billing@the21system.com before retrying. Otherwise you can try again now.
                  </p>

                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-gold px-8 text-[0.8rem] tracking-[0.14em] text-night uppercase transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:bg-gold-hover"
                  >
                    <RefreshCw
                      className="size-3.5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    Try again
                  </button>
                </>
              ) : null}
            </div>

            {busy ? null : (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-2 right-2 flex size-11 items-center justify-center text-night-muted transition-colors duration-500 hover:text-night-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
