import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EnrollmentPaymentPage } from './EnrollmentPayment.page';

describe('EnrollmentPaymentPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <EnrollmentPaymentPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('Enrollment Payment')).toBeDefined();
    });
});