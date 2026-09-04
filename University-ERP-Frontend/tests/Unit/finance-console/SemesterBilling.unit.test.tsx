// Test Type: Unit Testing
//
// Portal: finance-console
// Feature: SemesterBilling
//
// Source References:
// University-ERP-Frontend/apps/finance-console/src/features/SemesterBilling

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SemesterBillingPage } from '../../../apps/finance-console/src/features/SemesterBilling/SemesterBilling.page';

describe('SemesterBillingPage', () => {
    it('renders the page without crashing', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <SemesterBillingPage />
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});