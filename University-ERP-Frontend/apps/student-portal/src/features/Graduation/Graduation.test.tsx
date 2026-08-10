import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GraduationPage } from './Graduation.page';

describe('GraduationPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <GraduationPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('Graduation Workspace')).toBeDefined();
    });
});