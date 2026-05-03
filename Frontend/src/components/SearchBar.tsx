import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchTournaments } from '../hooks/useSearchTournaments';
import { SearchInput } from './SearchInput';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    isLoading?: boolean;
    showInNavbar?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    isLoading: externalLoading = false,
    showInNavbar = false
}) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const {
        results,
        isLoading: aiLoading,
        error,
        search: aiSearch
    } = useSearchTournaments();

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce AI search
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!searchQuery.trim()) return;

        debounceTimerRef.current = setTimeout(() => {
            aiSearch(searchQuery);
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery, aiSearch]);

    const handleSubmit = (query: string) => {
        if (!query.trim()) return;

        aiSearch(query);

        if (onSearch) {
            onSearch(query);
        } else {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (suggestion: { id: string; name: string }) => {
        navigate(`/shop/${suggestion.id}`);
    };

    const suggestions = results.slice(0, 5).map(result => ({
        id: result.id,
        name: result.name
    }));

    return (
        <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSubmit}
            isLoading={aiLoading || externalLoading}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            showInNavbar={showInNavbar}
            placeholder={
                showInNavbar
                    ? "Busca torneos con IA..."
                    : "p.ej. torneos de Dota baratos este fin de semana..."
            }
        />
    );
};
