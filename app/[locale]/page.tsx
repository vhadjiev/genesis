import type { Locale } from "@/i18n/settings";
import { getCmsPage } from "@/lib/cms/get-page";
import { PageRenderer } from "@/components/cms/PageRenderer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getCmsPage("home", locale as Locale);

  return <PageRenderer page={page} />;
}
