"use client";

/**
 * Rows that loop sideways and speed up (and turn round) with the page's scroll.
 * Adapted from Magic UI's Scroll Based Velocity
 * (https://magicui.design/docs/components/scroll-based-velocity): `m.div` for
 * the app's strict LazyMotion, the velocity hook shared instead of repeated,
 * and a still row for reduced motion.
 */
import {
  type MotionValue,
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/** The fastest a row goes, as a multiple of its base speed added on top of it. */
const MAX_BOOST = 5;
/** Scroll speed (px/s) that gives the full boost. */
const FULL_BOOST_SCROLL = 1000;
const VELOCITY_SPRING = { damping: 50, stiffness: 400 } as const;

/** Wraps `v` into [min, max), for a position that loops. */
export const wrap = (min: number, max: number, v: number): number => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** The page's scroll speed as a signed boost from -MAX_BOOST to MAX_BOOST, smoothed by a spring. */
function useScrollVelocityFactor(): MotionValue<number> {
  const { scrollY } = useScroll();
  const smooth = useSpring(useVelocity(scrollY), VELOCITY_SPRING);
  return useTransform(smooth, (v) => {
    const magnitude = Math.min(MAX_BOOST, (Math.abs(v) / FULL_BOOST_SCROLL) * MAX_BOOST);
    return v < 0 ? -magnitude : magnitude;
  });
}

const ScrollVelocityContext = createContext<MotionValue<number> | null>(null);

/** Shares one scroll reading among the rows inside it. */
export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const velocityFactor = useScrollVelocityFactor();
  return (
    <ScrollVelocityContext.Provider value={velocityFactor}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </ScrollVelocityContext.Provider>
  );
}

interface ScrollVelocityRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Speed at rest, in percent of one copy's width per second. */
  baseVelocity?: number;
  /** 1 moves left, -1 moves right. */
  direction?: 1 | -1;
  /** Whether scrolling speeds the row up and turns it round. */
  scrollReactivity?: boolean;
}

/** One looping row; inside a ScrollVelocityContainer it shares the container's scroll reading. */
export function ScrollVelocityRow(props: ScrollVelocityRowProps) {
  const shared = useContext(ScrollVelocityContext);
  return shared ? (
    <ScrollVelocityRowImpl {...props} velocityFactor={shared} />
  ) : (
    <ScrollVelocityRowLocal {...props} />
  );
}

function ScrollVelocityRowLocal(props: ScrollVelocityRowProps) {
  return <ScrollVelocityRowImpl {...props} velocityFactor={useScrollVelocityFactor()} />;
}

function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  scrollReactivity = true,
  velocityFactor,
  className,
  ...props
}: ScrollVelocityRowProps & { velocityFactor: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(1);
  const reducedMotion = useReducedMotion();

  const baseX = useMotionValue(0);
  const unitWidth = useMotionValue(0);
  const directionRef = useRef<number>(direction);
  const inViewRef = useRef(true);
  const pageVisibleRef = useRef(true);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    if (!container || !block) return;

    // Enough copies to cover the row twice over, so the loop never shows a gap.
    const measure = () => {
      const width = block.scrollWidth;
      unitWidth.set(width);
      const next = width > 0 ? Math.max(3, Math.ceil(container.offsetWidth / width) + 2) : 1;
      setCopies((prev) => (prev === next ? prev : next));
    };
    const onVisibility = () => {
      pageVisibleRef.current = document.visibilityState === "visible";
    };

    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    resize.observe(block);
    const view = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    view.observe(container);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      resize.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [children, unitWidth]);

  const x = useTransform([baseX, unitWidth], ([offset, width]: number[]) => {
    return `${-wrap(0, width || 1, offset || 0)}px`;
  });

  useAnimationFrame((_, delta) => {
    if (reducedMotion || !inViewRef.current || !pageVisibleRef.current) {
      return;
    }
    const width = unitWidth.get();
    if (width <= 0) return;
    const factor = scrollReactivity ? velocityFactor.get() : 0;
    const boost = Math.min(MAX_BOOST, Math.abs(factor));
    // Scrolling up turns the row round; it keeps that way until the scroll turns again.
    if (boost > 0.1) directionRef.current = direction * (factor >= 0 ? 1 : -1);
    const pixelsPerSecond = (width * baseVelocity) / 100;
    baseX.set(baseX.get() + directionRef.current * pixelsPerSecond * (1 + boost) * (delta / 1000));
  });

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
    >
      <m.div
        className="inline-flex transform-gpu items-center will-change-transform select-none"
        style={{ x }}
      >
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            aria-hidden={i !== 0 || undefined}
            className="inline-flex shrink-0 items-center"
          >
            {children}
          </div>
        ))}
      </m.div>
    </div>
  );
}
