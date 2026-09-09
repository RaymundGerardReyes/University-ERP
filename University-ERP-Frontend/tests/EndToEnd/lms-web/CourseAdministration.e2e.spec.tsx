import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { CoursePackagingPage } from '../../../apps/lms-web/src/features/CourseAdministration/CoursePackaging.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'admin-01', roles: ['ROLE_LMS_ADMIN'] }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getPackages: vi.fn().mockResolvedValue([
      { id: 'PKG-1', courseCode: 'CS101', moduleTitle: 'Intro to CS', packageSize: '~45 MB', status: 'Draft', totalLessons: 10 }
    ]),
    compilePackage: vi.fn().mockResolvedValue({ success: true, packageId: 'PKG-1' }),
    publishPackage: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("CourseAdministration - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("completes offline packaging user journey and compile lifecycle", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursePackagingPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Offline Course Packaging");
    await waitFor(() => {
      expect(screen.getByText("CS101")).toBeInTheDocument();
    });

    const compileBtn = screen.getByRole('button', { name: /compile & publish package/i });
    fireEvent.click(compileBtn);

    await waitFor(() => {
      expect(screen.getByText(/ready for Avalonia clients to download/i)).toBeInTheDocument();
    });
  });
});
