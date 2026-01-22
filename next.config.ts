import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    // Exposer CLERK_PUBLISHABLE_KEY comme NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY pour Clerk
    // Clerk s'attend à NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY côté client
    // Si NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY est déjà défini, on l'utilise directement
    // Sinon, on utilise CLERK_PUBLISHABLE_KEY
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
      process.env.CLERK_PUBLISHABLE_KEY || 
      '',
  },
  // Réduire les avertissements pour les erreurs de chargement de ressources externes
  // Les erreurs de Google Fonts sont non bloquantes grâce à display: "swap"
  logging: {
    fetches: {
      fullUrl: false, // Ne pas logger les URLs complètes pour réduire le bruit
    },
  },
};

export default nextConfig;
