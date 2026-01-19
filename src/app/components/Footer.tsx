import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  content: {
    about: {
      title: string;
      tagline: string;
      description: string;
    };
    quickLinks: {
      title: string;
      items: Array<{
        label: string;
        link: string;
      }>;
    };
    appFeatures: {
      title: string;
      items: Array<{
        label: string;
        link: string;
      }>;
    };
    contact: {
      title: string;
      email: string;
      emailLabel: string;
      socialLabel: string;
    };
    legal: {
      copyright: string;
      privacy: string;
      terms: string;
      privacyLink: string;
      termsLink: string;
    };
    social: {
      linkedin: string;
      instagram: string;
      tiktok: string;
    };
  };
}

export default function Footer({ content }: FooterProps) {
  
  return (
    <footer style={{ backgroundColor: '#F7F8F9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Image 
                src="/logo.png" 
                alt="GearConnect Logo" 
                width={48} 
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
              />
              <h3 className="text-base sm:text-lg font-semibold break-words" style={{ color: '#1E232C' }}>{content.about.title}</h3>
            </div>
            <p className="text-xs sm:text-sm mb-2 font-medium break-words" style={{ color: '#474C54' }}>
              {content.about.tagline}
            </p>
            <p className="text-xs sm:text-sm font-medium break-words" style={{ color: '#474C54' }}>
              {content.about.description}
            </p>
          </div>
          
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4 break-words" style={{ color: '#1E232C' }}>{content.quickLinks.title}</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {content.quickLinks.items.map((item, index) => (
                <li key={index} className="break-words">
                  <Link href={item.link} className="font-medium hover:text-[#E53935] transition-colors duration-300 ease-out break-words" style={{ color: '#474C54' }}>
                    {item.label}
                </Link>
              </li>
              ))}
            </ul>
          </div>
          
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4 break-words" style={{ color: '#1E232C' }}>{content.appFeatures.title}</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {content.appFeatures.items.map((item, index) => (
                <li key={index} className="break-words">
                  <Link href={item.link} className="font-medium hover:text-[#E53935] transition-colors duration-300 ease-out break-words" style={{ color: '#474C54' }}>
                    {item.label}
              </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4 break-words" style={{ color: '#1E232C' }}>{content.contact.title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="font-medium hover:text-[#E53935] transition-colors duration-300 ease-out" style={{ color: '#474C54' }}>
                  {content.contact.emailLabel}
                </Link>
              </li>
              <li className="font-medium" style={{ color: '#474C54' }}>
                {content.contact.email}
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href={content.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#E53935' }} className="hover:text-[#C62828] transform hover:scale-110 transition-all duration-300 ease-out">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href={content.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#E53935' }} className="hover:text-[#C62828] transform hover:scale-110 transition-all duration-300 ease-out">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href={content.social.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: '#E53935' }} className="hover:text-[#C62828] transform hover:scale-110 transition-all duration-300 ease-out">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between gap-4" style={{ borderColor: '#DAE0E6' }}>
          <p className="text-xs sm:text-sm font-medium break-words" style={{ color: '#474C54' }}>
            &copy; {new Date().getFullYear()} {content.legal.copyright}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 md:mt-0">
            <Link href={content.legal.privacyLink} className="text-xs sm:text-sm font-medium hover:text-[#E53935] transition-colors duration-300 ease-out whitespace-nowrap" style={{ color: '#474C54' }}>
              {content.legal.privacy}
            </Link>
            <Link href={content.legal.termsLink} className="text-xs sm:text-sm font-medium hover:text-[#E53935] transition-colors duration-300 ease-out whitespace-nowrap" style={{ color: '#474C54' }}>
              {content.legal.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 