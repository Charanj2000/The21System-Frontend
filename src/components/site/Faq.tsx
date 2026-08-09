import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME_FAQS } from "@/lib/faqs";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section className="section-y-tight bg-ivory px-6 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.4fr] md:gap-14">
        <Reveal>
          <p className="eyebrow text-gold-hover">Questions</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="border-t border-border">
            {HOME_FAQS.map(({ q, a }) => (
              <AccordionItem key={q} value={q} className="border-b border-border">
                <AccordionTrigger className="py-5 text-left font-display text-lg font-light text-ink transition-colors duration-500 ease-calm hover:text-gold-hover hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="max-w-prose pb-5 text-[0.95rem] leading-[1.75] font-light text-ink-muted">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}