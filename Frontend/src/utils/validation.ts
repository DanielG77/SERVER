// src/utils/validation.ts

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validates email format
 * @param email Email address to validate
 * @returns Validation error or null if valid
 */
export const validateEmail = (email: string): ValidationError | null => {
    if (!email || email.trim() === '') {
        return { field: 'email', message: 'El correo electrónico es requerido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { field: 'email', message: 'El correo electrónico no es válido' };
    }

    if (email.length > 255) {
        return { field: 'email', message: 'El correo electrónico es demasiado largo (máximo 255 caracteres)' };
    }

    return null;
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Validation error or null if valid
 */
export const validatePassword = (password: string): ValidationError | null => {
    if (!password || password.trim() === '') {
        return { field: 'password', message: 'La contraseña es requerida' };
    }

    if (password.length < 8) {
        return { field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' };
    }

    if (password.length > 128) {
        return { field: 'password', message: 'La contraseña es demasiado larga (máximo 128 caracteres)' };
    }

    // Optional: Check for password strength (at least one uppercase, one lowercase, one number)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return {
            field: 'password',
            message: 'La contraseña debe contener mayúsculas, minúsculas y números',
        };
    }

    return null;
};

/**
 * Validates username format (for registration)
 * @param username Username to validate
 * @returns Validation error or null if valid
 */
export const validateUsername = (username: string): ValidationError | null => {
    if (!username || username.trim() === '') {
        return { field: 'username', message: 'El nombre de usuario es requerido' };
    }

    if (username.length < 3) {
        return { field: 'username', message: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }

    if (username.length > 20) {
        return { field: 'username', message: 'El nombre de usuario no puede exceder 20 caracteres' };
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        return {
            field: 'username',
            message: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos',
        };
    }

    return null;
};

/**
 * Validates login credentials
 * @param email Email/username
 * @param password Password
 * @returns Array of validation errors (empty if all valid)
 */
export const validateLoginCredentials = (email: string, password: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    if (!password || password.trim() === '') {
        errors.push({ field: 'password', message: 'La contraseña es requerida' });
    }

    return errors;
};

/**
 * Validates registration credentials
 * @param username Username
 * @param email Email
 * @param password Password
 * @param confirmPassword Confirm password
 * @returns Array of validation errors (empty if all valid)
 */
export const validateRegistrationCredentials = (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    const usernameError = validateUsername(username);
    if (usernameError) errors.push(usernameError);

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);

    if (!confirmPassword || confirmPassword.trim() === '') {
        errors.push({ field: 'confirmPassword', message: 'La confirmación de contraseña es requerida' });
    } else if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Las contraseñas no coinciden' });
    }

    return errors;
};

/**
 * Extracts server error message from response
 * @param error Error message from server
 * @returns Formatted error message
 */
export const formatServerError = (error: unknown): string => {
    if (typeof error === 'string') {
        return error;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'object' && error !== null) {
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
        if ('error' in error && typeof error.error === 'string') {
            return error.error;
        }
    }

    return 'An error occurred. Please try again.';
};
