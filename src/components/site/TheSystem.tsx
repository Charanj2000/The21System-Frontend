import { Reveal } from "./Reveal";

const parts = [
  {
    mark: "01",
    title: "A closing ritual",
    body: "A short sequence that gives the day a last page, so the mind stops re-reading it.",
  },
  {
    mark: "02",
    title: "A quieter evening",
    body: "Light, screens and caffeine move themselves — one small change a night, never six at once.",
  },
  {
    mark: "03",
    title: "People doing it with you",
    body: "A cohort that begins the same night you do, and is still awake when you are.",
  },
];

export function TheSystem() {
  return (
    <section id="system" className="section-y ambient-top bg-night px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-gold">The real problem</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-extralight text-night-foreground text-balance-tight sm:text-5xl">
              Sleep is not the problem.
              <span className="block text-night-muted">An evening with no ending is.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="measure-sm mt-6 text-[1.0625rem] leading-[1.75] font-light text-night-muted">
              So The21System gives the evening an ending — three quiet parts, twenty-one nights.
            </p>
          </Reveal>
        </div>

        <ol className="mt-10 grid gap-px border-t border-night-hairline md:mt-14 md:grid-cols-3">
          {parts.map((p, i) => (
            <Reveal as="li" key={p.mark} delay={0.06 * i}>
              <article className="group flex h-full flex-col border-b border-night-hairline py-8 transition-colors duration-700 ease-calm md:border-r md:px-8 md:last:border-r-0 md:first:pl-0">
                <span className="font-display text-[0.7rem] tracking-[0.24em] text-gold uppercase">
                  {p.mark}
                </span>
                <h3 className="mt-6 font-display text-xl leading-tight font-light text-night-foreground sm:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-xs text-[0.9375rem] leading-[1.7] font-light text-night-muted">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}