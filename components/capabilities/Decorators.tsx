/**
 * Decorative overlays that can be added to any section.
 * Each is a purely visual layer — no interactivity, no layout impact.
 */

/** Subtle grid pattern overlay (used on Intelligence section) */
export function GridPattern() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.04,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/** Ambient blue glow at bottom center (used on CTA section) */
export function AmbientGlow() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "50vw",
          height: "30vw",
          maxWidth: "700px",
          maxHeight: "400px",
          borderRadius: "50%",
          filter: "blur(120px)",
          background:
            "radial-gradient(circle, rgba(29,78,216,0.1) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
