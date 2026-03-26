import type { CSSProperties } from "react";

/** Standard frosted glass — dark surface, 24px blur */
export const frost: CSSProperties = {
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  background: "rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "1.5rem",
};

/** Heavier frosted glass — darker, 30px blur, tighter radius */
export const frostHeavy: CSSProperties = {
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  background: "rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "1rem",
};

/** Light frosted glass — for light backgrounds */
export const frostLight: CSSProperties = {
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  background: "rgba(255, 255, 255, 0.5)",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  borderRadius: "1.5rem",
};
