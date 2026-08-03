import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createLogger } from '@university-erp/core-logger';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuthGuard } from './AuthGuard';
// Journey Imports
import { AdmissionStatusPage } from '../features/AdmissionStatus/AdmissionStatus.page';
import { ApplicationTimelinePage } from '../features/ApplicationTimeline/ApplicationTimeline.page';
import { ApplicationWizardPage } from '../features/ApplicationWizard/ApplicationWizard.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { DocumentSubmissionPage } from '../features/DocumentSubmission/DocumentSubmission.page';
import { EligibilityCheckerPage } from '../features/EligibilityChecker/EligibilityChecker.page';
import { ProgramExplorerPage } from '../features/ProgramExplorer/ProgramExplorer.page';
const logger = createLogger('applicant-portal', 'Routing');
export const Routing = () => {
    logger.debug('Building applicant route tree');
    return (_jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(AuthGuard, { children: _jsx(AppShell, {}) }), children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/programs", element: _jsx(ProgramExplorerPage, {}) }), _jsx(Route, { path: "/eligibility", element: _jsx(EligibilityCheckerPage, {}) }), _jsx(Route, { path: "/apply", element: _jsx(ApplicationWizardPage, {}) }), _jsx(Route, { path: "/documents", element: _jsx(DocumentSubmissionPage, {}) }), _jsx(Route, { path: "/timeline", element: _jsx(ApplicationTimelinePage, {}) }), _jsx(Route, { path: "/admissions", element: _jsx(AdmissionStatusPage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) }) }));
};
