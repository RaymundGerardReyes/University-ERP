import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './AppShell';

// Features
import { AcademicConfigurationPage } from '../features/AcademicConfiguration/AcademicConfiguration.page';
import { AuditCompliancePage } from '../features/AuditCompliance/AuditCompliance.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { IdentitySecurityPage } from '../features/IdentitySecurity/IdentitySecurity.page';
import { IntegrationManagementPage } from '../features/IntegrationManagement/IntegrationManagement.page';
import { OrganizationManagementPage } from '../features/OrganizationManagement/OrganizationManagement.page';
import { PlatformMonitoringPage } from '../features/PlatformMonitoring/PlatformMonitoring.page';
import { ReportsPage } from '../features/Reports/Reports.page';
import { RoleAdministrationPage } from '../features/RoleAdministration/RoleAdministration.page';
import { SystemAdministrationPage } from '../features/SystemAdministration/SystemAdministration.page';
import { UserAdministrationPage } from '../features/UserAdministration/UserAdministration.page';
import { WorkflowManagementPage } from '../features/WorkflowManagement/WorkflowManagement.page';

export const Routing: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthGuard><AppShell /></AuthGuard>}>
                    {/* Overview */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/monitoring" element={<PlatformMonitoringPage />} />

                    {/* Access Control */}
                    <Route path="/users" element={<UserAdministrationPage />} />
                    <Route path="/roles" element={<RoleAdministrationPage />} />
                    <Route path="/security" element={<IdentitySecurityPage />} />

                    {/* Master Data */}
                    <Route path="/organization" element={<OrganizationManagementPage />} />
                    <Route path="/academic-config" element={<AcademicConfigurationPage />} />

                    {/* Platform Operations */}
                    <Route path="/workflows" element={<WorkflowManagementPage />} />
                    <Route path="/integrations" element={<IntegrationManagementPage />} />
                    <Route path="/system" element={<SystemAdministrationPage />} />
                    <Route path="/audit" element={<AuditCompliancePage />} />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};