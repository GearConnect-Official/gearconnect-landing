
interface ContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    firstName: {
      label: string;
      placeholder: string;
    };
    lastName: {
      label: string;
      placeholder: string;
    };
    email: {
      label: string;
      placeholder: string;
    };
    vehicle: {
      label: string;
      placeholder: string;
    };
    subject: {
      label: string;
      placeholder: string;
      options: Array<{
        value: string;
        label: string;
      }>;
    };
    message: {
      label: string;
      placeholder: string;
    };
    privacy: {
      label: string;
    };
  };
}

export default function ContactForm({ title, description, submitButtonText, fields }: ContactFormProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 break-words text-primary">
        {title}
      </h2>
      <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 md:mb-8 break-words text-secondary">
        {description}
      </p>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
              {fields.firstName.label}
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] transition-all duration-200 contact-input border-grey text-primary"
              placeholder={fields.firstName.placeholder}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
              {fields.lastName.label}
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] transition-all duration-200 contact-input border-grey text-primary"
              placeholder={fields.lastName.placeholder}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
            {fields.email.label}
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] transition-all duration-200 contact-input border-grey text-primary"
            placeholder={fields.email.placeholder}
          />
        </div>
        
        <div>
          <label htmlFor="vehicle" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
            {fields.vehicle.label}
          </label>
          <input
            type="text"
            id="vehicle"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] transition-all duration-200 contact-input border-grey text-primary"
            placeholder={fields.vehicle.placeholder}
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
            {fields.subject.label}
          </label>
          <select
            id="subject"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] bg-white transition-all duration-200 contact-input border-grey text-primary"
          >
            {fields.subject.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
            {fields.message.label}
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] transition-all duration-200 contact-input border-grey text-primary"
            placeholder={fields.message.placeholder}
          ></textarea>
        </div>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            className="mt-1 h-4 w-4 focus:ring-[#E53935] rounded transition-all duration-200 contact-checkbox border-grey"
          />
          <label htmlFor="privacy" className="ml-2 block text-xs sm:text-sm font-medium break-words text-secondary">
            {fields.privacy.label}
          </label>
        </div>
        
        <button
          type="submit"
          className="bg-[#E53935] text-white hover:bg-[#C62828] py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out whitespace-nowrap"
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
} 