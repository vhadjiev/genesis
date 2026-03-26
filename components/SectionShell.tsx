"use client";

import type { SectionCapabilities, CmsImage } from "@/lib/types";
import { frost } from "@/lib/frost";
import { ScrollOverlayBackground } from "./capabilities/ScrollOverlayBackground";
import { FadeUpStagger } from "./capabilities/EntranceAnimation";
import { GridPattern, AmbientGlow } from "./capabilities/Decorators";

interface SectionShellProps {
  capabilities: SectionCapabilities;
  bgImage?: CmsImage;
  isDark: boolean;
  children: React.ReactNode;
}

/**
 * Client-side shell that wraps section content with interactive capabilities.
 * Handles: scroll-overlay background, entrance animation, decorators,
 * bottom gradient, bottom spacer, fullHeight, contentAlign, contentWrapper.
 */
export function SectionShell({
  capabilities,
  bgImage,
  isDark,
  children,
}: SectionShellProps) {
  const {
    backgroundMode,
    entranceAnimation,
    decorators,
    bottomGradient,
    bottomSpacer,
    fullHeight,
    contentAlign,
    contentWrapper,
  } = capabilities;

  // Determine if content needs entrance animation wrapping
  // animatedCount=1 means only the first child (main content) gets animated,
  // merged blocks (logos etc.) render instantly
  let content =
    entranceAnimation === "fade-up-stagger" ? (
      <FadeUpStagger animatedCount={1}>{children}</FadeUpStagger>
    ) : (
      children
    );

  // Wrap content in frosted card if requested
  if (contentWrapper === "frosted-card") {
    content = (
      <div style={{ ...frost, padding: "var(--sp-3xl)", maxWidth: "52rem" }}>
        {content}
      </div>
    );
  }

  // Content alignment + optional full-height
  const contentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
  };

  if (fullHeight) {
    contentStyle.height = "100vh";
    contentStyle.padding = "var(--sp-xl)";
  }

  if (contentAlign) {
    contentStyle.display = "flex";
    contentStyle.flexDirection = "column";

    switch (contentAlign) {
      case "center":
        contentStyle.alignItems = "center";
        contentStyle.justifyContent = "center";
        break;
      case "end":
        contentStyle.justifyContent = "flex-end";
        break;
      case "start":
      default:
        contentStyle.justifyContent = "flex-start";
        break;
    }
  }

  return (
    <>
      {/* Decorators */}
      {decorators?.includes("grid-pattern") && <GridPattern />}
      {decorators?.includes("ambient-glow") && <AmbientGlow />}

      {/* Background */}
      {backgroundMode === "scroll-overlay" && bgImage && (
        <ScrollOverlayBackground image={bgImage} />
      )}

      {/* Bottom gradient inside section */}
      {bottomGradient && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "300px",
            background: `linear-gradient(180deg, transparent, ${isDark ? "var(--brand-midnight)" : "var(--neutral-white)"} 68%)`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Content */}
      <div style={contentStyle}>{content}</div>

      {/* Bottom spacer */}
      {bottomSpacer && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "var(--sp-4xl)",
            paddingBottom: "var(--sp-4xl)",
          }}
        />
      )}
    </>
  );
}
