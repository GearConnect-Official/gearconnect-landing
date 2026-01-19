import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
}

interface ContactFaqProps {
  title: string;
  faqItems: FaqItem[];
  ctaText: string;
  ctaButtonText: string;
}

export default function ContactFaq({ title, faqItems, ctaText, ctaButtonText }: ContactFaqProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-grey-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 break-words text-primary">
          {title}
        </h2>
        
        <div className="grid gap-4 sm:gap-6 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border-l-4 min-w-0 border-brand">
              <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 break-words text-primary">
                  {item.question}
                </h3>
                <p className="text-sm sm:text-base font-medium break-words leading-relaxed text-secondary">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-base sm:text-lg md:text-xl font-medium mb-4 sm:mb-6 break-words text-secondary">
            {ctaText}
          </p>
          <Link
            href="/#download"
            className="inline-flex items-center bg-[#E53935] text-white hover:bg-[#C62828] py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out whitespace-nowrap"
          >
            {ctaButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
} 