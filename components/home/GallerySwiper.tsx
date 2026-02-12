"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Icon } from "@iconify/react";

interface GallerySwiperData {
  type: "gallerySwiper";
  images: string[];
}

interface GallerySwiperProps {
  data: GallerySwiperData;
  locale: string;
}

const SWIPE_THRESHOLD = 50;
const CARD_SIZE = 220;
const AUTO_SCROLL_INTERVAL = 2000; // Faster interval for gallery strip

export function GallerySwiper({ data }: GallerySwiperProps) {
  const images = data.images;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState(0);

  const totalItems = images.length;
  
  // Triple the images for seamless infinite scroll
  const extendedImages = [...images, ...images, ...images];

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean = true) => {
      if (scrollRef.current) {
        const scrollPosition = index * CARD_SIZE;
        scrollRef.current.scrollTo({
          left: scrollPosition,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    },
    []
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
    // If we've scrolled into the third set, reset to the second set
    if (currentIndex >= totalItems * 2) {
      const timeout = setTimeout(() => {
        const newIndex = currentIndex - totalItems;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex, false);
      }, 300);
      return () => clearTimeout(timeout);
    }
    
    // If we've scrolled before the second set, reset to the second set
    if (currentIndex < totalItems) {
      const timeout = setTimeout(() => {
        const newIndex = currentIndex + totalItems;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex, false);
      }, 300);
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

  // Handle swipe gestures on gallery strip
  const handleGalleryDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Calculate how many cards to move based on drag distance
    const draggedCards = Math.round(Math.abs(info.offset.x) / CARD_SIZE) || 1;
    
    if (info.offset.x < -SWIPE_THRESHOLD) {
      setCurrentIndex((prev) => prev + draggedCards);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      setCurrentIndex((prev) => prev - draggedCards);
    }
  };

  const openLightbox = (imageIndex: number) => {
    // Convert extended index to original index
    const originalIndex = imageIndex % images.length;
    setLightboxIndex(originalIndex);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const goToPreviousLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setSlideDirection(-1);
    setLightboxIndex((prev) => (prev === null ? null : prev === 0 ? images.length - 1 : prev - 1));
  }, [lightboxIndex, images.length]);

  const goToNextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setSlideDirection(1);
    setLightboxIndex((prev) => (prev === null ? null : prev === images.length - 1 ? 0 : prev + 1));
  }, [lightboxIndex, images.length]);

  // Handle swipe in lightbox
  const handleLightboxDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goToNextLightbox();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goToPreviousLightbox();
    }
  };

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        goToPreviousLightbox();
      } else if (e.key === "ArrowRight") {
        goToNextLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, goToPreviousLightbox, goToNextLightbox]);

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-[#1a1a24]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        {/* Gallery Strip with Swipe Support */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={handleGalleryDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <div
            ref={scrollRef}
            className="flex overflow-x-hidden pointer-events-none"
          >
            {extendedImages.map((image, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={`${image}-${index}`}
                  className="shrink-0 relative cursor-pointer pointer-events-auto"
                  style={{ width: `${CARD_SIZE}px`, height: `${CARD_SIZE}px` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => openLightbox(index)}
                >
                  {/* Square Image Container */}
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={image}
                      alt={`Gallery image ${(index % images.length) + 1}`}
                      fill
                      className={`object-cover transition-transform duration-300 ${
                        isHovered ? "scale-110" : "scale-100"
                      }`}
                      sizes={`${CARD_SIZE}px`}
                      draggable={false}
                    />
                    
                    {/* Hover Overlay with Zoom Icon */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon
                          icon="mdi:magnify-plus-outline"
                          className="w-6 h-6 text-white"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all"
              aria-label="Close lightbox"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>

            {/* Previous Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousLightbox();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all"
              aria-label="Previous image"
            >
              <Icon icon="mdi:chevron-left" className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextLightbox();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all"
              aria-label="Next image"
            >
              <Icon icon="mdi:chevron-right" className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/60 text-sm font-medium">
              <span className="text-white">{String(lightboxIndex + 1).padStart(2, "0")}</span>
              <span className="mx-1">/</span>
              <span>{String(images.length).padStart(2, "0")}</span>
            </div>

            {/* Lightbox Image with Swipe */}
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={lightboxIndex}
                custom={slideDirection}
                initial={{ opacity: 0, x: slideDirection > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection > 0 ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleLightboxDragEnd}
                className="cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[lightboxIndex]}
                  alt={`Gallery image ${lightboxIndex + 1}`}
                  className="max-w-[90vw] max-h-[85vh] w-auto h-auto"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
