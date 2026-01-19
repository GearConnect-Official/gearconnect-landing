// Import components
import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import ContactFaq from "../components/contact/ContactFaq";
import { getContactContent } from "@/lib/content";
import { getLanguage } from "@/lib/get-language";

export default async function Contact() {
  const lang = await getLanguage();
  const content = getContactContent(lang);

  return (
    <main>
      {/* Hero Section */}
      <ContactHero 
        title={content.hero.title} 
        description={content.hero.description} 
      />

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="contact-section mx-auto px-4 sm:px-6 lg:px-8">
          <div className="contact-grid">
            <div className="contact-column">
              <ContactForm 
                title={content.form.title}
                description={content.form.description}
                submitButtonText={content.form.submitButton}
                loginRequired={content.form.loginRequired}
                loginLink={content.form.loginLink}
                loginButton={content.form.loginButton}
                successMessage={content.form.successMessage}
                errorMessage={content.form.errorMessage}
                fields={content.form.fields}
              />
            </div>
            
            <div className="contact-column">
              <ContactInfo 
                title={content.info.title}
                description={content.info.description}
                email={content.info.email}
                social={content.info.social}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <ContactFaq 
        title={content.faq.title}
        faqItems={content.faq.items}
        ctaText={content.cta.text}
        ctaButtonText={content.cta.buttonText}
      />
    </main>
  );
} 