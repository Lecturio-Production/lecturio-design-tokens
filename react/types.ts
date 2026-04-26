import type { ComponentType, ReactNode } from "react";

/**
 * Shape of a Link component (Next.js `<Link>`, React-Router `<Link>`,
 * or a plain `<a>`). Every React primitive in this package accepts a
 * `LinkComponent` prop so you can plug in whichever your tool uses.
 *
 * Default: native `<a>`.
 */
export interface LinkLikeProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export type LinkLike = ComponentType<LinkLikeProps>;

/**
 * Shape of an Image component (Next.js `<Image>` or a plain `<img>`).
 * Header brand uses this for the logo slot.
 *
 * Default: native `<img>`.
 */
export interface ImageLikeProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export type ImageLike = ComponentType<ImageLikeProps>;

export const DefaultLink: LinkLike = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

export const DefaultImage: ImageLike = ({ src, alt, width, height, className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} width={width} height={height} className={className} />
);
