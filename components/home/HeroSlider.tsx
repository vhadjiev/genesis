"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface SlideContent {
  outline: string;
  main: string;
  subtitle: string;
  location?: string;
}

interface Slide {
  id: string;
  image: string;
  content: LocalizedContent<SlideContent>;
}

interface HeroSliderData {
  type: "heroSlider";
  items: Slide[];
}

interface HeroSliderProps {
  data: HeroSliderData;
  locale: string;
}

export function HeroSlider({ data, locale }: HeroSliderProps) {
  const slides = data.items;
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const activeSlide = slides[currentSlide];
  const content = getLocalizedContent(activeSlide.content, locale);

  // Text animation variants - fade from top
  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const textItemVariants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        opacity: { duration: 4 },
        y: { duration: 1.5 },
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Images with Fade + Scale (Zoom Out) Effect */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1, ease: "easeInOut" },
            scale: { duration: 10, ease: "easeOut" },
          }}
          className="absolute inset-0 hero-slide"
        >
          <Image
            src={activeSlide.image}
            alt=""
            fill
            className="object-cover"
            priority={currentSlide === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay (dark + dots) */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* Content - Left Aligned */}
      <div className="relative h-full flex items-center z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="hero-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="hero-text"
              >
                {/* Title */}
                <motion.h1 variants={textItemVariants} className="hero-title">
                  <span className="hero-title-outline">{content.outline}</span>
                  {content.main}
                </motion.h1>

                {/* Subtitle */}
                <motion.div variants={textItemVariants}>
                  <p className="hero-subtitle">
                    {content.subtitle}
                    {content.location && (
                      <>
                        <br />
                        {content.location}
                      </>
                    )}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Vertical Slide Indicators - Right Side */}
      <div className="hero-slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            data-label={`${String(index + 1).padStart(2, "0")}.`}
            className={`slide-indicator ${index === currentSlide ? "is-active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {String(index + 1).padStart(2, "0")}.
          </button>
        ))}
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-16 h-16 rounded-full border border-white/70 flex items-center justify-center text-white/70 hover:bg-white hover:text-[#282834] hover:border-white transition-all"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll to content"
      >
        <Icon icon="mdi:arrow-down-thin" className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
