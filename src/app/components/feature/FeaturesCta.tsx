import Link from 'next/link';

interface FeatureCtaProps {
  title: string;
  description: string;
  buttonText: string;
}

export default function FeaturesCta({ title, description, buttonText }: FeatureCtaProps) {
  return (
    <section className="features-cta">
      <div className="features-cta-container">
        <h2 className="features-cta-title">
          {title}
        </h2>
        <p className="features-cta-description">
          {description}
        </p>
        <div className="features-cta-button-container">
          <Link
            href="/#download"
            className="features-cta-button hover:scale-105 transition-all duration-300 ease-out"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
} 