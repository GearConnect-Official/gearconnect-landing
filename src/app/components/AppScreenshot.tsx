"use client";

import Image from "next/image";
import { useState } from "react";

interface AppScreenshotProps {
  src: string;
  alt: string;
}

export default function AppScreenshot({ src, alt }: AppScreenshotProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-[#FFF5F5] to-white flex items-center justify-center min-h-0">
        <div className="text-center p-3 sm:p-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 bg-[#E53935] rounded-full flex items-center justify-center">
            <span className="text-white text-sm sm:text-base md:text-lg font-bold">GC</span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-secondary">Screenshot: {alt}</p>
          <p className="text-[9px] sm:text-[10px] mt-1 break-all px-2 text-tertiary">{src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative min-h-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 200px, 240px"
        className="object-contain"
        onError={() => setHasError(true)}
        priority={false}
      />
    </div>
  );
}
