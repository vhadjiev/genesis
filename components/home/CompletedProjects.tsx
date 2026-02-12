"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface Project {
  id: string;
  image: string;
  link: string;
  title: LocalizedContent<string>;
  year: string;
  type: LocalizedContent<string>;
  specs: LocalizedContent<string>;
}

interface CompletedProjectsData {
  type: "completedProjects";
  title: LocalizedContent<string>;
  projects: Project[];
}

interface CompletedProjectsProps {
  data: CompletedProjectsData;
  locale: string;
}

export function CompletedProjects({ data, locale }: CompletedProjectsProps) {
  return (
    <section className="py-16 md:py-24 bg-[#282834]">
      <div className="container mx-auto px-4 md:px-6">
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
          <div className="w-24 h-1 bg-primary mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all"
              >
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={getLocalizedContent(project.title, locale)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />

                  {/* External link overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                      <Icon
                        icon="mdi:open-in-new"
                        className="w-7 h-7 text-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span>{getLocalizedContent(project.type, locale)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getLocalizedContent(project.title, locale)}
                  </h3>
                  <p className="text-sm text-white/60">
                    {getLocalizedContent(project.specs, locale)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
