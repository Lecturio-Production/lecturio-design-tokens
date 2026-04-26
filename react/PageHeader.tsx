import type { ReactNode } from "react";

export interface LcPageHeaderProps {
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
 *   <LcPageHeader
 *     eyebrow="Library"
 *     title="Narrated Scenes"
 *     sub="One sentence, plain language, what this page is for."
 *     rightSlot={<button className="lc-btn lc-btn--primary">Neue Scene</button>}
 *   />
 */
export function LcPageHeader({
  eyebrow,
  title,
  sub,
  rightSlot,
}: LcPageHeaderProps) {
  return (
    <header className="lc-page-header">
      <div>
        {eyebrow && <div className="lc-eyebrow">{eyebrow}</div>}
        <h1 className="lc-page-title">{title}</h1>
        {sub && <p className="lc-page-sub">{sub}</p>}
      </div>
      {rightSlot}
    </header>
  );
}
