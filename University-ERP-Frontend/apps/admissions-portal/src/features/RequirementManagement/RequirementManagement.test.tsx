import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RequirementManagementPage } from './RequirementManagement.page';

describe('RequirementManagementPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <RequirementManagementPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('RequirementManagement Workspace')).toBeDefined();
    });
});