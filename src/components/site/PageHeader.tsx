import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-night px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-20">
      <div aria-hidden className="halo -top-20 left-[10%] h-72 w-72 animate-breathe" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow text-gold">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-5 max-w-2xl font-display text-[2.1rem] leading-[1.04] font-extralight text-night-foreground text-balance-tight sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        {intro ? (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-base leading-relaxed font-light text-night-muted">
              {intro}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}