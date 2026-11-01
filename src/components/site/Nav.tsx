import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/useSession";
import { ReserveButton } from "./ReserveButton";

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          lifted
            ? "bg-night/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-5 py-5 md:px-10 md:py-6"
        >
          <Link
            to="/"
            className="font-display text-[1.05rem] font-medium tracking-tight text-night-foreground"
          >
            The<span className="text-gold-dark">21</span>System
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
                  className="flex items-center gap-2 font-sans text-sm font-medium text-night-foreground/90 hover:text-gold-dark transition-colors"
                >
                  Hi, {firstName}
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
                    className="absolute right-0 top-full z-50 mt-3 min-w-44 border border-night-foreground/15 bg-night p-1"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void signOut()}
                      disabled={signingOut}
                      className="w-full px-4 py-3 text-left font-sans text-sm text-night-foreground hover:bg-night-surface disabled:opacity-50"
                    >
                      {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="font-sans text-sm font-medium text-night-foreground/90 hover:text-gold-dark transition-colors"
              >
                Log in
              </Link>
            )}

            <ReserveButton variant="pill-on-dark" />
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex size-11 items-center justify-center text-night-foreground md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-50 flex flex-col bg-night p-6 md:hidden"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-[1.05rem] font-medium tracking-tight text-night-foreground"
            >
              The<span className="text-gold-dark">21</span>System
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="flex size-11 items-center justify-center text-night-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="mt-20 flex flex-col gap-8">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl font-normal tracking-tight text-night-foreground"
            >
              Home
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl font-normal tracking-tight text-night-foreground"
            >
              FAQ
            </Link>
            {firstName ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="text-left font-display text-4xl font-normal tracking-tight text-night-foreground"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl font-normal tracking-tight text-night-foreground"
              >
                Log in
              </Link>
            )}
          </div>

          <div className="mt-auto">
            <ReserveButton variant="pill-on-dark" className="w-full" />
          </div>
        </div>
      )}
    </>
  );
}
