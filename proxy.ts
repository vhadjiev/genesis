import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/settings";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")[0]
      .split("-")[0]
      .toLowerCase();
    if ((locales as readonly string[]).includes(preferred)) return preferred;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // If URL has the default locale prefix (/en, /en/...), redirect to clean URL
  if (
    pathname === `/${defaultLocale}` ||
    pathname.startsWith(`/${defaultLocale}/`)
  ) {
    const cleanPath = pathname.slice(`/${defaultLocale}`.length) || "/";
    request.nextUrl.pathname = cleanPath;
    return NextResponse.redirect(request.nextUrl);
  }

  // If URL has a non-default locale prefix (/bg, /bg/...), let it through
  const hasNonDefaultLocale = locales.some(
    (locale) =>
      locale !== defaultLocale &&
      (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  );
  if (hasNonDefaultLocale) return;

  // No locale prefix — rewrite internally to default locale (no redirect)
  const locale = getLocale(request);
  if (locale !== defaultLocale) {
    // User prefers a non-default locale → redirect to prefixed URL
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Default locale: rewrite internally to /en/... (URL stays clean)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
