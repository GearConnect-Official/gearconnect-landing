import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Types for content structure
export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    primaryButtonLink: string;
    secondaryButtonLink: string;
  };
  download: {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    androidButton: string;
    trustIndicators: Array<{
      label: string;
    }>;
  };
  features: {
    title: string;
    subtitle: string;
    description: string;
    feed: {
      title: string;
      description: string;
      items: string[];
      screenshot: string;
    };
    events: {
      title: string;
      description: string;
      items: string[];
      screenshot: string;
    };
    performances: {
      title: string;
      description: string;
      items: string[];
      screenshot: string;
    };
  };
  usage: {
    title: string;
    badge: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  banner: {
    text: string;
  };
  stats: Array<{
    value: string;
    label: string;
    suffix?: string;
  }>;
}

export interface NavbarContent {
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
}

export interface FooterContent {
  about: {
    title: string;
    tagline: string;
    description: string;
  };
  quickLinks: {
    title: string;
    items: Array<{
      label: string;
      link: string;
    }>;
  };
  appFeatures: {
    title: string;
    items: Array<{
      label: string;
      link: string;
    }>;
  };
  contact: {
    title: string;
    email: string;
    emailLabel: string;
    socialLabel: string;
  };
  legal: {
    copyright: string;
    privacy: string;
    terms: string;
    privacyLink: string;
    termsLink: string;
  };
  social: {
    linkedin: string;
    instagram: string;
    tiktok: string;
  };
}

export interface FeaturesContent {
  hero: {
    title: string;
    description: string;
  };
  performanceTracking: {
    title: string;
    description: string;
    items: string[];
    ctaText: string;
    imageSrc: string;
    imageAlt: string;
  };
  socialNetwork: {
    title: string;
    description: string;
    items: string[];
    ctaText: string;
    imageSrc: string;
    imageAlt: string;
  };
  whyGearConnect: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  keyFeatures: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface FAQContent {
  hero: {
    title: string;
    description: string;
  };
  questions: Array<{
    question: string;
    answer: string;
  }>;
  help: {
    title: string;
    description: string;
    contactButton: string;
    downloadButton: string;
    contactLink: string;
    downloadLink: string;
  };
}

export interface ContactContent {
  hero: {
    title: string;
    description: string;
  };
  form: {
    title: string;
    description: string;
    submitButton: string;
    fields: {
      firstName: {
        label: string;
        placeholder: string;
      };
      lastName: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      vehicle: {
        label: string;
        placeholder: string;
      };
      subject: {
        label: string;
        placeholder: string;
        options: Array<{
          value: string;
          label: string;
        }>;
      };
      message: {
        label: string;
        placeholder: string;
      };
      privacy: {
        label: string;
      };
    };
  };
  info: {
    title: string;
    description: string;
    email: {
      title: string;
      address: string;
      description: string;
    };
    social: {
      title: string;
    };
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    text: string;
    buttonText: string;
    link: string;
  };
}

// Helper function to load YAML files
function loadYAML<T>(filename: string, lang: string = 'en'): T {
  const filePath = path.join(process.cwd(), 'src', 'content', lang, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents) as T;
}

// Content loaders with language support
export function getHomeContent(lang: string = 'en'): HomeContent {
  return loadYAML<HomeContent>('home.yaml', lang);
}

export function getNavbarContent(lang: string = 'en'): NavbarContent {
  return loadYAML<NavbarContent>('navbar.yaml', lang);
}

export function getFooterContent(lang: string = 'en'): FooterContent {
  return loadYAML<FooterContent>('footer.yaml', lang);
}

export function getFeaturesContent(lang: string = 'en'): FeaturesContent {
  return loadYAML<FeaturesContent>('features.yaml', lang);
}

export function getFAQContent(lang: string = 'en'): FAQContent {
  return loadYAML<FAQContent>('faq.yaml', lang);
}

export function getContactContent(lang: string = 'en'): ContactContent {
  return loadYAML<ContactContent>('contact.yaml', lang);
}

export interface PrivacyContent {
  hero: {
    title: string;
    description: string;
  };
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export interface TermsContent {
  hero: {
    title: string;
    description: string;
  };
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export function getPrivacyContent(lang: string = 'en'): PrivacyContent {
  return loadYAML<PrivacyContent>('privacy.yaml', lang);
}

export function getTermsContent(lang: string = 'en'): TermsContent {
  return loadYAML<TermsContent>('terms.yaml', lang);
}
