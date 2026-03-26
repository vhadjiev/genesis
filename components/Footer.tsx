"use client";

import { Icon, Link, Logo, Button } from "@/components/primitives";
import type { Locale } from "@/i18n/settings";
import type { FooterGlobal } from "@/lib/types";

const linkStyle: React.CSSProperties = {
  fontSize: "var(--text-s)",
  color: "var(--neutral-400)",
};

const colHeadingStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--neutral-400)",
  marginBottom: "1.25rem",
};

export function Footer({ data, locale }: { data: FooterGlobal; locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--brand-midnight)" }}>
      <div className="gc" style={{ paddingTop: "var(--sp-4xl)", paddingBottom: "var(--sp-xl)" }}>

        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: `1.5fr ${data.columns.map(() => "1fr").join(" ")} 1fr 1.2fr`,
          gap: "var(--sp-xl)",
        }}>
          {/* Col 1: Logo + tagline + social */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-l)" }}>
            <Link href={`/${locale}`} style={{ display: "inline-flex" }}>
              <Logo src={data.logo} alt="Genesis Technology" theme="dark" height="1.125rem" />
            </Link>
            <p style={{ fontSize: "var(--text-s)", color: "var(--neutral-400)", lineHeight: 1.6, maxWidth: "16rem" }}>
              {data.tagline}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {data.socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  external
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
                  }}
                >
                  <Icon name={s.icon} size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Dynamic link columns */}
          {data.columns.map((col) => (
            <div key={col.title}>
              <h3 style={colHeadingStyle}>{col.title}</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.external ? link.href : `/${locale}${link.href}`}
                      external={link.external}
                      style={{
                        ...linkStyle,
                        ...(link.highlight ? { color: "var(--brand-blue-75)" } : {}),
                      }}
                    >
                      {link.icon && <Icon name={link.icon} size={14} style={{ marginRight: "0.375rem" }} />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts column */}
          <div>
            <h3 style={colHeadingStyle}>Contacts</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>
                <Link
                  href={data.contact.addressUrl || "#"}
                  external
                  style={{ ...linkStyle, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}
                >
                  <Icon name="lucide:map-pin" size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{data.contact.address}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
                  style={{ ...linkStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Icon name="lucide:phone" size={16} style={{ flexShrink: 0 }} />
                  {data.contact.phone}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${data.contact.email}`}
                  style={{ ...linkStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Icon name="lucide:mail" size={16} style={{ flexShrink: 0 }} />
                  {data.contact.email}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <h3 style={colHeadingStyle}>{data.newsletter.title}</h3>
            <p style={{ fontSize: "var(--text-s)", color: "var(--neutral-400)", lineHeight: 1.6, marginBottom: "var(--sp-m)" }}>
              {data.newsletter.description}
            </p>
            <form style={{ display: "flex", gap: "0.5rem" }} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={data.newsletter.placeholder}
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
              <Button isIconOnly variant="primary" size="sm" onPress={() => {}}>
                <Icon name="lucide:arrow-right" size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
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
            &copy; {year} {data.copyright}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-m)", fontSize: "var(--text-xs)", color: "var(--neutral-400)" }}>
            {data.badges.map((badge, i) => (
              <span key={badge.label}>
                {i > 0 && <span style={{ color: "rgba(255,255,255,0.12)", marginRight: "var(--sp-m)" }}>|</span>}
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  {badge.icon && <Icon name={badge.icon} size={14} style={{ color: "var(--brand-blue-75)" }} />}
                  {badge.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
