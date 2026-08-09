import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-night px-6 py-12 md:px-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div aria-hidden className="hairline-y w-full opacity-40" />
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-[0.85rem] tracking-[0.2em] text-night-foreground uppercase">
              The<span className="text-gold">21</span>System
            </p>
            <p className="mt-3 max-w-xs text-[0.875rem] leading-relaxed font-light text-night-muted">
              Quieter evenings, clearer mornings — twenty-one nights at a time.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
              { to: "/refund-policy", label: "Refunds" },
              { to: "/disclaimer", label: "Disclaimer" },
              { to: "/login", label: "Member login" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[0.72rem] tracking-[0.16em] text-night-muted uppercase transition-colors duration-500 ease-calm hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-[0.72rem] font-light text-night-muted">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}