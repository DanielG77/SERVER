// src/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { TournamentsProvider } from '../context/TournamentsContext';
import { GamesProvider } from '../context/GamesContext';
import { CategoriesProvider } from '../context/CategoriesContext';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

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
                <NotificationProvider>
                    <TournamentsProvider>
                        <GamesProvider>
                            <CategoriesProvider>
                                {children}
                            </CategoriesProvider>
                        </GamesProvider>
                    </TournamentsProvider>
                </NotificationProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
