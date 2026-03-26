"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/settings";

/* ── Footer data ── */
const productLinks = [
  { label: { en: "Genesis Universa", bg: "Genesis Universa" }, href: "/machines/universa" },
  { label: { en: "Genesis Alpha", bg: "Genesis Alpha" }, href: "/machines/alpha" },
  { label: { en: "Genesis Prime", bg: "Genesis Prime" }, href: "/machines/prime" },
  { label: { en: "Genesis Eclipse", bg: "Genesis Eclipse" }, href: "/machines/eclipse" },
  { label: { en: "Genesis Solaris", bg: "Genesis Solaris" }, href: "/machines/solaris" },
  { label: { en: "Genesis Solaris 2", bg: "Genesis Solaris 2" }, href: "/machines/solaris-2" },
];

const companyLinks = [
  { label: { en: "About", bg: "За нас" }, href: "/about" },
  { label: { en: "Careers", bg: "Кариери" }, href: "/careers" },
  { label: { en: "News", bg: "Новини" }, href: "/news" },
  { label: { en: "Contact", bg: "Контакт" }, href: "/contact" },
];

const manufacturingLinks = [
  { label: { en: "CNC Machining", bg: "CNC обработка" }, href: "/manufacturing/cnc" },
  { label: { en: "Laser Cutting", bg: "Лазерно рязане" }, href: "/manufacturing/laser" },
  { label: { en: "Metal Bending", bg: "Огъване на метал" }, href: "/manufacturing/bending" },
  { label: { en: "Welding", bg: "Заваряване" }, href: "/manufacturing/welding" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/genesistechnology/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/genesis-technology-bg/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/gentechtechnology",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

/* ── Logo SVG paths ── */
const logoPaths = [
  "m534.92 65.57c5.56-0.69 10.8-1.48 16.05-1.51 25.66-0.13 51.33-0.06 76.99-0.06 1.8 0 3.6 0 5.72 0 0 31.66 0 62.92 0 95-1.81 0-3.72 0-5.63 0-30.83 0-61.67 0.44-92.49-0.27-9.11-0.21-18.26-3.27-27.19-5.76-10.9-3.04-20.19-9.33-28.64-16.69-14.74-12.85-24.06-28.47-24.8-48.63-0.54-14.68 1.62-28.44 10.09-40.9 7.53-11.09 16.81-20.09 28.55-26.67 16.9-9.48 35.04-13.32 54.28-13.12 19.66 0.19 39.32 0.04 58.99 0.04 1.81 0 3.63 0 5.8 0 0 12.36 0 24.41 0 37-1.92 0-3.7 0-5.48 0-19.84 0-39.67-0.28-59.5 0.11-11.21 0.22-22.34 2.25-31.7 8.98-16.2 11.64-22.39 29.58-12.16 47.19 6.84 11.79 18.02 19.11 30.93 20.28 18.08 1.64 36.42 0.41 54.96 0.41 0-5.66 0-11.92 0-18.97q-2.56 0-5.2 0c-13 0-26 0.13-38.99-0.09-3.7-0.06-7.59-0.6-11.02-1.9-7.25-2.73-12.02-8.07-12.39-16.06-0.42-8.98 4.81-14.52 12.83-18.38z",
  "m800 159c-48.45 0-96.4 0-144.68 0 0-50.65 0-100.89 0-151.57 52.57 0 105.26 0 158.32 0 0 11.27 0 22.64 0 34.45-37.05 0-73.97 0-111.26 0 0 7.45 0 14.49 0 22.11 3.03 0 5.98 0 8.93 0 17.66 0 35.32-0.16 52.98 0.08 7.48 0.1 14.28 2.2 19.64 8.22 8.78 9.87 3.3 24.9-9.25 28.59-2.79 0.82-5.83 1.06-8.75 1.07-19.33 0.09-38.65 0.05-57.98 0.05-1.8 0-3.59 0-5.66 0 0 6.72 0 12.98 0 19.84 39.7 0 79.4 0 119.4 0 0 12.52 0 24.45 0 37.16-7.02 0-14.1 0-21.69 0z",
  "m1077 7c44.12 0 87.74 0 131.68 0 0 11.66 0 22.92 0 34.79-36.95 0-73.99 0-111.35 0 0 7.52 0 14.44 0 22.2 1.62 0 3.37 0 5.11 0 19 0 37.99-0.09 56.99 0.05 7.47 0.06 14.02 2.45 19.4 8.15 4.69 4.97 5.39 10.86 3.59 16.56-1.94 6.14-6.62 10.91-13.28 12.1-5.64 1-11.5 1.06-17.26 1.1-16.33 0.14-32.66 0.05-48.99 0.05-1.79 0-3.59 0-5.62 0 0 6.77 0 13.03 0 19.89 39.77 0 79.47 0 119.45 0 0 12.53 0 24.45 0 36.74-55.41 0-110.77 0-166.43 0 0-50.35 0-100.59 0-151.63 8.7 0 17.46 0 26.71 0z",
  "m979.35 147.71c-8.59-7.02-16.87-13.84-25.17-20.65q-12.56-10.31-25.17-20.57c-9.17-7.46-18.38-14.89-27.57-22.34-6.52-5.28-13.03-10.56-20.35-16.5 0 31.32 0 61.4 0 91.61-14.46 0-28.56 0-43.09 0 0-2.55 0-4.35 0-6.16q0-63.71 0-127.43c0-9.19 7.88-16.72 17.06-17.81 11.38-1.36 19.36 4.01 27.38 10.9 11.07 9.51 22.79 18.26 34.13 27.46 11.75 9.55 23.34 19.29 35.06 28.89 9.72 7.96 19.52 15.84 30.1 24.42 0-30.8 0-60.89 0-91.25 14.68 0 28.59 0 43.27 0q0 2.89 0 5.77c0 41.98-0.36 83.96 0.22 125.93 0.17 12.69-9.66 19.12-19.56 20.06-9.48 0.89-16.24-4.2-22.89-9.76-1-0.84-2.08-1.58-3.42-2.57z",
  "m1507.98 10.94c7.12-1.35 13.83-3.66 20.57-3.76 27.65-0.43 55.32-0.21 82.98-0.16 11.58 0.02 20.74 8.82 20.47 19.49-0.19 7.46-6.85 14.84-15.2 16.37-3.87 0.71-7.85 1.06-11.78 1.07-25 0.1-49.99 0.03-74.99 0.06-7.37 0.01-12.54 4.66-12.02 10.66 0.38 4.33 3.09 7.03 6.93 8.11 3.27 0.92 6.83 1.15 10.26 1.17 20 0.1 40.02-0.56 59.98 0.23 18.21 0.72 34.07 7.83 44.65 23.31 15.22 22.28 6.64 50.52-16.72 63.31-11.11 6.09-23.13 8.46-35.94 8.32-32.49-0.36-64.98-0.12-97.48-0.12-1.97 0-3.95 0-6.31 0 0-12.07 0-23.77 0-36 2.1 0 4.05 0 6 0 31.99 0 63.99 0.04 95.98-0.06 3.42-0.01 6.94-0.4 10.23-1.29 5.93-1.6 9.1-6.37 8.4-11.75-0.61-4.7-5.88-8.87-11.55-8.88-20.66-0.05-41.33 0.3-61.98-0.11-16.96-0.33-32.2-5.58-44.27-18.23-14.06-14.74-15.21-38.44-3-54.31 6.33-8.23 14.41-14.18 24.79-17.43z",
  "m1250.73 11.68c7.17-1.71 13.99-4.36 20.85-4.48 28.16-0.48 56.32-0.21 84.48-0.19 10.03 0 17.76 6.06 20.3 15.83 1.57 6.05-3.17 14.52-8.71 17.42-6.13 3.21-12.47 3.78-19.12 3.77-24.49-0.07-48.98-0.03-73.48-0.03-6.22 0-11.71 3.94-12.05 8.61-0.43 5.95 2.43 9.06 9.84 10.42 2.73 0.49 5.51 0.92 8.28 0.93 18.99 0.08 37.99-0.13 56.99 0.09 16.1 0.2 30.23 6.02 41.63 17.32 18.6 18.44 16.12 48.41-4.44 64.1-12.05 9.2-25.34 13.49-40.22 13.51-33.49 0.06-66.98 0.02-100.48 0.02-1.97 0-3.95 0-6.26 0 0-11.95 0-23.54 0-36 1.75 0 3.65 0 5.56 0 31.49 0 62.99 0.04 94.48-0.05 3.76-0.01 7.56-0.42 11.28-1.05 4.83-0.82 9.82-7.07 9.32-11.24-0.63-5.28-5.62-9.62-11.44-9.64-18.83-0.05-37.66-0.21-56.49 0.05-15.69 0.22-30.57-2.68-43.18-12.24-10.2-7.74-17.8-17.67-17.85-31.48-0.02-3.99-0.4-8.09 0.38-11.94 3.46-16.91 14.43-27.32 30.33-33.73z",
  "m1456 145.99c0 4.79 0 9.09 0 14.01-7.7 0-14.96 0-22.23 0-7.31 0-14.63 0-22.77 0 0-1.97 0-3.71 0-5.45 0-42.12 0.16-84.24-0.12-126.36-0.07-9.72 7.77-17.92 16.74-18.9 5.5-0.61 11.54 0.4 16.86 2.13 8.39 2.72 11.46 9.87 11.48 18.21 0.09 38.62 0.04 77.24 0.04 116.36z",
];

const linkStyle: React.CSSProperties = {
  fontSize: "var(--text-s)",
  color: "var(--neutral-400)",
  textDecoration: "none",
  transition: "color 0.25s",
};

const colHeadingStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--neutral-400)",
  marginBottom: "1.25rem",
};

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--brand-midnight)" }}>
      <div className="gc" style={{ paddingTop: "var(--sp-4xl)", paddingBottom: "var(--sp-xl)" }}>

        {/* ── Desktop: 6-column grid ── */}
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1.2fr",
          gap: "var(--sp-xl)",
        }}>
          {/* Col 1: Logo + tagline + social */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-l)" }}>
            <Link href={`/${locale}`} aria-label="Genesis Technology">
              <svg viewBox="454.85 6.91 1192.6 153.22" style={{ height: "1.125rem", width: "auto", color: "var(--neutral-white)" }}>
                {logoPaths.map((d, i) => <path key={i} fill="currentColor" d={d} />)}
              </svg>
            </Link>
            <p style={{ fontSize: "var(--text-s)", color: "var(--neutral-400)", lineHeight: 1.6, maxWidth: "16rem" }}>
              {locale === "bg"
                ? "Проектирано, инженерно и произведено в България."
                : "Designed, engineered, and manufactured in Bulgaria."}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--neutral-400)",
                    transition: "color 0.25s, border-color 0.25s",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Systems */}
          <div>
            <h3 style={colHeadingStyle}>{locale === "bg" ? "Системи" : "Systems"}</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`} className="underline-link" style={linkStyle}>
                    {link.label[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/services/cloud-system`} style={{ ...linkStyle, color: "var(--brand-blue-75)" }}>
                  {locale === "bg" ? "Облачна платформа" : "Cloud Platform"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h3 style={colHeadingStyle}>{locale === "bg" ? "Компания" : "Company"}</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`} className="underline-link" style={linkStyle}>
                    {link.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Manufacturing */}
          <div>
            <h3 style={colHeadingStyle}>{locale === "bg" ? "Производство" : "Manufacturing"}</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {manufacturingLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`} className="underline-link" style={linkStyle}>
                    {link.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contacts */}
          <div>
            <h3 style={colHeadingStyle}>{locale === "bg" ? "Контакти" : "Contacts"}</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>
                <a href="https://maps.app.goo.gl/gentech-plovdiv" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{locale === "bg" ? "Пловдив, България" : "Plovdiv, Bulgaria"}</span>
                </a>
              </li>
              <li>
                <a href="tel:+359895657706" style={{ ...linkStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +359 89 565 7706
                </a>
              </li>
              <li>
                <a href="mailto:info@gentech.bg" style={{ ...linkStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  info@gentech.bg
                </a>
              </li>
            </ul>
          </div>

          {/* Col 6: Newsletter */}
          <div>
            <h3 style={colHeadingStyle}>{locale === "bg" ? "Бюлетин" : "Newsletter"}</h3>
            <p style={{ fontSize: "var(--text-s)", color: "var(--neutral-400)", lineHeight: 1.6, marginBottom: "var(--sp-m)" }}>
              {locale === "bg"
                ? "Получавайте продуктови новини и индустриални прозрения."
                : "Get product updates and industry insights."}
            </p>
            <form style={{ display: "flex", gap: "0.5rem" }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={locale === "bg" ? "Имейл адрес" : "Email address"}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-s)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--neutral-white)",
                  fontSize: "var(--text-s)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-s)",
                  backgroundColor: "var(--brand-blue)",
                  color: "var(--neutral-white)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "var(--text-s)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            marginTop: "var(--sp-3xl)",
            paddingTop: "var(--sp-l)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--sp-m)",
          }}
        >
          <p style={{ fontSize: "var(--text-xs)", color: "var(--neutral-400)" }}>
            &copy; {year} Genesis Technology Ltd. {locale === "bg" ? "Всички права запазени." : "All rights reserved."}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-m)", fontSize: "var(--text-xs)", color: "var(--neutral-400)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue-75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              TÜV Nord Certified
            </span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-blue-75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
              </svg>
              Official ILLY Partner
            </span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
            <span>{locale === "bg" ? "Патент Рег. 3653 U1" : "Patent Reg. 3653 U1"}</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .footer-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </footer>
  );
}
