import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchTournaments, TournamentSearchResult } from '../hooks/useSearchTournaments';
import { SearchInput } from './SearchInput';
import { AlertCircle, Loader } from 'lucide-react';

interface ShopSearchBarProps {
    onSearch?: (results: TournamentSearchResult[]) => void;
    onError?: (error: string) => void;
}

export const ShopSearchBar: React.FC<ShopSearchBarProps> = ({ onSearch, onError }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const { results, isLoading, error, search: aiSearch } = useSearchTournaments();

    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🔁 Debounce búsqueda
    React.useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!searchQuery.trim()) return;

        debounceRef.current = setTimeout(() => {
            aiSearch(searchQuery);
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery, aiSearch]);

    // ❌ Manejo de errores
    React.useEffect(() => {
        if (error) {
            console.error('🔴 Search Error:', error);
            onError?.(error);
        }
    }, [error, onError]);

    // ✅ Resultados
    React.useEffect(() => {
        if (results.length > 0) {
            console.log('✅ Search Results:', {
                count: results.length,
                topResult: results[0]?.name,
                aiInterpretation: results[0]?.aiInterpretation,
                aiConfidence: results[0]?.aiConfidence
            });
            onSearch?.(results);
        }
    }, [results, onSearch]);

    const handleSubmit = (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        console.log('🔍 Submitting AI search:', { query: trimmed });
        aiSearch(trimmed);
    };

    const handleSuggestionClick = (suggestion: { id: string; name: string }) => {
        navigate(`/shop/${suggestion.id}`);
    };

    const suggestions = results.slice(0, 5).map(r => ({
        id: r.id,
        name: r.name
    }));

    return (
        <div className="w-full space-y-3">
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                placeholder="p.ej. Dota 2 barato online este fin de semana..."
                className="w-full"
            />

            {/* ❌ Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* 📊 Resultados */}
            {results.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                    <Loader size={18} className="flex-shrink-0 animate-spin" />
                    <span className="text-sm">
                        Encontrados <strong>{results.length}</strong> torneos con IA
                        {results[0]?.aiInterpretation && (
                            <> · Interpretación: "{results[0].aiInterpretation}"</>
                        )}
                    </span>
                </div>
            )}

            {/* 🔬 Debug */}
            {import.meta.env.DEV && results.length > 0 && (
                <details className="text-xs text-gray-600 p-2 bg-gray-50 rounded border border-gray-200">
                    <summary className="cursor-pointer font-mono">🔬 Debug Info</summary>
                    <pre className="mt-2 font-mono overflow-auto max-h-32">
                        {JSON.stringify({
                            query: searchQuery,
                            resultsCount: results.length,
                            topResult: results[0] ? {
                                name: results[0].name,
                                game: results[0].game,
                                aiInterpretation: results[0].aiInterpretation,
                                aiConfidence: results[0].aiConfidence?.toFixed(2),
                                score: results[0].score?.toFixed(1)
                            } : null
                        }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};
