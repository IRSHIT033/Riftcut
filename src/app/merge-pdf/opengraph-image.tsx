import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "Free PDF Merger — Riftcut";
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateToolOgImage({
    title: "Merge PDFs",
    description: "Combine multiple PDF files into one. Drag to reorder. Free and private.",
    color: "#4CC9F0",
    tag: "DRAG & DROP",
  });
}
