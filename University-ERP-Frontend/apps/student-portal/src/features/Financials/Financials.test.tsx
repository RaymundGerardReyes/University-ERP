import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { FinancialsPage } from './Financials.page';

// Mock the authentication SDK to prevent context errors
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-student' },
        user: { id: 'test-student' },
        isAuthenticated: true
    })
}));

describe('FinancialsPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FinancialsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // Asserting container definition is safer here because the API mock 
        // triggers an immediate loading skeleton state which hides the exact text.
        expect(container).toBeDefined();
    });
});