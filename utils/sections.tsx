/**
 * Section Type Registry with dynamic imports and Suspense boundaries
 * Vercel best practice 2.4: Dynamic Imports for Heavy Components
 * Vercel best practice 1.5: Strategic Suspense Boundaries
 */

import { Suspense, ComponentType } from "react";
import dynamic from "next/dynamic";
import type { Section } from "@/types";

interface SectionComponentProps {
  data: Section;
  locale: string;
}

/**
 * Section loading skeleton - shown while section component loads
 */
function SectionSkeleton() {
  return (
    <div className="animate-pulse py-16">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-foreground/5 rounded-lg w-1/3 mx-auto mb-8" />
        <div className="h-64 bg-foreground/5 rounded-2xl" />
      </div>
    </div>
  );
}

/**
 * Dynamic imports for code splitting - reduces initial bundle size
 * Each section is loaded only when needed
 */
const sectionComponents: Record<
  string,
  ComponentType<SectionComponentProps>
> = {
  // Home page sections
  heroSlider: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/HeroSlider").then((m) => m.HeroSlider) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  gallerySwiper: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/GallerySwiper").then((m) => m.GallerySwiper) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  servicesCarousel: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/ServicesCarousel").then(
        (m) => m.ServicesCarousel
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  processSteps: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/ProcessSteps").then(
        (m) => m.ProcessSteps
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  featuresGrid: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/FeaturesGrid").then(
        (m) => m.FeaturesGrid
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  workingRooms: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/WorkingRooms").then(
        (m) => m.WorkingRooms
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  rentToShoot: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/RentToShoot").then(
        (m) => m.RentToShoot
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  andromedaEffect: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/AndromedaEffect").then(
        (m) => m.AndromedaEffect
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  studioEquipment: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/StudioEquipment").then(
        (m) => m.StudioEquipment
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  completedProjects: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/CompletedProjects").then(
        (m) => m.CompletedProjects
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  conceptionSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/ConceptionSection").then(
        (m) => m.ConceptionSection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // Shared sections
  pageBanner: dynamic<SectionComponentProps>(
    () =>
      import("@/components/shared/PageBanner").then(
        (m) => m.PageBanner
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  imageGallery: dynamic<SectionComponentProps>(
    () =>
      import("@/components/shared/ImageGallery").then(
        (m) => m.ImageGallery
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  contactForm: dynamic<SectionComponentProps>(
    () =>
      import("@/components/shared/ContactForm").then(
        (m) => m.ContactForm
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // Equipment page sections
  equipmentList: dynamic<SectionComponentProps>(
    () =>
      import("@/components/sections/EquipmentList").then(
        (m) => m.EquipmentList
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // Contacts page sections
  contactInfo: dynamic<SectionComponentProps>(
    () =>
      import("@/components/sections/ContactInfo").then(
        (m) => m.ContactInfo
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  contactPageContent: dynamic<SectionComponentProps>(
    () =>
      import("@/components/sections/ContactPageContent").then(
        (m) => m.ContactPageContent
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  mapEmbed: dynamic<SectionComponentProps>(
    () =>
      import("@/components/sections/MapEmbed").then(
        (m) => m.MapEmbed
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // Events page sections
  eventsGrid: dynamic<SectionComponentProps>(
    () =>
      import("@/components/sections/EventsGrid").then(
        (m) => m.EventsGrid
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
};

/**
 * Render a section with Suspense boundary for streaming
 * @param section - The section data from JSON
 * @param locale - Current locale (e.g., "en", "bg")
 * @param index - Section index for unique key
 */
export function renderSection(
  section: Section,
  locale: string,
  index: number
): React.ReactNode {
  const Component = sectionComponents[section.type];

  if (!Component) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Unknown section type: ${section.type}`);
    }
    return null;
  }

  return (
    <Suspense key={`${section.type}-${index}`} fallback={<SectionSkeleton />}>
      <Component data={section} locale={locale} />
    </Suspense>
  );
}

/**
 * Render multiple sections
 * @param sections - Array of section data from page JSON
 * @param locale - Current locale
 */
export function renderSections(
  sections: Section[],
  locale: string
): React.ReactNode[] {
  return sections.map((section, index) => renderSection(section, locale, index));
}
