import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdmissionsDecisionPage } from './AdmissionsDecision.page';

describe('AdmissionsDecisionPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <AdmissionsDecisionPage />
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});