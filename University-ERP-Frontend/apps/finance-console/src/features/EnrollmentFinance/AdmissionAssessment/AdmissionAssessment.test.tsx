import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdmissionAssessmentPage } from './AdmissionAssessment.page';

describe('AdmissionAssessmentPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <AdmissionAssessmentPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('Admission Assessment')).toBeDefined();
    });
});