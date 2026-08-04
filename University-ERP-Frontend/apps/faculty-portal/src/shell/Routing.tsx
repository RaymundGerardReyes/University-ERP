import { AuthGuard } from '@university-erp/shell-kit';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AdvisingPage } from '../features/Advising/Advising.page';
import { AnalyticsPage } from '../features/Analytics/Analytics.page';
import { AssessmentsPage } from '../features/Assessments/Assessments.page';
import { CommunicationPage } from '../features/Communication/Communication.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { DocumentsPage } from '../features/Documents/Documents.page'; // <-- IMPORT
import { ResearchPage } from '../features/Research/Research.page';
import { SchedulePage } from '../features/Schedule/Schedule.page';
import { SettingsPage } from '../features/Settings/Settings.page'; // <-- IMPORT
import { StudentsDashboardPage } from '../features/Students/StudentsDashboard.page';
import { TeachingDashboardPage } from '../features/Teaching/TeachingDashboard.page';
import { AppShell } from './AppShell';

export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />

          <Route path="/teaching" element={<TeachingDashboardPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/students" element={<StudentsDashboardPage />} />

          <Route path="/advising" element={<AdvisingPage />} />

          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/research" element={<ResearchPage />} />

          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}