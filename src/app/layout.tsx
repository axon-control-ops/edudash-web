import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import 'katex/dist/katex.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EduDash Pro — AI-Powered Educational Platform for South Africa",
    template: "%s | EduDash Pro",
  },
  description:
    "AI-powered educational platform for South African schools, preschools, and independent learners. Exam prep, lesson planning, Dash AI tutor, video calls, and daily routines.",
  keywords: [
    "EduDash Pro",
    "South African education",
    "AI tutor",
    "CAPS aligned",
    "exam preparation",
    "lesson planning",
    "school management",
    "preschool management",
    "educational technology",
  ],
  authors: [{ name: "EduDash Pro" }],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "EduDash Pro",
    title: "EduDash Pro — AI-Powered Educational Platform",
    description:
      "The elite educational dashboard for South African schools. AI exam generation, voice tutoring, video calls, and daily routine management.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduDash Pro — AI-Powered Educational Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDash Pro — AI-Powered Educational Platform",
    description:
      "AI exam generation, voice tutoring, video calls, and daily routines for South African schools.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0b1020",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#111111" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider />
        <ErrorBoundary>{children}</ErrorBoundary>
        <ToastContainer />
      </body>
    </html>
  );
}
