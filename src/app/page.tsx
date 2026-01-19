import Link from "next/link";
import { getHomeContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";
import ScreenshotCarousel from "./components/ScreenshotCarousel";
import AppScreenshot from "./components/AppScreenshot";
import PlayStoreStats from "./components/PlayStoreStats";
import AnimatedBanner from "./components/AnimatedBanner";
import StatsBar from "./components/StatsBar";

export default async function Home() {
  const lang = await getLanguage();
  const content = getHomeContent(lang);

  // Screenshots for carousel
  const heroScreenshots = [
    { src: content.features.feed.screenshot, alt: "Social Feed", title: "Social Feed" },
    { src: content.features.events.screenshot, alt: "Events", title: "Events" },
    { src: content.features.performances.screenshot, alt: "Performances", title: "Performances" },
  ];

  return (
    <main>
      {/* Animated Banner */}
      <AnimatedBanner text={content.banner.text} />
      
      {/* Hero Section - Visual with App Screenshot Carousel */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFF5F5] overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#E53935] opacity-5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C62828] opacity-5 rounded-full blur-3xl animate-float animation-delay-1s"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 bg-gradient-to-r from-[#1E232C] via-[#E53935] to-[#1E232C] bg-clip-text text-transparent animate-gradient break-words">
                {content.hero.title}
          </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 font-bold break-words page-hero-subtitle">
                {content.hero.subtitle}
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 font-medium break-words page-hero-description">
                {content.hero.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link 
                  href={content.hero.primaryButtonLink} 
                  className="group inline-block bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 ease-out text-center animate-pulse-glow relative overflow-hidden whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="truncate">{content.hero.primaryButton}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
            <Link 
                  href={content.hero.secondaryButtonLink} 
                  className="inline-block bg-white border-2 border-[#E53935] text-[#E53935] hover:bg-[#FFF5F5] hover:border-[#C62828] font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out text-center whitespace-nowrap"
            >
                  <span className="truncate">{content.hero.secondaryButton}</span>
            </Link>
              </div>
            </div>
            
            {/* Right: App Screenshot Carousel */}
            <div className="hidden lg:block order-1 lg:order-2 animate-fade-in-up relative z-10 animation-delay-0-2s animation-fill-both">
              <div className="transform hover:scale-105 transition-transform duration-500 ease-out animate-float">
                <ScreenshotCarousel screenshots={heroScreenshots} />
              </div>
          </div>
          
            {/* Mobile: App Screenshot Carousel */}
            <div className="lg:hidden order-1 mb-4 sm:mb-6 animate-fade-in-up relative z-10">
              <ScreenshotCarousel screenshots={heroScreenshots} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar stats={content.stats} />

      {/* Features Section - Visual with Screenshots */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E53935] to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm sm:text-base font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-light-red text-brand">
                {content.features.title}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 break-words text-primary">
              {content.features.subtitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto break-words text-secondary">
              {content.features.description}
            </p>
          </div>
          
          {/* Feature 1: Social Feed */}
          <div className="mb-12 sm:mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[320px] aspect-[9/19] bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                  <AppScreenshot 
                    src={content.features.feed.screenshot}
                    alt={content.features.feed.title}
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left lg:pl-0 min-w-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words text-primary">{content.features.feed.title}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 font-medium break-words text-secondary">
                {content.features.feed.description}
              </p>
              <ul className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto lg:mx-0 text-secondary">
                {content.features.feed.items.map((item, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm md:text-base hover:text-[#1E232C] transition-colors duration-200 break-words">
                    <span className="text-[#E53935] mr-2 flex-shrink-0 font-bold">•</span>
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Feature 2: Events */}
          <div className="mb-12 sm:mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1 lg:pr-0 min-w-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words text-primary">{content.features.events.title}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 font-medium break-words text-secondary">
                {content.features.events.description}
              </p>
              <ul className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto lg:mx-0 text-secondary">
                {content.features.events.items.map((item, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm md:text-base hover:text-[#1E232C] transition-colors duration-200 break-words">
                    <span className="text-[#E53935] mr-2 flex-shrink-0 font-bold">•</span>
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[320px] aspect-[9/19] bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                  <AppScreenshot 
                    src={content.features.events.screenshot}
                    alt={content.features.events.title}
                  />
                </div>
              </div>
            </div>
              </div>
              
          {/* Feature 3: Performances */}
          <div className="mb-12 sm:mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[320px] aspect-[9/19] bg-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                  <AppScreenshot 
                    src={content.features.performances.screenshot}
                    alt={content.features.performances.title}
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left lg:pl-0 min-w-0">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words text-primary">{content.features.performances.title}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 font-medium break-words text-secondary">
                {content.features.performances.description}
              </p>
              <ul className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto lg:mx-0 text-secondary">
                {content.features.performances.items.map((item, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm md:text-base hover:text-[#1E232C] transition-colors duration-200 break-words">
                    <span className="text-[#E53935] mr-2 flex-shrink-0 font-bold">•</span>
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative py-20 sm:py-24 md:py-32 bg-gradient-to-br from-[#E53935] via-[#D32F2F] to-[#C62828] text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float animation-delay-1-5s"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-block mb-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-4 py-2 rounded-full border border-white/30">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {content.download.badge}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 animate-fade-in-up leading-tight break-words">
            {content.download.title}
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 text-white/90 font-semibold animate-fade-in-up break-words animation-delay-0-1s">
            {content.download.subtitle}
          </p>
          <p className="text-base sm:text-lg md:text-xl mb-12 sm:mb-16 text-white/80 font-medium animate-fade-in-up break-words animation-delay-0-2s">
            {content.download.description}
          </p>
          
          {/* Download Button */}
          <div className="flex justify-center items-center animate-fade-in-up animation-delay-0-3s">
            <a 
              href="https://play.google.com/store/apps/details?id=com.gearconnect.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-block transition-all duration-300 transform hover:scale-110 ease-out"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt={content.download.androidButton}
                className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-2xl"
              />
            </a>
            </div>
            
          {/* Play Store Stats */}
          <PlayStoreStats />
            
          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-white/70 text-sm sm:text-base animate-fade-in-up animation-delay-0-4s">
            {content.download.trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{indicator.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Usage Section */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-grey-50">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E53935] to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm sm:text-base font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-light-red text-brand">
                {content.usage.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 break-words text-primary">{content.usage.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {content.usage.items.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out border-l-4 min-w-0 border-brand"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#E53935] to-[#C62828] rounded-xl flex items-center justify-center mb-3 sm:mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg flex-shrink-0">
                  {feature.icon === 'user' && (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {feature.icon === 'network' && (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {feature.icon === 'briefcase' && (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 group-hover:text-[#E53935] transition-colors duration-300 break-words text-primary">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed break-words text-secondary">
                  {feature.description}
                </p>
            </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
