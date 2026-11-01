import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { ReserveButton } from "./ReserveButton";
import { Marquee } from "./Marquee";

const marqueeItems = [
  "21 nights",
  "₹199 once",
  "No subscription",
  "Cohort-based",
  "Lifetime access",
  "Refund if nothing changed",
];

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.4 });
  const { session } = useSession();

  const firstName = (() => {
    const user = session?.user;
    if (!user) return "";
    const m = (user.user_metadata ?? {}) as Record<string, unknown>;
    const name =
      (m.full_name as string | undefined) ??
      (m.name as string | undefined) ??
      user.email?.split("@")[0] ??
      "";
    return String(name).trim().split(/\s+/)[0] ?? "";
  })();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setLifted(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Dropdown dismiss
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onEsc);
    };
  }, [mobileOpen]);

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
      return;
    }
    setMenuOpen(false);
    setMobileOpen(false);
    setSigningOut(false);
    await navigate({ to: "/" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          lifted
            ? "bg-night/95 backdrop-blur-md"
            : "bg-night/40 backdrop-blur-sm"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-5"
        >
          <Link
            to="/"
            className="font-display text-base font-bold tracking-tight text-night-foreground"
          >
            the<span className="text-gold">21</span>system
          </Link>

          {/* Desktop controls */}
          <div className="hidden items-center gap-8 md:flex">
            {firstName ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 font-display text-xs font-medium tracking-tight text-night-foreground/90 hover:text-gold"
                >
                  hi, {firstName.toLowerCase()}
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`size-3 transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 min-w-40 border border-night-foreground/80 bg-night p-1"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void signOut()}
                      disabled={signingOut}
                      className="w-full px-3 py-2.5 text-left font-display text-xs tracking-tight text-night-foreground hover:bg-night-foreground hover:text-night disabled:opacity-50"
                    >
                      {signingOut ? "signing out…" : "sign out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="font-display text-xs font-medium tracking-tight text-night-foreground/90 hover:text-gold"
              >
                login
              </Link>
            )}

            <ReserveButton variant="nav" />
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex size-11 items-center justify-center border border-night-foreground/40 text-night-foreground md:hidden"
          >
            <Menu className="size-4" aria-hidden />
          </button>
        </nav>

        {/* Marquee strip under the nav */}
        <div className="border-y border-night-hairline bg-night py-2 text-[0.7rem] uppercase tracking-[0.12em] text-night-foreground">
          <Marquee items={marqueeItems} duration={48} />
        </div>

        {/* Scroll-progress bar */}
        {reduced ? null : (
          <motion.div
            aria-hidden
            style={{ scaleX: progress }}
            className="h-0.5 origin-left bg-gold"
          />
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-50 flex flex-col bg-night p-5 md:hidden"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-base font-bold tracking-tight text-night-foreground"
            >
              the<span className="text-gold">21</span>system
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="flex size-11 items-center justify-center border border-night-foreground/40 text-night-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mt-16 flex flex-col gap-6">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-5xl font-bold tracking-tight text-night-foreground hover:text-gold"
            >
              home
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileOpen(false)}
              className="font-display text-5xl font-bold tracking-tight text-night-foreground hover:text-gold"
            >
              faq
            </Link>
            {firstName ? (
              <button
                type="button"
                onClick={() => {
                  void signOut();
                }}
                className="text-left font-display text-5xl font-bold tracking-tight text-night-foreground hover:text-gold"
              >
                sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="font-display text-5xl font-bold tracking-tight text-night-foreground hover:text-gold"
              >
                login
              </Link>
            )}
          </div>

          <div className="mt-auto">
            <ReserveButton variant="pill" className="w-full justify-center" />
          </div>
        </div>
      )}
    </>
  );
}
