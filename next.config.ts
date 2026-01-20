import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Exposer CLERK_PUBLISHABLE_KEY comme NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY pour Clerk
    // Clerk s'attend à NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY côté client
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '',
  },
};

export default nextConfig;
