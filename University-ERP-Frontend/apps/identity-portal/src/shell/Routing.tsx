import { AuthGuard } from '@university-erp/shell-kit';
import { IdentityGuard, AuthProvider } from '@university-erp/auth-sdk';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell';
import { LoginPage } from '../features/UserLogin/UserLogin.page';

// Workspaces
import { AccountProvisioningPage } from '../features/UniversityAccount/AccountProvisioning.page';
import { DirectorySearchPage } from '../features/UniversityAccount/DirectorySearch.page';
import { EmailProvisioningPage } from '../features/Email/EmailProvisioning.page';
import { MFASetupPage } from '../features/MFA/MFASetup.page';
import { AccessRevocationPage } from '../features/MFA/AccessRevocation.page';

export const Routing: React.FC = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<AuthProvider><AuthGuard><AppShell /></AuthGuard></AuthProvider>}>
          
          <Route element={<IdentityGuard allowedRoles={['ROLE_IDENTITY_ADMIN', 'ROLE_IDENTITY_OPERATOR']} />}>
            <Route path="/account/provisioning" element={<AccountProvisioningPage />} />
            <Route path="/account/directory" element={<DirectorySearchPage />} />
            <Route path="/email/provisioning" element={<EmailProvisioningPage />} />
          </Route>

          <Route element={<IdentityGuard allowedRoles={['ROLE_IDENTITY_ADMIN', 'ROLE_IDENTITY_AUDITOR']} />}>
            <Route path="/mfa/setup" element={<MFASetupPage />} />
            <Route path="/mfa/revocation" element={<AccessRevocationPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/account/directory" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};