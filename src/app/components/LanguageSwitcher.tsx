"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supportedLanguages, languageNames, type Language } from '@/lib/i18n';

export default function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Use currentLang directly from props to avoid hydration mismatch
  const lang = currentLang;

  const switchLanguage = (newLang: Language) => {
    if (newLang === lang) {
      setIsOpen(false);
      return;
    }
    
    setIsOpen(false);
    
    // Set cookie with proper encoding
    const cookieValue = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    document.cookie = cookieValue;
    
    // Build new URL with lang parameter
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', newLang);
    
    // Force a hard reload to ensure server-side rendering picks up the new cookie
    // Using window.location.replace to avoid adding to history
    window.location.replace(currentUrl.toString());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out hover:bg-[#FFF5F5] text-primary"
        aria-label="Switch language"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline truncate max-w-[80px] lg:max-w-none">{languageNames[lang]}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto border-grey">
            {supportedLanguages.map((langOption) => (
              <button
                key={langOption}
                onClick={() => switchLanguage(langOption)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  lang === langOption 
                    ? 'bg-[#FFF5F5] text-[#E53935]' 
                    : 'hover:bg-[#FFF5F5]'
                }`}
                className={lang === langOption ? 'language-option-active' : 'language-option'}
              >
                {languageNames[langOption]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
