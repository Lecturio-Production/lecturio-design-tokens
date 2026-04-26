import type { ReactNode } from "react";

/**
 * Top-level shell wrapper. Use as the outermost element of every page
 * group (layout in Next.js App Router, root component in Vite tools).
 *
 *   <LcShell>
 *     <LcShellHeader ... />
 *     <LcShellMain>{children}</LcShellMain>
 *     <LcShellFooter ... />
 *   </LcShell>
 */
export function LcShell({ children }: { children: ReactNode }) {
  return <div className="lc-shell">{children}</div>;
}

/**
 * Main content area of the shell. Centered, padded, capped at 1600px.
 * Place between LcShellHeader and (optionally) LcShellFooter.
 */
export function LcShellMain({ children }: { children: ReactNode }) {
  return <main className="lc-shell-main">{children}</main>;
}
