import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { ApplicationIntakePage } from '../features/Intake/ApplicationIntake.page';
import { ApplicationReviewPage } from '../features/Review/ApplicationReview.page';
import { EntranceExaminationPage } from '../features/Examination/EntranceExamination.page';
import { AdmissionQueuePage } from '../features/Queue/AdmissionQueue.page';
import { AdmissionsReportsPage } from '../features/Reports/AdmissionsReports.page';
import { ApplicationVerificationPage } from '../features/Verification/ApplicationVerification.page';
import { AdmissionFeesPage } from '../features/Fees/AdmissionFees.page';
import { ApplicantCommunicationPage } from '../features/Communication/ApplicantCommunication.page';

export const Routing: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthGuard><AppShell /></AuthGuard>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/intake" element={<ApplicationIntakePage />} />
                    <Route path="/review" element={<ApplicationReviewPage />} />
                    <Route path="/examination" element={<EntranceExaminationPage />} />
                    <Route path="/verification" element={<ApplicationVerificationPage />} />
                    <Route path="/fees" element={<AdmissionFeesPage />} />
                    <Route path="/queue" element={<AdmissionQueuePage />} />
                    <Route path="/communication" element={<ApplicantCommunicationPage />} />
                    <Route path="/reports" element={<AdmissionsReportsPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
