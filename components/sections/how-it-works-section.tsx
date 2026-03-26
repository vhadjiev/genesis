"use client";

import { useState } from "react";
import { Tabs } from "@heroui/react";
import { useInView } from "@/hooks/useInView";

interface Step {
  number: string;
  text: string;
}

interface Tab {
  id: string;
  name: string;
  steps: Step[];
}

interface HowItWorksContent {
  label: string;
  headline: string;
  tabs: Tab[];
}

export function HowItWorksSection({ content }: { content: HowItWorksContent }) {
  const [activeKey, setActiveKey] = useState(content.tabs[0].id);
  const { ref, isVisible } = useInView(0.1);
  const activeTab = content.tabs.find((t) => t.id === activeKey) || content.tabs[0];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      data-header-theme="light"
      className="g-section"
      style={{
        background: "linear-gradient(var(--neutral-100), var(--neutral-200))",
      }}
    >
      <div className="gc">
        {/* Header */}
        <div
          className={`reveal${isVisible ? " visible" : ""}`}
          style={{ marginBottom: "var(--sp-2xl)" }}
        >
          <span
            className="label-s"
            style={{ color: "var(--brand-blue)", marginBottom: "var(--sp-m)", display: "block" }}
          >
            {content.label}
          </span>
          <h2 className="jumbo-h">
            {content.headline}
          </h2>
        </div>

        {/* HeroUI Tabs — pill-shaped switcher (v4 Ecosystem style) */}
        <div className={`reveal${isVisible ? " visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
          <Tabs
            selectedKey={activeKey}
            onSelectionChange={(key) => setActiveKey(key as string)}
            aria-label="How it works steps"
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
                aria-label="Process steps"
                style={{
                  display: "flex",
                  width: "100%",
                  gap: 0,
                }}
              >
                {content.tabs.map((tab) => (
                  <Tabs.Tab
                    key={tab.id}
                    id={tab.id}
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
                      color: activeKey === tab.id ? "var(--neutral-white)" : "var(--brand-midnight)",
                      transition: "color 0.25s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.name}
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

            {/* Tab panels — step cards */}
            {content.tabs.map((tab) => (
              <Tabs.Panel key={tab.id} id={tab.id}>
                <div
                  style={{
                    backgroundColor: "var(--neutral-white)",
                    borderRadius: "var(--radius-l)",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(tab.steps.length, 3)}, 1fr)`,
                    minHeight: "16rem",
                  }}
                  className="hiw-steps-grid"
                >
                  {tab.steps.map((step, i) => (
                    <div
                      key={step.number}
                      style={{
                        padding: "var(--sp-xl) var(--sp-2xl)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderRight: i < tab.steps.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
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
                        {step.number}
                      </span>
                      <p
                        className="text-l"
                        style={{ color: "var(--neutral-400)", lineHeight: "var(--lh-xl)" }}
                      >
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tabSlideIn {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 767px) {
          .hiw-steps-grid {
            grid-template-columns: 1fr !important;
          }
          .hiw-steps-grid > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(0,0,0,0.06);
          }
          .hiw-steps-grid > div:last-child {
            border-bottom: none;
          }
        }
      ` }} />
    </section>
  );
}
