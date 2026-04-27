import type { KeyboardEvent, ReactNode } from "react";

export interface LcCardProps {
  /** Adds hover lift + focus ring; toggle when the whole card is interactive. */
  clickable?: boolean;
  /** Click handler (only meaningful with `clickable`). */
  onClick?: () => void;
  /** Additional class names to compose on top of the base `lc-card`. */
  className?: string;
  /** ID for accessibility / scroll-to. */
  id?: string;
  /** ARIA label for clickable cards. */
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * The Lecturio card primitive — drop shadow, no border, square corners.
 * Compose sub-elements via the matching CSS classes (no wrapper components
 * for those — they'd be too thin to add value).
 *
 *   <LcCard clickable onClick={() => navigate(href)} ariaLabel={`Open ${title}`}>
 *     <div className="lc-card-head">
 *       <span className="lc-card-badge">9 Slides</span>
 *       <span className="lc-card-duration"><Clock /> 04:30</span>
 *     </div>
 *     <h3 className="lc-card-title">{title}</h3>
 *     <p className="lc-card-objective">{description}</p>
 *     <div className="lc-card-actions">
 *       <button className="lc-btn lc-btn--secondary">Edit</button>
 *     </div>
 *     <div className="lc-card-footer">Updated 2h ago</div>
 *   </LcCard>
 *
 * For static (non-clickable) cards, omit `clickable` — you get the base
 * card styling without the hover lift or focus ring.
 */
export function LcCard({
  clickable = false,
  onClick,
  className,
  id,
  ariaLabel,
  children,
}: LcCardProps) {
  const baseClass = clickable ? "lc-card lc-card--clickable" : "lc-card";
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  if (!clickable) {
    return (
      <article id={id} className={finalClass}>
        {children}
      </article>
    );
  }

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      className={finalClass}
      onClick={onClick}
      onKeyDown={handleKey}
    >
      {children}
    </div>
  );
}

export interface LcCardGridProps {
  children: ReactNode;
  /** Optional className to append. */
  className?: string;
}

/**
 * Auto-fill grid that places `LcCard`s into 300px+ columns with consistent
 * gaps. Use as the direct parent of multiple cards.
 *
 *   <LcCardGrid>
 *     {pipelines.map(p => <LcCard key={p.id} clickable>...</LcCard>)}
 *   </LcCardGrid>
 */
export function LcCardGrid({ children, className }: LcCardGridProps) {
  return (
    <ul className={className ? `lc-card-grid ${className}` : "lc-card-grid"}>
      {children}
    </ul>
  );
}
