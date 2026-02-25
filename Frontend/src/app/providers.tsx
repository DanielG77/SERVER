// src/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { TournamentsProvider } from '../context/TournamentsContext';
import { GamesProvider } from '../context/GamesContext';
import { CategoriesProvider } from '../context/CategoriesContext';
import { AuthProvider } from '../context/AuthContext';

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
            <AuthProvider>
                <TournamentsProvider>
                    <GamesProvider>
                        <CategoriesProvider>
                            {children}
                        </CategoriesProvider>
                    </GamesProvider>
                </TournamentsProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
