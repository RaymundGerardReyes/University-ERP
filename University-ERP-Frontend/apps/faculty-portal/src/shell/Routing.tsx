import { AuthGuard } from '@university-erp/shell-kit';
import { FacultyGuard } from '@university-erp/auth-sdk';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

// Implemented Features
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
import { AcademicEvaluationPage } from '../features/ChairpersonWorkspace/AcademicEvaluation.page';
import { AdmissionQueuePage } from '../features/SecretaryWorkspace/AdmissionQueue.page';
import { DocumentVerificationPage } from '../features/SecretaryWorkspace/DocumentVerification.page';
import { InterviewSchedulingPage } from '../features/SecretaryWorkspace/InterviewScheduling.page';
import { EvaluationQueuePage } from '../features/ChairpersonWorkspace/EvaluationQueue.page';
import { RecommendationPage } from '../features/ChairpersonWorkspace/Recommendation.page';
import { RecommendationQueuePage } from '../features/DeanWorkspace/RecommendationQueue.page';
import { CollegeApprovalPage } from '../features/DeanWorkspace/CollegeApproval.page';
import { EndorsementPage } from '../features/DeanWorkspace/Endorsement.page';
import { ApplicantAccessPage } from '../features/FacultySecurity/ApplicantAccess.page';
import { RecommendationAuditPage } from '../features/FacultySecurity/RecommendationAudit.page';
export const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/teaching" element={<TeachingPage />} />
          <Route path="/teaching/roster/:sectionId" element={<SectionRosterPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          {/* Secretary Workspace */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_FACULTY_SECRETARY']} />}>
            <Route path="/secretary/queue" element={<AdmissionQueuePage />} />
            <Route path="/secretary/verification" element={<DocumentVerificationPage />} />
            <Route path="/secretary/interviews" element={<InterviewSchedulingPage />} />
            <Route path="/secretary/requirements" element={<div className="fade-in stub-page"><h3>Secretary: Missing Requirements</h3></div>} />
          </Route>

          {/* Chairperson Workspace */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_DEPARTMENT_CHAIRPERSON']} />}>
            <Route path="/chairperson/queue" element={<EvaluationQueuePage />} />
            <Route path="/chairperson/evaluation" element={<AcademicEvaluationPage />} />
            <Route path="/chairperson/curriculum" element={<div className="fade-in stub-page"><h3>Chairperson: Curriculum Matching</h3></div>} />
            <Route path="/chairperson/recommendation" element={<RecommendationPage />} />
          </Route>

          {/* Dean Workspace */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_COLLEGE_DEAN']} />}>
            <Route path="/dean/queue" element={<RecommendationQueuePage />} />
            <Route path="/dean/endorsement" element={<EndorsementPage />} />
            <Route path="/dean/capacity" element={<CollegeApprovalPage />} />
          </Route>

          {/* Faculty Security */}
          <Route element={<FacultyGuard allowedRoles={['ROLE_FACULTY_SECURITY']} />}>
            <Route path="/security/access" element={<ApplicantAccessPage />} />
            <Route path="/security/documents" element={<div className="fade-in stub-page"><h3>Security: Confidential Documents</h3></div>} />
            <Route path="/security/audit" element={<RecommendationAuditPage />} />
            <Route path="/security/signatures" element={<div className="fade-in stub-page"><h3>Security: Digital Signatures</h3></div>} />
          </Route>
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};