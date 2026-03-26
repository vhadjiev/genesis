"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  },
});

/**
 * Wraps children with a Framer Motion fade-up stagger animation.
 * Each direct child animates in sequence with increasing delay.
 * Triggers on mount (not on scroll — for above-the-fold content like hero).
 */
export function FadeUpStagger({
  children,
  baseDelay = 0,
  staggerDelay = 0.15,
}: {
  children: React.ReactNode;
  baseDelay?: number;
  staggerDelay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // Wrap each child in a motion.div with staggered delay
  const items = Array.isArray(children) ? children : [children];

  return (
    <>
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={fadeUp(baseDelay + i * staggerDelay)}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
