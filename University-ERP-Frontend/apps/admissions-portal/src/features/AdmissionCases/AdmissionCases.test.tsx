import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdmissionCasesPage } from './AdmissionCases.page';

describe('AdmissionCasesPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <AdmissionCasesPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('AdmissionCases Workspace')).toBeDefined();
    });
});