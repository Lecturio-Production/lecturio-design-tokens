import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  DefaultImage,
  DefaultLink,
  type ImageLike,
  type LinkLike,
} from "./types";

export interface LcShellHeaderBrand {
  /** Display label, shown next to the logo. */
  label: string;
  /** Where clicking the brand takes you. Defaults to "/". */
  href?: string;
  /** Optional logo source. If omitted, only the label is rendered. */
  logoSrc?: string;
  /** Alt text for the logo. Defaults to "" (decorative — label conveys meaning). */
  logoAlt?: string;
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
 * Standard Lecturio app-shell header. Three-zone layout:
 *
 *   [Brand] [Nav] [Center slot — flex:1] [Right slot]
 *
 *   <LcShellHeader
 *     brand={{ label: "Orchestrator", logoSrc: "/logo.svg" }}
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
      <Link href={brand.href ?? "/"} className="lc-shell-brand">
        {brand.logoSrc && (
          <Image src={brand.logoSrc} alt={brand.logoAlt ?? ""} width={24} height={24} />
        )}
        <span>{brand.label}</span>
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
