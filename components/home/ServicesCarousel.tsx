"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion, PanInfo } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

const SWIPE_THRESHOLD = 50;

interface ServiceItem {
  id: string;
  image: string;
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
}

interface ServicesCarouselData {
  type: "servicesCarousel";
  title: LocalizedContent<string>;
  items: ServiceItem[];
}

interface ServicesCarouselProps {
  data: ServicesCarouselData;
  locale: string;
}

const AUTO_SCROLL_INTERVAL = 4000;

export function ServicesCarousel({ data, locale }: ServicesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  const totalItems = data.items.length;
  
  // Triple the items for seamless infinite scroll
  const extendedItems = [...data.items, ...data.items, ...data.items];

  // Update visible cards based on screen width
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const gap = 24;

  const getCardWidth = useCallback(() => {
    if (scrollRef.current) {
      return (scrollRef.current.offsetWidth - gap * (visibleCards - 1)) / visibleCards;
    }
    return 0;
  }, [visibleCards]);

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean = true) => {
      if (scrollRef.current) {
        const cardWidth = getCardWidth();
        const scrollPosition = index * (cardWidth + gap);

        scrollRef.current.scrollTo({
          left: scrollPosition,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    },
    [getCardWidth, gap]
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Scroll when index changes
  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  // Reset position seamlessly when we've scrolled too far
  useEffect(() => {
    // If we've scrolled into the third set, reset to the same position in the second set
    if (currentIndex >= totalItems * 2) {
      const timeout = setTimeout(() => {
        const newIndex = currentIndex - totalItems;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex, false);
      }, 500);
      return () => clearTimeout(timeout);
    }
    
    // If we've scrolled before the second set, reset to the same position in the second set
    if (currentIndex < totalItems) {
      const timeout = setTimeout(() => {
        const newIndex = currentIndex + totalItems;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex, false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, totalItems, scrollToIndex]);

  // Initialize to the middle set
  useEffect(() => {
    setCurrentIndex(totalItems);
    scrollToIndex(totalItems, false);
  }, [totalItems, scrollToIndex]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Handle swipe gestures
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goToNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goToPrev();
    }
  };

  // Calculate card width style based on visible cards
  const getCardWidthStyle = () => {
    if (visibleCards === 1) {
      return "100%";
    } else if (visibleCards === 2) {
      return `calc((100% - ${gap}px) / 2)`;
    } else {
      return `calc((100% - ${gap * 2}px) / 3)`;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#282834] mb-4">
            {getLocalizedContent(data.title, locale)}
          </h2>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Scroll Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-[120px] sm:top-[140px] md:top-[180px] z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow -ml-2 sm:-ml-4 md:-ml-6"
            aria-label="Previous"
          >
            <Icon icon="mdi:arrow-left" className="w-4 h-4 sm:w-5 sm:h-5 text-[#282834]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-[120px] sm:top-[140px] md:top-[180px] z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow -mr-2 sm:-mr-4 md:-mr-6"
            aria-label="Next"
          >
            <Icon icon="mdi:arrow-right" className="w-4 h-4 sm:w-5 sm:h-5 text-[#282834]" />
          </button>

          {/* Services Carousel with Swipe Support */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            onDragStart={() => setIsPaused(true)}
            className="cursor-grab active:cursor-grabbing"
          >
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-hidden py-4 pointer-events-none"
            >
              {extendedItems.map((service, index) => (
                <div
                  key={`${service.id}-${index}`}
                  className="shrink-0 pointer-events-auto"
                  style={{ width: getCardWidthStyle() }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                    {/* Service Image */}
                    <div className="relative w-full aspect-4/3 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={getLocalizedContent(service.title, locale)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        draggable={false}
                      />
                    </div>

                    {/* Service Content */}
                    <div className="p-4 sm:p-6 text-center">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-2 sm:mb-3">
                        {getLocalizedContent(service.title, locale)}
                      </h3>
                      <p className="text-sm md:text-base text-[#666] leading-relaxed">
                        {getLocalizedContent(service.description, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
