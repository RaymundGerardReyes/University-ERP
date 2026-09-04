// Test Type: Unit Testing
//
// Portal: registrar-portal
// Feature: TransferDivision
//
// Source References:
// University-ERP-Frontend/apps/registrar-portal/src/features/TransferDivision

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TransferDivisionPage } from '../../../apps/registrar-portal/src/features/TransferDivision/TransferDivision.page';

describe('TransferDivisionPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <TransferDivisionPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('TransferDivision Workspace')).toBeDefined();
    });
});