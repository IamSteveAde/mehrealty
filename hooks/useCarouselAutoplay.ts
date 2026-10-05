"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type RefObject } from "react";

type Options = {
  ref: RefObject<HTMLElement | null>;
  enabled: boolean;
  slide: number;
  advance: () => void;
};

export function useCarouselAutoplay({ ref, enabled, slide, advance }: Options) {
  const advanceRef = useRef(advance);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => { advanceRef.current = advance; }, [advance]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [ref]);

  useEffect(() => {
    if (!enabled || !visible || !pageVisible || reduceMotion || hovered || focused || paused) return;
    const timer = window.setTimeout(() => advanceRef.current(), 5000);
    return () => window.clearTimeout(timer);
  }, [enabled, visible, pageVisible, reduceMotion, hovered, focused, paused, slide]);

  return {
    paused,
    togglePaused: () => setPaused(current => !current),
    interaction: {
      onPointerEnter: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === "mouse") setHovered(true); },
      onPointerLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<HTMLElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); },
    },
  };
}
