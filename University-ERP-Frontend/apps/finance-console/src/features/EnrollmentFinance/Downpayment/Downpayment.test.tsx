import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DownpaymentPage } from './Downpayment.page';

describe('DownpaymentPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <DownpaymentPage />
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});