// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: CurriculumProgress
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/CurriculumProgress

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurriculumProgressPage } from '../../../apps/student-portal/src/features/CurriculumProgress/CurriculumProgress.page';

describe('CurriculumProgressPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <CurriculumProgressPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('CurriculumProgress Workspace')).toBeDefined();
    });
});