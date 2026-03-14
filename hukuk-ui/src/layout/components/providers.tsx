'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from '@/layout/context/AuthContext';
import { LayoutProvider } from '@/layout/context/layoutcontext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 },
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <PrimeReactProvider value={{ ripple: true }}>
                <AuthProvider>
                    <LayoutProvider>
                        {children}
                    </LayoutProvider>
                </AuthProvider>
            </PrimeReactProvider>
        </QueryClientProvider>
    );
}
