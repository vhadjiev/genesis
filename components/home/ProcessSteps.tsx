"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface StepItem {
  id: string;
  icon: string;
  title: LocalizedContent<string>;
  description: LocalizedContent<string>;
}

interface ProcessStepsData {
  type: "processSteps";
  items: StepItem[];
}

interface ProcessStepsProps {
  data: ProcessStepsData;
  locale: string;
}

export function ProcessSteps({ data, locale }: ProcessStepsProps) {
  return (
    <section className="py-16 md:py-24 bg-[#282834]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {data.items.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4">
                <Icon
                  icon={step.icon}
                  className="w-14 h-14 md:w-16 md:h-16 text-white/90"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-primary mb-2">
                {getLocalizedContent(step.title, locale)}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed max-w-[200px]">
                {getLocalizedContent(step.description, locale)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
