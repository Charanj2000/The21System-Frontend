import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/useSession";

type Variant = "pill" | "nav";

type Props = {
  variant?: Variant;
  className?: string;
};

const pillBase =
  "group relative inline-flex min-h-12 items-center gap-3 bg-night-foreground px-6 py-3 font-display text-xs font-semibold tracking-tight text-night uppercase transition-all duration-200 hover:bg-gold hover:text-night";

const navBase =
  "inline-flex items-center gap-2 border border-night-foreground px-4 py-2 font-display text-xs font-semibold tracking-tight text-night-foreground uppercase transition-colors duration-200 hover:bg-night-foreground hover:text-night";

export function ReserveButton({ variant = "pill", className }: Props) {
  const { session, loading } = useSession();
  const signedIn = Boolean(session);
  const linkTarget = signedIn
    ? { to: "/checkout" as const, search: undefined }
    : { to: "/login" as const, search: { redirect: "/checkout" } };

  const label = signedIn
    ? variant === "nav" ? "Reserve" : "Reserve your spot"
    : variant === "nav" ? "Sign in to reserve" : "Sign in to reserve";

  const base = variant === "nav" ? navBase : pillBase;
  const classes = className ? `${base} ${className}` : base;

  if (variant === "nav") {
    return (
      <Link
        to={linkTarget.to}
        search={linkTarget.search}
        className={classes}
        aria-busy={loading || undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={linkTarget.to}
      search={linkTarget.search}
      className={classes}
      aria-busy={loading || undefined}
    >
      <span className="relative">{label}</span>
      <span aria-hidden className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
    </Link>
  );
}
