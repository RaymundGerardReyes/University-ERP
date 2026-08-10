import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchedulePage } from './Schedule.page';

describe('SchedulePage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <SchedulePage />
            </QueryClientProvider>
        );
        expect(screen.getByText('Schedule Workspace')).toBeDefined();
    });
});