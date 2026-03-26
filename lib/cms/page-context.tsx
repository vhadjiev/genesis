"use client";

import { createContext, use, useRef, useCallback } from "react";

interface PageContextValue {
  /** Ref to the first section element on the page */
  firstSectionRef: React.RefObject<HTMLElement | null>;
  /** Called by PageRenderer to register the first section element */
  registerFirstSection: (el: HTMLElement | null) => void;
}

const PageContext = createContext<PageContextValue | null>(null);

export function PageContextProvider({ children }: { children: React.ReactNode }) {
  const firstSectionRef = useRef<HTMLElement | null>(null);

  const registerFirstSection = useCallback((el: HTMLElement | null) => {
    if (el && !firstSectionRef.current) {
      firstSectionRef.current = el;
    }
  }, []);

  return (
    <PageContext value={{ firstSectionRef, registerFirstSection }}>
      {children}
    </PageContext>
  );
}

export function usePageContext(): PageContextValue | null {
  return use(PageContext);
}
