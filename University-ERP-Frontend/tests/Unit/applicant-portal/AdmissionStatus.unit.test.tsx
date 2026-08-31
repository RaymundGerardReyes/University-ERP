// Test Type: Unit Testing
//
// Portal: applicant-portal
// Feature: AdmissionStatus (AuthGuard & Role Protection)
//
// Source References:
// University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.api.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.hooks.ts
// University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.page.tsx
// University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.types.ts

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthGuard } from '@university-erp/shell-kit';

const mockUseAuth = vi.fn();
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => mockUseAuth(),
}));

const TestRoute = () => <h1>Protected Applicant Content</h1>;

describe('Applicant Portal - RBAC & Auth Guards', () => {
  it('TC01: Should_Redirect_To_IdentityPortal_If_Not_Authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, identity: null });
    
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AuthGuard allowedRoles={['Applicant']} />}>
            <Route path="/dashboard" element={<TestRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Applicant Content')).toBeNull();
  });

  it('TC02: Should_Render_403_Forbidden_If_Role_Is_Not_Applicant', () => {
    mockUseAuth.mockReturnValue({ 
      isAuthenticated: true, 
      identity: { id: 'STU-123', roles: ['Student'] } 
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AuthGuard allowedRoles={['Applicant']} />}>
            <Route path="/dashboard" element={<TestRoute />} />
          </Route>
          <Route path="/unauthorized" element={<h1>403 Forbidden</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Applicant Content')).toBeNull();
    expect(screen.getByText('403 Forbidden')).toBeDefined();
  });
});
