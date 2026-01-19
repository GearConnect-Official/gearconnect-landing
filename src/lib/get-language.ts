import { cookies, headers } from 'next/headers';
import { supportedLanguages, defaultLanguage, type Language } from './i18n';

export async function getLanguage(): Promise<Language> {
  // Try to get language from cookie first (highest priority)
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lang')?.value;
  
  if (langCookie && supportedLanguages.includes(langCookie as Language)) {
    return langCookie as Language;
  }
  
  // Check for query parameter in headers (for initial language selection)
  const headersList = await headers();
  
  // Try to get from referer or URL if available
  // Note: In Next.js App Router, we can't directly access searchParams in server components
  // The middleware handles this and sets the cookie
  
  // Fallback to header detection
  const acceptLanguage = headersList.get('accept-language');
  
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
        return lang.code as Language;
      }
    }
  }
  
  return defaultLanguage;
}
