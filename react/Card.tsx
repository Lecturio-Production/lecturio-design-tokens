import type { ReactNode } from "react";

export interface LecCardProps {
  /**
   * Adds the `lec-card--clickable` modifier — visual hover lift + cursor.
   * The component itself attaches no handlers; wrap it in a `<Link>` (or
   * a `<button>`) to make it actually interactive.
   */
  clickable?: boolean;
  /** Additional class names to compose on top of the base `lec-card`. */
  className?: string;
  /** ID for accessibility / scroll-to. */
  id?: string;
  children: ReactNode;
}

/**
 * The Lecturio card primitive — drop shadow, no border, square corners.
 * Compose sub-elements via the matching CSS classes (`.lec-card-head`,
 * `.lec-card-title`, `.lec-card-sub`, `.lec-card-actions`, `.lec-card-footer`).
 *
 * Static card:
 *
 *   <LecCard>
 *     <h3 className="lec-card-title">…</h3>
 *     <p className="lec-card-sub">…</p>
 *   </LecCard>
 *
 * Clickable card — wrap in a Link so the host's router handles navigation
 * AND keyboard accessibility comes for free:
 *
 *   <Link href={`/pipeline/${p.id}`}>
 *     <LecCard clickable>
 *       <h3 className="lec-card-title">{p.name}</h3>
 *     </LecCard>
 *   </Link>
 *
 * For a card that triggers an in-page action (no navigation), wrap in a
 * `<button>` instead:
 *
 *   <button onClick={open}>
 *     <LecCard clickable>…</LecCard>
 *   </button>
 *
 * The component is server-component-safe — it attaches no event handlers
 * itself, so it composes cleanly with Server Components.
 */
export function LecCard({
  clickable = false,
  className,
  id,
  children,
}: LecCardProps) {
  const baseClass = clickable ? "lec-card lec-card--clickable" : "lec-card";
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <article id={id} className={finalClass}>
      {children}
    </article>
  );
}

export interface LecCardGridProps {
  children: ReactNode;
  /** Optional className to append. */
  className?: string;
}

/**
 * Auto-fill grid that places `LecCard`s into 300px+ columns with consistent
 * gaps. Use as the direct parent of multiple cards.
 *
 *   <LecCardGrid>
 *     {pipelines.map(p => <li key={p.id}><Link><LecCard clickable>…</LecCard></Link></li>)}
 *   </LecCardGrid>
 */
export function LecCardGrid({ children, className }: LecCardGridProps) {
  return (
    <ul className={className ? `lec-card-grid ${className}` : "lec-card-grid"}>
      {children}
    </ul>
  );
}
