/**
 * Metadata configuration — SEO, OG, JSON-LD for the portfolio.
 */

import type { Metadata, Viewport } from "next";
import { profile } from "@/content/profile";

const SITE_URL =
  process.env["NEXT_PUBLIC_SITE_URL"] || "https://example.com";

const SITE_NAME = profile.name;
const SITE_TITLE = `${SITE_NAME} — ${profile.title}`;
const SITE_DESCRIPTION = profile.tagline;

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Generative AI",
    "LLM",
    "Machine Learning",
    "RAG",
    "AI Engineer",
    "Portfolio",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDEAE3" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0C" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** JSON-LD structured data for Person schema */
export function getPersonJsonLd(): Record<string, unknown> {
  const sameAs = [profile.links.github, profile.links.linkedin, profile.links.x].filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: profile.title,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    email: profile.links.email,
    sameAs,
    knowsAbout: [
      "Large Language Models",
      "Retrieval-Augmented Generation",
      "LLM Evaluation",
      "Inference Optimization",
      "Multi-Agent Systems",
    ],
  };
}
