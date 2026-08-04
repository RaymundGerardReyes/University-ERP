import { AuthGuard } from '@university-erp/shell-kit';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { EnrollmentApprovalsPage } from '../features/Admissions/EnrollmentApprovals.page';
import { AdvisingPage } from '../features/Advising/Advising.page';
import { AnalyticsPage } from '../features/Analytics/Analytics.page';
import { AssessmentsPage } from '../features/Assessments/Assessments.page';
import { CommunicationPage } from '../features/Communication/Communication.page';
import { DashboardPage } from '../features/Dashboard/Dashboard.page';
import { ResearchPage } from '../features/Research/Research.page';
import { SchedulePage } from '../features/Schedule/Schedule.page';
import { StudentsDashboardPage } from '../features/Students/StudentsDashboard.page';
import { TeachingDashboardPage } from '../features/Teaching/TeachingDashboard.page';
import { AppShell } from './AppShell';

export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Core Academics */}
          <Route path="/teaching" element={<TeachingDashboardPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/students" element={<StudentsDashboardPage />} />

          {/* Administration & Advising */}
          <Route path="/admissions" element={<EnrollmentApprovalsPage />} />
          <Route path="/advising" element={<AdvisingPage />} />

          {/* Professional & Connect */}
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}