import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createLogger } from '@university-erp/core-logger';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuthGuard } from './AuthGuard';
import { NavigationLogger } from './NavigationLogger';
// Feature Imports
import { AlumniNetworkPage } from '../features/AlumniNetwork/AlumniNetwork.page';
import { CareerDashboardPage } from '../features/CareerDashboard/CareerDashboard.page';
import { GuidanceSessionsPage } from '../features/GuidanceSessions/GuidanceSessions.page';
import { HealthRecordsPage } from '../features/HealthRecords/HealthRecords.page';
import { HostelAllocationPage } from '../features/HostelAllocation/HostelAllocation.page';
import { MyEnrollmentsPage } from '../features/MyEnrollments/MyEnrollments.page';
import { StudentProfilePage } from '../features/StudentProfile/StudentProfile.page';
const logger = createLogger('student-portal', 'Routing');
export const Routing = () => {
    logger.debug('Building application route tree');
    return (_jsxs(BrowserRouter, { children: [_jsx(NavigationLogger, {}), _jsx(Routes, { children: _jsxs(Route, { element: _jsx(AuthGuard, { children: _jsx(AppShell, {}) }), children: [_jsx(Route, { path: "/profile", element: _jsx(StudentProfilePage, {}) }), _jsx(Route, { path: "/enrollments", element: _jsx(MyEnrollmentsPage, {}) }), _jsx(Route, { path: "/hostel", element: _jsx(HostelAllocationPage, {}) }), _jsx(Route, { path: "/health", element: _jsx(HealthRecordsPage, {}) }), _jsx(Route, { path: "/guidance", element: _jsx(GuidanceSessionsPage, {}) }), _jsx(Route, { path: "/career", element: _jsx(CareerDashboardPage, {}) }), _jsx(Route, { path: "/alumni", element: _jsx(AlumniNetworkPage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/profile", replace: true }) })] }) })] }));
};
