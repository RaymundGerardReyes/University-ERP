// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: CrossEnrollment
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/CrossEnrollment

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CrossEnrollmentPage } from '../../../apps/student-portal/src/features/CrossEnrollment/CrossEnrollment.page';

describe('CrossEnrollmentPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <CrossEnrollmentPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('CrossEnrollment Workspace')).toBeDefined();
    });
});