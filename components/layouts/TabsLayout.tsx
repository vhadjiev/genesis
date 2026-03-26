"use client";

import { useState } from "react";
import { Tabs } from "@heroui/react";
import { useInView } from "@/hooks/useInView";
import { Text } from "../primitives";
import type { LayoutProps } from "./LayoutProps";

interface TabsLayoutProps extends LayoutProps {
  orientation?: "horizontal" | "vertical";
}

export default function TabsLayout({ items, orientation = "horizontal" }: TabsLayoutProps) {
  const [activeKey, setActiveKey] = useState(items[0]?.id || "0");
  const { ref, isVisible } = useInView(0.1);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`reveal${isVisible ? " visible" : ""}`}>
      <Tabs
        selectedKey={activeKey}
        onSelectionChange={(key) => setActiveKey(key as string)}
        aria-label="Content tabs"
      >
        <Tabs.ListContainer
          style={{
            backgroundColor: "#eae2d7",
            borderRadius: "100vw",
            padding: "0.25rem",
            marginBottom: "var(--sp-2xl)",
          }}
        >
          <Tabs.List
            aria-label="Tab options"
            style={{
              display: "flex",
              width: "100%",
              gap: 0,
            }}
          >
            {items.map((item) => (
              <Tabs.Tab
                key={item.id || item.label}
                id={item.id || item.label || ""}
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "var(--sp-s) var(--sp-m)",
                  fontSize: "var(--text-m)",
                  fontWeight: 400,
                  cursor: "pointer",
                  borderRadius: "100vw",
                  position: "relative",
                  zIndex: 1,
                  color: activeKey === (item.id || item.label) ? "var(--neutral-white)" : "var(--brand-midnight)",
                  transition: "color 0.25s",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label || item.title}
                <Tabs.Indicator
                  style={{
                    backgroundColor: "var(--brand-midnight)",
                    borderRadius: "100vw",
                  }}
                />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>

        {/* Tab panels — render features as step cards */}
        {items.map((item) => (
          <Tabs.Panel key={item.id || item.label} id={item.id || item.label || ""}>
            <div
              style={{
                backgroundColor: "var(--neutral-white)",
                borderRadius: "var(--radius-l)",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(item.features?.length || 1, 3)}, 1fr)`,
                minHeight: "16rem",
              }}
              className="hiw-steps-grid"
            >
              {item.features?.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    padding: "var(--sp-xl) var(--sp-2xl)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRight: i < (item.features?.length || 0) - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    animation: `tabSlideIn 0.5s ease ${i * 0.08}s both`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--jumbo-2)",
                      fontWeight: 600,
                      letterSpacing: "var(--ls-l)",
                      lineHeight: "var(--lh)",
                      color: "var(--brand-blue)",
                      opacity: 0.15,
                      display: "block",
                      marginBottom: "var(--sp-m)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Text size="l" theme="light" style={{ lineHeight: "var(--lh-xl)" }}>
                    {feature}
                  </Text>
                </div>
              ))}
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>

    </div>
  );
}
