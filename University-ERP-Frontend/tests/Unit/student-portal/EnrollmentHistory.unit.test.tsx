// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: EnrollmentHistory
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/EnrollmentHistory

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EnrollmentHistoryPage } from '../../../apps/student-portal/src/features/EnrollmentHistory/EnrollmentHistory.page';

describe('EnrollmentHistoryPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <EnrollmentHistoryPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('EnrollmentHistory Workspace')).toBeDefined();
    });
});