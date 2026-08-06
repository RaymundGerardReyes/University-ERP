import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@university-erp/auth-sdk';
import React from 'react';
import { Routing } from './shell/Routing';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </QueryClientProvider>
  );
};
