declare module 'google-play-scraper' {
  interface AppDetails {
    appId: string;
    title: string;
    summary: string;
    installs: string;
    minInstalls: number;
    maxInstalls: number;
    score: number;
    scoreText: string;
    ratings: number;
    reviews: number;
    histogram: { [key: string]: number };
    price: number;
    free: boolean;
    currency: string;
    priceText: string;
    offersIAP: boolean;
    IAPRange: string;
    size: string;
    androidVersion: string;
    androidVersionText: string;
    developer: string;
    developerId: string;
    developerEmail: string;
    developerWebsite: string;
    developerAddress: string;
    privacyPolicy: string;
    genre: string;
    genreId: string;
    icon: string;
    headerImage: string;
    screenshots: string[];
    video: string;
    videoImage: string;
    contentRating: string;
    contentRatingDescription: string;
    adSupported: boolean;
    released: string;
    updated: number;
    version: string;
    recentChanges: string;
    comments: string[];
    url: string;
  }

  interface AppOptions {
    appId: string;
    lang?: string;
    country?: string;
  }

  export function app(options: AppOptions): Promise<AppDetails>;
  export function list(options: { category?: string; collection?: string; num?: number }): Promise<AppDetails[]>;
  export function search(options: { term: string; num?: number }): Promise<AppDetails[]>;
  export function developer(options: { devId: string; num?: number }): Promise<AppDetails[]>;
  export function reviews(options: { appId: string; num?: number }): Promise<{ data: unknown[] }>;

  const gplay: {
    app: typeof app;
    list: typeof list;
    search: typeof search;
    developer: typeof developer;
    reviews: typeof reviews;
  };

  export default gplay;
}
