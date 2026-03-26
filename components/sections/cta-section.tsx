"use client";

import { useInView } from "@/hooks/useInView";

interface CTAContent {
  headline: string;
  subheading: string;
  cta_primary: string;
  cta_secondary: string;
  trust_line: string;
}

export function CTASection({ content }: { content: CTAContent }) {
  const { ref, isVisible } = useInView(0.1);

  /**
   * Parse headline — words wrapped in *asterisks* get the gradient treatment.
   * E.g. "Transform your *vending* operations" => "Transform your " + <span class="text-gradient">vending</span> + " operations"
   */
  function renderHeadline(text: string) {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <span key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <span key={partIdx} className="text-gradient">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      data-header-theme="dark"
      className="g-section"
      style={{
        backgroundColor: "var(--brand-midnight)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blue glow at bottom */}
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
            background: "radial-gradient(circle, rgba(29,78,216,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        className="gc"
        style={{
          position: "relative",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Jumbo headline */}
        <h2
          style={{
            fontSize: "var(--jumbo-1)",
            lineHeight: "var(--lh)",
            fontWeight: 600,
            letterSpacing: "var(--ls-l)",
            color: "var(--neutral-white)",
            maxWidth: "56rem",
            marginBottom: "var(--sp-l)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {renderHeadline(content.headline)}
        </h2>

        {/* Subtitle */}
        <p
          className="text-l"
          style={{
            color: "var(--neutral-300)",
            maxWidth: "38rem",
            marginBottom: "var(--sp-2xl)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          {content.subheading}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "var(--sp-m)",
            marginBottom: "var(--sp-2xl)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        >
          <a href="#contact" className="g-button primary">
            <span>{content.cta_primary}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#" className="g-button ghost">
            <span>{content.cta_secondary}</span>
          </a>
        </div>

        {/* Trust line */}
        <p
          className="text-s"
          style={{
            color: "var(--neutral-400)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          {content.trust_line}
        </p>
      </div>
    </section>
  );
}
