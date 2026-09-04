// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: RequirementManagement
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/RequirementManagement

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RequirementManagementPage } from '../../../apps/admissions-portal/src/features/RequirementManagement/RequirementManagement.page';

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