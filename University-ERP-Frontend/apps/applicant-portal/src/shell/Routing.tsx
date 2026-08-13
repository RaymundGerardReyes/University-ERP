import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

import { AdmissionStatusPage } from '../features/AdmissionStatus/AdmissionStatus.page';

import { ApplicationTimelinePage } from '../features/ApplicationTimeline/ApplicationTimeline.page';
import { ApplicationWizardPage } from '../features/ApplicationWizard/ApplicationWizard.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { EligibilityCheckerPage } from '../features/EligibilityChecker/EligibilityChecker.page';

import { ProgramExplorerPage } from '../features/ProgramExplorer/ProgramExplorer.page';
import { DocumentSubmissionPage } from '../features/DocumentSubmission/DocumentSubmission.page';
import { InterviewSchedulingPage } from '../features/InterviewScheduling/InterviewScheduling.page';
import { OffersPage } from '../features/Offers/Offers.page';

// New Enrollment Payment step
import { EnrollmentPaymentPage } from '../features/EnrollmentPayment/EnrollmentPayment.page';
import { ApplicationFeePaymentPage } from '../features/EnrollmentPayment/ApplicationFeePayment.page';

export const Routing: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '/applicant-portal/'}>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/status" element={<AdmissionStatusPage />} />
          <Route path="/admissions" element={<AdmissionStatusPage />} />
          <Route path="/timeline" element={<ApplicationTimelinePage />} />
          <Route path="/wizard" element={<ApplicationWizardPage />} />
          <Route path="/apply" element={<ApplicationWizardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/eligibility" element={<EligibilityCheckerPage />} />

          <Route path="/programs" element={<ProgramExplorerPage />} />
          <Route path="/documents" element={<DocumentSubmissionPage />} />
          <Route path="/interviews" element={<InterviewSchedulingPage />} />
          <Route path="/offers" element={<OffersPage />} />
          
          {/* New routes */}
          <Route path="/enrollment-payment" element={<EnrollmentPaymentPage />} />
          <Route path="/payment" element={<ApplicationFeePaymentPage />} />
          <Route path="/application-fee" element={<ApplicationFeePaymentPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};