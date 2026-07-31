import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import AuthGuard from './AuthGuard';

import UserLogin from '@features/UserLogin/UserLogin.page';
import UserRegistration from '@features/UserRegistration/UserRegistration.page';
import PasswordReset from '@features/PasswordReset/PasswordReset.page';
import MfaVerification from '@features/MfaVerification/MfaVerification.page';
import SessionManagement from '@features/SessionManagement/SessionManagement.page';
import SecuritySettings from '@features/SecuritySettings/SecuritySettings.page';

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* Public Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/mfa" element={<MfaVerification />} />
          
          {/* Protected Routes */}
          <Route element={<AuthGuard />}>
            <Route path="/sessions" element={<SessionManagement />} />
            <Route path="/security" element={<SecuritySettings />} />
          </Route>
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
