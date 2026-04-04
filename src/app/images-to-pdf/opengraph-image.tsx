import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "Free Images to PDF — Riftcut";
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateToolOgImage({
    title: "Images to PDF",
    description: "Convert multiple images into a single PDF. Reorder, resize, choose layout.",
    color: "#A7F205",
    tag: "BATCH CONVERT",
  });
}
