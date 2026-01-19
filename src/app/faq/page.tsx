import Link from "next/link";
import { getFAQContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";

export default async function FAQ() {
  const lang = await getLanguage();
  const content = getFAQContent(lang);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 break-words">
            {content.hero.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 font-medium break-words">
            {content.hero.description}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8">
            {content.questions.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-6 md:p-8 border-l-4 shadow-md hover:shadow-lg transform hover:-translate-x-1 transition-all duration-300 ease-out min-w-0 border-brand">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 break-words text-primary">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base font-medium leading-relaxed break-words text-secondary">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-[#FFF5F5] rounded-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 break-words text-primary">
                {content.help.title}
              </h3>
              <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 break-words text-secondary">
                {content.help.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link 
                  href={content.help.contactLink} 
                  className="bg-[#E53935] hover:bg-[#C62828] text-white py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ease-out text-center whitespace-nowrap"
                >
                  {content.help.contactButton}
                </Link>
                <Link 
                  href={content.help.downloadLink} 
                  className="bg-white text-[#E53935] border-2 border-[#E53935] hover:bg-[#FFF5F5] hover:border-[#C62828] py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ease-out text-center whitespace-nowrap"
                >
                  {content.help.downloadButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 