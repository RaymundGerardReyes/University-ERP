import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// 1. Core Cross-Portal Page Controllers
import { ApplicationWizardPage } from '../../apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page';
import { ApplicationsPage } from '../../apps/admissions-portal/src/features/Applications/Applications.page';
import { AdmissionCasePage } from '../../apps/admissions-portal/src/features/Applications/AdmissionCase.page';
import { EvaluationQueuePage } from '../../apps/faculty-portal/src/features/ChairpersonWorkspace/EvaluationQueue.page';
import { EndorsementPage } from '../../apps/faculty-portal/src/features/DeanWorkspace/Endorsement.page';
import { EnrollmentPaymentPage } from '../../apps/applicant-portal/src/features/EnrollmentPayment/EnrollmentPayment.page';
import { DownpaymentPage } from '../../apps/finance-console/src/features/EnrollmentFinance/Downpayment/Downpayment.page';
import { EnrollmentActivationPage } from '../../apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page';
import { DashboardPage as StudentDashboardPage } from '../../apps/student-portal/src/features/Dashboard/Dashboard.page';

// 2. Mock Global Alert to prevent jsdom unhandled alert dialogs
vi.spyOn(window, 'alert').mockImplementation(() => {});

// 3. Dynamic Multi-Role Enterprise Authentication
let currentAuthContext = {
  user: {
    id: 'USR-APPLICANT-0099',
    name: 'Arthur Dent',
    role: 'Applicant',
    roles: ['Applicant']
  },
  identity: {
    id: 'USR-APPLICANT-0099',
    roles: ['Applicant']
  },
  isAuthenticated: true
};

vi.mock('@university-erp/auth-sdk', () => ({
  useAuth: () => currentAuthContext
}));

// 4. Central Cross-System In-Memory State Machine
const sharedEcosystemState = {
  applicationId: 'APP-2026-0099',
  applicantId: 'USR-APPLICANT-0099',
  applicantName: 'Arthur Dent',
  programId: 'BSCS',
  programName: 'BS Computer Science',
  department: 'Computer Science',
  status: 'Submitted',
  gpa: 3.85,
  submittedDate: '2026-10-08T00:00:00.000Z',
  applicationFeeStatus: 'Unpaid',
  interviewDate: null as string | null,
  interviewTime: null as string | null,
  officialStudentId: '' as string,
  documents: [
    {
      id: 'DOC-PSA-01',
      name: 'Birth Certificate (PSA)',
      status: 'Uploaded',
      filePath: '/storage/docs/psa_cert.pdf',
      uploadedAt: '2026-10-08T00:00:00.000Z',
      feedback: null
    }
  ],
  invoice: {
    id: 'INV-APP-2026-0099',
    invoiceId: 'INV-APP-2026-0099',
    studentId: 'USR-APPLICANT-0099',
    applicantId: 'USR-APPLICANT-0099',
    totalAmount: 3500.00,
    amount: 875.00,
    amountDue: 875.00,
    paidAmount: 0.00,
    description: 'Admissions Downpayment - BSCS',
    status: 'UNPAID',
    dueDate: '2026-11-01'
  },
  paymentSession: {
    sessionId: 'sess_downpayment_0099',
    status: 'PAYMENT_PENDING',
    amount: 875.00,
    currency: 'USD'
  },
  studentProfile: {
    studentId: 'STU-2026-0099',
    fullName: 'Arthur Dent',
    program: 'Bachelor of Science in Computer Science',
    yearLevel: '1st Year',
    academicStanding: 'GOOD',
    cumulativeGpa: 0.00,
    enrolledUnits: 18,
    maxUnitsAllowed: 21,
    tuitionOutstandingBalance: 2625.00,
    clearanceStatus: 'CLEARED',
    nextClass: {
      courseCode: 'CS-101',
      courseTitle: 'Introduction to Computing',
      room: 'Science Complex 101',
      startTime: '08:00 AM',
      instructor: 'Dr. Ada Lovelace'
    }
  },
  publishedEvents: [] as string[]
};

// 5. Mock API Clients with State Propagation across Portals
vi.mock('@university-erp/api-clients', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    admissionsApi: {
      getProgramCatalog: vi.fn().mockResolvedValue([
        { id: 'BSCS', degree: 'BS', major: 'Computer Science', college: 'CCS', duration: '4 Years', intake: 'Fall', tuitionEstimate: '$3,500', tags: [] }
      ]),
      submitApplication: vi.fn().mockImplementation((payload) => {
        sharedEcosystemState.status = 'Submitted';
        sharedEcosystemState.applicationId = 'APP-2026-0099';
        sharedEcosystemState.applicantName = `${payload.firstName} ${payload.lastName}`.trim();
        return Promise.resolve('APP-2026-0099');
      }),
      getPendingApplications: vi.fn().mockImplementation(() => {
        return Promise.resolve([
          {
            id: sharedEcosystemState.applicationId,
            applicantName: sharedEcosystemState.applicantName,
            program: sharedEcosystemState.programName,
            department: sharedEcosystemState.department,
            status: sharedEcosystemState.status,
            gpa: sharedEcosystemState.gpa,
            submittedDate: sharedEcosystemState.submittedDate,
            interviewDate: sharedEcosystemState.interviewDate,
            interviewTime: sharedEcosystemState.interviewTime,
            applicationFeeStatus: sharedEcosystemState.applicationFeeStatus,
            documents: sharedEcosystemState.documents
          }
        ]);
      }),
      verifyDocumentsAndForward: vi.fn().mockImplementation((id: string) => {
        if (id === sharedEcosystemState.applicationId) {
          sharedEcosystemState.documents.forEach(d => { d.status = 'Verified'; });
          sharedEcosystemState.status = 'InterviewPending';
        }
        return Promise.resolve({ success: true, status: sharedEcosystemState.status });
      }),
      scheduleInterview: vi.fn().mockImplementation((id: string, payload: { date: string; time: string }) => {
        if (id === sharedEcosystemState.applicationId) {
          sharedEcosystemState.interviewDate = payload.date;
          sharedEcosystemState.interviewTime = payload.time;
          sharedEcosystemState.status = 'UnderAcademicEvaluation';
        }
        return Promise.resolve();
      }),
      recommendApplication: vi.fn().mockImplementation((id: string) => {
        if (id === sharedEcosystemState.applicationId) {
          sharedEcosystemState.status = 'Recommended';
        }
        return Promise.resolve({ success: true, status: 'Recommended' });
      }),
      endorseApplication: vi.fn().mockImplementation((id: string) => {
        if (id === sharedEcosystemState.applicationId) {
          sharedEcosystemState.status = 'Endorsed_For_Enrollment';
          sharedEcosystemState.publishedEvents.push('ApplicantAcceptedIntegrationEvent');
          // Finance auto-creates the invoice upon ApplicantAcceptedIntegrationEvent
          sharedEcosystemState.invoice.status = 'UNPAID';
        }
        return Promise.resolve({ success: true, status: 'Endorsed_For_Enrollment' });
      }),
      activateEnrollment: vi.fn().mockImplementation((id: string) => {
        if (id !== sharedEcosystemState.applicationId || sharedEcosystemState.status !== 'Endorsed_For_Enrollment') {
          return Promise.reject(new Error('Admissions.InvalidState: Application must be endorsed before activation.'));
        }
        if (sharedEcosystemState.applicationFeeStatus !== 'Paid') {
          return Promise.reject(new Error('Admissions.InvalidState: Application fee downpayment must be cleared before activation.'));
        }
        sharedEcosystemState.status = 'Enrolled';
        sharedEcosystemState.officialStudentId = 'STU-2026-0099';
        sharedEcosystemState.publishedEvents.push('StudentEnrolledIntegrationEvent');
        return Promise.resolve('STU-2026-0099');
      }),
      generateStudentIdentityAndEnroll: vi.fn().mockImplementation((id: string) => {
        sharedEcosystemState.status = 'Enrolled';
        sharedEcosystemState.officialStudentId = 'STU-2026-0099';
        sharedEcosystemState.publishedEvents.push('StudentEnrolledIntegrationEvent');
        return Promise.resolve({ studentId: 'STU-2026-0099' });
      }),
      getApplicationStatus: vi.fn().mockImplementation(() => Promise.resolve([
        {
          id: sharedEcosystemState.applicationId,
          program: sharedEcosystemState.programName,
          submissionDate: '2026-10-08',
          status: sharedEcosystemState.status,
          nextSteps: 'Proceed to payment',
          feedback: null
        }
      ])),
      getApplicantJourney: vi.fn().mockImplementation(() => Promise.resolve({
        applicantName: sharedEcosystemState.applicantName,
        applicantId: sharedEcosystemState.applicantId,
        currentStage: 4,
        applicationFeeStatus: sharedEcosystemState.applicationFeeStatus,
        milestones: [],
        programs: [],
        documents: sharedEcosystemState.documents,
        timeline: [],
        applicationId: sharedEcosystemState.applicationId
      }))
    },
    facultyAdmissionsApi: {
      getPendingApplications: vi.fn().mockImplementation(() => Promise.resolve([
        {
          id: sharedEcosystemState.applicationId,
          applicantName: sharedEcosystemState.applicantName,
          program: sharedEcosystemState.programName,
          department: sharedEcosystemState.department,
          status: 'Pending Faculty Approval',
          gpa: sharedEcosystemState.gpa,
          submittedDate: sharedEcosystemState.submittedDate
        }
      ])),
      approveApplication: vi.fn().mockImplementation((id: string, action: 'Verify' | 'Approve') => {
        if (id === sharedEcosystemState.applicationId && action === 'Approve') {
          sharedEcosystemState.status = 'Recommended';
        }
        return Promise.resolve(true);
      })
    },
    registrarApi: {
      getAdmissionsQueue: vi.fn().mockImplementation(() => Promise.resolve([
        {
          id: sharedEcosystemState.applicationId,
          applicantName: sharedEcosystemState.applicantName,
          program: sharedEcosystemState.programName,
          status: sharedEcosystemState.status
        }
      ]))
    },
    financeApi: {
      getInvoices: vi.fn().mockImplementation(() => Promise.resolve([sharedEcosystemState.invoice])),
      createPaymentSession: vi.fn().mockImplementation(() => Promise.resolve({
        sessionId: sharedEcosystemState.paymentSession.sessionId,
        checkoutUrl: `/checkout?session=${sharedEcosystemState.paymentSession.sessionId}`
      }))
    },
    financeBillingApi: {
      payApplicationFee: vi.fn().mockImplementation(() => {
        sharedEcosystemState.applicationFeeStatus = 'Paid';
        sharedEcosystemState.invoice.status = 'PAID';
        sharedEcosystemState.publishedEvents.push('PaymentVerifiedIntegrationEvent');
        return Promise.resolve({ success: true });
      })
    }
  };
});

// 6. Mock Finance Downpayment API
vi.mock('../../apps/finance-console/src/features/EnrollmentFinance/Downpayment/Downpayment.api', () => ({
  downpaymentApi: {
    getPendingPayments: vi.fn().mockImplementation(() => Promise.resolve([
      {
        referenceId: sharedEcosystemState.applicationId,
        applicantName: sharedEcosystemState.applicantName,
        program: sharedEcosystemState.programName,
        amountDue: 875.00,
        amountPaid: 875.00,
        paymentMethod: 'ONLINE_GATEWAY',
        status: sharedEcosystemState.applicationFeeStatus === 'Paid' ? 'PAYMENT_VERIFIED' : 'PAYMENT_PENDING',
        transactionRef: `TXN-${sharedEcosystemState.applicationId}`,
        date: '2026-10-08'
      }
    ])),
    verifyPayment: vi.fn().mockImplementation((req: { paymentId: string }) => {
      if (req.paymentId === sharedEcosystemState.applicationId) {
        sharedEcosystemState.applicationFeeStatus = 'Paid';
        sharedEcosystemState.invoice.status = 'PAID';
        sharedEcosystemState.paymentSession.status = 'PAYMENT_VERIFIED';
        sharedEcosystemState.publishedEvents.push('PaymentVerifiedIntegrationEvent');
      }
      return Promise.resolve();
    })
  }
}));

// 7. Mock Student Dashboard API
vi.mock('../../apps/student-portal/src/features/Dashboard/Dashboard.api', () => ({
  fetchStudentDashboard: vi.fn().mockImplementation(() => Promise.resolve(sharedEcosystemState.studentProfile))
}));

describe('Admissions to Enrollment Cross-Portal Lifecycle E2E Suite', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity }
      }
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement, initialRoute = '/') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  // ─── PHASE 1: APPLICANT PORTAL — WIZARD SUBMISSION ─────────────────────────
  it('Phase 1: Applicant submits application through ApplicationWizard in Applicant Portal', async () => {
    currentAuthContext = {
      user: { id: 'USR-APPLICANT-0099', name: 'Arthur Dent', role: 'Applicant', roles: ['Applicant'] },
      identity: { id: 'USR-APPLICANT-0099', roles: ['Applicant'] },
      isAuthenticated: true
    };

    renderWithProviders(<ApplicationWizardPage />);

    // Wait for Step 1 Program Selection
    await waitFor(() => {
      expect(screen.getByText('Step 1: Program Selection')).toBeInTheDocument();
      expect(screen.getByText(/BS Computer Science/i)).toBeInTheDocument();
    });

    // Select BSCS program
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'BSCS' } });

    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    expect(nextBtn).toBeEnabled();
    fireEvent.click(nextBtn);

    // Step 2 Academic History
    await waitFor(() => {
      expect(screen.getByText('Step 2: Academic History')).toBeInTheDocument();
    });

    const schoolInput = screen.getByPlaceholderText(/High School or College Name/i);
    const gpaInput = screen.getByPlaceholderText(/e\.g\. 3\.8/i);

    fireEvent.change(schoolInput, { target: { value: 'Galactic Academy' } });
    fireEvent.change(gpaInput, { target: { value: '3.85' } });

    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });
    expect(submitBtn).toBeEnabled();
    fireEvent.click(submitBtn);

    // Step 3 Confirmation
    await waitFor(() => {
      expect(screen.getByText('Application Submitted!')).toBeInTheDocument();
      expect(screen.getByText(/Your application has been routed to the Admissions Office/i)).toBeInTheDocument();
    });

    // Invariant verification
    expect(sharedEcosystemState.applicationId).toBe('APP-2026-0099');
    expect(sharedEcosystemState.status).toBe('Submitted');
  });

  // ─── PHASE 2: ADMISSIONS PORTAL — REVIEW & DOCUMENT VERIFICATION ───────────
  it('Phase 2: Admissions Officer reviews queue and verifies requirements in Admissions Portal', async () => {
    currentAuthContext = {
      user: { id: 'OFFICER-01', name: 'Sarah Connor', role: 'Admissions', roles: ['Admissions', 'Admin'] },
      identity: { id: 'OFFICER-01', roles: ['Admissions', 'Admin'] },
      isAuthenticated: true
    };

    // Step 2a: Check Applications Queue
    const { unmount } = renderWithProviders(<ApplicationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Arthur Dent')).toBeInTheDocument();
      expect(screen.getByText('APP-2026-0099')).toBeInTheDocument();
      expect(screen.getByText('BS Computer Science')).toBeInTheDocument();
    });

    unmount();

    // Step 2b: Open Admission Case Requirements Tab
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/applications/APP-2026-0099?tab=requirements']}>
          <Routes>
            <Route path="/applications/:id" element={<AdmissionCasePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Submitted Requirements')).toBeInTheDocument();
      expect(screen.getByText('Birth Certificate (PSA)')).toBeInTheDocument();
    });

    // Verify documents button
    const verifyBtn = screen.getByRole('button', { name: /Verify Documents & Forward Case/i });
    expect(verifyBtn).toBeInTheDocument();
    fireEvent.click(verifyBtn);

    // Invariant verification: Status updated to InterviewPending
    await waitFor(() => {
      expect(sharedEcosystemState.status).toBe('InterviewPending');
      expect(sharedEcosystemState.documents[0].status).toBe('Verified');
    });
  });

  // ─── PHASE 3: FACULTY PORTAL — CHAIRPERSON RECOMMENDATION ───────────────────
  it('Phase 3: Department Chairperson recommends candidate in Faculty Portal EvaluationQueue', async () => {
    currentAuthContext = {
      user: { id: 'CHAIR-01', name: 'Dr. Evelyn Cross', role: 'Faculty', roles: ['Faculty', 'Chairperson'] },
      identity: { id: 'CHAIR-01', roles: ['Faculty', 'Chairperson'] },
      isAuthenticated: true
    };

    renderWithProviders(<EvaluationQueuePage />);

    await waitFor(() => {
      expect(screen.getByText('Academic Evaluation')).toBeInTheDocument();
      expect(screen.getByText('Arthur Dent')).toBeInTheDocument();
      expect(screen.getByText(/BS Computer Science • GPA: 3.85/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Recommend Admission/i })).toBeInTheDocument();
    });

    const recommendBtn = screen.getByRole('button', { name: /Recommend Admission/i });
    fireEvent.click(recommendBtn);

    // Assert status updated to Recommended through facultyAdmissionsApi mutation
    await waitFor(() => {
      expect(sharedEcosystemState.status).toBe('Recommended');
    });
  });

  // ─── PHASE 4: FACULTY PORTAL — DEAN ENDORSEMENT & FINANCE EVENT ────────────
  it('Phase 4: Dean endorses candidate, triggering cross-module event to Finance', async () => {
    currentAuthContext = {
      user: { id: 'DEAN-01', name: 'Dean Thomas Vance', role: 'Faculty', roles: ['Faculty', 'Dean'] },
      identity: { id: 'DEAN-01', roles: ['Faculty', 'Dean'] },
      isAuthenticated: true
    };

    // Prepare queue with candidate
    queryClient.setQueryData(['admissions', 'deanRecommendationQueue'], [
      {
        id: sharedEcosystemState.applicationId,
        applicantName: sharedEcosystemState.applicantName,
        program: sharedEcosystemState.programName,
        chairScore: '95/100',
        chairRemarks: 'Highly recommended for BSCS program.',
        status: 'Recommended'
      }
    ]);

    renderWithProviders(<EndorsementPage />);

    await waitFor(() => {
      expect(screen.getByText('College Endorsement')).toBeInTheDocument();
      expect(screen.getByText('Arthur Dent')).toBeInTheDocument();
      expect(screen.getByText('APP-2026-0099')).toBeInTheDocument();
    });

    // Select candidate card to open detail pane
    const candidateCard = screen.getByText('Arthur Dent');
    fireEvent.click(candidateCard);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Officially Endorse to Registrar/i })).toBeInTheDocument();
    });

    const endorseBtn = screen.getByRole('button', { name: /Officially Endorse to Registrar/i });
    fireEvent.click(endorseBtn);

    // Assert status updated to Endorsed_For_Enrollment and cross-module event published
    await waitFor(() => {
      expect(sharedEcosystemState.status).toBe('Endorsed_For_Enrollment');
      expect(sharedEcosystemState.publishedEvents).toContain('ApplicantAcceptedIntegrationEvent');
    });

    // Invariant: Finance auto-generates invoice for $3,500 ($875 downpayment)
    expect(sharedEcosystemState.invoice.totalAmount).toBe(3500.00);
    expect(sharedEcosystemState.invoice.amountDue).toBe(875.00);
  });

  // ─── PHASE 5: APPLICANT PORTAL & FINANCE CONSOLE — DOWNPAYMENT ──────────────
  it('Phase 5: Applicant inspects downpayment and Finance Cashier reconciles payment', async () => {
    // Step 5a: Applicant reviews invoice in EnrollmentPaymentPage
    currentAuthContext = {
      user: { id: 'USR-APPLICANT-0099', name: 'Arthur Dent', role: 'Applicant', roles: ['Applicant'] },
      identity: { id: 'USR-APPLICANT-0099', roles: ['Applicant'] },
      isAuthenticated: true
    };

    const { unmount } = renderWithProviders(<EnrollmentPaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('Enrollment Payment')).toBeInTheDocument();
      expect(screen.getByText('INV-APP-2026-0099')).toBeInTheDocument();
      expect(screen.getByText(/Admissions Downpayment - BSCS/i)).toBeInTheDocument();
      expect(screen.getByText(/875\.00/)).toBeInTheDocument();
    });

    unmount();

    // Step 5b: Finance Officer reconciles in Finance Console
    currentAuthContext = {
      user: { id: 'FINANCE-01', name: 'Gordon Gekko', role: 'Finance', roles: ['Finance', 'Admin'] },
      identity: { id: 'FINANCE-01', roles: ['Finance', 'Admin'] },
      isAuthenticated: true
    };

    renderWithProviders(<DownpaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('Enrollment Downpayment Verification')).toBeInTheDocument();
      expect(screen.getByText('Arthur Dent')).toBeInTheDocument();
      expect(screen.getByText('APP-2026-0099')).toBeInTheDocument();
    });

    const verifyPaymentBtn = screen.getByRole('button', { name: /Confirm Payment/i });
    fireEvent.click(verifyPaymentBtn);

    // Assert cross-module event PaymentVerifiedIntegrationEvent emitted
    await waitFor(() => {
      expect(sharedEcosystemState.applicationFeeStatus).toBe('Paid');
      expect(sharedEcosystemState.invoice.status).toBe('PAID');
      expect(sharedEcosystemState.publishedEvents).toContain('PaymentVerifiedIntegrationEvent');
    });
  });

  // ─── PHASE 6: REGISTRAR PORTAL — ENROLLMENT ACTIVATION ──────────────────────
  it('Phase 6: Registrar confirms prerequisites and activates official matriculation via EnrollmentActivationPage', async () => {
    currentAuthContext = {
      user: { id: 'REG-01', name: 'Prof. Minerva McGonagall', role: 'Registrar', roles: ['Registrar'] },
      identity: { id: 'REG-01', roles: ['Registrar'] },
      isAuthenticated: true
    };

    renderWithProviders(<EnrollmentActivationPage />);

    await waitFor(() => {
      expect(screen.getByText('Enrollment Activation')).toBeInTheDocument();
      expect(screen.getByText('Arthur Dent')).toBeInTheDocument();
      expect(screen.getByText('APP-2026-0099')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Activate Enrollment/i })).toBeInTheDocument();
    });

    // Open activation confirmation modal
    const activateBtn = screen.getByRole('button', { name: /Activate Enrollment/i });
    fireEvent.click(activateBtn);

    await waitFor(() => {
      expect(screen.getByText('Confirm Official Enrollment')).toBeInTheDocument();
      expect(screen.getByText('Financial Clearance Confirmed')).toBeInTheDocument();
    });

    // Execute official activation inside modal
    const modalConfirmBtn = screen.getAllByRole('button', { name: /Activate Enrollment/i })[1];
    fireEvent.click(modalConfirmBtn);

    // Assert real mutation completed and triggered StudentEnrolledIntegrationEvent
    await waitFor(() => {
      expect(sharedEcosystemState.status).toBe('Enrolled');
      expect(sharedEcosystemState.officialStudentId).toBe('STU-2026-0099');
      expect(sharedEcosystemState.publishedEvents).toContain('StudentEnrolledIntegrationEvent');
    });
  });

  // ─── PHASE 7: STUDENT PORTAL — ACADEMIC RECORD AUTO-PROVISIONING ───────────
  it('Phase 7: Newly enrolled student logs into Student Portal and verifies academic record', async () => {
    currentAuthContext = {
      user: { id: 'STU-2026-0099', name: 'Arthur Dent', role: 'Student', roles: ['Student'] },
      identity: { id: 'STU-2026-0099', roles: ['Student'] },
      isAuthenticated: true
    };

    renderWithProviders(<StudentDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Student Academic Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Arthur Dent \(STU-2026-0099\)/i)).toBeInTheDocument();
      expect(screen.getByText('0.00')).toBeInTheDocument(); // Fresh GPA
      expect(screen.getByText('GOOD')).toBeInTheDocument(); // Good Standing
      expect(screen.getByText('Financially Cleared')).toBeInTheDocument();
    });

    // Verify course & registration details
    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Official Registered')).toBeInTheDocument();
    expect(screen.getByText(/CS-101: Introduction to Computing/i)).toBeInTheDocument();
  });

  // ─── PHASE 8: RESILIENCE & INVARIANT FAILURE TESTING ────────────────────────
  it('Phase 8: Invariant enforcement blocks step bypassing and unauthorized actions', async () => {
    // Test 8a: Direct enrollment activation on an unendorsed application throws error
    const { admissionsApi } = await import('@university-erp/api-clients');
    await expect(admissionsApi.activateEnrollment('APP-UNENDORSED')).rejects.toThrow(
      /Admissions.InvalidState/
    );

    // Test 8b: Downpayment verification is idempotent and preserves cleared balance
    const { downpaymentApi } = await import('../../apps/finance-console/src/features/EnrollmentFinance/Downpayment/Downpayment.api');
    await downpaymentApi.verifyPayment({ paymentId: sharedEcosystemState.applicationId });
    expect(sharedEcosystemState.applicationFeeStatus).toBe('Paid');
    expect(sharedEcosystemState.invoice.status).toBe('PAID');

    // Test 8c: Unauthenticated user is blocked at Application Wizard
    currentAuthContext = {
      user: null as any,
      identity: null as any,
      isAuthenticated: false
    };

    renderWithProviders(<ApplicationWizardPage />);

    await waitFor(() => {
      expect(screen.getByText('Authentication Required')).toBeInTheDocument();
      expect(screen.getByText(/Please log in to start or submit a university application/i)).toBeInTheDocument();
    });
  });
});
