const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string, label: string): string {
  return value.trim() ? "" : `${label} is required`;
}

export function validateEmail(value: string): string {
  if (!value.trim()) return "Email is required";
  return EMAIL_PATTERN.test(value.trim()) ? "" : "Enter a valid email address";
}

export function validatePassword(value: string): string {
  if (!value) return "Password is required";
  return value.length >= 6 ? "" : "Password must be at least 6 characters";
}

export function validatePhone(value: string): string {
  if (!value.trim()) return "Mobile number is required";
  return /^[6-9]\d{9}$/.test(value.trim())
    ? ""
    : "Enter a valid 10-digit mobile number";
}

export function validatePostalCode(value: string): string {
  if (!value.trim()) return "PIN code is required";
  return /^\d{6}$/.test(value.trim()) ? "" : "Enter a valid 6-digit PIN code";
}
