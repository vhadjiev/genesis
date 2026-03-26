"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
  style,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
