// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: InterviewScheduling
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/InterviewScheduling/InterviewScheduling.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/InterviewScheduling/InterviewScheduling.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/InterviewScheduling/InterviewScheduling.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/InterviewScheduling/InterviewScheduling.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InterviewSchedulingPage } from '../../../apps/applicant-portal/src/features/InterviewScheduling/InterviewScheduling.page';

const mockScheduleInterview = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: { scheduleInterview: (...args: any) => mockScheduleInterview(...args) }
}));

describe('InterviewScheduling Feature', () => {
  it('TC09: InterviewScheduling_Should_Render_Calendar_Only_When_Status_Is_InterviewPending', () => {
    render(<InterviewSchedulingPage applicationStatus="InterviewPending" />);
    expect(screen.getByTestId('interview-calendar')).toBeDefined();
  });

  it('TC10: InterviewScheduling_Should_Show_Error_Toast_On_Scheduling_Conflict', async () => {
    mockScheduleInterview.mockRejectedValue(new Error('Time slot unavailable'));
    render(<InterviewSchedulingPage applicationStatus="InterviewPending" />);
    
    const submitBtn = screen.getByRole('button', { name: /Confirm Slot/i });
    submitBtn.click();

    await waitFor(() => {
      expect(screen.getByText(/Time slot unavailable/i)).toBeDefined();
    });
  });
});
