import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "Free PDF Image Editor — Riftcut";
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateToolOgImage({
    title: "Add Images to PDF",
    description: "Drag & drop images onto any PDF page. Position, resize, and download.",
    color: "#FF914D",
    tag: "VISUAL EDITOR",
  });
}
