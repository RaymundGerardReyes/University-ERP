import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { CourseContentPage } from '../../../apps/lms-web/src/features/CourseContent/CourseContent.page';

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({ user: { id: 'STU-101' }, isAuthenticated: true })
}));

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getCourseContent: vi.fn().mockResolvedValue({
      syllabusId: 'SYL-101',
      sectionId: 'CS-101',
      title: 'Introduction to Computer Science',
      description: 'Foundational programming and algorithmic principles.',
      modules: []
    })
  }
}));

describe("CourseContent - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("verifies course content navigation and resource availability", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseContentPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Course Content & Syllabus");
    await waitFor(() => {
      expect(screen.getByText("Introduction to Computer Science")).toBeInTheDocument();
    });
  });
});
