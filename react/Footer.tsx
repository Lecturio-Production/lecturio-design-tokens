import type { ReactNode } from "react";

export interface LecShellFooterProps {
  /**
   * Left slot — typically copyright + brand name.
   * E.g. `<>© 2026 Lecturio</>`.
   */
  leftSlot?: ReactNode;
  /**
   * Center slot — typically a row of footer links wrapped in
   * `<nav className="lec-shell-footer-links">`. Empty by default.
   */
  centerSlot?: ReactNode;
  /**
   * Right slot — typically build/version info wrapped in
   * `<span className="lec-shell-footer-meta">`. Empty by default.
   */
  rightSlot?: ReactNode;
}

/**
 * Standard Lecturio app-shell footer. Three-zone layout matching the header:
 *
 *   [Left] [Center — flex:1] [Right]
 *
 * Optional. If your tool doesn't need a footer, leave it out — the shell
 * still works without one.
 *
 *   <LecShellFooter
 *     leftSlot={<>© 2026 Lecturio</>}
 *     centerSlot={
 *       <nav className="lec-shell-footer-links">
 *         <a href="/imprint">Imprint</a>
 *         <a href="/privacy">Privacy</a>
 *       </nav>
 *     }
 *     rightSlot={<span className="lec-shell-footer-meta">v1.4.2</span>}
 *   />
 */
export function LecShellFooter({
  leftSlot,
  centerSlot,
  rightSlot,
}: LecShellFooterProps) {
  return (
    <footer className="lec-shell-footer">
      <div>{leftSlot}</div>
      <div>{centerSlot}</div>
      {rightSlot && <div>{rightSlot}</div>}
    </footer>
  );
}
