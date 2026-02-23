// src/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { TournamentsProvider } from '@/contexts/TournamentsContext';
import { GamesProvider } from '@/contexts/GamesContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <TournamentsProvider>
                <GamesProvider>
                    <CategoriesProvider>
                        {children}
                    </CategoriesProvider>
                </GamesProvider>
            </TournamentsProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
