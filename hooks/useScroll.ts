"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  subscribeScroll,
  subscribeStore,
  getScrollSnapshot,
  getServerSnapshot,
} from "@/lib/scroll-store";

/**
 * Returns current scrollY — triggers re-render when value changes.
 * Use sparingly. Prefer useScrollCallback for DOM mutations.
 */
export function useScrollY(): number {
  return useSyncExternalStore(subscribeStore, getScrollSnapshot, getServerSnapshot);
}

/**
 * Subscribes a callback to the shared rAF scroll loop.
 * The callback receives scrollY every frame — use it for direct DOM
 * mutations (setting style.opacity, style.transform) without re-renders.
 *
 * The callback is stable across renders via the deps array (like useEffect).
 */
export function useScrollCallback(
  callback: (scrollY: number) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    return subscribeScroll(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
