import { AuthGuard } from '@university-erp/shell-kit';
import { FacultyGuard } from '@university-erp/auth-sdk';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

// --- Implemented Features ---
import { AdvisingPage } from '../features/Advising/Advising.page';
import { AnalyticsPage } from '../features/Analytics/Analytics.page';
import { AssessmentsPage } from '../features/Assessments/Assessments.page';
import { CommunicationPage } from '../features/Communication/Communication.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { DocumentsPage } from '../features/Documents/Documents.page';
import { ResearchPage } from '../features/Research/Research.page';
import { SchedulePage } from '../features/Schedule/Schedule.page';
import { SettingsPage } from '../features/Settings/Settings.page';
import { StudentsPage } from '../features/Students/Students.page';
import { TeachingPage } from '../features/Teaching/Teaching.page';
import { SectionRosterPage } from '../features/Teaching/SectionRoster.page';

// --- Role Workspace Features ---
import { AdmissionQueuePage } from '../features/SecretaryWorkspace/AdmissionQueue.page';
import { DocumentVerificationPage } from '../features/SecretaryWorkspace/DocumentVerification.page';
import { InterviewSchedulingPage } from '../features/SecretaryWorkspace/InterviewScheduling.page';
import { MissingRequirementsPage } from '../features/SecretaryWorkspace/MissingRequirements.page';
import { EvaluationQueuePage } from '../features/ChairpersonWorkspace/EvaluationQueue.page';
import { AcademicEvaluationPage } from '../features/ChairpersonWorkspace/AcademicEvaluation.page';
import { RecommendationPage } from '../features/ChairpersonWorkspace/Recommendation.page';
import { CurriculumMatchingPage } from '../features/ChairpersonWorkspace/CurriculumMatching.page';
import { RecommendationQueuePage } from '../features/DeanWorkspace/RecommendationQueue.page';
import { CollegeApprovalPage } from '../features/DeanWorkspace/CollegeApproval.page';
import { EndorsementPage } from '../features/DeanWorkspace/Endorsement.page';
import { ApplicantAccessPage } from '../features/FacultySecurity/ApplicantAccess.page';
import { RecommendationAuditPage } from '../features/FacultySecurity/RecommendationAudit.page';
import { ConfidentialDocumentsPage } from '../features/FacultySecurity/ConfidentialDocuments.page';

// --- Safe Stub Component for In-Development Pages ---
const StubPage = ({ title }: { title: string }) => (
    <div className="fade-in stub-page">
        <div className="stub-icon">🚧</div>
        <h3 className="stub-title">{title}</h3>
        <div className="stub-subtitle">This administrative workflow is scheduled for future deployment.</div>
    </div>
);

export const Routing: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          
          {/* --- STANDARD FACULTY ROUTES --- */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/teaching" element={<TeachingPage />} />
          <Route path="/teaching/roster/:sectionId" element={<SectionRosterPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/advising" element={<AdvisingPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* --- SECRETARY WORKSPACE --- */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_FACULTY_SECRETARY']} />}>
            <Route path="/secretary/queue" element={<AdmissionQueuePage />} />
            <Route path="/secretary/verification" element={<DocumentVerificationPage />} />
            <Route path="/secretary/interviews" element={<InterviewSchedulingPage />} />
            <Route path="/secretary/requirements" element={<MissingRequirementsPage />} />
          </Route>

          {/* --- CHAIRPERSON WORKSPACE --- */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_DEPARTMENT_CHAIRPERSON']} />}>
            <Route path="/chairperson/queue" element={<EvaluationQueuePage />} />
            <Route path="/chairperson/evaluation" element={<AcademicEvaluationPage />} />
            <Route path="/chairperson/recommendation" element={<RecommendationPage />} />
            <Route path="/chairperson/curriculum" element={<CurriculumMatchingPage />} />
          </Route>

          {/* --- DEAN WORKSPACE --- */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_COLLEGE_DEAN']} />}>
            <Route path="/dean/queue" element={<RecommendationQueuePage />} />
            <Route path="/dean/capacity" element={<CollegeApprovalPage />} />
            <Route path="/dean/endorsement" element={<EndorsementPage />} />
          </Route>

          {/* --- SECURITY CONSOLE --- */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_FACULTY_SECURITY']} />}>
            <Route path="/security/access" element={<ApplicantAccessPage />} />
            <Route path="/security/audit" element={<RecommendationAuditPage />} />
            <Route path="/security/documents" element={<ConfidentialDocumentsPage />} />
            <Route path="/security/signatures" element={<StubPage title="Digital Signatures" />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};