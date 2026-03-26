"use client";

import { useRef, useEffect } from "react";
import { usePageContext } from "@/lib/page-context";

/**
 * Tiny client component that registers a section element with PageContext.
 * Rendered only for the first block in the page.
 */
export function SectionRefRegistrar({ sectionId }: { sectionId?: string }) {
  const ctx = usePageContext();
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current || !ctx) return;
    // Find our parent section element
    const el = sectionId
      ? document.getElementById(sectionId)
      : document.querySelector("section");
    if (el) {
      ctx.registerFirstSection(el as HTMLElement);
      registered.current = true;
    }
  }, [ctx, sectionId]);

  return null;
}
