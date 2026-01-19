// Supported languages - European languages
export const supportedLanguages = [
  'en', // English
  'fr', // French
  'de', // German
  'es', // Spanish
  'it', // Italian
  'pt', // Portuguese
  'nl', // Dutch
  'pl', // Polish
  'ru', // Russian
  'sv', // Swedish
  'da', // Danish
  'fi', // Finnish
  'no', // Norwegian
  'cs', // Czech
  'hu', // Hungarian
  'ro', // Romanian
  'el', // Greek
  'tr', // Turkish
  'uk', // Ukrainian
  'sk', // Slovak
  'hr', // Croatian
  'bg', // Bulgarian
] as const;

export type Language = (typeof supportedLanguages)[number];
export const defaultLanguage: Language = 'en';

// Language names for display
export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
  sv: 'Svenska',
  da: 'Dansk',
  fi: 'Suomi',
  no: 'Norsk',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  el: 'Ελληνικά',
  tr: 'Türkçe',
  uk: 'Українська',
  sk: 'Slovenčina',
  hr: 'Hrvatski',
  bg: 'Български',
};

// Language detection from headers
export function detectLanguage(headers: Headers): Language {
  // Check for explicit language preference in cookie or query param
  // This will be handled by the middleware
  
  // Get Accept-Language header
  const acceptLanguage = headers.get('accept-language');
  
  if (acceptLanguage) {
    // Parse Accept-Language header
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [code, q = '1'] = lang.trim().split(';q=');
        return { code: code.split('-')[0].toLowerCase(), quality: parseFloat(q) };
      })
      .sort((a, b) => b.quality - a.quality);
    
    // Check if any supported language matches
    for (const lang of languages) {
      if (supportedLanguages.includes(lang.code as Language)) {
        return lang.code as Language;
      }
    }
  }
  
  return defaultLanguage;
}

// Get language from cookie or default
export function getLanguageFromCookie(cookies: string | null): Language {
  if (!cookies) return defaultLanguage;
  
  const match = cookies.match(/lang=([^;]+)/);
  if (match && supportedLanguages.includes(match[1] as Language)) {
    return match[1] as Language;
  }
  
  return defaultLanguage;
}
