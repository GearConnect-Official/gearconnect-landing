
interface ContactHeroProps {
  title: string;
  description: string;
}

export default function ContactHero({ title, description }: ContactHeroProps) {
  return (
    <section className="bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6 break-words">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto text-white/95 font-medium break-words">
          {description}
        </p>
      </div>
    </section>
  );
} 