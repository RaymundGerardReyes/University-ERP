// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: CourseOfferings
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CourseOfferingsPage } from '../../../apps/registrar-portal/src/features/CurriculumDivision/CourseOfferings.page';

describe('CourseOfferingsPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseOfferingsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});
