import type { SectionConfig } from "@/lib/cms/types";

interface SectionHeaderProps {
  config: SectionConfig;
  isHero?: boolean;
  id?: string;
}

/**
 * Renders the section eyebrow label + headline.
 * Enforces heading hierarchy: h1 for hero only, h2 for all other sections.
 * Supports gradient text via headlineGradient substring.
 */
export function SectionHeader({ config, isHero, id }: SectionHeaderProps) {
  if (!config.headline && !config.label) return null;

  const Tag = isHero ? "h1" : "h2";
  const headingClass = isHero ? "jumbo-h" : "jumbo-h";
  const isDark = config.theme === "dark" || config.theme === "gradient";

  function renderHeadline(text: string) {
    // Support line breaks
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // If headlineGradient is set, wrap matching substring
      if (config.headlineGradient && line.includes(config.headlineGradient)) {
        const parts = line.split(config.headlineGradient);
        return (
          <span key={lineIdx}>
            {parts[0]}
            <span className="text-gradient">{config.headlineGradient}</span>
            {parts[1]}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      }
      return (
        <span key={lineIdx}>
          {line}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <header>
      {config.label && (
        <p
          className="label-s"
          style={{
            color: isDark ? "rgba(255,255,255,0.5)" : "var(--brand-blue)",
            marginBottom: "var(--sp-m)",
          }}
        >
          {config.label}
        </p>
      )}
      {config.headline && (
        <Tag
          id={id}
          className={headingClass}
          style={{
            color: isDark ? "var(--neutral-white)" : undefined,
            maxWidth: "48rem",
          }}
        >
          {renderHeadline(config.headline)}
        </Tag>
      )}
    </header>
  );
}
