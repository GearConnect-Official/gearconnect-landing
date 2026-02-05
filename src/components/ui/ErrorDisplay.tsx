'use client';

import React from 'react';
import { AppError, ErrorType, ErrorCode, ERROR_MESSAGES } from '@/lib/errors';

interface ErrorDisplayProps {
  error: AppError | Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

/**
 * Unified error display component aligned with the mobile app's error handling
 */
export function ErrorDisplay({ error, onRetry, onDismiss, compact = false }: ErrorDisplayProps) {
  if (!error) return null;

  const appError = error instanceof AppError
    ? error
    : error instanceof Error
      ? new AppError(ErrorCode.UNKNOWN_ERROR, ErrorType.UNKNOWN, error.message)
      : new AppError(ErrorCode.UNKNOWN_ERROR, ErrorType.UNKNOWN, String(error));

  const getErrorIcon = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return '🌐';
      case ErrorType.AUTH:
        return '🔒';
      case ErrorType.PERMISSION:
        return '⛔';
      case ErrorType.NOT_FOUND:
        return '🔍';
      case ErrorType.VALIDATION:
        return '⚠️';
      case ErrorType.SERVER:
        return '🖥️';
      default:
        return '❌';
    }
  };

  const getErrorColor = () => {
    switch (appError.type) {
      case ErrorType.NETWORK:
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case ErrorType.AUTH:
      case ErrorType.PERMISSION:
        return 'border-orange-500 bg-orange-50 text-orange-800';
      case ErrorType.NOT_FOUND:
        return 'border-blue-500 bg-blue-50 text-blue-800';
      case ErrorType.VALIDATION:
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default:
        return 'border-red-500 bg-red-50 text-red-800';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded border ${getErrorColor()}`}>
        <span>{getErrorIcon()}</span>
        <span className="text-sm flex-1">{appError.message}</span>
        {onDismiss && (
          <button onClick={onDismiss} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 p-6 ${getErrorColor()}`}>
      <div className="flex items-start gap-4">
        <span className="text-3xl">{getErrorIcon()}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {appError.type === ErrorType.NETWORK && 'Erreur de connexion'}
            {appError.type === ErrorType.AUTH && 'Erreur d\'authentification'}
            {appError.type === ErrorType.PERMISSION && 'Accès refusé'}
            {appError.type === ErrorType.NOT_FOUND && 'Ressource introuvable'}
            {appError.type === ErrorType.VALIDATION && 'Données invalides'}
            {appError.type === ErrorType.SERVER && 'Erreur serveur'}
            {appError.type === ErrorType.UNKNOWN && 'Erreur'}
          </h3>
          <p className="text-sm opacity-80">{appError.message}</p>

          <div className="mt-4 flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-white border border-current rounded hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Réessayer
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline error message for form fields
 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
      <span>⚠️</span>
      {message}
    </p>
  );
}

/**
 * Toast-style error notification
 */
export function ErrorToast({
  error,
  onDismiss,
}: {
  error: AppError | Error | string;
  onDismiss: () => void;
}) {
  const message = error instanceof AppError
    ? error.message
    : error instanceof Error
      ? error.message
      : String(error);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
        <span>❌</span>
        <p className="flex-1 text-sm">{message}</p>
        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ErrorDisplay;
