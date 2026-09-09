import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Cross-portal components
import { LMSManagerPage } from '../../../apps/faculty-portal/src/features/LMSManager/LMSManager.page';
import { CoursePackagingPage } from '../../../apps/lms-web/src/features/CourseAdministration/CoursePackaging.page';
import { SubmissionReviewPage } from '../../../apps/lms-web/src/features/OfflineSubmissionReview/SubmissionReview.page';
import { GradebookSyncPage } from '../../../apps/lms-web/src/features/GradebookOrchestration/GradebookSync.page';
import { LearningManagementPage } from '../../../apps/student-portal/src/features/LearningManagement/LearningManagement.page';

// Mock shared SDKs
vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => ({
    user: { id: 'USR-MASTER-01', name: 'Dr. Alan Turing', roles: ['ROLE_INSTRUCTOR', 'ROLE_LMS_ADMIN', 'ROLE_STUDENT', 'Faculty', 'Student'] },
    identity: { id: 'USR-MASTER-01' },
    isAuthenticated: true
  })
}));

// Cross-system in-memory state shared across the test lifecycle
const sharedEcosystemState = {
  syllabus: {
    syllabusId: 'SYL-CS101',
    sectionId: 'CS101-SEC01',
    title: 'CS101: Introduction to Programming',
    description: 'Foundational computer science principles, control flow, and algorithms.',
    modules: [
      {
        id: 'MOD-1',
        title: 'Week 1: Fundamentals of Logic',
        description: 'Boolean algebra and truth tables',
        orderSequence: 1,
        items: [
          { id: 'ITM-1', name: 'Lecture 1 Slides', contentType: 'URL', resourceUrl: 'https://cdn.erp.university.edu/cs101/week1.pdf' }
        ]
      }
    ]
  },
  packages: [
    {
      id: 'PKG-CS101',
      courseCode: 'CS101',
      moduleTitle: 'Introduction to Programming (Week 1-4)',
      packageSize: '~45 MB',
      status: 'Draft',
      totalLessons: 12
    }
  ],
  offlineSubmissions: [
    {
      id: 'SUB-2026-8812',
      studentId: 'STU-2026-8812',
      studentName: 'Alice Chen',
      courseCode: 'CS101',
      assignmentId: 'ASN-LAB-01',
      assignmentTitle: 'CS101 - Lab 1: Binary Search',
      essayContent: 'Implemented iterative and recursive binary search with O(log n) performance guarantee.',
      scheduleToken: 'TOKEN-CS101-W1',
      syncedAtUtc: '2026-08-06 08:30 AM',
      status: 'Pending Review',
      maxScore: 100
    }
  ],
  gradebook: [
    {
      id: 'GB-CS101-01',
      studentId: 'STU-2026-8812',
      studentName: 'Alice Chen',
      courseCode: 'CS101',
      finalScore: 91,
      letterGrade: 'A- (91%)',
      registrarStatus: 'Not Synced'
    }
  ]
};

vi.mock('@university-erp/api-clients', () => ({
  lmsApi: {
    getCourseContent: vi.fn().mockImplementation(() => Promise.resolve(sharedEcosystemState.syllabus)),
    createSyllabus: vi.fn().mockImplementation((_, payload) => {
      sharedEcosystemState.syllabus.title = payload.title;
      return Promise.resolve({ success: true, syllabus: sharedEcosystemState.syllabus });
    }),
    addModule: vi.fn().mockImplementation((_, payload) => {
      const newMod = {
        id: 'MOD-' + (sharedEcosystemState.syllabus.modules.length + 1),
        title: payload.title,
        description: payload.description,
        orderSequence: payload.orderSequence,
        items: []
      };
      sharedEcosystemState.syllabus.modules.push(newMod);
      return Promise.resolve(newMod);
    }),
    addContentItem: vi.fn().mockImplementation((_, modId, payload) => {
      const mod = sharedEcosystemState.syllabus.modules.find(m => m.id === modId);
      const item = { id: 'ITM-' + Date.now(), name: payload.name, contentType: payload.contentType, resourceUrl: payload.resourceUrl };
      if (mod) mod.items.push(item);
      return Promise.resolve(item);
    }),
    getPackages: vi.fn().mockImplementation(() => Promise.resolve(sharedEcosystemState.packages)),
    compilePackage: vi.fn().mockImplementation(code => {
      const pkg = sharedEcosystemState.packages.find(p => p.courseCode === code);
      if (pkg) pkg.status = 'Compiled';
      return Promise.resolve({ success: true, packageId: pkg ? pkg.id : 'PKG-01', manifest: 'sha256:manifest-hash' });
    }),
    publishPackage: vi.fn().mockResolvedValue({ success: true }),
    getOfflineSubmissions: vi.fn().mockImplementation(() => Promise.resolve(sharedEcosystemState.offlineSubmissions)),
    gradeSubmission: vi.fn().mockImplementation((subId, payload) => {
      const sub = sharedEcosystemState.offlineSubmissions.find(s => s.id === subId);
      if (sub) {
        sub.status = 'Graded';
        sub.score = payload.score;
        sub.feedback = payload.feedback;
      }
      return Promise.resolve(sub);
    }),
    syncOfflineAssignment: vi.fn().mockResolvedValue({ submissionId: 'SUB-2026-8812' }),
    getGradebookRecords: vi.fn().mockImplementation(() => Promise.resolve(sharedEcosystemState.gradebook)),
    syncGradesToRegistrar: vi.fn().mockImplementation(stuId => {
      const rec = sharedEcosystemState.gradebook.find(g => g.studentId === stuId);
      if (rec) rec.registrarStatus = 'Synced';
      return Promise.resolve({ success: true });
    }),
    getAssignments: vi.fn().mockResolvedValue([]),
    createAssignment: vi.fn().mockResolvedValue({ id: 'ASN-1', status: 'Published' }),
    getQuizzes: vi.fn().mockResolvedValue([]),
    getTimeline: vi.fn().mockResolvedValue([])
  },
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { success: true } })
  }
}));

vi.mock('@university-erp/workflow-sdk', () => ({
  LMSWorkflow: {
    process: vi.fn().mockResolvedValue({ success: true, action: 'Processed' })
  }
}));

describe("LMS Cross-Portal Lifecycle - End-to-End Testing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it("Phase 1: Faculty authors course syllabus, adds learning modules, and uploads lecture slides in faculty-portal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/teaching/lms/CS101-SEC01']}>
          <Routes>
            <Route path="/teaching/lms/:sectionId" element={<LMSManagerPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("LMS Content Manager: CS101-SEC01");
    });

    expect(screen.getByText("Week 1: Fundamentals of Logic")).toBeInTheDocument();
    expect(screen.getByText("Lecture 1 Slides")).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/Module Title/i);
    const descInput = screen.getByPlaceholderText(/Description/i);
    fireEvent.change(titleInput, { target: { value: 'Week 2: Control Structures' } });
    fireEvent.change(descInput, { target: { value: 'If-else statements and iteration' } });

    const addModuleBtn = screen.getByRole('button', { name: /Add Module/i });
    fireEvent.click(addModuleBtn);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });

  it("Phase 2: LMS Administrator compiles and publishes offline course package in lms-web for Avalonia clients", async () => {
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

  it("Phase 3: Instructor reviews and grades offline assignment synced from Avalonia desktop client in lms-web", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SubmissionReviewPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Offline Submission Review");

    await waitFor(() => {
      expect(screen.getByText("STU-2026-8812")).toBeInTheDocument();
      expect(screen.getByText(/CS101 - Lab 1: Binary Search/i)).toBeInTheDocument();
    });

    const gradeBtn = screen.getByRole('button', { name: /grade submission/i });
    fireEvent.click(gradeBtn);

    await waitFor(() => {
      expect(screen.getByText(/Grade Submission: STU-2026-8812/i)).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /submit grade & notify student/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Grade Submission: STU-2026-8812/i)).not.toBeInTheDocument();
    });
  });

  it("Phase 4: Instructor synchronizes finalized grades to the University Registrar database in lms-web", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradebookSyncPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Gradebook Orchestration");

    await waitFor(() => {
      expect(screen.getByText("STU-2026-8812")).toBeInTheDocument();
      expect(screen.getByText("A- (91%)")).toBeInTheDocument();
    });

    const syncBtn = screen.getByRole('button', { name: /sync to registrar/i });
    fireEvent.click(syncBtn);

    await waitFor(() => {
      expect(screen.getByText(/Official grades synced to Registrar/i)).toBeInTheDocument();
    });
  });

  it("Phase 5: Student views published course modules and learning materials in student-portal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/learning/CS101']}>
          <Routes>
            <Route path="/learning/:courseId" element={<LearningManagementPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/LMS: CS101: Introduction to Programming/i);
    });

    expect(screen.getByText(/Course Syllabus & Modules/i)).toBeInTheDocument();
    expect(screen.getByText(/Week 1: Fundamentals of Logic/i)).toBeInTheDocument();
  });
});
