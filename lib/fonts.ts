/**
 * Font Loading — next/font instances for all portfolio typefaces.
 * Loaded once in layout.tsx, exposed as CSS variables.
 *
 * Google-hosted (self-hosted at build time, no runtime network request) so the
 * build has no dependency on local font assets under /public/fonts.
 */

import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const generalSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

/** Combined class string for <html> or <body> */
export const fontVariables = [
  instrumentSerif.variable,
  generalSans.variable,
  geistMono.variable,
].join(" ");
