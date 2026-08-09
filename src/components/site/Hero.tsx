import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import heroNight from "@/assets/hero-night.jpg";
import { COHORT } from "@/lib/cohort";

export function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 90]);
  const copyOpacity = useTransform(scrollY, [0, 420], [1, reduced ? 1 : 0.15]);

  return (
    <section className="relative isolate min-h-[86svh] overflow-hidden bg-night sm:min-h-[96svh]">
      <motion.img
        src={heroNight}
        alt="A dark bedroom at night with a thin line of warm light across the linen"
        width={1600}
        height={1920}
        fetchPriority="high"
        decoding="async"
        style={{ y: imageY }}
        className="absolute inset-0 -z-10 size-full scale-105 object-cover opacity-90"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-night/75 via-night/55 to-night"
      />

      <motion.div
        style={{ opacity: copyOpacity }}
        className="mx-auto flex min-h-[86svh] max-w-6xl flex-col justify-end px-6 pt-24 pb-12 sm:min-h-[96svh] md:px-10 md:pb-20"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow text-gold"
        >
          The 21-Day Sleep Reset
        </motion.p>

        <motion.h1
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl font-display text-[2.35rem] leading-[1.03] font-extralight text-night-foreground text-balance-tight sm:text-6xl lg:text-[5.25rem]"
        >
          Reclaim the hours
          <span className="block text-night-muted">before midnight.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between"
        >
          <p className="measure-sm text-[1.0625rem] leading-[1.7] font-light text-night-muted">
            A cohort-based 21-night reset for people who think for a living. Calmer evenings,
            clearer mornings.
          </p>

          <Link
            to="/checkout"
            className="group relative inline-flex min-h-14 items-center gap-4 overflow-hidden rounded-full bg-gold pr-6 pl-8 text-[0.78rem] tracking-[0.18em] text-night uppercase shadow-[0_20px_50px_-26px_var(--color-gold)] transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:bg-gold-hover active:translate-y-0"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-night/10 to-transparent transition-transform duration-1000 ease-calm group-hover:translate-x-full"
            />
            <span className="relative">Reserve your spot</span>
            <span
              aria-hidden
              className="relative grid size-7 place-items-center rounded-full bg-night/12 transition-transform duration-500 ease-calm group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.7rem] tracking-[0.16em] text-night-muted uppercase"
        >
          <span className="text-gold">Next cohort begins {COHORT.startsOn}</span>
          <span aria-hidden className="hidden size-1 rounded-full bg-gold/60 sm:block" />
          <span>Small actions, every day</span>
          <span aria-hidden className="hidden size-1 rounded-full bg-gold/60 sm:block" />
          <span>One payment · {COHORT.price}</span>
        </motion.p>
      </motion.div>

      <div aria-hidden className="halo top-[16%] left-[8%] hidden size-72 animate-breathe md:block" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-night"
      />
    </section>
  );
}