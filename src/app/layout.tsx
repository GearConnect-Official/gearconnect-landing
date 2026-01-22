import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getNavbarContent, getFooterContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";

// Configuration des polices avec gestion d'erreur améliorée
// Si Google Fonts n'est pas accessible, les polices de secours seront utilisées
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Utilise la police de secours immédiatement si Google Fonts n'est pas disponible
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: true,
  preload: true, // Précharger pour améliorer les performances
  // Désactiver le chargement automatique si la connexion échoue
  // Next.js utilisera automatiquement les polices de secours
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
  adjustFontFallback: true,
  preload: true,
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
  
  // Clerk détecte automatiquement NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // Mais on peut aussi le passer explicitement pour plus de clarté
  // ⚠️ IMPORTANT: Cette variable DOIT être définie dans .env avec le préfixe NEXT_PUBLIC_
  // pour être accessible côté client
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    console.error('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set!');
    console.error('   Clerk ne peut pas fonctionner sans cette variable.');
    console.error('   Ajoutez NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY dans votre fichier .env');
    console.error('   Le site peut charger à l\'infini sans cette clé.');
  }

  // Si la clé n'est pas définie, on ne peut pas utiliser ClerkProvider
  // On retourne une version sans Clerk pour éviter le chargement infini
  if (!clerkPublishableKey) {
    return (
      <html lang={lang} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#E53935', marginBottom: '1rem' }}>Configuration manquante</h1>
            <p style={{ marginBottom: '1rem' }}>
              La clé <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> n&apos;est pas définie dans votre fichier <code>.env</code>.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Veuillez ajouter cette variable d&apos;environnement pour que l&apos;application fonctionne correctement.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Consultez <code>ENV_COMPLETE.md</code> pour plus d&apos;informations.
            </p>
          </div>
        </body>
      </html>
    );
  }
  
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
    >
      <html lang={lang} suppressHydrationWarning>
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
    </ClerkProvider>
  );
}
