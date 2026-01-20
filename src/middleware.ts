import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supportedLanguages, defaultLanguage, type Language } from './lib/i18n';

// Routes protégées nécessitant une authentification
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/support(.*)',
]);

// Middleware combiné pour Clerk et i18n
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Gestion de l'authentification pour les routes protégées
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      const signInUrl = new URL('/auth/login', req.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  // Gestion de la langue (i18n)
  const pathnameHasLocale = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );
  
  let locale: Language = defaultLanguage;
  
  // Check query parameter first (for language switching)
  const langParam = req.nextUrl.searchParams.get('lang');
  if (langParam && supportedLanguages.includes(langParam as Language)) {
    locale = langParam as Language;
  } else {
    // Check cookie (for persistent language preference)
    const langCookie = req.cookies.get('lang')?.value;
    if (langCookie && supportedLanguages.includes(langCookie as Language)) {
      locale = langCookie as Language;
    } else {
      // Check Accept-Language header (for initial detection)
      const acceptLanguage = req.headers.get('accept-language');
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
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * 
     * Note: API routes are now included so Clerk can work with them
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
