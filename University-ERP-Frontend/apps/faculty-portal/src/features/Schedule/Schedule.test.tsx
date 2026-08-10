import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SchedulePage } from './Schedule.page';

// Mock the authentication SDK to prevent context errors
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'faculty-user' },
        user: { id: 'faculty-user' },
        isAuthenticated: true
    })
}));

describe('SchedulePage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <SchedulePage />
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});