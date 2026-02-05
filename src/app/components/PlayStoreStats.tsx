"use client";

import { useEffect, useState } from "react";

interface PlayStoreData {
  rating: number;
  reviews: number;
  downloads: string;
  lastUpdated: string;
}

export default function PlayStoreStats() {
  const [data, setData] = useState<PlayStoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/playstore');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const playStoreData = await response.json();
        setData(playStoreData);
      } catch (err) {
        console.error('Error fetching Play Store data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Don't render anything while loading or on error
  if (loading || error || !data) {
    return null;
  }

  // Don't render if there's no meaningful data (app not yet on Play Store)
  const hasRating = data.rating > 0;
  const hasReviews = data.reviews > 0;
  const hasDownloads = data.downloads && data.downloads !== '0';

  if (!hasRating && !hasReviews && !hasDownloads) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-white/80 text-xs sm:text-sm">
      {hasRating && (
        <div className="flex items-center gap-2" title="Note moyenne sur Google Play">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold">{data.rating.toFixed(1)}</span>
        </div>
      )}
      {hasReviews && (
        <div className="flex items-center gap-1" title="Nombre d'avis">
          <span>{data.reviews.toLocaleString()}</span>
          <span className="text-white/60">avis</span>
        </div>
      )}
      {hasDownloads && (
        <div className="flex items-center gap-1" title="Nombre de téléchargements">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="font-semibold">{data.downloads}</span>
          <span className="text-white/60">téléchargements</span>
        </div>
      )}
    </div>
  );
}
