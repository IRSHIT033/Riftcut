import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Riftcut — Free Private File Toolkit",
    short_name: "Riftcut",
    description:
      "Remove backgrounds, convert files, merge PDFs, and more. 100% private — all processing in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF7",
    theme_color: "#FFDE59",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
