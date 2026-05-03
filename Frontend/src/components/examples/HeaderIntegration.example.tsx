/**
 * EXAMPLE: UnifiedSearch integration in Header
 * 
 * Copy this to your Header component where SearchBar was used.
 */

import { useNavigate } from 'react-router-dom';
import UnifiedSearch from '../UnifiedSearch';

export const HeaderSearchExample = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 max-w-md">
            <UnifiedSearch
                variant="navbar"
                placeholder="Busca torneos, juegos..."
                onResultSelect={(result) => {
                    navigate(`/shop/${result.id}`);
                }}
                onSubmit={(query) => {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                }}
                maxResults={6}
                debounceMs={300}
                showViewAllButton={true}
            />
        </div>
    );
};

/*
 * Replace SearchBar with UnifiedSearch in Header.tsx:
 * 
 * BEFORE:
 *   <SearchBar showInNavbar={true} />
 * 
 * AFTER:
 *   <UnifiedSearch
 *     variant="navbar"
 *     placeholder="Busca torneos, juegos..."
 *     onResultSelect={(result) => navigate(`/shop/${result.id}`)}
 *     onSubmit={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
 *     maxResults={6}
 *   />
 */
