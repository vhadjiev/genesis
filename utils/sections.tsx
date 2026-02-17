/**
 * Section Type Registry with dynamic imports and Suspense boundaries
 * Maps section type strings from page JSON to React components
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
  // ===== Home page sections =====
  heroSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/HeroSection").then((m) => m.HeroSection) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  trustBarSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/TrustBarSection").then((m) => m.TrustBarSection) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  problemSolutionSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/ProblemSolutionSection").then(
        (m) => m.ProblemSolutionSection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  differentiatorSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/DifferentiatorSection").then(
        (m) => m.DifferentiatorSection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  featuredProducts: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/FeaturedProducts").then((m) => m.FeaturedProducts) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  statsSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/StatsSection").then((m) => m.StatsSection) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  partnersSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/PartnersSection").then((m) => m.PartnersSection) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  testimonialsSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/TestimonialsSection").then(
        (m) => m.TestimonialsSection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  ctaSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/CTASection").then((m) => m.CTASection) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  brandStorySection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/BrandStorySection").then(
        (m) => m.BrandStorySection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  serviceSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/ServiceSection").then(
        (m) => m.ServiceSection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  newsletterSection: dynamic<SectionComponentProps>(
    () =>
      import("@/components/home/NewsletterSection").then(
        (m) => m.NewsletterSection
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // ===== Product page sections =====
  productHero: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductHero").then((m) => m.ProductHero) as Promise<
        ComponentType<SectionComponentProps>
      >,
    { loading: () => <SectionSkeleton /> }
  ),
  productOverview: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductOverview").then(
        (m) => m.ProductOverview
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  productHighlights: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductHighlights").then(
        (m) => m.ProductHighlights
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  productFeatures: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductFeatures").then(
        (m) => m.ProductFeatures
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  productSpecs: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductSpecs").then(
        (m) => m.ProductSpecs
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  productFAQ: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductFAQ").then(
        (m) => m.ProductFAQ
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  productCTA: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductCTA").then(
        (m) => m.ProductCTA
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  productGallery: dynamic<SectionComponentProps>(
    () =>
      import("@/components/product/ProductGallery").then(
        (m) => m.ProductGallery
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // ===== Service page sections =====
  serviceHero: dynamic<SectionComponentProps>(
    () =>
      import("@/components/services/ServiceHero").then(
        (m) => m.ServiceHero
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  serviceDetails: dynamic<SectionComponentProps>(
    () =>
      import("@/components/services/ServiceDetails").then(
        (m) => m.ServiceDetails
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  serviceCapabilities: dynamic<SectionComponentProps>(
    () =>
      import("@/components/services/ServiceCapabilities").then(
        (m) => m.ServiceCapabilities
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // ===== Company sections =====
  companyOverview: dynamic<SectionComponentProps>(
    () =>
      import("@/components/company/CompanyOverview").then(
        (m) => m.CompanyOverview
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  projectsGrid: dynamic<SectionComponentProps>(
    () =>
      import("@/components/company/ProjectsGrid").then(
        (m) => m.ProjectsGrid
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  newsGrid: dynamic<SectionComponentProps>(
    () =>
      import("@/components/company/NewsGrid").then(
        (m) => m.NewsGrid
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),
  exhibitionsGrid: dynamic<SectionComponentProps>(
    () =>
      import("@/components/company/ExhibitionsGrid").then(
        (m) => m.ExhibitionsGrid
      ) as Promise<ComponentType<SectionComponentProps>>,
    { loading: () => <SectionSkeleton /> }
  ),

  // ===== Shared sections =====
  pageBanner: dynamic<SectionComponentProps>(
    () =>
      import("@/components/shared/PageBanner").then(
        (m) => m.PageBanner
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

  // ===== Contacts page sections =====
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
