"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface Room {
  id: string;
  icon: string;
  image: string;
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
  size: LocalizedContent<string>;
  feature?: LocalizedContent<string>;
}

interface WorkingRoomsData {
  type: "workingRooms";
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
  rooms: Room[];
}

interface WorkingRoomsProps {
  data: WorkingRoomsData;
  locale: string;
}

export function WorkingRooms({ data, locale }: WorkingRoomsProps) {
  const { t } = useTranslation();
  const [selectedRoom, setSelectedRoom] = useState(data.rooms[0]?.id || "");
  const [direction, setDirection] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Track section visibility for the floating info button
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
        // Close panel when section goes out of view
        if (!entry.isIntersecting) {
          setIsPanelOpen(false);
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const currentRoom = data.rooms.find((r) => r.id === selectedRoom) || data.rooms[0];
  const currentIndex = data.rooms.findIndex((r) => r.id === selectedRoom);

  const handleRoomChange = (roomId: string) => {
    const newIndex = data.rooms.findIndex((r) => r.id === roomId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelectedRoom(roomId);
    setIsPanelOpen(false); // Close panel when changing rooms
  };

  // Variants for image transitions
  const imageVariants = {
    enter: (direction: number) => ({
      scale: 1.2,
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    center: {
      scale: 1,
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      scale: 0.9,
      opacity: 0,
      x: direction > 0 ? -100 : 100,
    }),
  };

  // Variants for content transitions
  const contentVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      y: 20,
      x: direction > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      y: 0,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      y: -10,
      x: direction > 0 ? -30 : 30,
    }),
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden h-[85vh] md:min-h-screen">
      {/* Animated Room Image Background */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={selectedRoom}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentRoom.image}
            alt={getLocalizedContent(currentRoom.title, locale)}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Gradient overlay - lighter on mobile to show more image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1612] via-[#0a1612]/20 to-transparent md:via-[#0a1612]/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header - Compact on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-8 md:pt-24 px-4 md:px-6 text-center"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            {getLocalizedContent(data.title, locale)}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        {/* Room Details - positioned in middle area */}
        <div className="flex-1 flex items-end px-4 md:px-6 pb-4 md:pb-8">
          <div className="container mx-auto max-w-6xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={selectedRoom}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Mobile: Compact layout */}
                <div className="md:hidden space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    {getLocalizedContent(currentRoom.title, locale)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-xs border border-primary/30">
                      <Icon icon="mdi:ruler-square" className="w-3.5 h-3.5" aria-hidden="true" />
                      {getLocalizedContent(currentRoom.size, locale)}
                    </span>
                    {currentRoom.feature && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs border border-white/20">
                        <Icon icon="mdi:soundwave" className="w-3.5 h-3.5" aria-hidden="true" />
                        {getLocalizedContent(currentRoom.feature, locale)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop: Full layout */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary border border-primary/30"
                      >
                        <Icon icon="mdi:ruler-square" className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                          {getLocalizedContent(currentRoom.size, locale)}
                        </span>
                      </motion.span>
                      {currentRoom.feature && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/20"
                        >
                          <Icon icon="mdi:soundwave" className="w-4 h-4" aria-hidden="true" />
                          <span className="text-sm font-medium">
                            {getLocalizedContent(currentRoom.feature, locale)}
                          </span>
                        </motion.span>
                      )}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white">
                      {getLocalizedContent(currentRoom.title, locale)}
                    </h3>
                  </div>
                  <div className="lg:text-right">
                    <p className="text-white/70 text-lg leading-relaxed max-w-xl lg:ml-auto">
                      {getLocalizedContent(currentRoom.description, locale)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation Area - fixed at bottom */}
        <div className="pb-6 md:pb-16">
          {/* Mobile: Icon-only navigation */}
          <div className="md:hidden px-4">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-md">
                {data.rooms.map((room) => (
                  <motion.button
                    key={room.id}
                    onClick={() => handleRoomChange(room.id)}
                    aria-label={getLocalizedContent(room.title, locale)}
                    aria-pressed={selectedRoom === room.id}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      selectedRoom === room.id
                        ? "text-white"
                        : "text-white/60"
                    }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedRoom === room.id && (
                      <motion.div
                        layoutId="activeRoomMobile"
                        className="absolute inset-0 bg-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <Icon icon={room.icon} className="relative z-10 w-5 h-5" aria-hidden="true" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Full navigation pills */}
          <div className="hidden md:block px-6">
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap justify-center gap-3 p-2 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
                {data.rooms.map((room, index) => (
                  <motion.button
                    key={room.id}
                    onClick={() => handleRoomChange(room.id)}
                    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                      selectedRoom === room.id
                        ? "text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    whileHover={{ scale: selectedRoom === room.id ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedRoom === room.id && (
                      <motion.div
                        layoutId="activeRoom"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon icon={room.icon} className="relative z-10 w-5 h-5" aria-hidden="true" />
                    <span className="relative z-10 text-base font-medium whitespace-nowrap">
                      {getLocalizedContent(room.title, locale)}
                    </span>
                    <span className={`relative z-10 ml-1 text-xs font-mono ${
                      selectedRoom === room.id ? "text-white/50" : "text-white/30"
                    }`}>
                      0{index + 1}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Slide-in Info Panel */}
      <div className="md:hidden">
        {/* Panel Tab (fixed position, follows scroll) */}
        <AnimatePresence>
          {isSectionVisible && (
            <motion.button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              aria-label={isPanelOpen ? t("rooms.closeInfo") : t("rooms.openInfo")}
              aria-expanded={isPanelOpen}
              className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: isPanelOpen ? -280 : 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="bg-primary/30 backdrop-blur-md rounded-l-xl py-4 px-3 flex flex-col items-center gap-2 shadow-lg shadow-primary/20 border border-white/10">
                  <Icon 
                    icon={isPanelOpen ? "mdi:chevron-right" : "mdi:chevron-left"} 
                    className="w-5 h-5 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-primary text-xs font-semibold writing-vertical tracking-wide">
                    {t("rooms.info")}
                  </span>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Panel Content */}
        <motion.div
          className="fixed right-0 top-0 bottom-0 w-[280px] z-40"
          initial={{ x: "100%" }}
          animate={{ x: isPanelOpen && isSectionVisible ? 0 : "100%" }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
        >
          <div className="h-full bg-[#0a1612]/95 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsPanelOpen(false)}
              aria-label={t("common.close") || "Close"}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
            >
              <Icon icon="mdi:close" className="w-5 h-5" aria-hidden="true" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRoom}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Room Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon icon={currentRoom.icon} className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-white">
                  {getLocalizedContent(currentRoom.title, locale)}
                </h4>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs">
                    <Icon icon="mdi:ruler-square" className="w-3 h-3" aria-hidden="true" />
                    {getLocalizedContent(currentRoom.size, locale)}
                  </span>
                  {currentRoom.feature && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                      <Icon icon="mdi:soundwave" className="w-3 h-3" aria-hidden="true" />
                      {getLocalizedContent(currentRoom.feature, locale)}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10" />

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed">
                  {getLocalizedContent(currentRoom.description, locale)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Backdrop when panel is open */}
        <AnimatePresence>
          {isPanelOpen && isSectionVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 bg-black/30 z-30"
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
}
