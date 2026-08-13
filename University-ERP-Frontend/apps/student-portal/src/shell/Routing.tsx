import { createLogger } from '@university-erp/core-logger';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './AppShell';
import { AuthGuard } from '@university-erp/shell-kit';

import { NavigationLogger } from './NavigationLogger';

// Feature Imports
import { AlumniNetworkPage } from '../features/AlumniNetwork/AlumniNetwork.page';
import { CareerDashboardPage } from '../features/CareerDashboard/CareerDashboard.page';
import { GuidanceSessionsPage } from '../features/GuidanceSessions/GuidanceSessions.page';
import { HealthRecordsPage } from '../features/HealthRecords/HealthRecords.page';
import { HostelAllocationPage } from '../features/HostelAllocation/HostelAllocation.page';
import { StudentProfilePage } from '../features/StudentProfile/StudentProfile.page';
import { AcademicRecordPage } from '../features/AcademicRecord/AcademicRecord.page';

// New Student Self-Service Features
import { RegistrationPage } from '../features/Registration/Registration.page';
import { CrossEnrollmentPage } from '../features/CrossEnrollment/CrossEnrollment.page';
import { CurriculumProgressPage } from '../features/CurriculumProgress/CurriculumProgress.page';
import { EnrollmentHistoryPage } from '../features/EnrollmentHistory/EnrollmentHistory.page';
import { GraduationPage } from '../features/Graduation/Graduation.page';
import { SchedulePage } from '../features/Schedule/Schedule.page';
import { FinancialsPage } from '../features/Financials/Financials.page';

const logger = createLogger('student-portal', 'Routing');

export const Routing: React.FC = () => {
  logger.debug('Building application route tree');

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '/student-portal/'}>
      <NavigationLogger />
      <Routes>

        {/* PROTECTED ROUTES */}
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/profile" element={<StudentProfilePage />} />
          <Route path="/records" element={<AcademicRecordPage />} />
          <Route path="/hostel" element={<HostelAllocationPage />} />
          <Route path="/health" element={<HealthRecordsPage />} />
          <Route path="/guidance" element={<GuidanceSessionsPage />} />
          <Route path="/career" element={<CareerDashboardPage />} />
          <Route path="/alumni" element={<AlumniNetworkPage />} />

          {/* New Self-Service Routes */}
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/cross-enrollment" element={<CrossEnrollmentPage />} />
          <Route path="/curriculum-progress" element={<CurriculumProgressPage />} />
          <Route path="/enrollment-history" element={<EnrollmentHistoryPage />} />
          <Route path="/graduation" element={<GraduationPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/financials" element={<FinancialsPage />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/profile" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};