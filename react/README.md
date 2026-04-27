# Lecturio React Components

Source-only React components for the Lecturio shell. Imported directly from the submodule — no build step, no published package.

## Peer dependencies

The consuming tool must already have these installed:

| Package | Version |
|---|---|
| `react` | `>=19` |
| `lucide-react` | `>=0.460` (any reasonably recent version is fine) |

The components are framework-agnostic regarding the router/image library: pass `LinkComponent` and `ImageComponent` props with whatever your stack uses (`next/link`, `react-router-dom`, plain `<a>`).

## Components

| Component | Purpose |
|---|---|
| `LcShell` | Top-level wrapper with the Lecturio body background. |
| `LcShellMain` | Centered, padded main content area. |
| `LcShellHeader` | The standard sticky top header: brand + nav + center slot + right slot. The Lecturio logo is bundled — tools only need to pass `productName`. |
| `LcShellFooter` | Optional bottom strip with three slots. Most tools won't need it. |
| `LcPageHeader` | The eyebrow + title + sub + action pattern at the top of any list/detail page. |

## The bundled logo

`assets/logo.png` is the canonical Lecturio logo. `LcShellHeader` uses it by default — pass `brand={{ productName: "MyTool" }}` and you're done. Override via `brand.logoSrc` only if you really need a different image.

The same URL is also exported as `lecturioLogoSrc` for use elsewhere in your tool (login splash, error pages, etc.):

```tsx
import { lecturioLogoSrc } from "../../design-tokens/react";
<img src={lecturioLogoSrc} alt="Lecturio" />
```

## Importing

```ts
import {
  LcShell,
  LcShellMain,
  LcShellHeader,
  LcShellFooter,
  LcPageHeader,
} from "../../design-tokens/react";
```

(Adjust the relative path based on where the importing file lives.)

## Example — Next.js dashboard layout

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderKanban, Boxes, Wrench } from "lucide-react";
import { LcShell, LcShellMain, LcShellHeader } from "../../design-tokens/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <LcShell>
      <LcShellHeader
        brand={{ productName: "Orchestrator" }}
        navItems={[
          { href: "/", label: "Dashboard", icon: LayoutGrid, isActive: isActive("/") },
          { href: "/projects", label: "Projects", icon: FolderKanban, isActive: isActive("/projects") },
          { href: "/services", label: "Services", icon: Boxes, isActive: isActive("/services") },
          { href: "/tools", label: "Tools", icon: Wrench, isActive: isActive("/tools") },
        ]}
        rightSlot={<UserMenu />}
        LinkComponent={Link}
        ImageComponent={Image}
      />
      <LcShellMain>{children}</LcShellMain>
    </LcShell>
  );
}
```

## Why source-only

This package is consumed via git submodule, not npm. Bumping the submodule pin in a tool gives the new components without a publish/install dance. The consuming tool's TypeScript build compiles them just like any in-repo source.

If the components ever leak peer-deps that conflict with consumer apps, that's the moment to consider extracting to a real npm package. Until then, source sharing is simpler.
