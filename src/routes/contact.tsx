import { createFileRoute } from "@tanstack/react-router";

import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";
import { Nav } from "@/components/site/Nav";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

const title = "Contact — The21System";
const description =
  "Reach a human at The21System. Questions about the 21-Day Sleep Reset, billing, or refunds.";

interface Channel {
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly note: string;
}

const channels: readonly Channel[] = [
  {
    label: "Email",
    value: "hello@the21system.com",
    href: "mailto:hello@the21system.com",
    note: "We reply within one working day.",
  },
  {
    label: "Phone & WhatsApp",
    value: "+91 86607 89864",
    href: "tel:+918660789864",
    note: "Mon–Sat, 10am–7pm IST.",
  },
  {
    label: "Billing & refunds",
    value: "billing@the21system.com",
    href: "mailto:billing@the21system.com",
    note: "Invoices, receipts, refunds.",
  },
  {
    label: "Press",
    value: "press@the21system.com",
    href: "mailto:press@the21system.com",
    note: "Interviews and brand assets.",
  },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Nav />
      <main id="content" className="flex-1">
        <PageHeader
          eyebrow="Contact"
          title="A quiet inbox, watched by people."
          intro="No ticket numbers. No chatbots."
        />
        <section className="bg-ivory px-6 py-24 md:px-10 md:py-32">
          <ul className="mx-auto max-w-3xl border-t border-border">
            {channels.map(({ label, value, href, note }, i) => (
              <Reveal as="li" key={value} delay={i * 0.08}>
                <div className="grid gap-2 border-b border-border py-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
                  <span className="eyebrow pt-1 text-gold-hover">{label}</span>
                  <div className="min-w-0">
                    <a
                      href={href}
                      className="inline-flex min-h-11 items-center font-display text-lg font-light text-ink underline decoration-gold/50 decoration-1 underline-offset-[6px] transition-colors duration-500 hover:text-gold-hover"
                    >
                      {value}
                    </a>
                    <p className="mt-1 text-[0.95rem] font-light text-ink-muted">{note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}