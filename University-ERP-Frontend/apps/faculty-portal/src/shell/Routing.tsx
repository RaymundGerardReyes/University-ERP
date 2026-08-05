import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

// Implemented Features
import { AdvisingPage } from '../features/Advising/Advising.page';

// Stub Generator
const Stub = ({ title }: { title: string }) => (
  <div className="stub-page fade-in">
    <div className="stub-icon">🚧</div>
    <div className="stub-title">{title}</div>
    <div className="stub-subtitle">This module is currently under development in the ERP architecture.</div>
  </div>
);

export const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          <Route path="/advising" element={<AdvisingPage />} />

          {/* Faculty Features Stubs */}
          <Route path="/analytics" element={<Stub title="Academic Analytics" />} />
          <Route path="/assessments" element={<Stub title="Assessments & Gradebook" />} />
          <Route path="/communication" element={<Stub title="Communication Hub" />} />
          <Route path="/dashboard" element={<Stub title="Faculty Workspace" />} />
          <Route path="/documents" element={<Stub title="Document Management" />} />
          <Route path="/research" element={<Stub title="Research & Grants" />} />
          <Route path="/schedule" element={<Stub title="Class Schedule" />} />
          <Route path="/settings" element={<Stub title="Faculty Settings" />} />
          <Route path="/students" element={<Stub title="Student Roster" />} />
          <Route path="/teaching" element={<Stub title="Teaching & Materials" />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};