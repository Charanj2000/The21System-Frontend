export interface Faq {
  readonly q: string;
  readonly a: string;
}

/** Single source of truth for FAQ copy — used on the homepage and /faq. */
export const FAQS: readonly Faq[] = [
  {
    q: "When does it start?",
    a: "The next cohort begins September 1. You reserve your place now and everyone starts the same night.",
  },
  {
    q: "Do I need an app?",
    a: "No. Each night arrives by email, one at a time. Nothing to install.",
  },
  {
    q: "How long does it take each night?",
    a: "A short sequence at the end of your evening — most people settle into it quickly, and it gets shorter once it becomes habit.",
  },
  {
    q: "What if I miss a night?",
    a: "Nothing breaks. You pick up the next evening, and the cohort keeps a place for you.",
  },
  {
    q: "Is this medical advice?",
    a: "No. It's a behavioural routine. If you suspect a sleep disorder, please see a clinician.",
  },
  {
    q: "What if it doesn't work?",
    a: "Finish all 21 nights. If nothing changed, write to us and we refund you in full.",
  },
  {
    q: "Do I get lifetime access?",
    a: "Yes. The system stays yours, including future revisions, plus the community rooms.",
  },
] as const;

/** The four asked most often — shown inline on the homepage. */
export const HOME_FAQS: readonly Faq[] = FAQS.slice(0, 4);
