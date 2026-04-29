import type { ReactNode } from "react";

export interface LecPageHeaderProps {
  /**
   * Small uppercase label above the title (e.g. "Library", "Settings").
   * 12px, primary color, letter-spaced.
   */
  eyebrow?: string;
  /** The page title. Single line preferred. */
  title: string;
  /** One-sentence subtitle, plain language, max ~620px. */
  sub?: string;
  /**
   * Slot on the right of the header — typically a primary action button
   * (e.g. "Neue Scene"). Empty by default.
   */
  rightSlot?: ReactNode;
}

/**
 * Standard top-of-page header. Use at the top of every list/index/detail
 * page. Eyebrow + title + sub on the left, action button on the right.
 *
 *   <LecPageHeader
 *     eyebrow="Library"
 *     title="Narrated Scenes"
 *     sub="One sentence, plain language, what this page is for."
 *     rightSlot={<button className="lec-btn lec-btn--primary">Neue Scene</button>}
 *   />
 */
export function LecPageHeader({
  eyebrow,
  title,
  sub,
  rightSlot,
}: LecPageHeaderProps) {
  return (
    <header className="lec-page-header">
      <div>
        {eyebrow && <div className="lec-eyebrow">{eyebrow}</div>}
        <h1 className="lec-page-title">{title}</h1>
        {sub && <p className="lec-page-sub">{sub}</p>}
      </div>
      {rightSlot}
    </header>
  );
}
