import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supportedLanguages, defaultLanguage, type Language } from './lib/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname already has a language prefix
  const pathnameHasLocale = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );
  
  // Get language from query param (highest priority), cookie, or header
  let locale: Language = defaultLanguage;
  
  // Check query parameter first (for language switching)
  const langParam = request.nextUrl.searchParams.get('lang');
  if (langParam && supportedLanguages.includes(langParam as Language)) {
    locale = langParam as Language;
  } else {
    // Check cookie (for persistent language preference)
    const langCookie = request.cookies.get('lang')?.value;
    if (langCookie && supportedLanguages.includes(langCookie as Language)) {
      locale = langCookie as Language;
    } else {
      // Check Accept-Language header (for initial detection)
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage) {
        const languages = acceptLanguage
          .split(',')
          .map((lang) => {
            const [code, q = '1'] = lang.trim().split(';q=');
            return { code: code.split('-')[0].toLowerCase(), quality: parseFloat(q) };
          })
          .sort((a, b) => b.quality - a.quality);
        
        for (const lang of languages) {
          if (supportedLanguages.includes(lang.code as Language)) {
            locale = lang.code as Language;
            break;
          }
        }
      }
    }
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Always set/update the language cookie to ensure it's current
  response.cookies.set('lang', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
