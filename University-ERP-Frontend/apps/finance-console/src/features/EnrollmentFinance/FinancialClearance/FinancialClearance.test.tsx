import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinancialClearancePage } from './FinancialClearance.page';

describe('FinancialClearancePage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <FinancialClearancePage />
            </QueryClientProvider>
        );
        expect(screen.getByText('Financial Clearance')).toBeDefined();
    });
});