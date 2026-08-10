import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AcademicSchedulingDivisionPage } from './AcademicSchedulingDivision.page';

describe('AcademicSchedulingDivisionPage', () => {
    it('renders the standard title', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <AcademicSchedulingDivisionPage />
            </QueryClientProvider>
        );
        expect(screen.getByText('AcademicSchedulingDivision Workspace')).toBeDefined();
    });
});