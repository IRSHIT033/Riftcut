import { generateToolOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const alt = "Free AI Background Remover — Riftcut";
export const size = ogSize;
export const contentType = ogContentType;

export default function OgImage() {
  return generateToolOgImage({
    title: "AI Background Remover",
    description: "Remove image backgrounds instantly. 100% private, runs in your browser.",
    color: "#FF6B6B",
    tag: "AI POWERED",
  });
}
