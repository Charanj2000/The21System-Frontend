import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/",
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing secure sign-in…");

  useEffect(() => {
    let active = true;

    async function completeSignIn() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!data.session) {
          throw new Error(
            "No session was returned. Please try Google sign-in again.",
          );
        }

        if (active) {
          const destination =
            redirect.startsWith("/") && !redirect.startsWith("//")
              ? redirect
              : "/";
          await navigate({ to: destination });
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Sign-in could not be completed. Please try again.",
          );
        }
      }
    }

    void completeSignIn();
    return () => {
      active = false;
    };
  }, [navigate, redirect]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-night px-6 text-night-foreground">
      <div className="max-w-md text-center">
        <p className="text-sm font-light" aria-live="polite">
          {message}
        </p>
        {message !== "Completing secure sign-in…" ? (
          <a
            href="/login"
            className="mt-6 inline-block text-sm text-gold underline"
          >
            Return to login
          </a>
        ) : null}
      </div>
    </main>
  );
}
