"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface Founder {
  id: string;
  image: string;
  name: LocalizedContent<string>;
  role: LocalizedContent<string>;
  quote: LocalizedContent<string>;
}

interface ConceptionSectionData {
  type: "conceptionSection";
  title: LocalizedContent<string>;
  subtitle: LocalizedContent<string>;
  founders: Founder[];
}

interface ConceptionSectionProps {
  data: ConceptionSectionData;
  locale: string;
}

export function ConceptionSection({ data, locale }: ConceptionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute inset-[-10%] w-[120%] h-[120%]">
          <Image
            src="/images/gallery/UBC-Gallery-07.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#0a1612]/90" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {getLocalizedContent(data.title, locale)}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-primary">
            {getLocalizedContent(data.subtitle, locale)}
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 max-w-2xl">
          {[...data.founders].reverse().map((founder, index) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Icon
                      icon="mdi:account"
                      className="w-8 h-8 text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {getLocalizedContent(founder.name, locale)}
                    </h3>
                    <p className="text-sm text-primary">
                      {getLocalizedContent(founder.role, locale)}
                    </p>
                  </div>
                </div>
                <Icon
                  icon="mdi:format-quote-open"
                  className="w-8 h-8 text-primary/30 mb-2"
                />
                <p className="text-white/70 leading-relaxed italic">
                  {getLocalizedContent(founder.quote, locale)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
