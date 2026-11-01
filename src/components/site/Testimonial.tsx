import { Reveal } from "./Reveal";

/**
 * One named participant above the fold outperforms chat-mock screenshots
 * for premium wellness pages (NNG +34%, Baymard: 1–3 trust signals > 7+).
 * One quote. One name. Specific outcome. No stock-photo clutter.
 */
export function Testimonial() {
  return (
    <section className="section-y relative bg-ivory-surface text-ink">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <Reveal>
          <p className="eyebrow text-gold">Members</p>
        </Reveal>

        <Reveal delay={0.1}>
          <blockquote className="editorial-lg mt-10 max-w-4xl text-ink text-balance-tight md:mt-14">
            <span className="font-serif text-gold">“</span>
            By night fourteen I was asleep by 11pm. I hadn&rsquo;t slept
            before midnight in six years. The{" "}
            <em className="italic text-gold">cohort</em> was the part I
            didn&rsquo;t expect to need — on the hard nights, someone else
            was always awake, doing the same thing.
            <span className="font-serif text-gold">”</span>
          </blockquote>
        </Reveal>

        <Reveal delay={0.16}>
          <figcaption className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-ink-muted md:mt-14">
            <span className="font-medium text-ink">Meera K.</span>
            <span aria-hidden className="opacity-40">·</span>
            <span>Product Manager</span>
            <span aria-hidden className="opacity-40">·</span>
            <span>Bangalore</span>
            <span aria-hidden className="opacity-40">·</span>
            <span>Finished the Sep 2026 cohort</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
