// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: Schedule
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/Schedule

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SchedulePage } from '../../../apps/student-portal/src/features/Schedule/Schedule.page';

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