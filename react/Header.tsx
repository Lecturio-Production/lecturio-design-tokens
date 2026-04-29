import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  DefaultImage,
  DefaultLink,
  type ImageLike,
  type LinkLike,
} from "./types";
/**
 * The Lecturio logo is bundled with the design-tokens repo so every tool
 * uses the same canonical asset without copying it around. We resolve the
 * URL via `import.meta.url` — works identically in Next.js (webpack asset
 * modules) and Vite, returns a plain string, and needs no `.d.ts` plumbing
 * for `*.png` imports on the consumer side.
 */
const DEFAULT_LECTURIO_LOGO_SRC: string = new URL(
  "../assets/logo.png",
  import.meta.url
).href;

/**
 * Public re-export of the bundled Lecturio logo URL — useful when a tool
 * needs to render the logo somewhere outside the standard header (login
 * splash, footer, error page, etc.).
 */
export const lecturioLogoSrc: string = DEFAULT_LECTURIO_LOGO_SRC;

export interface LecShellHeaderBrand {
  /**
   * Override the Lecturio logo if you really need to. By default the
   * canonical logo bundled with this design-tokens repo is used.
   */
  logoSrc?: string;
  /** Alt text for the logo. Defaults to "Lecturio". */
  logoAlt?: string;
  /**
   * Tool / product name shown after the logo, separated by a thin divider.
   * E.g. "Orchestrator", "Scene Editor", "Slide Generator".
   */
  productName: string;
  /** Where clicking the brand takes you. Defaults to "/". */
  href?: string;
}

export interface LecShellHeaderNavItem {
  href: string;
  label: string;
  /** Lucide icon component, e.g. `LayoutGrid`. Pass as a reference, not JSX. */
  icon: LucideIcon;
  /**
   * Whether this item represents the current route. The host app computes
   * this — the design system stays routing-agnostic.
   */
  isActive?: boolean;
}

export interface LecShellHeaderProps {
  brand: LecShellHeaderBrand;
  /** Top-level navigation items, rendered with icon + label pills. */
  navItems?: LecShellHeaderNavItem[];
  /**
   * Slot in the horizontal center. Use for tool-specific UI like a
   * step-nav, search input, or breadcrumbs. Empty by default.
   */
  centerSlot?: ReactNode;
  /**
   * Slot on the right edge. Typically the user-menu (avatar + dropdown),
   * which is app-specific because it depends on auth state. Empty by default.
   */
  rightSlot?: ReactNode;
  /** Pluggable Link component. Defaults to a native <a>. */
  LinkComponent?: LinkLike;
  /** Pluggable Image component for the brand logo. Defaults to a native <img>. */
  ImageComponent?: ImageLike;
}

/**
 * Standard Lecturio app-shell header. Brand pattern is:
 *
 *   [Logo] | [Product name]   [Nav]   [Center slot]   [Right slot]
 *
 *   <LecShellHeader
 *     brand={{ logoSrc: "/logo.svg", productName: "Orchestrator" }}
 *     navItems={[
 *       { href: "/", label: "Dashboard", icon: LayoutGrid, isActive: pathname === "/" },
 *       { href: "/projects", label: "Projects", icon: FolderKanban, isActive: pathname.startsWith("/projects") },
 *     ]}
 *     rightSlot={<MyUserMenu user={user} />}
 *     LinkComponent={NextLink}
 *     ImageComponent={NextImage}
 *   />
 */
export function LecShellHeader({
  brand,
  navItems = [],
  centerSlot,
  rightSlot,
  LinkComponent = DefaultLink,
  ImageComponent = DefaultImage,
}: LecShellHeaderProps) {
  const Link = LinkComponent;
  const Image = ImageComponent;

  return (
    <header className="lec-shell-header">
      <Link
        href={brand.href ?? "/"}
        className="lec-shell-brand"
      >
        <Image
          src={brand.logoSrc ?? DEFAULT_LECTURIO_LOGO_SRC}
          alt={brand.logoAlt ?? "Lecturio"}
          width={120}
          height={28}
          className="lec-shell-brand-logo"
        />
        <span className="lec-shell-brand-divider" />
        <span className="lec-shell-brand-product">{brand.productName}</span>
      </Link>

      {navItems.length > 0 && (
        <nav className="lec-shell-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const cls = item.isActive
              ? "lec-shell-nav-link is-active"
              : "lec-shell-nav-link";
            return (
              <Link key={item.href} href={item.href} className={cls}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      <div
        className="lec-shell-spacer"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {centerSlot}
      </div>

      {rightSlot && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {rightSlot}
        </div>
      )}
    </header>
  );
}
