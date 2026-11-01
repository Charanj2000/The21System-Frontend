import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "A short evening ritual, one night at a time.",
    note:
      "Each evening we send a small, specific action — never more than 10 minutes. The system doesn't rely on willpower; it rearranges the few inputs that shape your sleep.",
  },
  {
    n: "02",
    title: "A cohort of 100, moving together.",
    note:
      "You begin the same night as everyone else. A private group checks in each night. Weekly live sessions with a sleep coach. Missing a night doesn't break anything.",
  },
  {
    n: "03",
    title: "Clearer mornings by week three.",
    note:
      "Most members fall asleep 30–45 minutes faster by day 14 and wake before the alarm by day 21. Finish all 21 nights — if nothing changed, we refund you in full.",
  },
];

export function Mechanism() {
  return (
    <section className="section-y relative bg-ivory text-ink">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-gold">How it works</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="editorial-lg mt-5 max-w-xs text-ink">
                A system,{" "}
                <em className="italic text-gold">not a course.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-sm font-sans text-[0.95rem] leading-relaxed text-ink-muted">
                Three simple things make it work. Each is small on its own; together they
                reset the hours before midnight.
              </p>
            </Reveal>
          </div>

          <ol className="flex flex-col">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={0.1 + i * 0.08}>
                <div className={`grid grid-cols-[auto_1fr] items-start gap-x-6 py-8 sm:gap-x-10 ${i > 0 ? "hairline" : ""}`}>
                  <span className="font-display text-3xl font-light tracking-tight text-ink/35 sm:text-4xl">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl leading-snug font-normal text-ink sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-xl font-sans text-[0.95rem] leading-relaxed text-ink-muted">
                      {s.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
