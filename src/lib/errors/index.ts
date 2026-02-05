/**
 * Unified error handling system aligned with the mobile app
 * Provides consistent error types, messages, and handling across dashboard
 */

// Error types matching the app's error classification
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION = 'PERMISSION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

// Standardized error codes
export enum ErrorCode {
  // Network errors
  NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',

  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',

  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',

  // Permission errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error messages in French (matching app locale)
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_UNAVAILABLE]: 'Connexion réseau indisponible. Vérifiez votre connexion internet.',
  [ErrorCode.TIMEOUT]: 'La requête a expiré. Veuillez réessayer.',
  [ErrorCode.CONNECTION_REFUSED]: 'Impossible de se connecter au serveur.',

  [ErrorCode.UNAUTHORIZED]: 'Vous devez vous connecter pour accéder à cette ressource.',
  [ErrorCode.SESSION_EXPIRED]: 'Votre session a expiré. Veuillez vous reconnecter.',
  [ErrorCode.INVALID_TOKEN]: 'Token d\'authentification invalide.',

  [ErrorCode.INVALID_INPUT]: 'Les données saisies sont invalides.',
  [ErrorCode.MISSING_FIELD]: 'Un champ requis est manquant.',

  [ErrorCode.RESOURCE_NOT_FOUND]: 'La ressource demandée n\'existe pas.',
  [ErrorCode.RESOURCE_CONFLICT]: 'Conflit avec une ressource existante.',

  [ErrorCode.FORBIDDEN]: 'Vous n\'avez pas les droits pour effectuer cette action.',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissions insuffisantes.',

  [ErrorCode.INTERNAL_ERROR]: 'Une erreur interne est survenue. Veuillez réessayer.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Le service est temporairement indisponible.',

  [ErrorCode.UNKNOWN_ERROR]: 'Une erreur inattendue est survenue.',
};

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: ErrorCode;
  public readonly originalError?: unknown;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    type: ErrorType,
    message?: string,
    originalError?: unknown,
    context?: Record<string, unknown>
  ) {
    super(message || ERROR_MESSAGES[code]);
    this.name = 'AppError';
    this.code = code;
    this.type = type;
    this.originalError = originalError;
    this.context = context;
  }
}

// Parse HTTP status to error
export function httpStatusToError(status: number, message?: string): AppError {
  switch (status) {
    case 400:
      return new AppError(ErrorCode.INVALID_INPUT, ErrorType.VALIDATION, message);
    case 401:
      return new AppError(ErrorCode.UNAUTHORIZED, ErrorType.AUTH, message);
    case 403:
      return new AppError(ErrorCode.FORBIDDEN, ErrorType.PERMISSION, message);
    case 404:
      return new AppError(ErrorCode.RESOURCE_NOT_FOUND, ErrorType.NOT_FOUND, message);
    case 409:
      return new AppError(ErrorCode.RESOURCE_CONFLICT, ErrorType.VALIDATION, message);
    case 500:
      return new AppError(ErrorCode.INTERNAL_ERROR, ErrorType.SERVER, message);
    case 503:
      return new AppError(ErrorCode.SERVICE_UNAVAILABLE, ErrorType.SERVER, message);
    default:
      return new AppError(ErrorCode.UNKNOWN_ERROR, ErrorType.UNKNOWN, message);
  }
}

// Parse any error to AppError
export function parseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppError(ErrorCode.NETWORK_UNAVAILABLE, ErrorType.NETWORK, undefined, error);
    }
    if (error.message.includes('timeout')) {
      return new AppError(ErrorCode.TIMEOUT, ErrorType.NETWORK, undefined, error);
    }

    return new AppError(ErrorCode.UNKNOWN_ERROR, ErrorType.UNKNOWN, error.message, error);
  }

  return new AppError(ErrorCode.UNKNOWN_ERROR, ErrorType.UNKNOWN, String(error));
}

// Handle API response errors
export async function handleApiError(response: Response): Promise<never> {
  let message: string | undefined;

  try {
    const data = await response.json();
    message = data.error || data.message;
  } catch {
    // Ignore JSON parse errors
  }

  throw httpStatusToError(response.status, message);
}

// Log error for debugging (can be extended to send to monitoring service)
export function logError(error: AppError, context?: string): void {
  console.error(`[${context || 'App'}] Error:`, {
    type: error.type,
    code: error.code,
    message: error.message,
    context: error.context,
    originalError: error.originalError,
  });
}
