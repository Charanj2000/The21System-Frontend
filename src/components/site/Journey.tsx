import dawn from "@/assets/journey-dawn.jpg";
import ritual from "@/assets/journey-ritual.jpg";
import morningLight from "@/assets/morning-light.jpg";
import circle from "@/assets/community-circle.jpg";
import { Reveal } from "./Reveal";

type Chapter = {
  mark: string;
  title: string;
  note: string;
  img: string;
  alt: string;
};

const chapters: Chapter[] = [
  {
    mark: "Night 01",
    title: "Recognition.",
    note: "Nothing is wrong with you. Your evening never learned where to end.",
    img: ritual,
    alt: "A hand setting a small notebook beside a warm bedside lamp at night",
  },
  {
    mark: "Night 04",
    title: "First quiet morning.",
    note: "You notice it in the morning, not in the night. Something simply felt softer.",
    img: dawn,
    alt: "First pale dawn light falling across a linen bedsheet",
  },
  {
    mark: "Night 12",
    title: "The mind slows naturally.",
    note: "Light, caffeine and screens have quietly found their places.",
    img: morningLight,
    alt: "Soft morning light through sheer linen curtains",
  },
  {
    mark: "Night 21",
    title: "Morning becomes effortless.",
    note: "The hours before midnight are yours again. You wake before the alarm.",
    img: circle,
    alt: "Three friends together in warm, unhurried morning light",
  },
];

export function Journey() {
  return (
    <section id="nights" className="section-y relative bg-ivory text-ink">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-gold">Twenty-one nights</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="editorial-lg mt-5 max-w-xs text-ink">
                It arrives{" "}
                <em className="italic text-gold">quietly</em> —
                <br />
                not all at once.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 max-w-sm font-sans text-[0.95rem] leading-relaxed text-ink-muted">
                Four moments stand out across the cohort. Everything in between is
                small, specific, and slow — the way change actually happens.
              </p>
            </Reveal>
          </div>

          <ol className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
            {chapters.map((c, i) => (
              <Reveal as="li" key={c.mark} delay={0.1 + i * 0.06}>
                <figure className="group">
                  <div className="overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.alt}
                      width={640}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <p className="font-sans text-xs tracking-[0.14em] text-gold uppercase">
                      {c.mark}
                    </p>
                    <h3 className="mt-2 font-display text-xl leading-snug font-normal text-ink sm:text-[1.4rem]">
                      {c.title.replace(/\.$/, "")}
                      <span className="text-gold">.</span>
                    </h3>
                    <p className="mt-2 font-sans text-[0.9rem] leading-relaxed text-ink-muted">
                      {c.note}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
