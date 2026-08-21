import { AuthGuard } from '@university-erp/shell-kit';
import { FinanceGuard } from '@university-erp/auth-sdk';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell';

// Workspaces
import { TuitionAssessmentPage } from '../features/TuitionAssessment/TuitionAssessment.page';
import { StatementOfAccountPage } from '../features/StudentBilling/StatementOfAccount.page';
import { ScholarshipGrantsPage } from '../features/StudentBilling/ScholarshipGrants.page';
import { StudentBillingPage } from '../features/StudentBilling/StudentBilling.page';
import { PaymentGatewayPage } from '../features/Cashier/PaymentGateway.page';
import { PaymentGatewayPage as PaymentGatewayMonitorPage } from '../features/PaymentGateway/PaymentGateway.page';
import { ClearanceApprovalPage } from '../features/Cashier/ClearanceApproval.page';

// New Enrollment Finance Workspace
import { AdmissionAssessmentPage } from '../features/EnrollmentFinance/AdmissionAssessment/AdmissionAssessment.page';
import { DownpaymentPage } from '../features/EnrollmentFinance/Downpayment/Downpayment.page';
import { FinancialClearancePage } from '../features/EnrollmentFinance/FinancialClearance/FinancialClearance.page';
import { SemesterBillingPage } from '../features/SemesterBilling/SemesterBilling.page';

export const Routing: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          
          {/* Enrollment Finance Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_ASSESSOR', 'ROLE_FINANCE_CASHIER']} />}>
            <Route path="/enrollment-finance/assessment" element={<AdmissionAssessmentPage />} />
            <Route path="/enrollment-finance/downpayment" element={<DownpaymentPage />} />
            <Route path="/enrollment-finance/clearance" element={<FinancialClearancePage />} />
          </Route>

          {/* Tuition Assessment Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_ASSESSOR']} />}>
            <Route path="/assessment/tuition" element={<TuitionAssessmentPage />} />
          </Route>

          {/* Student Billing Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_ASSESSOR']} />}>
            <Route path="/billing/statement" element={<StatementOfAccountPage />} />
            <Route path="/billing/scholarships" element={<ScholarshipGrantsPage />} />
            <Route path="/billing/semester" element={<SemesterBillingPage />} />
            <Route path="/billing/administration" element={<StudentBillingPage />} />
          </Route>

          {/* Cashier & Payments Workspace */}
          <Route element={<FinanceGuard allowedRoles={['ROLE_FINANCE_ADMIN', 'ROLE_FINANCE_CASHIER']} />}>
            <Route path="/cashier/payments" element={<PaymentGatewayPage />} />
            <Route path="/cashier/monitor" element={<PaymentGatewayMonitorPage />} />
            <Route path="/cashier/gateway" element={<PaymentGatewayMonitorPage />} />
            <Route path="/cashier/clearance" element={<ClearanceApprovalPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/enrollment-finance/assessment" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
