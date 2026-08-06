import { AuthGuard } from '@university-erp/shell-kit';
import { FinanceGuard } from '@university-erp/auth-sdk';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell';

// Workspaces
import { TuitionAssessmentPage } from '../features/TuitionAssessment/TuitionAssessment.page';
import { StatementOfAccountPage } from '../features/StudentBilling/StatementOfAccount.page';
import { ScholarshipGrantsPage } from '../features/StudentBilling/ScholarshipGrants.page';
import { PaymentGatewayPage } from '../features/Cashier/PaymentGateway.page';
import { ClearanceApprovalPage } from '../features/Cashier/ClearanceApproval.page';

export const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          
          {/* Tuition Assessment Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_ASSESSOR']} />}>
            <Route path="/assessment/tuition" element={<TuitionAssessmentPage />} />
          </Route>

          {/* Student Billing Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_ASSESSOR']} />}>
            <Route path="/billing/statement" element={<StatementOfAccountPage />} />
            <Route path="/billing/scholarships" element={<ScholarshipGrantsPage />} />
          </Route>

          {/* Cashier & Payments Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_CASHIER']} />}>
            <Route path="/cashier/payments" element={<PaymentGatewayPage />} />
            <Route path="/cashier/clearance" element={<ClearanceApprovalPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/assessment/tuition" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
