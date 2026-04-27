import type { ReactNode } from "react";

export interface LcCardProps {
  /**
   * Adds the `lc-card--clickable` modifier — visual hover lift + cursor.
   * The component itself attaches no handlers; wrap it in a `<Link>` (or
   * a `<button>`) to make it actually interactive.
   */
  clickable?: boolean;
  /** Additional class names to compose on top of the base `lc-card`. */
  className?: string;
  /** ID for accessibility / scroll-to. */
  id?: string;
  children: ReactNode;
}

/**
 * The Lecturio card primitive — drop shadow, no border, square corners.
 * Compose sub-elements via the matching CSS classes (`.lc-card-head`,
 * `.lc-card-title`, `.lc-card-sub`, `.lc-card-actions`, `.lc-card-footer`).
 *
 * Static card:
 *
 *   <LcCard>
 *     <h3 className="lc-card-title">…</h3>
 *     <p className="lc-card-sub">…</p>
 *   </LcCard>
 *
 * Clickable card — wrap in a Link so the host's router handles navigation
 * AND keyboard accessibility comes for free:
 *
 *   <Link href={`/pipeline/${p.id}`}>
 *     <LcCard clickable>
 *       <h3 className="lc-card-title">{p.name}</h3>
 *     </LcCard>
 *   </Link>
 *
 * For a card that triggers an in-page action (no navigation), wrap in a
 * `<button>` instead:
 *
 *   <button onClick={open}>
 *     <LcCard clickable>…</LcCard>
 *   </button>
 *
 * The component is server-component-safe — it attaches no event handlers
 * itself, so it composes cleanly with Server Components.
 */
export function LcCard({
  clickable = false,
  className,
  id,
  children,
}: LcCardProps) {
  const baseClass = clickable ? "lc-card lc-card--clickable" : "lc-card";
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <article id={id} className={finalClass}>
      {children}
    </article>
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
 *     {pipelines.map(p => <li key={p.id}><Link><LcCard clickable>…</LcCard></Link></li>)}
 *   </LcCardGrid>
 */
export function LcCardGrid({ children, className }: LcCardGridProps) {
  return (
    <ul className={className ? `lc-card-grid ${className}` : "lc-card-grid"}>
      {children}
    </ul>
  );
}
