'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorCode, ErrorType, logError } from '@/lib/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

/**
 * Error Boundary component aligned with the mobile app's ErrorBoundary
 * Catches uncaught JavaScript errors and displays a fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const appError = new AppError(
      ErrorCode.UNKNOWN_ERROR,
      ErrorType.UNKNOWN,
      error.message,
      error
    );

    return {
      hasError: true,
      error: appError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = new AppError(
      ErrorCode.UNKNOWN_ERROR,
      ErrorType.UNKNOWN,
      error.message,
      error,
      { componentStack: errorInfo.componentStack }
    );

    logError(appError, 'ErrorBoundary');
    this.props.onError?.(appError);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && fallback) {
      return fallback;
    }

    if (hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Oups ! Une erreur est survenue
            </h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'Une erreur inattendue est survenue'}
            </p>
            <button
              onClick={this.resetError}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
