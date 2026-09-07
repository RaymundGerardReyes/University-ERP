import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { AuthGuard } from '../../../../libs/shell-kit/AuthGuard';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'u-1', roles: ['Admin'] },
    isAuthenticated: true
  })
}));

describe("AuthGuard - Unit Testing", () => {
  it("renders protected children when authenticated as Admin", () => {
    render(
      <MemoryRouter>
        <AuthGuard allowedRoles={['Admin']}>
          <div>Admin Dashboard Access</div>
        </AuthGuard>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Dashboard Access')).toBeInTheDocument();
  });
});
