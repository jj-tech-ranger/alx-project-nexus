// Simple validation functions - can be replaced with Zod/Yup for more complex projects

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
}

export const validatePhone = (phone: string): boolean => {
  // Kenya phone format: +254XXXXXXXXX or 0XXXXXXXXX
  const phoneRegex = /^(\+254|0)[17][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validatePostalCode = (code: string): boolean => {
  return code.length >= 2 && code.length <= 10
}

export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return Boolean(value)
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

export const validateNumber = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value)
}

export const validatePositiveNumber = (value: unknown): boolean => {
  return validateNumber(value) && (value as number) > 0
}

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

// Form validation helper
export interface ValidationError {
  field: string
  message: string
}

export const validateFormData = (
  data: Record<string, unknown>,
  rules: Record<string, ((value: unknown) => boolean)[]>,
): ValidationError[] => {
  const errors: ValidationError[] = []

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    for (const rule of fieldRules) {
      if (!rule(value)) {
        errors.push({
          field,
          message: `Validation failed for ${field}`,
        })
        break
      }
    }
  }

  return errors
}

// API Error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown): { message: string; code: string } => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  }
}
