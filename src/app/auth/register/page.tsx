"use client";

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (!username || username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères.');
      return;
    }

    setLoading(true);

    if (!isLoaded) {
      setError('Système d\'inscription non prêt. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    try {
      // Inscription avec Clerk
      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      // Si l'email doit être vérifié
      if (result.status === 'missing_requirements') {
        setPendingVerification(true);
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      } else if (result.status === 'complete') {
        // Si pas besoin de vérification, activer directement
        await setActive({ session: result.createdSessionId });
        
        // Synchroniser avec le backend
        try {
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username }),
          });

          if (!response.ok) {
            console.warn('Backend sync failed, but registration succeeded');
          }
        } catch (syncError) {
          console.warn('Backend sync error:', syncError);
        }

        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage || 
        err.errors?.[0]?.message || 
        'Erreur lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLoaded) {
      setError('Système de vérification non prêt. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        
        // Synchroniser avec le backend
        try {
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username }),
          });

          if (!response.ok) {
            console.warn('Backend sync failed, but registration succeeded');
          }
        } catch (syncError) {
          console.warn('Backend sync error:', syncError);
        }

        router.push('/dashboard');
      } else {
        setError('Le code de vérification est incorrect.');
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage || 
        err.errors?.[0]?.message || 
        'Code de vérification invalide. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 sm:py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-xl p-8 sm:p-10">
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

            <h1 className="text-3xl font-bold text-center mb-2 text-primary">
              Vérification Email
            </h1>
            <p className="text-center mb-8 text-secondary">
              Nous avons envoyé un code de vérification à {email}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-semibold mb-2 text-primary">
                  Code de vérification
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors text-center text-2xl tracking-widest border-grey"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading || !isLoaded}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={async () => {
                  if (signUp) {
                    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                  }
                }}
                className="text-sm text-[#E53935] hover:text-[#C62828] font-medium"
              >
                Renvoyer le code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Créer un compte
          </h1>
          <p className="text-center mb-8 text-secondary">
            Rejoignez la communauté GearConnect
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
              <label htmlFor="username" className="block text-sm font-semibold mb-2 text-primary">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey"
                placeholder="johndoe"
                disabled={loading || !isLoaded}
              />
            </div>

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
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey"
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
                minLength={8}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey"
                placeholder="••••••••"
                disabled={loading || !isLoaded}
              />
              <p className="mt-1 text-xs text-tertiary">Au moins 8 caractères</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-primary">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey"
                placeholder="••••••••"
                disabled={loading || !isLoaded}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Déjà un compte ?{' '}
              <Link href="/auth/login" className="text-[#E53935] hover:text-[#C62828] font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
