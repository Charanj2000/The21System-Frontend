import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import dawn from "@/assets/journey-dawn.jpg";
import ritual from "@/assets/journey-ritual.jpg";
import morningLight from "@/assets/morning-light.jpg";
import circle from "@/assets/community-circle.jpg";
import { Reveal } from "./Reveal";

type Chapter = {
  mark: string;
  title: string;
  note: string;
  img?: string;
  alt?: string;
  dark: boolean;
};

const chapters: Chapter[] = [
  {
    mark: "Night 1",
    title: "Recognition.",
    note: "Nothing is wrong with you. Your evening simply never learned where to end.",
    img: ritual,
    alt: "A hand setting a small notebook beside a warm bedside lamp at night",
    dark: true,
  },
  {
    mark: "Night 4",
    title: "First quiet morning.",
    note: "You notice it in the morning, not in the night. Something simply felt softer.",
    img: dawn,
    alt: "First pale dawn light falling across a linen bedsheet",
    dark: true,
  },
  {
    mark: "Night 12",
    title: "The mind slows naturally.",
    note: "Light, caffeine and screens have quietly found their places.",
    img: morningLight,
    alt: "Soft morning light through sheer linen curtains",
    dark: false,
  },
  {
    mark: "Night 21",
    title: "Morning becomes effortless.",
    note: "The hours before midnight are yours again, and you wake before the alarm.",
    img: circle,
    alt: "Three friends together in warm, unhurried morning light",
    dark: false,
  },
];

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.6 });

  return (
    <section
      id="nights"
      className="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--color-night)_0%,var(--color-night)_44%,var(--color-night-surface)_56%,var(--color-ivory)_70%,var(--color-ivory)_100%)]"
    >
      <div aria-hidden className="halo top-[12%] -left-24 size-[26rem] opacity-40" />

      <div className="section-y mx-auto max-w-5xl px-6 md:px-10">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-gold">Twenty-one nights</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-extralight text-night-foreground text-balance-tight sm:text-5xl">
              It doesn&rsquo;t arrive all at once.
              <span className="block text-night-muted">It arrives quietly.</span>
            </h2>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-12 md:mt-16">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] w-px bg-gold/20 md:left-1/2 md:-translate-x-1/2"
          />
          <motion.div
            aria-hidden
            style={{ scaleY: reduced ? 1 : rail }}
            className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-gradient-to-b from-gold/70 to-gold/20 md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-12 md:space-y-16">
            {chapters.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal as="li" key={c.mark} delay={0.05}>
                  <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 md:grid-cols-2 md:gap-x-16">
                    <span
                      className={`relative z-10 mt-2 grid size-[15px] shrink-0 place-items-center rounded-full border md:absolute md:top-3 md:left-1/2 md:-translate-x-1/2 ${
                        c.dark ? "border-gold/50 bg-night" : "border-gold/60 bg-ivory"
                      }`}
                    >
                      <span className="size-[5px] rounded-full bg-gold" />
                    </span>

                    <div className={`min-w-0 md:pr-8 ${flip ? "md:order-2 md:pr-0 md:pl-8" : ""}`}>
                      <p
                        className={`eyebrow ${c.dark ? "text-gold" : "text-gold-hover"} ${
                          flip ? "" : "md:text-right"
                        }`}
                      >
                        {c.mark}
                      </p>
                      <p
                        className={`mt-4 font-display text-[1.5rem] leading-[1.15] font-light text-balance-tight sm:text-[2rem] ${
                          c.dark ? "text-night-foreground" : "text-ink"
                        } ${flip ? "" : "md:text-right"}`}
                      >
                        {c.title}
                      </p>
                      <p
                        className={`mt-4 max-w-xs text-[0.9375rem] leading-[1.7] font-light ${
                          c.dark ? "text-night-muted" : "text-ink-muted"
                        } ${flip ? "" : "md:ml-auto md:text-right"}`}
                      >
                        {c.note}
                      </p>
                    </div>

                    {c.img ? (
                      <figure
                        className={`col-start-2 mt-5 md:col-start-auto md:mt-0 md:pl-8 ${
                          flip ? "md:order-1 md:flex md:justify-end md:pr-8 md:pl-0" : ""
                        }`}
                      >
                        <img
                          src={c.img}
                          alt={c.alt}
                          width={720}
                          height={720}
                          loading="lazy"
                          decoding="async"
                          className={`aspect-square w-32 object-cover transition-all duration-[900ms] ease-calm hover:scale-[1.03] hover:opacity-100 sm:w-40 md:w-44 ${
                            c.dark ? "opacity-75" : "opacity-95"
                          }`}
                        />
                      </figure>
                    ) : (
                      <div aria-hidden className={flip ? "md:order-1" : ""} />
                    )}
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}