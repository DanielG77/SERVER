import React, { useState, useRef, useEffect } from 'react';

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (query: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
    suggestions?: Array<{ id: string; name: string }>;
    onSuggestionClick?: (suggestion: { id: string; name: string }) => void;
    showInNavbar?: boolean;
    className?: string;
}

/**
 * COMPONENTE REUTILIZABLE: SearchInput
 * 
 * Propósito: Input de búsqueda "dumb" que SOLO envía texto natural
 * 
 * Características:
 * - No hace lógica de parsing
 * - No transforma la query
 * - Solo captura input y lo envía tal cual
 * - Soporta suggestions (opcional)
 * - Funciona en navbar o full-width
 * 
 * USO EN HEADER:
 * <SearchInput 
 *   value={query} 
 *   onChange={setQuery}
 *   onSubmit={(q) => search(q)}
 *   showInNavbar
 * />
 * 
 * USO EN SHOP:
 * <SearchInput 
 *   value={query} 
 *   onChange={setQuery}
 *   onSubmit={(q) => search(q)}
 *   placeholder="p.ej. Dota 2 barato este fin de semana..."
 * />
 */
export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onSubmit,
    placeholder = 'Busca torneos...',
    isLoading = false,
    disabled = false,
    suggestions = [],
    onSuggestionClick,
    showInNavbar = false,
    className = '',
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Cerrar suggestions al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: { id: string; name: string }) => {
        onSuggestionClick?.(suggestion);
        setShowSuggestions(false);
    };

    // NAVBAR version: minimal, inline
    if (showInNavbar) {
        return (
            <div ref={searchRef} className={`relative w-full max-w-xs ${className}`}>
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={placeholder}
                        disabled={disabled || isLoading}
                        className="w-full px-4 py-2 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all disabled:opacity-50"
                        aria-label="Buscar torneos"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400">🔍</span>

                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                                </svg>
                            </div>
                        </div>
                    )}
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && value.trim() && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden z-40">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-cyan-500/20 transition-colors text-white/90 text-sm border-b border-white/10 last:border-b-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span>{suggestion.name}</span>
                                    <span className="text-xs text-cyan-400">→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // FULL-WIDTH version: para SearchPage o Shop
    return (
        <div ref={searchRef} className={`w-full ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={placeholder}
                        disabled={disabled || isLoading}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                        aria-label="Buscar torneos"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin">
                                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && value.trim() && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-40">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-800 text-sm border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-center justify-between">
                                    <span>{suggestion.name}</span>
                                    <span className="text-xs text-gray-400">→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};
