import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";

const moments = [
  { time: "11:40 PM", line: "One more email." },
  { time: "12:52 AM", line: "I'll sleep after this." },
  { time: "2:10 AM", line: "Sleep finally arrives." },
  { time: "6:50 AM", line: "The alarm feels impossible." },
];

function Moment({ time, line }: { time: string; line: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: false, margin: "-45% 0px -45% 0px" });
  const reduced = useReducedMotion();

  return (
    <li ref={ref} className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 pb-10 md:gap-x-10 md:pb-12">
      <span className="relative z-10 mt-3 grid size-3 shrink-0 place-items-center md:mt-4">
        <motion.span
          animate={{
            opacity: inView ? 1 : 0.35,
            scale: reduced ? 1 : inView ? 1 : 0.7,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`size-2 rounded-full bg-gold ${inView ? "animate-glow" : ""}`}
        />
      </span>
      <motion.div
        animate={{ opacity: inView ? 1 : 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0"
      >
        <p className="text-[0.65rem] tracking-[0.24em] text-gold/80 uppercase">{time}</p>
        <p className="mt-2 font-display text-[1.6rem] leading-[1.15] font-extralight text-night-foreground text-balance-tight sm:text-4xl lg:text-[2.75rem]">
          {line}
        </p>
      </motion.div>
    </li>
  );
}

export function NightTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.6 });

  return (
    <section
      id="cycle"
      className="section-y relative overflow-hidden bg-night px-6 md:px-10"
    >
      <div aria-hidden className="halo top-[30%] -left-24 size-[26rem] opacity-40" />
      <div className="relative mx-auto max-w-4xl">
        <p className="eyebrow text-gold">Recognition</p>
        <h2 className="mt-6 max-w-2xl font-display text-[2rem] leading-[1.1] font-extralight text-night-foreground text-balance-tight sm:text-5xl">
          You are not bad at sleeping.
          <span className="mt-2 block text-night-muted">You are simply never off duty.</span>
        </h2>
        <p className="measure-sm mt-6 text-[1.0625rem] leading-[1.75] font-light text-night-muted">
          The work follows you upstairs. The day never gets a last page — so the mind keeps
          reading it, in the dark.
        </p>

        <div ref={ref} className="relative mt-12 md:mt-14">
          <div
            aria-hidden
            className="absolute top-2 bottom-10 left-[5px] w-px bg-night-hairline"
          />
          <motion.div
            aria-hidden
            style={{ scaleY: reduced ? 1 : rail }}
            className="absolute top-2 bottom-10 left-[5px] w-px origin-top bg-gradient-to-b from-gold/80 to-gold/10"
          />
          <ol>
            {moments.map((m) => (
              <Moment key={m.time} {...m} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}