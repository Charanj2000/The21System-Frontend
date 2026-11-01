import dawn from "@/assets/journey-dawn.jpg";
import ritual from "@/assets/journey-ritual.jpg";
import morningLight from "@/assets/morning-light.jpg";
import circle from "@/assets/community-circle.jpg";

type Chapter = {
  n: string;
  mark: string;
  title: string;
  note: string;
  img: string;
  alt: string;
};

const chapters: Chapter[] = [
  {
    n: "01",
    mark: "Night 01",
    title: "Recognition.",
    note: "Nothing is wrong with you. Your evening never learned where to end.",
    img: ritual,
    alt: "A hand setting a small notebook beside a warm bedside lamp at night",
  },
  {
    n: "04",
    mark: "Night 04",
    title: "First quiet morning.",
    note: "You notice it in the morning, not in the night. Something simply felt softer.",
    img: dawn,
    alt: "First pale dawn light falling across a linen bedsheet",
  },
  {
    n: "12",
    mark: "Night 12",
    title: "The mind slows naturally.",
    note: "Light, caffeine and screens have quietly found their places.",
    img: morningLight,
    alt: "Soft morning light through sheer linen curtains",
  },
  {
    n: "21",
    mark: "Night 21",
    title: "Morning becomes effortless.",
    note: "The hours before midnight are yours again, and you wake before the alarm.",
    img: circle,
    alt: "Three friends together in warm, unhurried morning light",
  },
];

export function Journey() {
  return (
    <section
      id="nights"
      className="relative isolate overflow-hidden bg-night text-night-foreground"
    >
      <span aria-hidden className="grain" />

      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        {/* Header row — tight */}
        <div className="flex flex-wrap items-end justify-between gap-y-3 border-b border-night-foreground pb-5">
          <span className="font-display text-xs font-medium tracking-tight uppercase">
            / 21 nights · 4 chapters
          </span>
          <span className="font-display text-xs font-medium tracking-tight text-night-foreground/60 uppercase">
            scroll →
          </span>
        </div>

        <h2 className="display-md mt-8 max-w-3xl md:mt-10">
          it arrives{" "}
          <span className="font-serif italic font-normal text-gold">quietly</span>
          <span className="text-night-foreground/40"> — not all at once.</span>
        </h2>

        {/* 4-up grid */}
        <ol className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 md:gap-x-5 lg:grid-cols-4">
          {chapters.map((c, i) => (
            <li key={c.n} className="group flex flex-col">
              <figure className="relative aspect-[4/5] overflow-hidden border border-night-foreground/70">
                <img
                  src={c.img}
                  alt={c.alt}
                  width={640}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover grayscale transition-[filter,transform] duration-500 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                />

                {/* Chapter index chip, top-left */}
                <span className="absolute top-0 left-0 bg-night-foreground px-2 py-1 font-display text-[0.65rem] font-semibold tracking-tight text-night uppercase">
                  0{i + 1} / 04
                </span>

                {/* Giant numeral overlay, bottom-right */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -bottom-3 font-display text-[5.5rem] leading-none font-bold tracking-[-0.06em] text-ivory mix-blend-difference transition-transform duration-500 ease-out sm:text-[6.5rem] md:-bottom-5 md:text-[7rem] group-hover:-translate-y-1"
                >
                  {c.n}
                </span>
              </figure>

              <div className="mt-4">
                <p className="font-display text-[0.65rem] font-medium tracking-[0.14em] text-gold uppercase">
                  {c.mark}
                </p>
                <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-night-foreground sm:text-xl">
                  {c.title.replace(/\.$/, "")}
                  <span className="text-gold">.</span>
                </h3>
                <p className="mt-2 font-display text-[0.82rem] leading-relaxed font-light text-night-foreground/60">
                  {c.note}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Dark → morning rail at the bottom */}
        <div
          aria-hidden
          className="mt-14 h-px w-full bg-gradient-to-r from-night-foreground/20 via-gold to-ivory"
        />
        <div className="mt-3 flex justify-between font-display text-[0.65rem] font-medium tracking-[0.14em] text-night-foreground/60 uppercase">
          <span>night 01</span>
          <span>night 21</span>
        </div>
      </div>
    </section>
  );
}
