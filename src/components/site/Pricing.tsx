import { Check } from "lucide-react";

import { COHORT } from "@/lib/cohort";
import { Reveal } from "./Reveal";
import { ReserveButton } from "./ReserveButton";

const included = [
  "21-day guided journey, delivered one night at a time",
  "Weekly live sessions with a sleep coach",
  "Private cohort group — the people doing it with you",
  "Lifetime access to the system and all revisions",
  "Full refund if 21 nights change nothing",
];

export function Pricing() {
  return (
    <section id="begin" className="section-y-air relative bg-ivory text-ink">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-20">
          {/* Left: price + CTA */}
          <div>
            <Reveal>
              <p className="eyebrow text-gold">Reserve</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="editorial-lg mt-5 text-ink">
                One payment.
                <br />
                <em className="italic text-gold">One cohort.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-10 font-display text-[clamp(3.5rem,8vw,5.5rem)] leading-none font-light tracking-tight text-ink">
                {COHORT.price}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-3 font-sans text-[0.85rem] tracking-[0.14em] text-ink-muted uppercase">
                Once · No subscription
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col gap-3">
                <ReserveButton />
                <p className="font-sans text-[0.85rem] text-ink-muted">
                  Full refund if nothing changes by day 21 —
                  <br className="hidden sm:block" /> no forms, no interviews.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: what's included */}
          <Reveal delay={0.22}>
            <ul className="flex flex-col">
              {included.map((item, i) => (
                <li
                  key={item}
                  className={`flex items-start gap-4 py-5 ${i > 0 ? "hairline" : ""}`}
                >
                  <Check
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-gold"
                    strokeWidth={1.5}
                  />
                  <span className="font-sans text-[0.95rem] leading-relaxed text-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-sans text-[0.85rem] leading-relaxed text-ink-muted">
              Next cohort begins{" "}
              <span className="text-ink">{COHORT.startsOn}</span>. Limited to 100
              members per cohort — everyone starts together.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
