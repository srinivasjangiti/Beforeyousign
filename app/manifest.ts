import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BeforeYouSign — AI Contract Intelligence",
    short_name: "BeforeYouSign",
    description:
      "Upload any contract and get instant AI-powered risk analysis, hidden clause detection, and strategic recommendations.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#1c1917",
    orientation: "portrait-primary",
    categories: ["legal", "productivity", "business"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        // @ts-expect-error — form_factor is valid in manifest spec but not yet in Next.js types
        form_factor: "wide",
      },
    ],
  };
}
