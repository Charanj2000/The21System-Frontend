import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

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
          <Link
            to="/login"
            className="text-[0.72rem] tracking-[0.14em] text-night-muted uppercase transition-colors duration-500 ease-calm hover:text-night-foreground"
          >
            <span className="sm:hidden">Login</span>
            <span className="hidden sm:inline">Login / Sign up</span>
          </Link>
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