import type { SectionConfig } from "@/lib/cms/types";
import { themeColors } from "@/lib/cms/theme-colors";
import { Heading } from "./primitives";

interface SectionHeaderProps {
  config: SectionConfig;
  isHero?: boolean;
  id?: string;
}

/**
 * Renders the section eyebrow label + headline.
 * Enforces heading hierarchy: h1 for hero only, h2 for all other sections.
 * Uses Heading atom for gradient text and line break support.
 */
export function SectionHeader({ config, isHero, id }: SectionHeaderProps) {
  if (!config.headline && !config.label) return null;

  const colors = themeColors(config.theme);

  return (
    <header>
      {config.label && (
        <p
          className="label-s"
          style={{ color: colors.label, marginBottom: "var(--sp-m)" }}
        >
          {config.label}
        </p>
      )}
      {config.headline && (
        <Heading
          level={isHero ? 1 : 2}
          size="jumbo"
          gradient={config.headlineGradient}
          theme={config.theme}
          id={id}
          maxWidth="48rem"
        >
          {config.headline}
        </Heading>
      )}
    </header>
  );
}
