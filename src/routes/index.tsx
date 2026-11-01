import { createFileRoute } from "@tanstack/react-router";

import heroBedroom from "@/assets/hero-bedroom.jpg";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { Founder } from "@/components/site/Founder";
import { Hero } from "@/components/site/Hero";
import { Journey } from "@/components/site/Journey";
import { Mechanism } from "@/components/site/Mechanism";
import { Nav } from "@/components/site/Nav";
import { Pricing } from "@/components/site/Pricing";
import { SkipLink } from "@/components/site/SkipLink";
import { Testimonial } from "@/components/site/Testimonial";
import { COHORT, computeCohortForDate } from "@/lib/cohort";
import { getHomeFaqs } from "@/lib/faqs";

const title = "The21System — The 21-Day Sleep Reset";

function priceNumeric(): string {
  const match = COHORT.price.match(/(\d[\d,]*)/);
  return match ? match[1].replace(/,/g, "") : "199";
}

export const Route = createFileRoute("/")({
  head: () => {
    const cohort = computeCohortForDate();
    const description = `A cohort-based 21-night reset for professionals who overthink. Calmer evenings, clearer mornings. Next cohort begins ${cohort.startsOn}.`;

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
            price: priceNumeric(),
            priceCurrency: "INR",
            availability: "https://schema.org/PreOrder",
            availabilityStarts: cohort.startDate,
            url: "/checkout",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: getHomeFaqs().map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "/" },
      ],
      links: [
        { rel: "canonical", href: "/" },
        { rel: "preload", as: "image", href: heroBedroom, fetchPriority: "high" },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(structuredData) },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="content">
        <Hero />
        <Mechanism />
        <Journey />
        <Testimonial />
        <Founder />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
