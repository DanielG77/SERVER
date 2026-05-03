import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useTournamentSearch } from '../hooks/useTournamentSearch';
import { TournamentSearchResultResponse } from '../services/tournamentSearchService';

export interface UnifiedSearchProps {
    variant?: 'navbar' | 'page';
    placeholder?: string;
    onResultSelect?: (result: TournamentSearchResultResponse) => void;
    onSubmit?: (query: string) => void;
    maxResults?: number;
    containerClassName?: string;
    showViewAllButton?: boolean;
    debounceMs?: number;
    autoFocus?: boolean;
}

const SearchResultItem: React.FC<{
    result: TournamentSearchResultResponse;
    isHighlighted: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
}> = ({ result, isHighlighted, onClick, onMouseEnter }) => (
    <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={`w-full text-left px-4 py-3 border-b border-white/10 last:border-b-0 transition-colors cursor-pointer ${isHighlighted ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-cyan-500/10 text-white/90'}`}
        role="option"
        aria-selected={isHighlighted}
    >
        <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm md:text-base">{result.name}</p>
                <p className="text-xs text-white/60 truncate">{result.game} • {result.maxPlayers} jugadores</p>
            </div>
            <span className="text-xs text-cyan-400 flex-shrink-0 ml-2">→</span>
        </div>
    </button>
);

export const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
    variant = 'navbar',
    placeholder = 'Busca torneos, juegos...',
    onResultSelect,
    onSubmit,
    maxResults = 8,
    containerClassName = '',
    showViewAllButton = true,
    debounceMs = 300,
    autoFocus = false,
}) => {
    const { query, results, isLoading, error, isEmpty, hasSearched, setQuery, search, clear } = useTournamentSearch({
        debounceMs,
        minChars: 1,
        autoSearch: true,
    });

    const searchRef = useRef<HTMLFormElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const displayResults = results.slice(0, maxResults);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowDropdown(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!showDropdown && e.key !== 'Enter') return;
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setShowDropdown(true);
                    setHighlightedIndex((prev) => (prev < displayResults.length - 1 ? prev + 1 : prev));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (highlightedIndex >= 0 && displayResults[highlightedIndex]) {
                        handleSelectResult(displayResults[highlightedIndex]);
                    } else if (query.trim()) {
                        handleSubmit();
                    }
                    break;
                default:
                    break;
            }
        },
        [showDropdown, highlightedIndex, displayResults, query]
    );

    const handleSelectResult = useCallback(
        (result: TournamentSearchResultResponse) => {
            if (onResultSelect) onResultSelect(result);
            setShowDropdown(false);
            setHighlightedIndex(-1);
        },
        [onResultSelect]
    );

    const handleSubmit = useCallback(
        (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if (query.trim() && onSubmit) onSubmit(query);
        },
        [query, onSubmit]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newQuery = e.target.value;
            setQuery(newQuery);
            setHighlightedIndex(-1);
            setShowDropdown(newQuery.trim() ? true : false);
        },
        [setQuery]
    );

    const handleInputFocus = useCallback(() => {
        if (query.trim() || results.length > 0) setShowDropdown(true);
    }, [query, results]);

    const containerClass = variant === 'navbar' ? 'w-full max-w-md' : 'w-full';
    const inputClass = variant === 'navbar' ? 'px-4 py-2 text-sm' : 'px-4 py-3 text-base';

    return (
        <form onSubmit={handleSubmit} ref={searchRef} className={`relative ${containerClass} ${containerClassName}`}>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 text-lg z-10">⚡</span>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className={`w-full ${inputClass} pl-10 pr-10 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder:text-white/50 transition-all`}
                    aria-label="Buscar torneos"
                    aria-describedby="search-status"
                    aria-expanded={showDropdown}
                    aria-autocomplete="list"
                    role="combobox"
                    autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-lg">
                    {isLoading ? (
                        <span className="inline-block animate-spin">⟳</span>
                    ) : query ? (
                        <button
                            type="button"
                            onClick={() => {
                                clear();
                                setQuery('');
                                setShowDropdown(false);
                            }}
                            className="hover:text-cyan-300 transition-colors cursor-pointer"
                            aria-label="Limpiar búsqueda"
                        >
                            ✕
                        </button>
                    ) : null}
                </div>
            </div>

            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden z-40" role="listbox">
                    <div id="search-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                        {isLoading && 'Buscando...'}
                        {isEmpty && `No hay resultados para "${query}"`}
                        {displayResults.length > 0 && `${displayResults.length} resultado${displayResults.length !== 1 ? 's' : ''} disponible${displayResults.length !== 1 ? 's' : ''}`}
                    </div>

                    {isLoading && (
                        <div className="px-4 py-6 text-center text-gray-400">
                            <div className="inline-block animate-spin mb-2">⟳</div>
                            <p className="text-sm">Buscando torneos...</p>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="px-4 py-4 bg-red-500/10 border-b border-red-500/20 text-red-300 text-sm">{error}</div>
                    )}

                    {isEmpty && (
                        <div className="px-4 py-6 text-center text-gray-400">
                            <p className="text-sm mb-2">No hay resultados</p>
                            <p className="text-xs text-white/40">Intenta con otras palabras clave</p>
                        </div>
                    )}

                    {!isLoading && displayResults.length > 0 && (
                        <>
                            <div role="option">
                                {displayResults.map((result, idx) => (
                                    <SearchResultItem
                                        key={result.id}
                                        result={result}
                                        isHighlighted={highlightedIndex === idx}
                                        onClick={() => handleSelectResult(result)}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                    />
                                ))}
                            </div>
                            {showViewAllButton && results.length > maxResults && (
                                <button type="submit" className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500/40 hover:to-cyan-600/40 text-cyan-300 text-sm font-medium transition-all">
                                    Ver todos los resultados ({results.length})
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </form>
    );
};

export default UnifiedSearch;
