// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: OfficialGrades
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { OfficialGradesPage } from '../../../apps/registrar-portal/src/features/AcademicRecordsDivision/OfficialGrades.page';

describe('OfficialGradesPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <OfficialGradesPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});
