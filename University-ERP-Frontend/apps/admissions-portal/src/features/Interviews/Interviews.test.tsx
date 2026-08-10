import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InterviewsPage } from './Interviews.page';

describe('InterviewsPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <InterviewsPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('Interviews Workspace')).toBeDefined();
    });
});