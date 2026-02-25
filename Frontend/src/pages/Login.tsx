// src/pages/Login.tsx
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    validateLoginCredentials,
    validateRegistrationCredentials,
    validateEmail,
    validatePassword,
    validateUsername,
    ValidationError,
    formatServerError,
} from '../utils/validation';
import { apiRegister, AuthError } from '../services/auth';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Mode state
    const [mode, setMode] = useState<'login' | 'register'>('login');

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState<string>('');
    const [loginFieldErrors, setLoginFieldErrors] = useState<ValidationError[]>([]);

    // Register form state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerError, setRegisterError] = useState<string>('');
    const [registerFieldErrors, setRegisterFieldErrors] = useState<ValidationError[]>([]);

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Get field error for display
    const getFieldError = (field: string, errors: ValidationError[]): string | null => {
        return errors.find((e) => e.field === field)?.message || null;
    };

    // Handle login submission
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginFieldErrors([]);
        setIsLoading(true);

        try {
            // Validate form
            const errors = validateLoginCredentials(loginEmail, loginPassword);
            if (errors.length > 0) {
                setLoginFieldErrors(errors);
                setIsLoading(false);
                return;
            }

            // Attempt login
            await login({ email: loginEmail, password: loginPassword });
            navigate('/home');
        } catch (err) {
            const errorMessage = formatServerError(err);
            setLoginError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle register submission
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError('');
        setRegisterFieldErrors([]);
        setIsLoading(true);

        try {
            // Validate form
            const errors = validateRegistrationCredentials(
                registerUsername,
                registerEmail,
                registerPassword,
                registerConfirmPassword
            );
            if (errors.length > 0) {
                setRegisterFieldErrors(errors);
                setIsLoading(false);
                return;
            }

            // Attempt registration
            await apiRegister({
                username: registerUsername,
                email: registerEmail,
                password: registerPassword,
            });

            // Auto-login after successful registration
            await login({ email: registerEmail, password: registerPassword });
            navigate('/home');
        } catch (err) {
            const authError = err as AuthError;
            const errorMessage = authError.message || 'Registration failed. Please try again.';
            setRegisterError(errorMessage);

            // If there are field-level errors, display them
            if (authError.details) {
                const fieldErrors: ValidationError[] = Object.entries(authError.details).map(
                    ([field, message]) => ({
                        field,
                        message: typeof message === 'string' ? message : String(message),
                    })
                );
                setRegisterFieldErrors(fieldErrors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Reset forms when switching modes
    const switchMode = (newMode: 'login' | 'register') => {
        setMode(newMode);
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
        setLoginFieldErrors([]);
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setRegisterError('');
        setRegisterFieldErrors([]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-96">
                {/* Mode Tabs */}
                <div className="flex mb-6 border-b">
                    <button
                        onClick={() => switchMode('login')}
                        className={`flex-1 py-2 px-4 font-semibold transition ${mode === 'login'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => switchMode('register')}
                        className={`flex-1 py-2 px-4 font-semibold transition ${mode === 'register'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Login Form */}
                {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit}>
                        <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

                        {loginError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {loginError}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Correo Electrónico o Usuario
                            </label>
                            <input
                                type="text"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                onBlur={() => {
                                    const error = validateEmail(loginEmail);
                                    if (error) {
                                        setLoginFieldErrors([
                                            ...loginFieldErrors.filter((e) => e.field !== 'email'),
                                            error,
                                        ]);
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${getFieldError('email', loginFieldErrors)
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="usuario@example.com"
                            />
                            {getFieldError('email', loginFieldErrors) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getFieldError('email', loginFieldErrors)}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500`}
                                placeholder="••••••••"
                            />
                            {getFieldError('password', loginFieldErrors) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getFieldError('password', loginFieldErrors)}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                )}

                {/* Register Form */}
                {mode === 'register' && (
                    <form onSubmit={handleRegisterSubmit}>
                        <h2 className="text-2xl font-bold mb-6">Registrarse</h2>

                        {registerError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {registerError}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Nombre de Usuario</label>
                            <input
                                type="text"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                onBlur={() => {
                                    const error = validateUsername(registerUsername);
                                    if (error) {
                                        setRegisterFieldErrors([
                                            ...registerFieldErrors.filter((e) => e.field !== 'username'),
                                            error,
                                        ]);
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${getFieldError('username', registerFieldErrors)
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="usuario123"
                            />
                            {getFieldError('username', registerFieldErrors) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getFieldError('username', registerFieldErrors)}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                onBlur={() => {
                                    const error = validateEmail(registerEmail);
                                    if (error) {
                                        setRegisterFieldErrors([
                                            ...registerFieldErrors.filter((e) => e.field !== 'email'),
                                            error,
                                        ]);
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${getFieldError('email', registerFieldErrors)
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="usuario@example.com"
                            />
                            {getFieldError('email', registerFieldErrors) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getFieldError('email', registerFieldErrors)}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                onBlur={() => {
                                    const error = validatePassword(registerPassword);
                                    if (error) {
                                        setRegisterFieldErrors([
                                            ...registerFieldErrors.filter((e) => e.field !== 'password'),
                                            error,
                                        ]);
                                    }
                                }}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${getFieldError('password', registerFieldErrors)
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="••••••••"
                            />
                            {getFieldError('password', registerFieldErrors) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getFieldError('password', registerFieldErrors)}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                value={registerConfirmPassword}
                                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${getFieldError('confirmPassword', registerFieldErrors)
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="••••••••"
                            />
                            {getFieldError('confirmPassword', registerFieldErrors) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {getFieldError('confirmPassword', registerFieldErrors)}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;