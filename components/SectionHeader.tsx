import type { SectionConfig } from "@/lib/types";
import { Heading, Text } from "./primitives";

interface SectionHeaderProps {
  config: SectionConfig;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
}

/**
 * Renders the section eyebrow label + headline.
 * Heading level is data-driven via sectionConfig.headingLevel (default: 2).
 */
export function SectionHeader({ config, headingLevel = 2, id }: SectionHeaderProps) {
  if (!config.headline && !config.label) return null;

  return (
    <header>
      {config.label && (
        <Text variant="label" theme={config.theme} style={{ marginBottom: "var(--sp-m)" }}>
          {config.label}
        </Text>
      )}
      {config.headline && (
        <Heading
          level={headingLevel}
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
