"use client";

interface AnimatedBannerProps {
  text: string;
}

export default function AnimatedBanner({ text }: AnimatedBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#E53935] to-[#C62828] py-2.5 sm:py-3">
      <div className="flex whitespace-nowrap animate-scroll">
        {/* Duplicate content for seamless loop */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-6 sm:space-x-8 flex-shrink-0">
            <span className="text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest">
              {text}
            </span>
            <span className="text-white/70 text-lg sm:text-xl">⚡</span>
          </div>
        ))}
      </div>
    </div>
  );
}
