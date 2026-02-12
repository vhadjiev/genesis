"use client";

import React from "react";
import { motion } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface Column {
  id: string;
  title: LocalizedContent<string>;
  subtitle: LocalizedContent<string> | null;
  description: LocalizedContent<string>;
}

interface RentToShootData {
  type: "rentToShoot";
  columns: Column[];
}

interface RentToShootProps {
  data: RentToShootData;
  locale: string;
}

export function RentToShoot({ data, locale }: RentToShootProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          {data.columns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282834] mb-4">
                {getLocalizedContent(column.title, locale)}
              </h2>
              {column.subtitle && (
                <p className="text-lg md:text-xl text-primary font-medium mb-6">
                  {getLocalizedContent(column.subtitle, locale)}
                </p>
              )}
              <p className="text-[#555] leading-relaxed">
                {getLocalizedContent(column.description, locale)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
