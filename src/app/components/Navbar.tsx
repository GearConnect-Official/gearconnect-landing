"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { type Language } from '@/lib/i18n';

interface NavbarProps {
  content: {
    brand: {
      name: string;
      tagline: string;
    };
    menu: {
      home: string;
      features: string;
      faq: string;
      contact: string;
    };
    cta: {
      text: string;
      link: string;
    };
  };
  currentLang?: Language;
}

export default function Navbar({ content, currentLang = 'en' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use currentLang directly from props to avoid hydration mismatch
  const lang = currentLang;

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 border-b" style={{ borderColor: '#DAE0E6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity duration-300">
              <Image 
                src="/logo.png" 
                alt="GearConnect Logo" 
                width={40} 
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
                priority
              />
              <div className="flex flex-col min-w-0">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight truncate" style={{ color: '#E53935' }}>{content.brand.name}</span>
                <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium hidden sm:block truncate" style={{ color: '#474C54' }}>{content.brand.tagline}</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2 lg:space-x-4 xl:space-x-8">
            <div className="flex space-x-1 flex-wrap items-center">
              <Link href="/" className="px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ease-out hover:bg-[#FFF5F5] hover:text-[#E53935] whitespace-nowrap" style={{ color: '#1E232C' }}>
                {content.menu.home}
              </Link>
              <Link href="/#features" className="px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ease-out hover:bg-[#FFF5F5] hover:text-[#E53935] whitespace-nowrap" style={{ color: '#1E232C' }}>
                {content.menu.features}
              </Link>
              <Link href="/faq" className="px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ease-out hover:bg-[#FFF5F5] hover:text-[#E53935] whitespace-nowrap" style={{ color: '#1E232C' }}>
                {content.menu.faq}
              </Link>
              <Link href="/contact" className="px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-300 ease-out hover:bg-[#FFF5F5] hover:text-[#E53935] whitespace-nowrap" style={{ color: '#1E232C' }}>
                {content.menu.contact}
              </Link>
            </div>
            <LanguageSwitcher currentLang={lang} />
            <Link 
              href={content.cta.link} 
              className="text-white px-3 lg:px-6 py-2 rounded-lg text-xs lg:text-sm font-semibold shadow-md transition-all duration-300 ease-out transform hover:scale-105 hover:bg-[#C62828] hover:shadow-lg whitespace-nowrap"
              style={{ backgroundColor: '#E53935' }}
            >
              {content.cta.text}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-200 hover:bg-[#FFF5F5] focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ color: '#474C54' }}
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t relative z-50" style={{ borderColor: '#DAE0E6' }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-[#FFF5F5]" style={{ color: '#1E232C' }}>
              {content.menu.home}
            </Link>
            <Link href="/#features" className="block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-[#FFF5F5]" style={{ color: '#1E232C' }}>
              {content.menu.features}
            </Link>
            <Link href="/faq" className="block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-[#FFF5F5]" style={{ color: '#1E232C' }}>
              {content.menu.faq}
            </Link>
            <Link href="/contact" className="block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-[#FFF5F5]" style={{ color: '#1E232C' }}>
              {content.menu.contact}
            </Link>
            <div className="px-4 mt-4">
              <LanguageSwitcher currentLang={lang} />
            </div>
            <Link 
              href={content.cta.link} 
              className="block mx-4 mt-4 text-white px-4 py-3 rounded-lg text-base font-semibold text-center transition-all duration-200 hover:bg-[#C62828]"
              style={{ backgroundColor: '#E53935' }}
            >
              {content.cta.text}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 