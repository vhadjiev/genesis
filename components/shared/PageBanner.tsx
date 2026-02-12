"use client";

import React from "react";
import { motion } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface PageBannerData {
  type: "pageBanner";
  backgroundImage?: string;
  title: LocalizedContent<string>;
  subtitle?: LocalizedContent<string>;
}

interface PageBannerProps {
  data: PageBannerData;
  locale: string;
}

export function PageBanner({ data, locale }: PageBannerProps) {
  const title = getLocalizedContent(data.title, locale);
  const subtitle = data.subtitle
    ? getLocalizedContent(data.subtitle, locale)
    : undefined;

  return (
    <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      {/* Color overlay to mute the image */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{ backgroundColor: '#282834' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {subtitle && <p className="text-primary text-lg mb-2">{subtitle}</p>}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {title}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-6" />
        </motion.div>
      </div>
    </section>
  );
}
