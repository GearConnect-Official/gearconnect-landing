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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/playstore');
        const playStoreData = await response.json();
        setData(playStoreData);
      } catch (error) {
        console.error('Error fetching Play Store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return null; // Ne rien afficher pendant le chargement
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-white/80 text-xs sm:text-sm">
      {data.rating > 0 && (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold">{data.rating.toFixed(1)}</span>
        </div>
      )}
      {data.reviews > 0 && (
        <div className="flex items-center gap-1">
          <span>{data.reviews.toLocaleString()}</span>
          <span className="text-white/60">reviews</span>
        </div>
      )}
      {data.downloads && (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{data.downloads}</span>
          <span className="text-white/60">downloads</span>
        </div>
      )}
    </div>
  );
}
