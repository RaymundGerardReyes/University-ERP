import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurriculumProgressPage } from './CurriculumProgress.page';

describe('CurriculumProgressPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <CurriculumProgressPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('CurriculumProgress Workspace')).toBeDefined();
    });
});