import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

import { AdmissionStatusPage } from '../features/AdmissionStatus/AdmissionStatus.page';

const Stub = ({ title }: { title: string }) => (
  <div className="stub-page fade-in">
    <div className="stub-icon">🚧</div>
    <div className="stub-title">{title}</div>
    <div className="stub-subtitle">This module is currently being built by the engineering team.</div>
  </div>
);

export const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/status" element={<AdmissionStatusPage />} />
          <Route path="/timeline" element={<Stub title="Application Timeline" />} />
          <Route path="/wizard" element={<Stub title="Application Wizard" />} />
          <Route path="/dashboard" element={<Stub title="Dashboard" />} />
          <Route path="/eligibility" element={<Stub title="Eligibility Checker" />} />
          <Route path="/approvals" element={<Stub title="Enrollment Approvals" />} />
          <Route path="/programs" element={<Stub title="Program Explorer" />} />
          <Route path="/documents" element={<Stub title="Document Submission" />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};