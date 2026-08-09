/** Keyboard users land here first; it stays invisible until focused. */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[60] focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:bg-gold focus-visible:px-4 focus-visible:text-[0.75rem] focus-visible:tracking-[0.14em] focus-visible:text-night focus-visible:uppercase"
    >
      Skip to content
    </a>
  );
}
