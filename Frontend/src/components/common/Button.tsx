import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    as?: React.ElementType; // ← Añade esta línea
    to?: string; // ← Añade esta línea para react-router
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    fullWidth = false,
    className = '',
    disabled,
    as: Component = 'button', // ← Manejo de la prop 'as'
    to,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
        outline: 'bg-transparent border border-gray-700 text-gray-300 hover:border-primary hover:text-primary',
        ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`;

    // Si Component no es 'button', renderizamos ese componente
    if (Component !== 'button') {
        return (
            <Component
                className={buttonClasses}
                to={to}
                {...(props as any)}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {icon && !loading && <span className="mr-2">{icon}</span>}
                {children}
            </Component>
        );
    }

    // Renderizado normal para button
    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {icon && !loading && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;