import { createFileRoute } from "@tanstack/react-router";

import heroNight from "@/assets/hero-night.jpg";
import { Community } from "@/components/site/Community";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { Founder } from "@/components/site/Founder";
import { Hero } from "@/components/site/Hero";
import { Journey } from "@/components/site/Journey";
import { Nav } from "@/components/site/Nav";
import { NightTimeline } from "@/components/site/NightTimeline";
import { Pricing } from "@/components/site/Pricing";
import { SkipLink } from "@/components/site/SkipLink";
import { TheSystem } from "@/components/site/TheSystem";
import { HOME_FAQS } from "@/lib/faqs";

const title = "The21System — The 21-Day Sleep Reset";
const description =
  "A cohort-based 21-night reset for professionals who overthink. Calmer evenings, clearer mornings. Next cohort begins September 1.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "#organization",
      name: "The21System",
      description:
        "Cohort-based sleep and evening rituals for people who think for a living.",
      email: "hello@the21system.com",
    },
    {
      "@type": "Product",
      name: "The 21-Day Sleep Reset",
      description,
      brand: { "@id": "#organization" },
      category: "Sleep & wellbeing programme",
      offers: {
        "@type": "Offer",
        price: "499",
        priceCurrency: "INR",
        availability: "https://schema.org/PreOrder",
        availabilityStarts: "2026-09-01",
        url: "/checkout",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: HOME_FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroNight, fetchPriority: "high" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(structuredData) },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="content">
        <Hero />
        <NightTimeline />
        <TheSystem />
        <Journey />
        <Community />
        <Founder />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
