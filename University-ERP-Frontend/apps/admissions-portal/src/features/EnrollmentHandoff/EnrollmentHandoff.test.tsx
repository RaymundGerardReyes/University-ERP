import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EnrollmentHandoffPage } from './EnrollmentHandoff.page';

describe('EnrollmentHandoffPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <EnrollmentHandoffPage />
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});