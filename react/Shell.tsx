import type { ReactNode } from "react";

/**
 * Top-level shell wrapper. Use as the outermost element of every page
 * group (layout in Next.js App Router, root component in Vite tools).
 *
 *   <LecShell>
 *     <LecShellHeader ... />
 *     <LecShellMain>{children}</LecShellMain>
 *     <LecShellFooter ... />
 *   </LecShell>
 */
export function LecShell({ children }: { children: ReactNode }) {
  return <div className="lec-shell">{children}</div>;
}

/**
 * Main content area of the shell. Centered, padded, capped at 1600px.
 * Place between LecShellHeader and (optionally) LecShellFooter.
 */
export function LecShellMain({ children }: { children: ReactNode }) {
  return <main className="lec-shell-main">{children}</main>;
}
