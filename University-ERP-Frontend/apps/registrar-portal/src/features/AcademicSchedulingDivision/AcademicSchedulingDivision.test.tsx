import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AcademicSchedulingDivisionPage } from './AcademicSchedulingDivision.page';

describe('AcademicSchedulingDivisionPage', () => {
    it('renders the scheduling workspace header and calendar grid', () => {
        const queryClient = new QueryClient();
        
        render(
            <QueryClientProvider client={queryClient}>
                <AcademicSchedulingDivisionPage />
            </QueryClientProvider>
        );
        
        // 1. Verify the new PageHeader title exists
        expect(screen.getByText('Academic Scheduling Workspace')).toBeDefined();
        
        // 2. Verify the visual calendar grid renders the days of the week
        expect(screen.getByText('Monday')).toBeDefined();
        expect(screen.getByText('Wednesday')).toBeDefined();
        expect(screen.getByText('Friday')).toBeDefined();
        
        // 3. Verify the conflict detection badge renders for the mocked overlapping class
        expect(screen.getByText('Conflict')).toBeDefined();
    });
});