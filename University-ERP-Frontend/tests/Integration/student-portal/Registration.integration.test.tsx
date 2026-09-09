import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { RegistrationPage } from '../../../apps/student-portal/src/features/Registration/Registration.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ identity: { id: 'test-student' }, user: { id: 'test-student' }, isAuthenticated: true })
}));

describe("Registration - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders course registration page container", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RegistrationPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(container).toBeDefined();
  });
});
