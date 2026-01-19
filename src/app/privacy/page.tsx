import { getPrivacyContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";

export default async function Privacy() {
  const lang = await getLanguage();
  const content = getPrivacyContent(lang);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 break-words">
            {content.hero.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium break-words">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-10">
            {content.sections.map((section, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 break-words" style={{ color: '#1E232C' }}>
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words" style={{ color: '#474C54' }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
