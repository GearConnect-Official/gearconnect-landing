"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsBarProps {
  stats: Stat[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="py-8 sm:py-12 bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFF5F5]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center transform transition-all duration-700 ease-out"
              style={{
                opacity: mounted ? (isVisible ? 1 : 0) : 1,
                transform: mounted ? (isVisible ? "translateY(0)" : "translateY(20px)") : "translateY(0)",
                transitionDelay: mounted ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-brand">
                {stat.value}
                {stat.suffix && <span className="text-2xl sm:text-3xl">{stat.suffix}</span>}
              </div>
              <div className="text-xs sm:text-sm md:text-base font-medium break-words px-1 text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
