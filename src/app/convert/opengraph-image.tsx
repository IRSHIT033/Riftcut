import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "Free File Converter — Riftcut";
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateToolOgImage({
    title: "File Converter",
    description: "Convert images and Word documents to PDF. Free, private, no uploads.",
    color: "#FFDE59",
    tag: "MULTI-FORMAT",
  });
}
