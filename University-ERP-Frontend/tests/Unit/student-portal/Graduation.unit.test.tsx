// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: Graduation
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/Graduation

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GraduationPage } from '../../../apps/student-portal/src/features/Graduation/Graduation.page';

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