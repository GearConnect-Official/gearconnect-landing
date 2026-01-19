import "../styles";

// Import components
import FeaturesHero from "../components/feature/FeaturesHero";
import FeatureSection from "../components/feature/FeatureSection";
import FeaturesCta from "../components/feature/FeaturesCta";

import { getFeaturesContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";

export default async function Features() {
  const lang = await getLanguage();
  const content = getFeaturesContent(lang);

  return (
    <main>
      {/* Hero Section */}
      <FeaturesHero 
        title={content.hero.title} 
        description={content.hero.description} 
      />

      {/* App Available Notice */}
      <section className="py-6 sm:py-8 bg-light-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-l-4 p-4 sm:p-6 rounded-r-lg shadow-md border-brand">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm sm:text-base font-medium text-secondary">
                  <strong className="text-brand">{content.notice.label}:</strong> {content.notice.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <div className="features-grid-container">
          {/* Feature 1 - Performance Tracking */}
          <FeatureSection
            title={content.performanceTracking.title}
            description={content.performanceTracking.description}
            features={content.performanceTracking.items}
            ctaText={content.performanceTracking.ctaText}
            imageSrc={content.performanceTracking.imageSrc}
            imageAlt={content.performanceTracking.imageAlt}
          />

          {/* Feature 2 - Community Discovery */}
          <FeatureSection
            title={content.socialNetwork.title}
            description={content.socialNetwork.description}
            features={content.socialNetwork.items}
            ctaText={content.socialNetwork.ctaText}
            imageSrc={content.socialNetwork.imageSrc}
            imageAlt={content.socialNetwork.imageAlt}
            reverse={true}
          />
        </div>
      </section>

      {/* Why GearConnect */}
      <section className="py-12 sm:py-16 md:py-20 bg-grey-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 break-words text-primary">{content.whyGearConnect.title}</h2>
            <p className="text-base sm:text-lg md:text-xl font-medium max-w-3xl mx-auto break-words text-secondary">
              {content.whyGearConnect.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {content.whyGearConnect.items.map((item, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out text-center">
                <div className={`${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-[#E53935]' : 'bg-green-500'} text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 transform hover:scale-110 transition-transform duration-300`}>
                  {item.icon === 'target' && '🎯'}
                  {item.icon === 'rocket' && '🚀'}
                  {item.icon === 'handshake' && '🤝'}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 break-words text-primary">{item.title}</h3>
                <p className="text-sm sm:text-base font-medium break-words text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 break-words text-primary">{content.keyFeatures.title}</h2>
            <p className="text-base sm:text-lg md:text-xl font-medium max-w-3xl mx-auto break-words text-secondary">
              {content.keyFeatures.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {content.keyFeatures.items.map((item, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="bg-[#FFF5F5] w-12 h-12 rounded-full flex items-center justify-center text-[#E53935] font-bold mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                  {item.icon === 'phone' && '📱'}
                  {item.icon === 'chart' && '📊'}
                  {item.icon === 'calendar' && '🎉'}
                  {item.icon === 'briefcase' && '💼'}
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-2 break-words text-primary">{item.title}</h3>
                <p className="text-xs sm:text-sm font-medium break-words text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <FeaturesCta
        title={content.cta.title}
        description={content.cta.description}
        buttonText={content.cta.buttonText}
      />
    </main>
  );
} 