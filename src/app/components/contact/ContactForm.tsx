"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface ContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  loginRequired: string;
  loginLink: string;
  loginButton: string;
  successMessage: string;
  errorMessage: string;
  fields: {
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

export default function ContactForm({ 
  title, 
  description, 
  submitButtonText,
  loginRequired,
  loginLink,
  loginButton,
  successMessage,
  errorMessage,
  fields 
}: ContactFormProps) {
  const { isLoaded, isSignedIn } = useUser();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    privacy: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.subject || !formData.message.trim()) {
      setError('Subject and message are required');
      return;
    }

    if (!formData.privacy) {
      setError('You must agree to the privacy policy');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || errorMessage);
        return;
      }

      setSuccess(true);
      setFormData({
        subject: '',
        message: '',
        privacy: false,
      });
    } catch (err) {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 break-words text-primary">
          {title}
        </h2>
        <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 md:mb-8 break-words text-secondary">
          {description}
        </p>
        <div className="text-center py-8">
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 break-words text-primary">
          {title}
        </h2>
        <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 md:mb-8 break-words text-secondary">
          {description}
        </p>
        <div className="bg-[#FFF5F5] border border-[#E53935] rounded-lg p-6 mb-6">
          <p className="text-primary mb-4 break-words">
            {loginRequired}
          </p>
          <Link
            href={loginLink}
            className="inline-block bg-[#E53935] text-white hover:bg-[#C62828] py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out whitespace-nowrap"
          >
            {loginButton}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 break-words text-primary">
          {title}
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <p className="text-green-800 break-words">{successMessage}</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-block bg-[#E53935] text-white hover:bg-[#C62828] py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out whitespace-nowrap"
        >
          View in Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 break-words text-primary">
        {title}
      </h2>
      <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 md:mb-8 break-words text-secondary">
        {description}
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 break-words">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm sm:text-base font-medium mb-2 break-words text-secondary">
            {fields.subject.label}
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] bg-white transition-all duration-200 contact-input border-grey"
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
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E53935] focus:border-[#E53935] transition-all duration-200 contact-input border-grey"
            placeholder={fields.message.placeholder}
          ></textarea>
        </div>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            checked={formData.privacy}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 focus:ring-[#E53935] rounded transition-all duration-200 contact-checkbox border-grey"
          />
          <label htmlFor="privacy" className="ml-2 block text-xs sm:text-sm font-medium break-words text-secondary">
            {fields.privacy.label}
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-[#E53935] text-white hover:bg-[#C62828] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out whitespace-nowrap"
        >
          {loading ? 'Sending...' : submitButtonText}
        </button>
      </form>
    </div>
  );
}
