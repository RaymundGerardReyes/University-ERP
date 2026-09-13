// Test Type: Unit Testing
//
// Portal: student-portal
// Feature: CurriculumProgress
//
// Source References:
// University-ERP-Frontend/apps/student-portal/src/features/CurriculumProgress

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CurriculumProgressPage } from '../../../apps/student-portal/src/features/CurriculumProgress/CurriculumProgress.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    identity: { id: 'STU-001', name: 'John Doe', programCode: 'BSCS' },
    user: { id: 'STU-001', name: 'John Doe' }
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({
      data: {
        studentId: 'STU-001',
        programId: 'BSCS',
        totalCreditsRequired: 145,
        creditsCompleted: 30,
        creditsInProgress: 18,
        gpa: 3.75,
        completedSubjects: ['CS101', 'GE101'],
        currentlyRegisteredCourses: ['CS102'],
        graduationEligibilityStatus: 'PENDING_REVIEW'
      }
    })
  },
  registrarCurriculumApi: {
    getCurriculumByProgram: vi.fn().mockResolvedValue({
      curriculumId: 'cur-1',
      programCode: 'BSCS',
      programName: 'Bachelor of Science in Computer Science',
      academicYear: '2024-2025',
      version: '1.0',
      status: 'Active',
      totalUnits: 145,
      years: [
        {
          yearLevel: 1,
          semesters: [
            {
              semester: 'First',
              totalUnits: 20,
              subjects: [
                { subjectId: 's1', code: 'CS101', title: 'Intro to Computing', units: 3, department: 'CCS', subjectType: 'Core', isElective: false, prerequisiteCodes: [] }
              ]
            }
          ]
        }
      ]
    })
  }
}));

describe('CurriculumProgressPage', () => {
    it('renders the curriculum progress page with degree completion status', async () => {
        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={queryClient}>
                <CurriculumProgressPage />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Curriculum Progress')).toBeDefined();
            expect(screen.getByText('Degree Completion')).toBeDefined();
        });
    });
});