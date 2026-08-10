import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CrossEnrollmentDivisionPage } from './CrossEnrollmentDivision.page';

describe('CrossEnrollmentDivisionPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <CrossEnrollmentDivisionPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('CrossEnrollmentDivision Workspace')).toBeDefined();
    });
});