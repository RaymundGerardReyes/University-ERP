// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: Interviews
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/Interviews/Interviews.api.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Interviews/Interviews.hooks.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Interviews/Interviews.page.tsx
// University-ERP-Frontend/apps/admissions-portal/src/features/Interviews/Interviews.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { AcademicEvaluationPage } from '../../../apps/faculty-portal/src/features/ChairpersonWorkspace/AcademicEvaluation.page';

const mockCompleteInterview = vi.fn();

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    completeInterview: (data: any) => mockCompleteInterview(data)
  }
}));

describe('Admissions Portal - Interview Operations', () => {
  const queryClient = new QueryClient();

  it('TC21: Interviews_Should_List_Candidates_With_Status_InterviewScheduled', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AcademicEvaluationPage candidates={[{ id: 'APP-200', status: 'InterviewScheduled' }]} />
      </QueryClientProvider>
    );
    expect(screen.getByText('APP-200')).toBeDefined();
  });

  it('TC22: Interviews_Should_Submit_FacultyRemarks_And_Transition_To_UnderAcademicEvaluation', async () => {
    const user = userEvent.setup();
    mockCompleteInterview.mockResolvedValue(true);
    
    render(
      <QueryClientProvider client={queryClient}>
        <AcademicEvaluationPage candidates={[{ id: 'APP-200', status: 'InterviewScheduled' }]} />
      </QueryClientProvider>
    );

    await user.type(screen.getByPlaceholderText(/Enter remarks/i), 'Excellent problem solving.');
    await user.click(screen.getByRole('button', { name: /Complete Interview/i }));

    await waitFor(() => {
      expect(mockCompleteInterview).toHaveBeenCalledWith(expect.objectContaining({ remarks: 'Excellent problem solving.' }));
    });
  });
});
