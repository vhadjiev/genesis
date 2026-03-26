/**
 * Shared scroll store — single rAF loop, multiple subscribers.
 *
 * Two subscription modes:
 * 1. `subscribe(callback)` — raw callback, called every rAF frame with scrollY.
 *    Use for DOM mutations (setting style.opacity, style.transform) that should
 *    NOT trigger React re-renders.
 *
 * 2. React hook `useScrollY()` — returns scrollY via useSyncExternalStore.
 *    Triggers re-renders. Use sparingly — only when you need scrollY in JSX.
 *
 * The rAF loop auto-starts when the first subscriber joins and auto-stops
 * when the last subscriber leaves.
 */

type ScrollCallback = (scrollY: number) => void;

let subscribers = new Set<ScrollCallback>();
let rafId: number | null = null;
let currentScrollY = 0;

// For useSyncExternalStore
let storeListeners = new Set<() => void>();
let snapshotScrollY = 0;

function tick() {
  currentScrollY = window.scrollY;

  // Notify raw callbacks (DOM mutations, no re-renders)
  subscribers.forEach((cb) => cb(currentScrollY));

  // Notify React store listeners (batched re-renders) — only if value changed
  if (snapshotScrollY !== currentScrollY) {
    snapshotScrollY = currentScrollY;
    storeListeners.forEach((listener) => listener());
  }

  rafId = requestAnimationFrame(tick);
}

function startLoop() {
  if (rafId !== null) return;
  if (typeof window === "undefined") return;
  currentScrollY = window.scrollY;
  snapshotScrollY = currentScrollY;
  rafId = requestAnimationFrame(tick);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function maybeStart() {
  if (subscribers.size > 0 || storeListeners.size > 0) {
    startLoop();
  }
}

function maybeStop() {
  if (subscribers.size === 0 && storeListeners.size === 0) {
    stopLoop();
  }
}

/**
 * Subscribe a raw callback — called every rAF frame with current scrollY.
 * Returns an unsubscribe function.
 *
 * Use this for direct DOM manipulation (style.opacity, style.transform)
 * to avoid React re-renders.
 */
export function subscribeScroll(callback: ScrollCallback): () => void {
  subscribers.add(callback);
  maybeStart();

  // Immediately call with current value so subscriber initializes
  if (typeof window !== "undefined") {
    callback(window.scrollY);
  }

  return () => {
    subscribers.delete(callback);
    maybeStop();
  };
}

/**
 * For useSyncExternalStore — React store interface.
 */
export function subscribeStore(listener: () => void): () => void {
  storeListeners.add(listener);
  maybeStart();
  return () => {
    storeListeners.delete(listener);
    maybeStop();
  };
}

export function getScrollSnapshot(): number {
  return snapshotScrollY;
}

export function getServerSnapshot(): number {
  return 0;
}
