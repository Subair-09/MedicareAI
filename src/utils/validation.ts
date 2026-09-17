/**
 * Strict Email Validation utility.
 * Enforces RFC 5322 compliance, rejecting invalid formats such as consecutive dots
 * (e.g. jon..mathew@gmail.com), leading/trailing periods, whitespace, or invalid domains.
 */
export function validateEmailStrict(email: string): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email address cannot exceed 254 characters.' };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'Email address cannot contain spaces.' };
  }

  // Explicit check for consecutive dots anywhere in email (e.g., jon..mathew@gmail.com)
  if (trimmed.includes('..')) {
    return { isValid: false, error: 'Email cannot contain consecutive dots (..).' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address with a single @ symbol.' };
  }

  const [local, domain] = parts;

  if (!local || local.length === 0) {
    return { isValid: false, error: 'Email username cannot be empty.' };
  }

  if (local.length > 64) {
    return { isValid: false, error: 'Email username cannot exceed 64 characters.' };
  }

  if (local.startsWith('.') || local.endsWith('.')) {
    return { isValid: false, error: 'Email username cannot start or end with a period.' };
  }

  // Local part strict: alphanumeric start/end, allowed single separators in between
  const localRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*$/;
  if (!localRegex.test(local)) {
    return { isValid: false, error: 'Email username contains invalid characters or consecutive dots.' };
  }

  if (!domain || domain.length === 0) {
    return { isValid: false, error: 'Email domain is required.' };
  }

  if (domain.startsWith('.') || domain.endsWith('.')) {
    return { isValid: false, error: 'Email domain cannot start or end with a period.' };
  }

  if (domain.startsWith('-') || domain.endsWith('-')) {
    return { isValid: false, error: 'Email domain cannot start or end with a hyphen.' };
  }

  // Domain part strict: valid labels separated by single dots, TLD at least 2 alpha characters
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return { isValid: false, error: 'Please enter a valid email domain (e.g., gmail.com).' };
  }

  return { isValid: true };
}
