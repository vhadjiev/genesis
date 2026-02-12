"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface FeatureItem {
  id: string;
  icon: string;
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
}

interface FeaturesGridData {
  type: "featuresGrid";
  intro: LocalizedContent<string>;
  ctaText: LocalizedContent<string>;
  ctaLink: string;
  items: FeatureItem[];
}

interface FeaturesGridProps {
  data: FeaturesGridData;
  locale: string;
}

export function FeaturesGrid({ data, locale }: FeaturesGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introText = getLocalizedContent(data.intro, locale);
  
  // Split intro text to highlight "UBC Sound & Cinema Studio"
  const highlightText = "UBC Sound & Cinema Studio";
  const parts = introText.split(highlightText);

  // CSS filter to color the SVG icons with primary green color (#67923d)
  const iconColorFilter = "invert(44%) sepia(35%) saturate(567%) hue-rotate(58deg) brightness(93%) contrast(88%)";

  // Parallax effect for the background logo
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const logoY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.05, 0.12, 0.12, 0.05]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Parallax Background Logo */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ y: logoY, opacity: logoOpacity }}
      >
        <div className="relative w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]">
          <Image
            src="/images/ubc-logo.svg"
            alt=""
            fill
            className="object-contain"
            sizes="700px"
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16 md:mb-20"
        >
          <p className="text-lg md:text-xl lg:text-2xl text-[#282834] leading-relaxed font-medium">
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="text-primary">{highlightText}</span>
                {parts[1]}
              </>
            ) : (
              introText
            )}
          </p>
        </motion.div>

        {/* Features Grid - Centered 3x2 Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 mb-16">
            {data.items.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-14 h-14 relative">
                  <Image
                    src={feature.icon}
                    alt=""
                    fill
                    className="object-contain"
                    style={{ filter: iconColorFilter }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#282834] mb-2">
                    {getLocalizedContent(feature.title, locale)}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed">
                    {getLocalizedContent(feature.description, locale)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href={`/${locale}${data.ctaLink}`}
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-4 rounded-full transition-colors"
          >
            {getLocalizedContent(data.ctaText, locale)}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
