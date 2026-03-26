"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeScroll } from "@/lib/scroll-store";
import { usePageContext } from "@/lib/page-context";
import { Button, Icon, Link, Logo } from "@/components/primitives";
import { locales, localePath, parseLocalePath, type Locale } from "@/i18n/settings";
import type { HeaderGlobal } from "@/lib/types";

type NavState = "static" | "ready" | "fixed";

// ─── Hoisted style constants per nav state ──────────────────────────────────

const NAV_BASE: React.CSSProperties = {
  top: "1.25rem",
  left: "50%",
  width: "calc(100% - 3rem)",
  maxWidth: "var(--container-max)",
  height: "3.75rem",
  padding: "0 0.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 999,
  borderRadius: "100vw",
};

const TRANSITION_SMOOTH =
  "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, border-radius 0.3s, box-shadow 0.3s, backdrop-filter 0.3s";

const GLASS_ON: React.CSSProperties = {
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  backgroundColor: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(255, 255, 255, 0.45)",
  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06), 0 0 0 0.5px rgba(0, 0, 0, 0.04)",
};

const GLASS_OFF: React.CSSProperties = {
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
  backgroundColor: "transparent",
  border: "1px solid transparent",
  boxShadow: "none",
};

const STATE_STYLES: Record<NavState, {
  position: "absolute" | "fixed";
  transform: string;
  opacity: number;
  pointerEvents: "auto" | "none";
  muted: string;
  logoTheme: "dark" | "light";
  glass: React.CSSProperties;
  ctaVariant: "secondary" | "primary";
}> = {
  static: {
    position: "absolute",
    transform: "translateX(-50%)",
    opacity: 1,
    pointerEvents: "auto",
    muted: "rgba(255,255,255,0.6)",
    logoTheme: "dark",
    glass: GLASS_OFF,
    ctaVariant: "secondary",
  },
  ready: {
    position: "fixed",
    transform: "translateX(-50%) translateY(-10px) scale(0.97)",
    opacity: 0,
    pointerEvents: "none",
    muted: "var(--neutral-400)",
    logoTheme: "light",
    glass: GLASS_OFF,
    ctaVariant: "primary",
  },
  fixed: {
    position: "fixed",
    transform: "translateX(-50%) translateY(0) scale(1)",
    opacity: 1,
    pointerEvents: "auto",
    muted: "var(--neutral-400)",
    logoTheme: "light",
    glass: GLASS_ON,
    ctaVariant: "primary",
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

export function Header({ data, locale }: { data: HeaderGlobal; locale: Locale }) {
  const [state, setState] = useState<NavState>("static");
  const [prevState, setPrevState] = useState<NavState>("static");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const pageCtx = usePageContext();

  // Scroll-driven nav state — uses shared scroll store directly
  useEffect(() => {
    return subscribeScroll(() => {
      const section = pageCtx?.firstSectionRef.current;
      if (!section) {
        setState((prev) => {
          const next: NavState = window.scrollY > 100 ? "fixed" : "static";
          return next === prev ? prev : next;
        });
        return;
      }
      const bottom = section.getBoundingClientRect().bottom;
      let next: NavState;
      if (bottom <= 0) next = "fixed";
      else if (bottom < 120) next = "ready";
      else next = "static";
      setState((prev) => {
        if (prev !== next) setPrevState(prev);
        return next;
      });
    });
  }, [pageCtx]);

  // Close mobile menu on navigation — derived state, not an effect
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const otherLocales = locales.filter((l) => l !== locale);
  const s = STATE_STYLES[state];

  const shouldAnimate = state === "fixed" || (state === "static" && prevState !== "static");
  const transition = shouldAnimate ? TRANSITION_SMOOTH : "none";

  return (
    <>
      <nav
        style={{
          ...NAV_BASE,
          ...s.glass,
          position: s.position,
          transform: s.transform,
          opacity: s.opacity,
          pointerEvents: s.pointerEvents,
          transition,
        }}
      >
        {/* Logo */}
        <Link href={localePath(locale)} className="shrink-0" style={{ display: "inline-flex" }}>
          <Logo logo={data.resolvedLogo || { type: "image", src: data.logo }} alt="Genesis Technology" theme={s.logoTheme} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {data.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{ color: s.muted, fontSize: "var(--text-l)", fontWeight: 600 }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-5">
          {otherLocales.map((alt) => (
            <Link
              key={alt}
              href={localePath(alt, parseLocalePath(pathname).pathWithoutLocale)}
              className="nav-link"
              style={{ color: s.muted, fontSize: "var(--text-s)", fontWeight: 500 }}
            >
              {alt.toUpperCase()}
            </Link>
          ))}
          <Button href={data.cta.href} variant={s.ctaVariant} size={data.cta.size}>
            {data.cta.label}
            {data.cta.icon && <Icon name={data.cta.icon} size={14} />}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Button
          isIconOnly
          variant="ghost"
          className="lg:hidden"
          onPress={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </Button>
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
              {data.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="heading-md"
                  style={{ color: "var(--neutral-white)" }}
                >
                  {item.label}
                </Link>
              ))}
              {otherLocales.map((alt) => (
                <Link
                  key={alt}
                  href={localePath(alt, parseLocalePath(pathname).pathWithoutLocale)}
                  style={{ color: "var(--neutral-300)", fontSize: "var(--text-s)", fontWeight: 500, marginTop: "var(--sp-l)" }}
                >
                  {data.localeNames?.[alt] || alt.toUpperCase()}
                </Link>
              ))}
              <Button href={data.cta.href} variant="secondary" style={{ marginTop: "var(--sp-m)" }}>
                {data.cta.label}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
