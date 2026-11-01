import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getFaqs } from "@/lib/faqs";

const title = "FAQ — The 21-Day Sleep Reset | The21System";
const description =
  "How the 21-Day Sleep Reset works: nightly time, what arrives by email, refunds, and who it's for.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: getFaqs().map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Nav />
      <main id="content" className="flex-1">
        <PageHeader
          eyebrow="Questions"
          title="Everything you'd ask at 2am."
          intro="Short answers. Nothing hidden in the footnotes."
        />
        <section className="bg-ivory px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Accordion type="single" collapsible className="border-t border-ink/15">
                {getFaqs().map(({ q, a }) => (
                  <AccordionItem key={q} value={q} className="border-b border-ink/15">
                    <AccordionTrigger className="py-6 text-left font-display text-lg font-light text-ink hover:no-underline">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-[0.95rem] leading-relaxed font-light text-ink-muted">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}