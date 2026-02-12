"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface EventItem {
  id: string;
  icon: string;
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
}

interface EventsGridData {
  type: "eventsGrid";
  intro: LocalizedContent<string>;
  items: EventItem[];
  outroTitle: LocalizedContent<string>;
  outro: LocalizedContent<string>;
  ctaText: LocalizedContent<string>;
  ctaLink: string;
}

interface EventsGridProps {
  data: EventsGridData;
  locale: string;
}

export function EventsGrid({ data, locale }: EventsGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introText = getLocalizedContent(data.intro, locale);

  // Split intro text to highlight "UBC Sound & Cinema Studio"
  const highlightText = "UBC Sound & Cinema Studio";
  const parts = introText.split(highlightText);

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

        {/* Events Grid - 2x2 Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
            {data.items.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon icon={event.icon} className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#282834] mb-3">
                      {getLocalizedContent(event.title, locale)}
                    </h3>
                    <p className="text-[#555] leading-relaxed">
                      {getLocalizedContent(event.description, locale)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Outro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#282834] mb-4">
            {getLocalizedContent(data.outroTitle, locale)}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6" />
          <p className="text-[#555] leading-relaxed text-lg">
            {getLocalizedContent(data.outro, locale)}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
