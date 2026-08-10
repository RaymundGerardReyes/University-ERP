import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RegistrarDashboardPage } from './RegistrarDashboard.page';

describe('RegistrarDashboardPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <RegistrarDashboardPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('RegistrarDashboard Workspace')).toBeDefined();
    });
});