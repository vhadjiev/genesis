/**
 * An 80vh gradient strip that fades from a solid color to transparent.
 * Rendered AFTER a section to create a smooth visual transition into the next section.
 * Used by Hero → Story transition.
 */
export function FadeStrip({
  color = "var(--brand-midnight)",
  height = "80vh",
}: {
  color?: string;
  height?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        height,
        background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
        pointerEvents: "none",
      }}
    />
  );
}
