import type { SectionConfig } from "@/lib/types";
import { themeColors } from "@/lib/theme-colors";
import { Heading } from "./primitives";

interface SectionHeaderProps {
  config: SectionConfig;
  /** Heading level — driven by sectionConfig.headingLevel from JSON */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
}

/**
 * Renders the section eyebrow label + headline.
 * Heading level is data-driven via sectionConfig.headingLevel (default: 2).
 */
export function SectionHeader({ config, headingLevel = 2, id }: SectionHeaderProps) {
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
          level={headingLevel}
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
