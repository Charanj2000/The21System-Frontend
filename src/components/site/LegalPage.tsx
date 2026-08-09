import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { PageHeader } from "./PageHeader";
import { Reveal } from "./Reveal";
import { SkipLink } from "./SkipLink";

export interface LegalBlock {
  readonly heading: string;
  readonly body: readonly string[];
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  blocks,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  updated: string;
  blocks: readonly LegalBlock[];
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Nav />
      <main id="content" className="flex-1">
        <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
        <section className="bg-ivory px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-[0.7rem] tracking-[0.18em] text-ink-muted uppercase">
              Last updated {updated}
            </p>
            <div className="mt-10 border-t border-border">
              {blocks.map((block, i) => (
                <Reveal key={block.heading} delay={Math.min(i, 5) * 0.06}>
                  <article className="grid gap-3 border-b border-border py-8 md:grid-cols-[1fr_1.6fr] md:gap-10">
                    <h2 className="font-display text-[1.05rem] leading-snug font-light text-ink">
                      {block.heading}
                    </h2>
                    <div className="min-w-0 space-y-4">
                      {block.body.map((p) => (
                        <p key={p} className="text-[0.95rem] leading-[1.75] font-light text-ink-muted">
                          {p}
                        </p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
