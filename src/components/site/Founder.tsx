import charanImage from "@/assets/founder-charan.png";
import sonaliImage from "@/assets/founder-sonali.jpg";

import { Reveal } from "./Reveal";

const letters = [
  {
    quote:
      "Transformation doesn't happen when you learn more — it happens when you show up consistently. That's why The 21 System was built: to make lasting change inevitable through accountability, community, and action.",
    name: "Charan",
    role: "Co-founder",
    img: charanImage,
  },
  {
    quote:
      "I created The 21 System for the version of me who believed change was possible but didn't know how to make it last. Every step of this journey is built to turn hope into lasting transformation.",
    name: "Sonali",
    role: "Co-founder",
    img: sonaliImage,
  },
];

const stories = [
  {
    quote:
      "By night nine I stopped negotiating with myself at 1am. I just went to bed. The strange part is what it did to my mornings.",
    name: "Aditi R.",
    role: "Product lead, Bengaluru",
  },
  {
    quote:
      "I joined for sleep. What actually changed was that I stopped being short with my wife after 9pm.",
    name: "Karthik S.",
    role: "Founder, Chennai",
  },
];

export function Founder() {
  return (
    <section className="section-y bg-ivory px-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="eyebrow text-gold-hover">From the founders</p>
        </Reveal>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-2 md:gap-14">
          {letters.map((l, i) => (
            <Reveal key={l.name} delay={0.08 * i}>
              <figure className="flex h-full flex-col">
                <blockquote className="font-display text-[1.05rem] leading-[1.6] font-light text-ink text-balance-tight sm:text-[1.2rem] sm:leading-[1.55]">
                  {l.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4 pt-8">
                  <img
                    src={l.img}
                    alt={`${l.name}, co-founder of The21System`}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="size-20 shrink-0 rounded-full object-cover object-[center_25%] ring-1 ring-ink/10 sm:size-24"
                  />
                  <span>
                    <span className="block font-hand text-2xl leading-none text-ink">
                      {l.name}
                    </span>
                    <span className="mt-1.5 block text-[0.7rem] tracking-[0.16em] text-ink-muted uppercase">
                      {l.role}, The21System
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12">
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={0.07 * i}>
              <figure className="flex h-full flex-col border-t border-ink/12 pt-7">
                <blockquote className="font-display text-[1.1rem] leading-[1.5] font-light text-ink text-balance-tight sm:text-[1.2rem]">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto pt-6 text-[0.75rem] tracking-[0.16em] text-ink-muted uppercase">
                  {s.name} — {s.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
