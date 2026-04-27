import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  DefaultImage,
  DefaultLink,
  type ImageLike,
  type LinkLike,
} from "./types";
import bundledLogo from "../assets/logo.png";

/**
 * The Lecturio logo is bundled with the design-tokens repo so every tool
 * uses the same canonical asset without copying it around. Bundlers (Vite,
 * Next.js, Webpack) hand back either a plain URL string or a static-image
 * object with `.src` — normalize to a string here.
 */
const DEFAULT_LECTURIO_LOGO_SRC: string =
  typeof bundledLogo === "string"
    ? bundledLogo
    : ((bundledLogo as unknown as { src: string }).src ?? "");

/**
 * Public re-export of the bundled Lecturio logo URL — useful when a tool
 * needs to render the logo somewhere outside the standard header (login
 * splash, footer, error page, etc.).
 */
export const lecturioLogoSrc: string = DEFAULT_LECTURIO_LOGO_SRC;

export interface LcShellHeaderBrand {
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

export interface LcShellHeaderNavItem {
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

export interface LcShellHeaderProps {
  brand: LcShellHeaderBrand;
  /** Top-level navigation items, rendered with icon + label pills. */
  navItems?: LcShellHeaderNavItem[];
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
 *   <LcShellHeader
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
export function LcShellHeader({
  brand,
  navItems = [],
  centerSlot,
  rightSlot,
  LinkComponent = DefaultLink,
  ImageComponent = DefaultImage,
}: LcShellHeaderProps) {
  const Link = LinkComponent;
  const Image = ImageComponent;

  return (
    <header className="lc-shell-header">
      <Link
        href={brand.href ?? "/"}
        className="lc-shell-brand"
      >
        <Image
          src={brand.logoSrc ?? DEFAULT_LECTURIO_LOGO_SRC}
          alt={brand.logoAlt ?? "Lecturio"}
          width={120}
          height={28}
          className="lc-shell-brand-logo"
        />
        <span className="lc-shell-brand-divider" />
        <span className="lc-shell-brand-product">{brand.productName}</span>
      </Link>

      {navItems.length > 0 && (
        <nav className="lc-shell-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const cls = item.isActive
              ? "lc-shell-nav-link is-active"
              : "lc-shell-nav-link";
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
        className="lc-shell-spacer"
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
