import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalBlock } from "@/components/site/LegalPage";
import { COHORT } from "@/lib/cohort";

const title = "Refund Policy — The21System";
const description =
  "How refunds, cancellations and cohort transfers work for The 21-Day Sleep Reset by The21System.";

const blocks: readonly LegalBlock[] = [
  {
    heading: "The promise",
    body: [
      `The 21-Day Sleep Reset is a one-time payment of ${COHORT.price}. Complete all 21 nights, and if nothing about your evenings or mornings changed, write to us within 7 days of finishing and we refund you in full — no forms, no interviews.`,
    ],
  },
  {
    heading: "Before the cohort begins",
    body: [
      `You may cancel any time before your cohort start date (${COHORT.startsOn}) for a full refund. Email billing@the21system.com from the address you used at checkout.`,
    ],
  },
  {
    heading: "After the cohort begins",
    body: [
      "Once the cohort has started, refunds are handled through the completion promise above. This keeps the group intact — everyone begins and finishes together.",
      "If a genuine emergency stops you from participating, tell us. We will move you to the next cohort at no cost instead of processing a refund.",
    ],
  },
  {
    heading: "Cohort transfers",
    body: [
      "You can request one free transfer to a later cohort up to 48 hours before your start date. Your place is held, not lost.",
    ],
  },
  {
    heading: "How to request a refund",
    body: [
      "Email billing@the21system.com or call +91 86607 89864 with your name, the email used at checkout, and your payment reference.",
      "Approved refunds are issued to the original payment method via Razorpay and typically settle within 5–7 working days, depending on your bank.",
    ],
  },
  {
    heading: "What is not refundable",
    body: [
      "Payment gateway fees deducted by your bank or card issuer on international transactions are outside our control. Everything we receive is refundable.",
    ],
  },
];

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Refund policy"
      title="Finish it. If nothing changed, we refund you."
      intro="Clear terms, written in plain language."
      updated="November 2026"
      blocks={blocks}
    />
  );
}