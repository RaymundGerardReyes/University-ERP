// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: AcademicRecordInitialization
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AcademicRecordInitializationPage } from '../../../apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicRecordInitialization.page';

describe('AcademicRecordInitializationPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AcademicRecordInitializationPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});
