// Test Type: Unit Testing
//
// Portal: faculty-portal
// Feature: SectionRoster
//
// Source References:
// University-ERP-Frontend/apps/faculty-portal/src/features/Teaching

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SectionRosterPage } from '../../../apps/faculty-portal/src/features/Teaching/SectionRoster.page';

describe('SectionRosterPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SectionRosterPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});