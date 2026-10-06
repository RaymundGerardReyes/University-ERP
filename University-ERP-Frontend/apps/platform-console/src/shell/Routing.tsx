import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Platform Core Feature Slices
import NotificationPage from '../features/Notification/Notification.page';
import CommunicationPage from '../features/Communication/Communication.page';
import DocumentManagementPage from '../features/DocumentManagement/DocumentManagement.page';
import AnalyticsBIPage from '../features/AnalyticsBI/AnalyticsBI.page';
import CRMPage from '../features/CRM/CRM.page';
import MultiCampusPage from '../features/MultiCampus/MultiCampus.page';
import APIKeysPage from '../features/APIKeys/APIKeys.page';
import DatabaseManagementPage from '../features/DatabaseManagement/DatabaseManagement.page';
import GlobalSettingsPage from '../features/GlobalSettings/GlobalSettings.page';
import SecurityAuditsPage from '../features/SecurityAudits/SecurityAudits.page';
import SystemLogsPage from '../features/SystemLogs/SystemLogs.page';
import TenantManagementPage from '../features/TenantManagement/TenantManagement.page';

const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
    <nav style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Platform Console</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <li><Link to="/notifications" style={{ color: 'white', textDecoration: 'none' }}>Notifications</Link></li>
        <li><Link to="/communications" style={{ color: 'white', textDecoration: 'none' }}>Communications</Link></li>
        <li><Link to="/documents" style={{ color: 'white', textDecoration: 'none' }}>Document Management</Link></li>
        <li><Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics & BI</Link></li>
        <li><Link to="/crm" style={{ color: 'white', textDecoration: 'none' }}>CRM</Link></li>
        <li><Link to="/campus" style={{ color: 'white', textDecoration: 'none' }}>Multi-Campus</Link></li>
        <li><Link to="/api-keys" style={{ color: 'white', textDecoration: 'none' }}>API Keys</Link></li>
        <li><Link to="/database" style={{ color: 'white', textDecoration: 'none' }}>Database Management</Link></li>
        <li><Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>Global Settings</Link></li>
        <li><Link to="/security-audits" style={{ color: 'white', textDecoration: 'none' }}>Security Audits</Link></li>
        <li><Link to="/logs" style={{ color: 'white', textDecoration: 'none' }}>System Logs</Link></li>
        <li><Link to="/tenants" style={{ color: 'white', textDecoration: 'none' }}>Tenant Management</Link></li>
      </ul>
    </nav>
    <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f8fafc' }}>
      {children}
    </main>
  </div>
);

export const Routing = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell>
        <Routes>
          <Route path="/" element={<h1>Platform Dashboard Overview</h1>} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/communications" element={<CommunicationPage />} />
          <Route path="/documents" element={<DocumentManagementPage />} />
          <Route path="/analytics" element={<AnalyticsBIPage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/campus" element={<MultiCampusPage />} />
          <Route path="/api-keys" element={<APIKeysPage />} />
          <Route path="/database" element={<DatabaseManagementPage />} />
          <Route path="/settings" element={<GlobalSettingsPage />} />
          <Route path="/security-audits" element={<SecurityAuditsPage />} />
          <Route path="/logs" element={<SystemLogsPage />} />
          <Route path="/tenants" element={<TenantManagementPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};
