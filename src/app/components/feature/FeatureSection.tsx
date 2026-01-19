import Image from 'next/image';
import Link from 'next/link';

interface FeatureSectionProps {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function FeatureSection({ 
  title, 
  description, 
  features, 
  ctaText, 
  imageSrc, 
  imageAlt, 
  reverse = false 
}: FeatureSectionProps) {
  return (
    <div className={`${reverse ? "feature-row-reverse" : "feature-row"} animate-fade-in-up`}>
      <div className={reverse ? "feature-content-right" : "feature-content"}>
        <h2 className="feature-title">{title}</h2>
        <p className="feature-description">{description}</p>
        <ul className="feature-list">
          {features.map((feature, index) => (
            <li key={index} className="feature-list-item">
              <svg
                className="feature-list-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="feature-list-text">{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/#download" className="feature-cta">
          {ctaText}
        </Link>
      </div>
      <div className="feature-image-container">
        <div className="feature-image-wrapper">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
} 