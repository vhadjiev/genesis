import { readFile } from "fs/promises";
import { join } from "path";
import { cache } from "react";

/**
 * Resolved logo ready for rendering.
 * - svg: inlined content string (no client fetch needed)
 * - image: just the src URL for next/image
 */
export type ResolvedLogo =
  | { type: "svg"; src: string; content: string }
  | { type: "image"; src: string };

function cleanSvg(raw: string): string {
  return raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "");
}

/**
 * Resolves a logo URL server-side.
 *
 * - Local paths (starting with /) → reads from public/ on disk
 * - Remote URLs → fetches with cache
 * - Checks content for SVG (content-type or body sniffing)
 * - Returns resolved type + content for SSR
 *
 * Wrapped in React.cache() for per-request deduplication —
 * if Header and Footer use the same logo URL, it resolves once.
 */
export const resolveLogo = cache(async (src: string): Promise<ResolvedLogo> => {
  try {
    let content: string;
    let contentType: string | null = null;

    if (src.startsWith("/")) {
      // Local file in public/ directory
      const filePath = join(process.cwd(), "public", src);
      content = await readFile(filePath, "utf-8");
      // Infer type from extension
      contentType = src.endsWith(".svg") ? "image/svg+xml" : "image/other";
    } else {
      // Remote URL
      const res = await fetch(src, { next: { revalidate: 3600 } });
      if (!res.ok) return { type: "image", src };
      contentType = res.headers.get("content-type") || "";
      content = await res.text();
    }

    // Check if SVG by content-type or content sniffing
    const isSvg =
      contentType?.includes("svg") ||
      content.trimStart().startsWith("<svg");

    if (isSvg) {
      return { type: "svg", src, content: cleanSvg(content) };
    }

    return { type: "image", src };
  } catch {
    return { type: "image", src };
  }
});
