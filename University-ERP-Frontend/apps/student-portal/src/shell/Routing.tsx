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
import { MyEnrollmentsPage } from '../features/MyEnrollments/MyEnrollments.page';
import { StudentProfilePage } from '../features/StudentProfile/StudentProfile.page';
import { EnrollmentPage } from '../features/Enrollment/Enrollment.page';
import { TimetablePage } from '../features/Timetable/Timetable.page';
import { AcademicRecordPage } from '../features/AcademicRecord/AcademicRecord.page';
import { ClearancePage } from '../features/Clearance/Clearance.page';

const logger = createLogger('student-portal', 'Routing');

export const Routing: React.FC = () => {
  logger.debug('Building application route tree');

  return (
    <BrowserRouter>
      <NavigationLogger />
      <Routes>

        {/* PROTECTED ROUTES */}
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/profile" element={<StudentProfilePage />} />
          <Route path="/enrollments" element={<MyEnrollmentsPage />} />
          <Route path="/enrollment" element={<EnrollmentPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/records" element={<AcademicRecordPage />} />
          <Route path="/clearance" element={<ClearancePage />} />
          <Route path="/hostel" element={<HostelAllocationPage />} />
          <Route path="/health" element={<HealthRecordsPage />} />
          <Route path="/guidance" element={<GuidanceSessionsPage />} />
          <Route path="/career" element={<CareerDashboardPage />} />
          <Route path="/alumni" element={<AlumniNetworkPage />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/profile" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};