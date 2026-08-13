import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { ApplicationsPage } from '../features/Applications/Applications.page';
import { AdmissionCasePage } from '../features/Applications/AdmissionCase.page';
import { ApplicantCommunicationPage } from '../features/Communication/ApplicantCommunication.page';
import { AdmissionsReportsPage } from '../features/Reports/AdmissionsReports.page';

export const Routing: React.FC = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '/admissions-portal/'}>
            <Routes>
                <Route element={<AuthGuard><AppShell /></AuthGuard>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/applications/:id" element={<AdmissionCasePage />} />
                    <Route path="/communications" element={<ApplicantCommunicationPage />} />
                    <Route path="/reports" element={<AdmissionsReportsPage />} />

                    {/* Legacy redirects — old links still work */}
                    <Route path="/intake" element={<Navigate to="/applications" replace />} />
                    <Route path="/queue" element={<Navigate to="/applications" replace />} />
                    <Route path="/cases" element={<Navigate to="/applications" replace />} />
                    <Route path="/verification" element={<Navigate to="/applications" replace />} />
                    <Route path="/review" element={<Navigate to="/applications" replace />} />
                    <Route path="/requirements" element={<Navigate to="/applications" replace />} />
                    <Route path="/interviews" element={<Navigate to="/applications" replace />} />
                    <Route path="/examination" element={<Navigate to="/applications" replace />} />
                    <Route path="/decisions" element={<Navigate to="/applications" replace />} />
                    <Route path="/handoff" element={<Navigate to="/applications" replace />} />
                    <Route path="/fees" element={<Navigate to="/applications" replace />} />
                    <Route path="/communication" element={<Navigate to="/communications" replace />} />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
