import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { IdentityGuard } from '../../../../libs/auth-sdk/src/guards/IdentityGuard';

vi.mock('../../../../libs/auth-sdk/react/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'usr-1', roles: ['Admin', 'Faculty', 'ROLE_FACULTY_ADMIN', 'ROLE_FINANCE_ADMIN', 'ROLE_IDENTITY_ADMIN', 'ROLE_LMS_ADMIN', 'ROLE_REGISTRAR'] },
    isAuthenticated: true
  })
}));

describe("IdentityGuard - Unit Testing", () => {
  it("renders protected outlet when authenticated with authorized role", () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<IdentityGuard allowedRoles={['ROLE_FACULTY_ADMIN'] as any} />}>
            <Route path="/protected" element={<div>Authorized Access Granted</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Authorized Access Granted')).toBeInTheDocument();
  });
});
