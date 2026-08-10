import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EnrollmentHistoryPage } from './EnrollmentHistory.page';

describe('EnrollmentHistoryPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <EnrollmentHistoryPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('EnrollmentHistory Workspace')).toBeDefined();
    });
});