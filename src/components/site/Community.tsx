import { Video } from "lucide-react";
import { addDays, format, parseISO } from "date-fns";

import { COHORT } from "@/lib/cohort";
import { Reveal } from "./Reveal";

const whatsapp = [
  { from: "Meera", text: "Phone on DND at 10. Third night in a row.", mine: false },
  { from: "You", text: "Doing the shutdown now. Brain still buzzing.", mine: true },
  { from: "Rohit", text: "Same on night 3. Write it down — it stops asking to be remembered.", mine: false },
];

const discord = [
  { channel: "# night-log", note: "Night 6 · 14 entries today" },
  { channel: "# 2am-club", note: "For the nights it doesn't work" },
  { channel: "# ask-the-coach", note: "Answered every evening" },
];

function getSessions() {
  const start = parseISO(`${COHORT.startDate}T00:00:00Z`);
  return [
    { date: format(start, "EEE, d MMM"), title: "Opening night — meet your cohort", time: "8:30 pm IST · 45 min" },
    { date: format(addDays(start, 6), "EEE, d MMM"), title: "Week 1 review & Q&A", time: "9:00 pm IST · 45 min" },
    { date: format(addDays(start, 13), "EEE, d MMM"), title: "Sleep coaching — evenings that hold", time: "8:30 pm IST · 45 min" },
  ];
}

export function Community() {
  const sessions = getSessions();
  return (
    <section
      id="community"
      className="section-y ambient-top relative overflow-hidden bg-night-surface px-6 md:px-10"
    >
      <div aria-hidden className="halo -top-16 right-[6%] hidden size-64 animate-breathe md:block" />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-gold">Inside the community</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[2rem] leading-[1.1] font-extralight text-night-foreground text-balance-tight sm:text-5xl">
              You don&rsquo;t do the 21 nights alone.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="measure-sm mt-6 text-[1.0625rem] leading-[1.75] font-light text-night-muted">
              A daily thread, a cohort server, and one calm hour together each week on Google Meet.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          <Reveal>
            <article className="lift flex h-full flex-col border border-night-hairline bg-night p-5 hover:border-gold/30 sm:p-6">
              <p className="text-[0.62rem] tracking-[0.18em] text-gold/80 uppercase">
                WhatsApp · The 10pm thread
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {whatsapp.map((m) => (
                  <li
                    key={m.text}
                    className={`max-w-[88%] px-3 py-2 ${
                      m.mine
                        ? "self-end rounded-t-lg rounded-bl-lg bg-gold/15"
                        : "self-start rounded-t-lg rounded-br-lg bg-night-surface"
                    }`}
                  >
                    <p className="text-[0.6rem] tracking-[0.12em] text-gold/70 uppercase">
                      {m.from}
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-snug font-light text-night-foreground">
                      {m.text}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.8rem] leading-relaxed font-light text-night-muted">
                One nudge a night. Never noise.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="lift flex h-full flex-col border border-night-hairline bg-night p-5 hover:border-gold/30 sm:p-6">
              <p className="text-[0.62rem] tracking-[0.18em] text-gold/80 uppercase">
                Discord · Your cohort server
              </p>
              <ul className="mt-4 divide-y divide-night-hairline border-y border-night-hairline">
                {discord.map((c) => (
                  <li
                    key={c.channel}
                    className="group flex flex-wrap items-baseline justify-between gap-2 py-2.5 transition-colors duration-500 ease-calm hover:text-gold"
                  >
                    <span className="font-display text-[0.88rem] font-light text-night-foreground transition-colors duration-500 group-hover:text-gold">
                      {c.channel}
                    </span>
                    <span className="text-[0.72rem] font-light text-night-muted">{c.note}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.8rem] leading-relaxed font-light text-night-muted">
                Rooms stay open long after night 21. Access is yours for life.
              </p>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 border border-night-hairline p-5 sm:p-6 md:mt-6">
            <p className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.18em] text-gold/80 uppercase">
              <Video aria-hidden className="size-4" strokeWidth={1.25} />
              Weekly live sessions · Google Meet
            </p>
            <ul className="mt-4 divide-y divide-night-hairline border-y border-night-hairline">
              {sessions.map((s) => (
                <li
                  key={s.title}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5"
                >
                  <span className="font-display text-[0.9rem] font-light text-night-foreground">
                    <span className="mr-3 text-gold">{s.date}</span>
                    {s.title}
                  </span>
                  <span className="text-[0.72rem] font-light text-night-muted">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}