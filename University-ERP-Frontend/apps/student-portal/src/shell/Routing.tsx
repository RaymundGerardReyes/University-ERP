import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuthGuard } from './AuthGuard';

// Import Feature Pages
import { AdmissionStatusPage } from '../features/AdmissionStatus/AdmissionStatus.page';
import { AlumniNetworkPage } from '../features/AlumniNetwork/AlumniNetwork.page';
import { CareerDashboardPage } from '../features/CareerDashboard/CareerDashboard.page';
import { GuidanceSessionsPage } from '../features/GuidanceSessions/GuidanceSessions.page';
import { HealthRecordsPage } from '../features/HealthRecords/HealthRecords.page';
import { HostelAllocationPage } from '../features/HostelAllocation/HostelAllocation.page';
import { MyEnrollmentsPage } from '../features/MyEnrollments/MyEnrollments.page';
import { StudentProfilePage } from '../features/StudentProfile/StudentProfile.page';

export const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/profile" element={<StudentProfilePage />} />
          <Route path="/enrollments" element={<MyEnrollmentsPage />} />
          <Route path="/admissions" element={<AdmissionStatusPage />} />
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