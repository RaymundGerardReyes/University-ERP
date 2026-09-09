import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { CoursePackagingPage } from '../../../apps/lms-web/src/features/CourseAdministration/CoursePackaging.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'usr-admin-01', roles: ['ROLE_LMS_ADMIN', 'Admin'] },
    isAuthenticated: true
  })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getPackages: vi.fn().mockResolvedValue([
      {
        id: 'PKG-101',
        courseCode: 'CS101',
        moduleTitle: 'Introduction to Programming (Week 1-4)',
        packageSize: '~45 MB',
        status: 'Draft',
        totalLessons: 12
      },
      {
        id: 'PKG-203',
        courseCode: 'CS203',
        moduleTitle: 'Data Structures & Algorithms (Full Term)',
        packageSize: '~120 MB',
        status: 'Compiled',
        totalLessons: 24
      }
    ]),
    compilePackage: vi.fn().mockResolvedValue({ success: true, packageId: 'PKG-101', manifest: 'manifest-hash' }),
    publishPackage: vi.fn().mockResolvedValue({ success: true })
  },
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { success: true } })
  }
}));

vi.mock('@university-erp/workflow-sdk', () => ({
  LMSWorkflow: {
    process: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe("CourseAdministration - Integration Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("renders packaging workspace, lists course bundles, and triggers compilation for Avalonia client", async () => {
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
      expect(screen.getByText("CS203")).toBeInTheDocument();
    });

    const compileButtons = screen.getAllByRole('button', { name: /compile & publish package/i });
    expect(compileButtons.length).toBeGreaterThan(0);

    fireEvent.click(compileButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/ready for Avalonia clients to download/i)).toBeInTheDocument();
    });
  });
});
