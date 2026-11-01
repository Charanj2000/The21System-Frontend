import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/useSession";

type Variant = "pill" | "nav" | "pill-on-dark";

type Props = {
  variant?: Variant;
  className?: string;
};

const pillOnLight =
  "group btn-pill btn-pill-dark relative overflow-hidden";

const pillOnDark =
  "group btn-pill btn-pill-light relative overflow-hidden";

const navBase =
  "inline-flex items-center font-sans text-sm font-medium text-ink hover:text-gold transition-colors duration-200";

const navDark =
  "inline-flex items-center font-sans text-sm font-medium text-night-foreground hover:text-gold-dark transition-colors duration-200";

export function ReserveButton({ variant = "pill", className }: Props) {
  const { session, loading } = useSession();
  const signedIn = Boolean(session);
  const linkTarget = signedIn
    ? { to: "/checkout" as const, search: undefined }
    : { to: "/login" as const, search: { redirect: "/checkout" } };

  const label = signedIn ? "Reserve my spot" : "Sign in to reserve";

  if (variant === "nav") {
    return (
      <Link
        to={linkTarget.to}
        search={linkTarget.search}
        className={`${navBase} ${className ?? ""}`}
        aria-busy={loading || undefined}
      >
        <span>{label}</span>
        <span aria-hidden className="ml-1.5">→</span>
      </Link>
    );
  }

  const base = variant === "pill-on-dark" ? pillOnDark : pillOnLight;

  return (
    <Link
      to={linkTarget.to}
      search={linkTarget.search}
      className={`${base} ${className ?? ""}`}
      aria-busy={loading || undefined}
    >
      <span>{label}</span>
      <span aria-hidden className="transition-transform duration-240 group-hover:translate-x-1">→</span>
    </Link>
  );
}
