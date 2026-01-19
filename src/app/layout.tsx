import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getNavbarContent, getFooterContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gearconnect-landing.vercel.app'),
  title: "GearConnect - Connect Passion with Ambition",
  description: "The social network for motorsport enthusiasts. Share your passion, track your performances, connect with the community, and accelerate your racing career.",
  keywords: "motorsport, racing, social network, performance tracking, racing community, motorsport events, racing app, gearconnect",
  authors: [{ name: 'GearConnect Team' }],
  openGraph: {
    title: "GearConnect - Connect Passion with Ambition",
    description: "The social network for motorsport enthusiasts. Share your passion, track your performances, and connect with the community.",
    url: 'https://gearconnect-landing.vercel.app',
    siteName: 'GearConnect',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: '/logo.png',
      width: 512,
      height: 512,
      alt: 'GearConnect Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "GearConnect - Connect Passion with Ambition",
    description: "The social network for motorsport enthusiasts. Share your passion, track your performances, and connect with the community.",
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://gearconnect-landing.vercel.app'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: 'google-site-verification',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguage();
  const navbarContent = getNavbarContent(lang);
  const footerContent = getFooterContent(lang);
  
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar content={navbarContent} currentLang={lang} />
        <div className="pt-14 sm:pt-16">
          {children}
        </div>
        <SpeedInsights />
        <Analytics />
        <Footer content={footerContent} />
      </body>
    </html>
  );
}
