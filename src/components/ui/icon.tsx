import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";

export type { IconSvgElement } from "@hugeicons/react";

/** Props that give an icon an accessible name; without one it is decorative. */
const LABEL_PROPS = ["aria-label", "aria-labelledby", "role"] as const;

/**
 * One icon from the free Hugeicons set (`@hugeicons/core-free-icons`), drawn in
 * the current text colour. Size it with a class (`size-4`) or `size`. It is
 * hidden from screen readers unless it is given a label, since most icons sit
 * beside text that already says what they mean.
 */
export function Icon(props: HugeiconsIconProps) {
  const labelled = LABEL_PROPS.some((prop) => props[prop] !== undefined);
  return <HugeiconsIcon aria-hidden={labelled ? undefined : true} {...props} />;
}
