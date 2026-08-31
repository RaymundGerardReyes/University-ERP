// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: ApplicationWizard
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.types.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ApplicationWizardPage } from '../../../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page';

const mockSubmitApplication = vi.fn();
vi.mock('@university-erp/api-clients', () => ({
  admissionsApi: {
    submitApplication: (data: any) => mockSubmitApplication(data),
  },
}));

describe('ApplicationWizard Feature', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  const renderComponent = () => render(
    <QueryClientProvider client={queryClient}>
      <ApplicationWizardPage />
    </QueryClientProvider>
  );

  it('TC03: ApplicationWizard_Should_Render_Step1_PersonalInformation_By_Default', () => {
    renderComponent();
    expect(screen.getByText(/Personal Information/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeDefined();
  });

  it('TC04: ApplicationWizard_Should_Prevent_Next_Step_If_Required_Fields_Empty', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    await user.click(nextBtn);
    
    expect(screen.getByText(/First Name is required/i)).toBeDefined();
    expect(mockSubmitApplication).not.toHaveBeenCalled();
  });

  it('TC05: ApplicationWizard_Should_Show_Loading_Spinner_And_Submit_Payload', async () => {
    const user = userEvent.setup();
    mockSubmitApplication.mockResolvedValue('APP-12345');
    renderComponent();

    await user.type(screen.getByPlaceholderText(/First Name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/Last Name/i), 'Doe');
    
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitBtn);

    expect(screen.getByRole('button', { name: /Submitting/i })).toBeDefined();

    await waitFor(() => {
      expect(mockSubmitApplication).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Doe'
      }));
    });
  });
});
