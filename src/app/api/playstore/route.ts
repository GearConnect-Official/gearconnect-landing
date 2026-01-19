import { NextResponse } from 'next/server';

// Interface pour les données Play Store
interface PlayStoreData {
  rating: number;
  reviews: number;
  downloads: string;
  lastUpdated: string;
}

// Cache pour éviter trop de requêtes
let cachedData: PlayStoreData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

export async function GET() {
  try {
    // Vérifier le cache
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // ID de l'app GearConnect sur Google Play
    const appId = 'com.gearconnect.app';
    
    // Note: L'API officielle Google Play nécessite une authentification complexe
    // Pour l'instant, on utilise des données statiques ou on peut scraper (non recommandé)
    // Solution recommandée: Utiliser un service tiers comme AppFollow, AppAnnie, ou 42matters
    
    // Pour l'instant, retourner des données par défaut
    // TODO: Intégrer avec une API tierce ou scraper de manière légale
    const playStoreData: PlayStoreData = {
      rating: 4.5,
      reviews: 1250,
      downloads: '10K+',
      lastUpdated: new Date().toISOString(),
    };

    // Mettre à jour le cache
    cachedData = playStoreData;
    cacheTimestamp = now;

    return NextResponse.json(playStoreData);
  } catch (error) {
    console.error('Error fetching Play Store data:', error);
    // Retourner des données par défaut en cas d'erreur
    return NextResponse.json({
      rating: 4.5,
      reviews: 1250,
      downloads: '10K+',
      lastUpdated: new Date().toISOString(),
    });
  }
}
