/**
 * Returns consistent color tokens based on theme.
 * Eliminates the isDark ternary pattern scattered across components.
 */
export interface ThemeColors {
  text: string;
  muted: string;
  label: string;
  accent: string;
  bg: string;
}

export function themeColors(theme?: string): ThemeColors {
  const isDark = theme === "dark" || theme === "gradient";

  if (isDark) {
    return {
      text: "var(--neutral-white)",
      muted: "rgba(255,255,255,0.7)",
      label: "rgba(255,255,255,0.5)",
      accent: "var(--brand-blue-85)",
      bg: "var(--brand-midnight)",
    };
  }

  return {
    text: "var(--brand-midnight)",
    muted: "var(--neutral-400)",
    label: "var(--neutral-400)",
    accent: "var(--brand-blue)",
    bg: "var(--neutral-white)",
  };
}
