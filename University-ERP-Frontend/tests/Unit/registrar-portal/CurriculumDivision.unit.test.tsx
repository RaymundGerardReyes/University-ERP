import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CourseOfferingsPage } from '../../../apps/registrar-portal/src/features/CurriculumDivision/CourseOfferings.page';
import { CurriculumDivisionPage } from '../../../apps/registrar-portal/src/features/CurriculumDivision/CurriculumDivision.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'reg-1', roles: ['Registrar'] } })
}));

vi.mock('@university-erp/api-clients', () => ({
  registrarCurriculumApi: {
    getAllPrograms: vi.fn().mockResolvedValue([
      { programId: 'p1', code: 'BSCS', name: 'BS in Computer Science', college: 'CCS', totalUnits: 145, yearsToComplete: 4, isActive: true },
      { programId: 'p2', code: 'BSA', name: 'BS in Accountancy', college: 'CBA', totalUnits: 173, yearsToComplete: 4, isActive: true }
    ]),
    getCurriculumByProgram: vi.fn().mockResolvedValue({
      curriculumId: 'c1',
      programId: 'p1',
      programCode: 'BSCS',
      programName: 'BS in Computer Science',
      academicYear: '2024-2025',
      version: '1.0',
      status: 'Active',
      totalUnits: 145,
      years: []
    }),
    getSubjectCatalog: vi.fn().mockResolvedValue([
      { id: '1', code: 'CS101', title: 'Intro to Computing', units: 3, department: 'Computer Science', status: 'Core', description: 'Intro course' }
    ]),
    togglePrerequisite: vi.fn().mockResolvedValue(true),
    updateMasterData: vi.fn().mockResolvedValue(true),
  }
}));

describe("CurriculumDivision - Unit Testing", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders curriculum course offerings heading", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOfferingsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  it("renders CurriculumDivisionPage with academic programs and subject catalog tabs", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CurriculumDivisionPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Curriculum Management/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Academic Programs/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Subject Catalog/i })).toBeInTheDocument();
      expect(screen.getByText('BSCS')).toBeInTheDocument();
      expect(screen.getByText('BSA')).toBeInTheDocument();
    });
  });
});
