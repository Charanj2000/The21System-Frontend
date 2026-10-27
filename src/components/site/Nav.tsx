import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  useEffect(() => {
    let active = true;

    const updateUser = (
      user: {
        user_metadata?: Record<string, unknown>;
        email?: string;
      } | null,
    ) => {
      if (!active) return;

      const metadata = user?.user_metadata ?? {};
      const fullName =
        metadata.full_name ??
        metadata.name ??
        metadata.fullName ??
        user?.email?.split("@")[0] ??
        "";

      setFirstName(String(fullName).trim().split(/\s+/)[0] ?? "");
      if (!user) setMenuOpen(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUser(session?.user ?? null);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!error) updateUser(data.session?.user ?? null);
      })
      .catch(() => {
        if (active) setFirstName("");
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setLifted(window.scrollY > 24);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
      return;
    }

    setMenuOpen(false);
    setFirstName("");
    setSigningOut(false);
    await navigate({ to: "/" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-calm ${
        lifted
          ? "bg-night/92 shadow-[0_1px_0_0_var(--color-night-hairline)] backdrop-blur-xl"
          : "bg-gradient-to-b from-night/60 to-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 md:px-10 md:py-5"
      >
        <Link
          to="/"
          className="min-w-0 font-display text-[0.85rem] font-semibold tracking-[0.2em] text-night-foreground uppercase transition-opacity duration-500 ease-calm hover:opacity-80 sm:text-[0.9rem]"
        >
          The<span className="text-gold">21</span>System
        </Link>

        <div className="flex shrink-0 items-center gap-5 sm:gap-7">
          {firstName ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 text-[0.72rem] tracking-[0.1em] text-gold transition-colors hover:text-night-foreground"
              >
                Hi, {firstName}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`size-3 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-3 min-w-36 border border-night-hairline bg-night-surface p-1 shadow-xl"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className="w-full px-4 py-3 text-left text-[0.72rem] tracking-[0.1em] text-night-muted uppercase transition-colors hover:bg-night hover:text-gold disabled:opacity-50"
                  >
                    {signingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[0.72rem] tracking-[0.14em] text-night-muted uppercase transition-colors duration-500 ease-calm hover:text-night-foreground"
            >
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Login / Sign up</span>
            </Link>
          )}

          <Link
            to="/checkout"
            className="border-b border-gold/40 pb-1 text-[0.72rem] tracking-[0.14em] text-night-foreground uppercase transition-colors duration-500 ease-calm hover:border-gold hover:text-gold"
          >
            Reserve
          </Link>
        </div>
      </nav>

      {reduced ? null : (
        <motion.div
          aria-hidden
          style={{ scaleX: progress, willChange: "transform" }}
          className="h-px origin-left bg-gradient-to-r from-gold/70 to-gold/25"
        />
      )}
    </header>
  );
}
