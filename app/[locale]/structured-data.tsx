export function StructuredData({ locale }: { locale: string }) {
  const isEn = locale === "en";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Genesis Technology",
    url: "https://gentech.bg",
    logo: "https://gentech.bg/logo.svg",
    description: isEn
      ? "European-engineered professional beverage systems for hotels, offices, and restaurant chains."
      : "Европейски професионални напиткови системи за хотели, офиси и ресторантски вериги.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sofia",
      addressCountry: "BG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@gentech.bg",
    },
    sameAs: [
      "https://facebook.com/gentechtechnology",
      "https://linkedin.com/company/genesis-technology",
      "https://instagram.com/genesis.technology",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Genesis Technology",
    url: "https://gentech.bg",
    inLanguage: [locale === "bg" ? "bg-BG" : "en-US"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
