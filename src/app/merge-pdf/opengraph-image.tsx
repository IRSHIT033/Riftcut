import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "Free PDF & Image Merger — Riftcut";
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateToolOgImage({
    title: "Merge PDFs & Images",
    description: "Combine PDFs and images into one document. Reorder, preview, download. Free and private.",
    color: "#4CC9F0",
    tag: "MIX & MERGE",
  });
}
