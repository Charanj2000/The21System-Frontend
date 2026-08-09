import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { COHORT } from "@/lib/cohort";
import { Reveal } from "./Reveal";

const included = [
  "21-day guided journey",
  "WhatsApp accountability",
  "Discord community",
  "Weekly live sessions",
  "Lifetime community access",
  "One time payment",
];

export function Pricing() {
  return (
    <section
      id="begin"
      className="section-y-air relative overflow-hidden bg-night px-6 md:px-10"
    >
      <div aria-hidden className="halo -top-24 left-1/2 size-96 -translate-x-1/2 animate-breathe" />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <Reveal>
            <p className="eyebrow text-gold">Tonight can end differently</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[2rem] leading-[1.08] font-extralight text-night-foreground text-balance-tight sm:text-5xl">
              The 21-Day Sleep Reset
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 font-display text-5xl font-light text-night-foreground sm:text-6xl">
              {COHORT.price}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-3 text-[0.75rem] tracking-[0.16em] text-night-muted uppercase">
              One payment · No subscription
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.22}>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-px sm:grid-cols-2">
            {included.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border-b border-night-hairline py-4"
              >
                <Check aria-hidden className="size-4 shrink-0 text-gold" strokeWidth={1.25} />
                <span className="text-[0.92rem] font-light text-night-muted">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-10 text-center">
            <Link
              to="/checkout"
              className="group inline-flex min-h-14 items-center gap-4 rounded-full bg-gold pr-6 pl-8 text-[0.78rem] tracking-[0.18em] text-night uppercase shadow-[0_20px_50px_-26px_var(--color-gold)] transition-all duration-500 ease-calm hover:-translate-y-0.5 hover:bg-gold-hover"
            >
              <span>Reserve your spot</span>
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-full bg-night/12 transition-transform duration-500 ease-calm group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <p className="mt-6 text-[0.75rem] tracking-[0.2em] text-gold uppercase">
              Next cohort begins {COHORT.startsOn}
            </p>
            <p className="mx-auto mt-3 max-w-xs text-[0.85rem] leading-relaxed font-light text-night-muted">
              You&rsquo;re reserving a place, not starting tonight. Everyone begins together.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}