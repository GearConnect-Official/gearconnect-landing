"use client";

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLoaded) {
      setError('Système non prêt. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
      });

      // Récupérer l'ID de l'adresse email depuis les identifiants disponibles
      const emailAddressId = result.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'reset_password_email_code'
      )?.emailAddressId;

      if (!emailAddressId) {
        throw new Error('Email address ID not found');
      }

      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        emailAddressId,
      });

      setStep('code');
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        error.errors?.[0]?.longMessage || 
        error.errors?.[0]?.message || 
        'Erreur lors de l\'envoi du code. Vérifiez votre email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoaded || !signIn) {
      setError('Système non prêt. Veuillez réessayer.');
      return;
    }

    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.');
      return;
    }

    setLoading(true);

    try {
      await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });

      setStep('password');
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        error.errors?.[0]?.longMessage || 
        error.errors?.[0]?.message || 
        'Code invalide. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoaded || !signIn) {
      setError('Système non prêt. Veuillez réessayer.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        error.errors?.[0]?.longMessage || 
        error.errors?.[0]?.message || 
        'Erreur lors de la réinitialisation. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

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
            {step === 'email' && 'Mot de passe oublié'}
            {step === 'code' && 'Code de vérification'}
            {step === 'password' && 'Nouveau mot de passe'}
          </h1>
          <p className="text-center mb-8 text-secondary">
            {step === 'email' && 'Entrez votre email pour recevoir un code de réinitialisation'}
            {step === 'code' && `Nous avons envoyé un code à ${email}`}
            {step === 'password' && 'Choisissez un nouveau mot de passe'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Envoi...' : 'Envoyer le code'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-semibold mb-2 text-primary">
                  Code de vérification
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors text-center text-2xl tracking-widest border-grey auth-input"
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

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="text-sm text-[#E53935] hover:text-[#C62828] font-medium"
                >
                  Renvoyer le code
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2 text-primary">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey auth-input"
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
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] transition-colors border-grey auth-input"
                  placeholder="••••••••"
                  disabled={loading || !isLoaded}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-[#E53935] hover:bg-[#C62828] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-[#E53935] hover:text-[#C62828] font-medium">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
