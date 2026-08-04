import { createLogger } from '@university-erp/core-logger';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './AppShell';
import { AuthGuard } from '@university-erp/shell-kit';


// Journey Imports
import { AdmissionStatusPage } from '../features/AdmissionStatus/AdmissionStatus.page';
import { ApplicationTimelinePage } from '../features/ApplicationTimeline/ApplicationTimeline.page';
import { ApplicationWizardPage } from '../features/ApplicationWizard/ApplicationWizard.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { DocumentSubmissionPage } from '../features/DocumentSubmission/DocumentSubmission.page';
import { EligibilityCheckerPage } from '../features/EligibilityChecker/EligibilityChecker.page';
import { ProgramExplorerPage } from '../features/ProgramExplorer/ProgramExplorer.page';

const logger = createLogger('applicant-portal', 'Routing');

export const Routing: React.FC = () => {
  logger.debug('Building applicant route tree');

  return (
    <BrowserRouter>
      <Routes>

        {/* PROTECTED ROUTES */}
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/programs" element={<ProgramExplorerPage />} />
          <Route path="/eligibility" element={<EligibilityCheckerPage />} />
          <Route path="/apply" element={<ApplicationWizardPage />} />
          <Route path="/documents" element={<DocumentSubmissionPage />} />
          <Route path="/timeline" element={<ApplicationTimelinePage />} />
          <Route path="/admissions" element={<AdmissionStatusPage />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};