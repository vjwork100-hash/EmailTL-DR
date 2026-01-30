
import { ERROR_MESSAGES, API_CONFIG } from '../constants.ts';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmailThread = (thread: string): ValidationResult => {
  const trimmed = thread.trim();
  
  if (trimmed.length < API_CONFIG.MIN_EMAIL_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL_LENGTH };
  }
  
  if (trimmed.length > API_CONFIG.MAX_EMAIL_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL_LENGTH };
  }
  
  const hasEmailMarkers = trimmed.includes('From:') || trimmed.includes('To:') || trimmed.includes('Subject:');
  if (!hasEmailMarkers) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL_FORMAT };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? { isValid: true } : { isValid: false, error: 'Invalid email format' };
};
