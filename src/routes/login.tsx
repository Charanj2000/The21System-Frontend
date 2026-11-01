import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { GoogleMark } from "@/components/site/GoogleMark";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";

const title = "Login or sign up — The21System";
const description =
  "Log in or create your account with Google to reach your cohort home. Signing in never starts a payment.";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/",
  }),
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
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

type State = "idle" | "loading" | "error";

function LoginPage() {
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { session, loading: sessionLoading } = useSession();

  useEffect(() => {
    if (sessionLoading || !session) return;
    const safe = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
    void navigate({ to: safe, replace: true });
  }, [session, sessionLoading, redirect, navigate]);

  const signIn = async () => {
    setState("loading");
    setErrorMessage("");

    try {
      const destination =
        redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(destination)}`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start Google sign-in.",
      );
    }
  };

  const goHome = () => void navigate({ to: "/" });

  return (
    <main
      id="content"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-night px-6 py-20 md:px-10"
    >
      <div aria-hidden className="halo -top-24 left-1/2 h-96 w-96 -translate-x-1/2 animate-breathe" />

      <div className="relative mx-auto w-full max-w-sm">
        <Reveal>
          <Link
            to="/"
            className="font-display text-[0.9rem] font-semibold tracking-[0.18em] text-night-foreground uppercase"
          >
            The<span className="text-gold">21</span>System
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-10 font-display text-[2rem] leading-[1.06] font-extralight text-night-foreground text-balance-tight sm:text-4xl">
            Login or sign up.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 text-[0.95rem] leading-relaxed font-light text-night-muted">
            New here or returning — one account for your nights, your progress, your circle.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10" aria-live="polite">
            <button
              type="button"
              onClick={signIn}
              disabled={state === "loading"}
              className="group flex min-h-13 w-full items-center justify-center gap-3 border border-night-hairline bg-night-surface px-6 text-[0.8rem] tracking-[0.12em] text-night-foreground uppercase transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:border-gold/50 disabled:cursor-wait disabled:opacity-70"
            >
              {state === "loading" ? (
                <>
                  <span className="size-3 animate-ping rounded-full bg-gold" />
                  Connecting to Google
                </>
              ) : (
                <>
                  <GoogleMark className="size-4" />
                  Continue with Google
                </>
              )}
            </button>

            {state === "error" ? (
              <p className="mt-4 break-words text-[0.8rem] font-light text-destructive">
                Google sign-in could not start: {errorMessage}
              </p>
            ) : null}

            <p className="mt-6 text-[0.75rem] leading-relaxed font-light text-night-muted">
              Signing in never starts a payment. We only ever email you about your cohort.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 border-t border-night-hairline pt-6">
            <p className="text-[0.8rem] font-light text-night-muted">
              Not enrolled yet?{" "}
              <button
                type="button"
                onClick={signIn}
                disabled={state === "loading"}
                className="text-gold underline-offset-4 transition-colors hover:text-gold-hover hover:underline disabled:opacity-60"
              >
                Sign in to reserve your spot
              </button>
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
