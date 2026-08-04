// Identity Portal Bootstrap
// This portal IS the auth provider — it must NOT use AuthProvider (which would cause a redirect loop).
// It uses a minimal bootstrap with only QueryClientProvider.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@university-erp/shell-kit';
import { Routing } from '@shell/Routing';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Routing />
    </QueryClientProvider>
  </React.StrictMode>
);
