// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: EnrollmentValidation
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { EnrollmentValidationPage } from '../../../apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentValidation.page';

describe('EnrollmentValidationPage', () => {
    it('renders successfully', () => {
        const queryClient = new QueryClient();
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EnrollmentValidationPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(container).toBeDefined();
    });
});
