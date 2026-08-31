// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: Review
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/Review/Review.api.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Review/Review.hooks.ts
// University-ERP-Frontend/apps/admissions-portal/src/features/Review/Review.page.tsx
// University-ERP-Frontend/apps/admissions-portal/src/features/Review/Review.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { AcademicEvaluationPage } from '../../../../apps/faculty-portal/src/features/ChairpersonWorkspace/AcademicEvaluation.page';

const mockEvaluateApplication = vi.fn();
const mockRecommendAdmission = vi.fn();

vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    evaluateApplication: (data: any) => mockEvaluateApplication(data),
    recommendAdmission: (data: any) => mockRecommendAdmission(data)
  }
}));

describe('Admissions Portal - Academic Evaluation & Review', () => {
  const queryClient = new QueryClient();

  it('TC23: Evaluation_Should_Calculate_Composite_Score_Based_On_Rubric', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
         <AcademicEvaluationPage candidates={[{ id: 'APP-201', status: 'UnderAcademicEvaluation' }]} />
      </QueryClientProvider>
    );

    await user.type(screen.getByTestId('math-score'), '90');
    await user.type(screen.getByTestId('logic-score'), '80');
    
    expect(screen.getByTestId('composite-score').textContent).toBe('85');
  });

  it('TC24: Evaluation_Should_Update_Status_To_Waitlist_Via_EvaluateApplicationCommand', async () => {
    const user = userEvent.setup();
    mockEvaluateApplication.mockResolvedValue(true);
    
    render(
      <QueryClientProvider client={queryClient}>
        <AcademicEvaluationPage candidates={[{ id: 'APP-201', status: 'UnderAcademicEvaluation' }]} />
      </QueryClientProvider>
    );

    await user.click(screen.getByRole('button', { name: /Move to Waitlist/i }));

    await waitFor(() => {
      expect(mockEvaluateApplication).toHaveBeenCalledWith(expect.objectContaining({ decision: 'Waitlist' }));
    });
  });

  it('TC25: Evaluation_Should_Call_RecommendAdmissionCommand_With_Remarks', async () => {
    const user = userEvent.setup();
    mockRecommendAdmission.mockResolvedValue(true);
    
    render(
      <QueryClientProvider client={queryClient}>
        <AcademicEvaluationPage candidates={[{ id: 'APP-201', status: 'UnderAcademicEvaluation' }]} />
      </QueryClientProvider>
    );

    await user.type(screen.getByPlaceholderText(/Recommendation notes/i), 'Strong candidate for BSCS');
    await user.click(screen.getByRole('button', { name: /Recommend Admission/i }));

    await waitFor(() => {
      expect(mockRecommendAdmission).toHaveBeenCalledWith(expect.objectContaining({ remarks: 'Strong candidate for BSCS' }));
    });
  });
});
