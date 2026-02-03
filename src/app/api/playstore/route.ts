import { NextResponse } from 'next/server';
import gplay from 'google-play-scraper';

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

// ID de l'app GearConnect sur Google Play
const APP_ID = process.env.PLAYSTORE_APP_ID || 'com.gearconnect.app';

// Données par défaut en cas d'erreur ou si l'app n'est pas encore publiée
const DEFAULT_DATA: PlayStoreData = {
  rating: 0,
  reviews: 0,
  downloads: '0',
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  try {
    // Vérifier le cache
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Récupérer les données depuis Google Play Store
    const appDetails = await gplay.app({ appId: APP_ID });

    const playStoreData: PlayStoreData = {
      rating: appDetails.score || 0,
      reviews: appDetails.reviews || 0,
      downloads: appDetails.installs || '0',
      lastUpdated: appDetails.updated ? new Date(appDetails.updated).toISOString() : new Date().toISOString(),
    };

    // Mettre à jour le cache
    cachedData = playStoreData;
    cacheTimestamp = now;

    return NextResponse.json(playStoreData);
  } catch (error) {
    console.error('Error fetching Play Store data:', error);

    // Si on a des données en cache (même expirées), les retourner
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Sinon retourner des données par défaut
    return NextResponse.json(DEFAULT_DATA);
  }
}

// Force dynamic rendering (no static pre-rendering)
export const dynamic = 'force-dynamic';
