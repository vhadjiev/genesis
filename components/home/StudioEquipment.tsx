"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface EquipmentCategory {
  id: string;
  icon: string;
  label: LocalizedContent<string>;
  items: string[];
}

interface StudioEquipmentData {
  type: "studioEquipment";
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
  categories: EquipmentCategory[];
}

interface StudioEquipmentProps {
  data: StudioEquipmentData;
  locale: string;
}

export function StudioEquipment({ data, locale }: StudioEquipmentProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    data.categories[0]?.id || ""
  );

  const currentCategory = data.categories.find(
    (c) => c.id === selectedCategory
  );

  // Find the maximum number of items across all categories
  const maxItems = useMemo(() => {
    return Math.max(...data.categories.map((c) => c.items.length));
  }, [data.categories]);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#282834] mb-4">
            {getLocalizedContent(data.title, locale)}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-[#555] max-w-2xl mx-auto">
            {getLocalizedContent(data.description, locale)}
          </p>
        </motion.div>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {data.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-white font-semibold"
                    : "bg-gray-100 text-[#555] hover:bg-gray-200"
                }`}
              >
                <Icon
                  icon={category.icon}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                <span className="text-sm md:text-base">
                  {getLocalizedContent(category.label, locale)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Equipment List - Fixed height container */}
        <div className="max-w-2xl mx-auto">
          <div 
            className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100"
            style={{ minHeight: `${maxItems * 40 + 48}px` }}
          >
            <AnimatePresence mode="wait">
              {currentCategory && (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <ul className="space-y-3 inline-block">
                    {currentCategory.items.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 text-[#333]"
                      >
                        <Icon
                          icon="mdi:check-circle"
                          className="w-5 h-5 text-primary shrink-0"
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
