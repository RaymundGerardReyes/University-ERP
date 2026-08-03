import { createLogger } from '@university-erp/core-logger';
import React from 'react';
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