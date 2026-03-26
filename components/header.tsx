"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollCallback } from "@/hooks/useScroll";
import { usePageContext } from "@/lib/cms/page-context";
import type { Locale } from "@/i18n/settings";

const navItems = [
  { key: "machines", href: "#machines" },
  { key: "technology", href: "#technology" },
  { key: "story", href: "#story" },
  { key: "contact", href: "#contact" },
];

const navLabels: Record<string, Record<Locale, string>> = {
  machines: { en: "Machines", bg: "Машини" },
  technology: { en: "Technology", bg: "Технология" },
  story: { en: "Our Story", bg: "Нашата история" },
  contact: { en: "Contact", bg: "Контакт" },
  cta: { en: "Get a Quote", bg: "Запитване" },
};

const logoPaths = [
  "m534.92 65.57c5.56-0.69 10.8-1.48 16.05-1.51 25.66-0.13 51.33-0.06 76.99-0.06 1.8 0 3.6 0 5.72 0 0 31.66 0 62.92 0 95-1.81 0-3.72 0-5.63 0-30.83 0-61.67 0.44-92.49-0.27-9.11-0.21-18.26-3.27-27.19-5.76-10.9-3.04-20.19-9.33-28.64-16.69-14.74-12.85-24.06-28.47-24.8-48.63-0.54-14.68 1.62-28.44 10.09-40.9 7.53-11.09 16.81-20.09 28.55-26.67 16.9-9.48 35.04-13.32 54.28-13.12 19.66 0.19 39.32 0.04 58.99 0.04 1.81 0 3.63 0 5.8 0 0 12.36 0 24.41 0 37-1.92 0-3.7 0-5.48 0-19.84 0-39.67-0.28-59.5 0.11-11.21 0.22-22.34 2.25-31.7 8.98-16.2 11.64-22.39 29.58-12.16 47.19 6.84 11.79 18.02 19.11 30.93 20.28 18.08 1.64 36.42 0.41 54.96 0.41 0-5.66 0-11.92 0-18.97q-2.56 0-5.2 0c-13 0-26 0.13-38.99-0.09-3.7-0.06-7.59-0.6-11.02-1.9-7.25-2.73-12.02-8.07-12.39-16.06-0.42-8.98 4.81-14.52 12.83-18.38z",
  "m800 159c-48.45 0-96.4 0-144.68 0 0-50.65 0-100.89 0-151.57 52.57 0 105.26 0 158.32 0 0 11.27 0 22.64 0 34.45-37.05 0-73.97 0-111.26 0 0 7.45 0 14.49 0 22.11 3.03 0 5.98 0 8.93 0 17.66 0 35.32-0.16 52.98 0.08 7.48 0.1 14.28 2.2 19.64 8.22 8.78 9.87 3.3 24.9-9.25 28.59-2.79 0.82-5.83 1.06-8.75 1.07-19.33 0.09-38.65 0.05-57.98 0.05-1.8 0-3.59 0-5.66 0 0 6.72 0 12.98 0 19.84 39.7 0 79.4 0 119.4 0 0 12.52 0 24.45 0 37.16-7.02 0-14.1 0-21.69 0z",
  "m1077 7c44.12 0 87.74 0 131.68 0 0 11.66 0 22.92 0 34.79-36.95 0-73.99 0-111.35 0 0 7.52 0 14.44 0 22.2 1.62 0 3.37 0 5.11 0 19 0 37.99-0.09 56.99 0.05 7.47 0.06 14.02 2.45 19.4 8.15 4.69 4.97 5.39 10.86 3.59 16.56-1.94 6.14-6.62 10.91-13.28 12.1-5.64 1-11.5 1.06-17.26 1.1-16.33 0.14-32.66 0.05-48.99 0.05-1.79 0-3.59 0-5.62 0 0 6.77 0 13.03 0 19.89 39.77 0 79.47 0 119.45 0 0 12.53 0 24.45 0 36.74-55.41 0-110.77 0-166.43 0 0-50.35 0-100.59 0-151.63 8.7 0 17.46 0 26.71 0z",
  "m979.35 147.71c-8.59-7.02-16.87-13.84-25.17-20.65q-12.56-10.31-25.17-20.57c-9.17-7.46-18.38-14.89-27.57-22.34-6.52-5.28-13.03-10.56-20.35-16.5 0 31.32 0 61.4 0 91.61-14.46 0-28.56 0-43.09 0 0-2.55 0-4.35 0-6.16q0-63.71 0-127.43c0-9.19 7.88-16.72 17.06-17.81 11.38-1.36 19.36 4.01 27.38 10.9 11.07 9.51 22.79 18.26 34.13 27.46 11.75 9.55 23.34 19.29 35.06 28.89 9.72 7.96 19.52 15.84 30.1 24.42 0-30.8 0-60.89 0-91.25 14.68 0 28.59 0 43.27 0q0 2.89 0 5.77c0 41.98-0.36 83.96 0.22 125.93 0.17 12.69-9.66 19.12-19.56 20.06-9.48 0.89-16.24-4.2-22.89-9.76-1-0.84-2.08-1.58-3.42-2.57z",
  "m1507.98 10.94c7.12-1.35 13.83-3.66 20.57-3.76 27.65-0.43 55.32-0.21 82.98-0.16 11.58 0.02 20.74 8.82 20.47 19.49-0.19 7.46-6.85 14.84-15.2 16.37-3.87 0.71-7.85 1.06-11.78 1.07-25 0.1-49.99 0.03-74.99 0.06-7.37 0.01-12.54 4.66-12.02 10.66 0.38 4.33 3.09 7.03 6.93 8.11 3.27 0.92 6.83 1.15 10.26 1.17 20 0.1 40.02-0.56 59.98 0.23 18.21 0.72 34.07 7.83 44.65 23.31 15.22 22.28 6.64 50.52-16.72 63.31-11.11 6.09-23.13 8.46-35.94 8.32-32.49-0.36-64.98-0.12-97.48-0.12-1.97 0-3.95 0-6.31 0 0-12.07 0-23.77 0-36 2.1 0 4.05 0 6 0 31.99 0 63.99 0.04 95.98-0.06 3.42-0.01 6.94-0.4 10.23-1.29 5.93-1.6 9.1-6.37 8.4-11.75-0.61-4.7-5.88-8.87-11.55-8.88-20.66-0.05-41.33 0.3-61.98-0.11-16.96-0.33-32.2-5.58-44.27-18.23-14.06-14.74-15.21-38.44-3-54.31 6.33-8.23 14.41-14.18 24.79-17.43z",
  "m1250.73 11.68c7.17-1.71 13.99-4.36 20.85-4.48 28.16-0.48 56.32-0.21 84.48-0.19 10.03 0 17.76 6.06 20.3 15.83 1.57 6.05-3.17 14.52-8.71 17.42-6.13 3.21-12.47 3.78-19.12 3.77-24.49-0.07-48.98-0.03-73.48-0.03-6.22 0-11.71 3.94-12.05 8.61-0.43 5.95 2.43 9.06 9.84 10.42 2.73 0.49 5.51 0.92 8.28 0.93 18.99 0.08 37.99-0.13 56.99 0.09 16.1 0.2 30.23 6.02 41.63 17.32 18.6 18.44 16.12 48.41-4.44 64.1-12.05 9.2-25.34 13.49-40.22 13.51-33.49 0.06-66.98 0.02-100.48 0.02-1.97 0-3.95 0-6.26 0 0-11.95 0-23.54 0-36 1.75 0 3.65 0 5.56 0 31.49 0 62.99 0.04 94.48-0.05 3.76-0.01 7.56-0.42 11.28-1.05 4.83-0.82 9.82-7.07 9.32-11.24-0.63-5.28-5.62-9.62-11.44-9.64-18.83-0.05-37.66-0.21-56.49 0.05-15.69 0.22-30.57-2.68-43.18-12.24-10.2-7.74-17.8-17.67-17.85-31.48-0.02-3.99-0.4-8.09 0.38-11.94 3.46-16.91 14.43-27.32 30.33-33.73z",
  "m1456 145.99c0 4.79 0 9.09 0 14.01-7.7 0-14.96 0-22.23 0-7.31 0-14.63 0-22.77 0 0-1.97 0-3.71 0-5.45 0-42.12 0.16-84.24-0.12-126.36-0.07-9.72 7.77-17.92 16.74-18.9 5.5-0.61 11.54 0.4 16.86 2.13 8.39 2.72 11.46 9.87 11.48 18.21 0.09 38.62 0.04 77.24 0.04 116.36z",
];

function Logo({ color }: { color: string }) {
  return (
    <svg viewBox="454.85 6.91 1192.6 153.22" style={{ height: "1.375rem", width: "auto", color }}>
      {logoPaths.map((d, i) => <path key={i} fill="currentColor" d={d} />)}
    </svg>
  );
}

/*
 * Three states, one element:
 *
 * "static"  — absolute, white text, no glass, fully visible
 * "ready"   — fixed, dark text, glass prepped but hidden (opacity:0, scaled down)
 *             This state is set when hero bottom < 100px — user can't see the
 *             nav because it has scrolled off screen. We use this moment to
 *             swap colors and set initial animation pose WITHOUT any visible transition.
 * "fixed"   — fixed, dark text, glass visible, animated in (opacity:1, scale:1)
 *             Set when hero bottom <= 0.
 *
 * On scroll back up: "fixed" → "ready" (animate out) → "static" (swap back)
 */
type NavState = "static" | "ready" | "fixed";

export function Header({ locale }: { locale: Locale }) {
  const [state, setState] = useState<NavState>("static");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const prevState = useRef<NavState>("static");

  // Get first section ref from PageContext (data-driven, no DOM queries)
  const pageCtx = usePageContext();

  const handleScroll = useCallback(() => {
    const section = pageCtx?.firstSectionRef.current;
    if (!section) {
      setState(window.scrollY > 100 ? "fixed" : "static");
      return;
    }
    const bottom = section.getBoundingClientRect().bottom;
    if (bottom <= 0) {
      setState("fixed");
    } else if (bottom < 120) {
      setState("ready");
    } else {
      setState("static");
    }
  }, [pageCtx]);

  // Use shared scroll store — single rAF loop for the whole app
  useScrollCallback(handleScroll, [handleScroll]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Track previous state to know transition direction
  useEffect(() => { prevState.current = state; }, [state]);

  const altLocale = locale === "en" ? "bg" : "en";
  const altPath = pathname.replace(`/${locale}`, `/${altLocale}`);

  const isStatic = state === "static";
  const isFixed = state === "fixed";
  const isReady = state === "ready";

  // Colors: static = white, ready/fixed = dark (no transition needed — "ready"
  // happens while nav is off-screen so the color swap is invisible)
  const text = isStatic ? "var(--neutral-white)" : "var(--brand-midnight)";
  const muted = isStatic ? "rgba(255,255,255,0.6)" : "var(--neutral-400)";
  const ctaBg = isStatic ? "var(--neutral-white)" : "var(--brand-midnight)";
  const ctaFg = isStatic ? "var(--brand-midnight)" : "var(--neutral-white)";

  // Glass visual: only visible in "fixed" state
  const showGlass = isFixed;

  // Position: absolute when static, fixed when ready or fixed
  const position = isStatic ? "absolute" : "fixed";

  // Transform: static = just center, ready = center + pre-animation pose,
  // fixed = center + final pose
  const transform = isStatic
    ? "translateX(-50%)"
    : isReady
    ? "translateX(-50%) translateY(-10px) scale(0.97)"
    : "translateX(-50%) translateY(0) scale(1)";

  // Opacity: always 1 when static, 0 when ready (invisible), 1 when fixed
  const opacity = isReady ? 0 : 1;

  // Transitions: NONE when entering "ready" (instant invisible swap),
  // animate when entering "fixed" or reverting to "static"
  const shouldAnimate = state === "fixed" || (state === "static" && prevState.current !== "static");
  const transition = shouldAnimate
    ? "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, border-radius 0.3s, box-shadow 0.3s, backdrop-filter 0.3s"
    : "none";

  return (
    <>
      <nav
        style={{
          position,
          top: "1.25rem",
          left: "50%",
          transform,
          opacity,
          width: "calc(100% - 3rem)",
          maxWidth: "var(--container-max)",
          height: "3.75rem",
          padding: "0 0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 999,
          borderRadius: showGlass ? "100vw" : "100vw",
          backdropFilter: showGlass ? "blur(40px) saturate(180%)" : "none",
          WebkitBackdropFilter: showGlass ? "blur(40px) saturate(180%)" : "none",
          backgroundColor: showGlass ? "rgba(255, 255, 255, 0.72)" : "transparent",
          border: showGlass ? "1px solid rgba(255, 255, 255, 0.45)" : "1px solid transparent",
          boxShadow: showGlass ? "0 2px 20px rgba(0, 0, 0, 0.06), 0 0 0 0.5px rgba(0, 0, 0, 0.04)" : "none",
          transition,
          pointerEvents: isReady ? "none" : "auto",
        }}
      >
        <Link href={`/${locale}`} aria-label="Genesis Technology" className="shrink-0">
          <Logo color={text} />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              style={{
                color: muted,
                fontSize: "var(--text-l)",
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = text; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = muted; }}
            >
              {navLabels[item.key][locale]}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <Link
            href={altPath}
            style={{
              color: muted,
              fontSize: "var(--text-s)",
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = muted; }}
          >
            {altLocale.toUpperCase()}
          </Link>
          <a
            href="#contact"
            className="g-button"
            style={{ backgroundColor: ctaBg, color: ctaFg }}
          >
            {navLabels.cta[locale]}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={text} strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col items-center justify-center"
            style={{ background: "var(--brand-midnight)", top: "5.5rem" }}
          >
            <nav className="flex flex-col items-center gap-6">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="heading-h4"
                  style={{ color: "var(--neutral-white)", textDecoration: "none" }}
                >
                  {navLabels[item.key][locale]}
                </motion.a>
              ))}
              <Link
                href={altPath}
                onClick={() => setMobileOpen(false)}
                style={{ color: "var(--neutral-300)", fontSize: "var(--text-s)", fontWeight: 500, textDecoration: "none", marginTop: "var(--sp-l)" }}
              >
                {altLocale === "en" ? "English" : "Български"}
              </Link>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="g-button variant" style={{ marginTop: "var(--sp-m)" }}>
                {navLabels.cta[locale]}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
