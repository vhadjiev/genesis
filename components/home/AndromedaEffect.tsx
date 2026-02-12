"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface AndromedaEffectData {
  type: "andromedaEffect";
  id: string;
  logo: string;
  paragraphs: LocalizedContent<string>[];
}

interface AndromedaEffectProps {
  data: AndromedaEffectData;
  locale: string;
}

export function AndromedaEffect({ data, locale }: AndromedaEffectProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstParagraph = data.paragraphs[0];
  const secondParagraph = data.paragraphs[1];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Parallax fade in from center - opacity and scale animate together
  const logoOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <section
      ref={sectionRef}
      id={data.id}
      className="py-16 md:py-24 bg-[#282834]"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* First paragraph - top */}
          {firstParagraph && (
            <p className="text-base md:text-lg leading-relaxed text-white/80 mb-12 md:mb-16">
              {getLocalizedContent(firstParagraph, locale)}
            </p>
          )}

          {/* Logo - center with parallax */}
          <motion.div
            className="flex justify-center mb-12 md:mb-16"
            style={{ opacity: logoOpacity, scale: logoScale }}
          >
            <div className="relative w-[500px] h-[318px] md:w-[720px] md:h-[458px]">
              <Image
                src={data.logo}
                alt="The Andromeda Effect - Independent Artists Alliance"
                fill
                className="object-contain"
                sizes="720px"
              />
            </div>
          </motion.div>

          {/* Second paragraph - bottom */}
          {secondParagraph && (
            <p className="text-base md:text-lg leading-relaxed text-white/70">
              {getLocalizedContent(secondParagraph, locale)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
