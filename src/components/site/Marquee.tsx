import type { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Infinite CSS marquee that duplicates its content once so the loop is seamless.
 * Pauses on hover (desktop) via `group` + `group-hover:[animation-play-state:paused]`.
 */
export function Marquee({ items, duration = 36, reverse = false, className }: Props) {
  const style = { ["--marquee-duration" as string]: `${duration}s` } as React.CSSProperties;
  const renderTrack = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className={`marquee-track ${reverse ? "marquee-reverse" : ""} items-center group-hover:[animation-play-state:paused]`}
    >
      {items.map((node, i) => (
        <span key={i} className="flex shrink-0 items-center gap-10 whitespace-nowrap">
          {node}
          <span aria-hidden className="size-1 rounded-full bg-current opacity-40" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee-wrap group ${className ?? ""}`} style={style}>
      {renderTrack(false)}
      {renderTrack(true)}
    </div>
  );
}
