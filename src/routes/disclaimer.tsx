import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalBlock } from "@/components/site/LegalPage";

const title = "Disclaimer — The21System";
const description =
  "The21System is an educational habit and sleep-routine programme. It is not therapy, counselling or medical treatment.";

const blocks: readonly LegalBlock[] = [
  {
    heading: "Not medical care",
    body: [
      "The 21-Day Sleep Reset is an educational, behavioural programme about evening habits and sleep routines. It is not medical advice, diagnosis or treatment, and nothing in it should be read as a clinical recommendation.",
    ],
  },
  {
    heading: "Not therapy or counselling",
    body: [
      "We are not licensed therapists, psychologists, psychiatrists or counsellors, and the programme is not psychotherapy, counselling or crisis support.",
      "Community rooms and live sessions are peer spaces for accountability and shared practice. They are not a substitute for professional mental-health care.",
    ],
  },
  {
    heading: "When to see a professional",
    body: [
      "If you suspect insomnia, sleep apnoea, or any sleep, medical or mental-health condition — or you are taking medication that affects sleep — please consult a qualified clinician before or alongside this programme.",
      "If you are in distress or thinking about harming yourself, stop and contact a local emergency number or a crisis helpline immediately. In India you can reach Tele-MANAS on 14416.",
    ],
  },
  {
    heading: "No guaranteed outcomes",
    body: [
      "Results depend on your circumstances and consistency. We describe what typically happens for participants; we do not promise specific sleep, health or performance outcomes.",
    ],
  },
  {
    heading: "Your responsibility",
    body: [
      "You take part voluntarily and remain responsible for your own decisions, health and safety. Never apply a suggestion that conflicts with guidance from your doctor.",
    ],
  },
  {
    heading: "Testimonials",
    body: [
      "Quotes shared on this site reflect individual experiences and are not typical or guaranteed results.",
    ],
  },
  {
    heading: "Questions",
    body: [
      "Write to hello@the21system.com or call +91 86607 89864 and a person will reply.",
    ],
  },
];

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Disclaimer"
      title="A routine, not a treatment."
      intro="What this programme is — and what it is not."
      updated="August 2026"
      blocks={blocks}
    />
  );
}