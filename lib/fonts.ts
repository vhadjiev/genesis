import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";

export const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});
