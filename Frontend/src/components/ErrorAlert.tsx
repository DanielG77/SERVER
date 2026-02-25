// src/components/ErrorAlert.tsx
import React from 'react';

interface ErrorAlertProps {
    message: string | null;
    onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40 animate-in slide-in-from-top">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg">
                <div className="flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{message}</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-red-500 hover:text-red-700 transition"
                            aria-label="Cerrar"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorAlert;
