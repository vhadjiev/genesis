"use client";

import { useState } from "react";
import { Card, Button, Icon, DotIndicator } from "../primitives";
import { Content } from "../Content";
import type { LayoutProps } from "./LayoutProps";

/**
 * Carousel layout — shows one item at a time with prev/next navigation.
 * Uses Content primitive for item rendering (works with any itemLayout).
 * Optional image column when items have images.
 */
export default function CarouselLayout({ items, itemLayout, theme, sectionConfig }: LayoutProps) {
  const [active, setActive] = useState(0);
  const t = items[active];
  const hasImage = !!t.image?.src;

  const goTo = (i: number) => {
    setActive(((i % items.length) + items.length) % items.length);
  };

  return (
    <div>
      <div
        className="testimonial-grid"
        style={{
          display: "grid",
          gridTemplateColumns: hasImage ? "1fr 1fr" : "1fr",
          gap: "var(--sp-3xl)",
          alignItems: "stretch",
        }}
      >
        {/* Left: image */}
        {hasImage && (
          <Card
            image={t.image}
            imagePosition="top"
            imageAspectRatio="1"
            variant="flat"
            style={{ borderRadius: "1.25rem", overflow: "hidden" }}
          >
            {/* Card with image-only, no body content */}
            <span />
          </Card>
        )}

        {/* Right: content + navigation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Content
            item={t}
            layout={itemLayout}
            theme={theme}
            headingLevel={sectionConfig.headingLevel}
          />

          {/* Navigation — prev, dots, next */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "var(--sp-2xl)",
            }}
          >
            <Button
              isIconOnly
              variant="secondary"
              size="sm"
              onPress={() => goTo(active - 1)}
              aria-label="Previous"
            >
              <Icon name="lucide:chevron-left" size={16} />
            </Button>

            <DotIndicator count={items.length} active={active} theme="dark" onSelect={setActive} />

            <Button
              isIconOnly
              variant="secondary"
              size="sm"
              onPress={() => goTo(active + 1)}
              aria-label="Next"
            >
              <Icon name="lucide:chevron-right" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
