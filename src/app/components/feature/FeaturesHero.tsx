
interface HeroProps {
  title: string;
  description: string;
}

export default function FeaturesHero({ title, description }: HeroProps) {
  return (
    <section className="features-hero">
      <div className="features-hero-container">
        <h1 className="features-hero-title">
          {title}
        </h1>
        <p className="features-hero-description">
          {description}
        </p>
      </div>
    </section>
  );
} 