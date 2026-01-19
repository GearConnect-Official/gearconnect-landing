"use client";

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLoaded) {
      setError('Système de connexion non prêt. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    try {
      // Connexion avec Clerk
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        // Activer la session
        await setActive({ session: result.createdSessionId });
        
        // Synchroniser avec le backend
        try {
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            console.warn('Backend sync failed, but login succeeded');
          }
        } catch (syncError) {
          console.warn('Backend sync error:', syncError);
        }

        // Rediriger vers le dashboard
        router.push('/dashboard');
      } else {
        setError('La connexion n\'a pas pu être complétée. Veuillez réessayer.');
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage || 
        err.errors?.[0]?.message || 
        'Erreur lors de la connexion. Vérifiez vos identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 sm:py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.png" 
              alt="GearConnect Logo" 
              width={60} 
              height={60}
              className="w-15 h-15"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">
            Connexion
          </h1>
          <p className="text-center mb-8 text-secondary">
            Connectez-vous à votre compte GearConnect
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-primary">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey auth-input"
                placeholder="votre@email.com"
                disabled={loading || !isLoaded}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-primary">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey auth-input"
                placeholder="••••••••"
                disabled={loading || !isLoaded}
              />
            </div>

            <div className="flex items-center justify-between">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-[#E53935] hover:text-[#C62828] font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className="text-[#E53935] hover:text-[#C62828] font-semibold">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
