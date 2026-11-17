import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export type TileTone =
  "surface" | "raised" | "inverse" | "mint" | "sky" | "peach" | "butter" | "rose" | "picture";

type TileProps<T extends ElementType> = {
  as?: T;
  tone?: TileTone;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** One filled tile of the landing board (see landing.css). */
export function Tile<T extends ElementType = "div">({
  as,
  tone = "surface",
  className,
  children,
  ...rest
}: TileProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag className={cn("ln-tile", className)} data-tone={tone} {...rest}>
      {children}
    </Tag>
  );
}

/** A filled tile that is one link, its label beside an arrow that nudges on hover. */
export function LinkTile({
  href,
  tone,
  className,
  children,
}: {
  href: string;
  tone?: TileTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tile
      as={Link}
      href={href}
      tone={tone}
      className={cn(
        "ln-press group flex h-full min-h-16 items-center justify-between gap-3 py-3 font-semibold",
        className,
      )}
    >
      {children}
      <Icon
        icon={ArrowRight02Icon}
        aria-hidden
        className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      />
    </Tile>
  );
}

interface ShotProps {
  /** File in public/landing, captured from the real app by scripts/capture-landing.ts. */
  src: string;
  alt: string;
  /** CSS object-position, to choose the crop. */
  position?: string;
  /** A picture for screens under the desktop board (1024px), e.g. the phone layout. */
  phoneSrc?: string;
  /** Enlarges the picture around `position`, for a closer crop in a small tile. */
  zoom?: number;
  /** Above the fold: load eagerly, at high priority (not preloaded: phone and desktop differ). */
  eager?: boolean;
  className?: string;
}

const EAGER = { loading: "eager", fetchPriority: "high" } as const;

/** A screenshot of the app that covers its tile. */
export function Shot({
  src,
  phoneSrc,
  alt,
  position = "left top",
  zoom,
  eager,
  className,
}: ShotProps) {
  const style = {
    objectPosition: position,
    ...(zoom && { transform: `scale(${zoom})`, transformOrigin: position }),
  };
  if (phoneSrc) {
    // Art direction: one <picture>, so each screen downloads only its own file.
    const common = { alt, fill: true, unoptimized: true, ...(eager && EAGER) } as const;
    const phone = getImageProps({ ...common, src: `/landing/${phoneSrc}` }).props;
    const { props } = getImageProps({ ...common, src: `/landing/${src}` });
    return (
      <picture>
        <source media="(max-width: 1023px)" srcSet={phone.srcSet ?? phone.src} />
        <img
          {...props}
          alt={alt}
          className={cn("object-cover", className)}
          style={{ ...props.style, ...style }}
        />
      </picture>
    );
  }
  return (
    <Image
      src={`/landing/${src}`}
      alt={alt}
      fill
      unoptimized
      {...(eager && EAGER)}
      className={cn("object-cover", className)}
      style={style}
    />
  );
}
