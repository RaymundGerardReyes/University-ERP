// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: BrowseCourses
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/Registration

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { BrowseCoursesPage } from '../../../apps/student-portal/src/features/Registration/BrowseCourses.page';

// Mock the authentication SDK to prevent context errors
vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'test-student' },
        user: { id: 'test-student' },
        isAuthenticated: true
    })
}));

describe('BrowseCoursesPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BrowseCoursesPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});
