import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { COHORT } from "@/lib/cohort";
import { ReserveButton } from "./ReserveButton";
import { Marquee } from "./Marquee";

const marqueeTop = [
  "the 21-day sleep reset",
  "cohort begins " + COHORT.startsOn.toLowerCase(),
  "AW26",
  "limited to 100",
  "guided together",
];

export function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative isolate overflow-hidden bg-night pt-32 pb-10 sm:pt-36 md:pb-16">
      <span aria-hidden className="grain" />
      <div
        aria-hidden
        className="grid-lines absolute inset-0 opacity-30"
      />

      <div
        ref={containerRef}
        className="relative mx-auto flex max-w-[1400px] flex-col gap-8 px-5 md:px-10"
      >
        {/* Top meta row */}
        <div className="flex flex-wrap items-end justify-between gap-y-4 border-b border-night-foreground pb-6">
          <span className="font-display text-xs font-medium tracking-tight text-night-foreground/70 uppercase">
            Vol. 01 — The Sleep Edition
          </span>
          <span className="font-display text-xs font-medium tracking-tight text-night-foreground/70 uppercase">
            {COHORT.startsOn} → ends +15
          </span>
        </div>

        {/* The money shot */}
        <div className="pt-6 md:pt-12">
          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl text-night-foreground"
          >
            <span className="block">reclaim</span>
            <span className="block pl-[0.08em] text-night-foreground/40">the hours</span>
            <span className="block">
              before{" "}
              <span className="relative italic font-serif font-normal text-gold">
                midnight
                <svg
                  aria-hidden
                  viewBox="0 0 300 20"
                  className="absolute -bottom-2 left-0 w-full"
                >
                  <path
                    d="M2 10 Q 75 2 150 10 T 298 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </span>
          </motion.h1>
        </div>

        {/* Bottom row — CTA + draggable chip + description */}
        <div className="mt-6 grid gap-10 border-t border-night-foreground pt-8 md:mt-10 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-10">
          <div className="flex flex-col gap-6">
            <p className="font-display text-base leading-snug font-light text-night-foreground/80 sm:text-lg md:max-w-md">
              A 21-night cohort reset for people who think for a living.
              Calmer evenings, clearer mornings — on a schedule.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ReserveButton />
              <span className="font-display text-xs font-medium tracking-tight text-night-foreground/60 uppercase">
                → or scroll to read first
              </span>
            </div>
          </div>

          {/* Draggable spec sheet */}
          <div className="relative hidden h-[180px] md:block">
            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.18}
              whileDrag={{ scale: 0.98, cursor: "grabbing" }}
              className="absolute right-0 top-0 w-[260px] cursor-grab border border-night-foreground bg-night-foreground p-5 text-night select-none"
            >
              <div className="flex items-center justify-between font-display text-xs font-semibold tracking-tight uppercase">
                <span>spec sheet</span>
                <span aria-hidden>⇢ drag me</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-y-3 font-display text-[0.78rem] font-medium tracking-tight uppercase">
                <span className="text-night/60">length</span>
                <span>21 nights</span>
                <span className="text-night/60">price</span>
                <span>{COHORT.price} once</span>
                <span className="text-night/60">cohort</span>
                <span>limited 100</span>
                <span className="text-night/60">refund</span>
                <span>no questions</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom marquee strip */}
      <div className="mt-12 border-y border-night-foreground py-3 text-sm text-night-foreground md:mt-20 md:py-4 md:text-base">
        <Marquee items={marqueeTop} duration={44} />
      </div>
    </section>
  );
}
