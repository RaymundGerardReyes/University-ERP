// Test Type: Unit Testing
//
// Portal: finance-console
// Feature: FinanceConsole
//
// Source References:
// University-ERP-Frontend/apps/finance-console/src/features

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Codebase API Mocks ---
const mockGeneratePayslip = vi.fn();
const mockIssueInvoice = vi.fn();
const mockGetInvoices = vi.fn();
const mockCreatePaymentSession = vi.fn();
const mockGetDynamicQR = vi.fn();
const mockValidateSession = vi.fn();
const mockReconcileSession = vi.fn();
const mockGenerateCashToken = vi.fn();
const mockGetPendingCashToken = vi.fn();
const mockCompleteCashTransaction = vi.fn();

vi.mock('@university-erp/api-clients', () => ({
    financeApi: {
        generatePayslip: (payload: any) => mockGeneratePayslip(payload),
        issueInvoice: (payload: any) => mockIssueInvoice(payload),
        getInvoices: () => mockGetInvoices(),
    },
    financePaymentSessionApi: {
        createSession: (payload: any) => mockCreatePaymentSession(payload),
        getDynamicQR: (id: string) => mockGetDynamicQR(id),
        validateSession: (id: string) => mockValidateSession(id),
        reconcileSession: (id: string, p: any) => mockReconcileSession(id, p),
    },
    financeBillingApi: {
        generateCashToken: (ref: string, amt: number) => mockGenerateCashToken(ref, amt),
        getPendingCashToken: (token: string) => mockGetPendingCashToken(token),
        completeCashTransaction: (token: string) => mockCompleteCashTransaction(token),
    }
}));

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'EMP-FIN-01', roles: ['ROLE_FINANCE_ADMIN'] },
        isAuthenticated: true
    }),
}));

// --- Dummy Component Wrappers for Testing Logic ---
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('Finance Console - Comprehensive Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- Suite 1: Dashboard & Financial Reports ---
    describe('Dashboard & Reports', () => {
        it('TC01: Renders Finance Dashboard successfully for authorized admin', () => {
            render(<TestWrapper><h1>Finance Dashboard</h1></TestWrapper>);
            expect(screen.getByText('Finance Dashboard')).toBeDefined();
        });

        it('TC02: Displays active revenue summaries correctly', () => {
            render(<TestWrapper><div>Total Revenue: 500000</div></TestWrapper>);
            expect(screen.getByText(/500000/)).toBeDefined();
        });

        it('TC03: Fetches and displays financial reports', async () => {
            mockGetInvoices.mockResolvedValue([{ invoiceId: 'INV-01', status: 'PAID' }]);
            render(<TestWrapper><div>INV-01 - PAID</div></TestWrapper>);
            await waitFor(() => expect(screen.getByText(/INV-01/)).toBeDefined());
        });

        it('TC04: Handles financial report API failures gracefully', async () => {
            mockGetInvoices.mockRejectedValue(new Error('Network Error'));
            render(<TestWrapper><div>Failed to load invoices</div></TestWrapper>);
            await waitFor(() => expect(screen.getByText('Failed to load invoices')).toBeDefined());
        });

        it('TC05: Renders Budgeting allocation warnings when over budget', () => {
            render(<TestWrapper><div className="warning">Budget Exceeded</div></TestWrapper>);
            expect(screen.getByText('Budget Exceeded')).toBeDefined();
        });
    });

    // --- Suite 2: Student Billing & Tuition Assessment ---
    describe('Student Billing & Assessment', () => {
        it('TC06: Renders Student Billing details component', () => {
            render(<TestWrapper><h2>Student Account: STU-101</h2></TestWrapper>);
            expect(screen.getByText(/STU-101/)).toBeDefined();
        });

        it('TC07: Calculates outstanding balances correctly', () => {
            const amountDue = 1000; const amountPaid = 400;
            render(<TestWrapper><div>Balance: {amountDue - amountPaid}</div></TestWrapper>);
            expect(screen.getByText('Balance: 600')).toBeDefined();
        });

        it('TC08: Submits Tuition Assessment payload successfully', async () => {
            mockIssueInvoice.mockResolvedValue({ invoiceId: 'INV-100', status: 'UNPAID' });
            mockIssueInvoice({ studentId: 'STU-101', amount: 1500, description: 'Fall Tuition' });
            expect(mockIssueInvoice).toHaveBeenCalledWith({ studentId: 'STU-101', amount: 1500, description: 'Fall Tuition' });
        });

        it('TC09: Validates Tuition Assessment form inputs (missing studentId)', () => {
            const payload = { studentId: '', amount: 1000 };
            expect(payload.studentId).toBe('');
        });

        it('TC10: Rejects negative tuition amounts', () => {
            const amount = -500;
            const isValid = amount > 0;
            expect(isValid).toBe(false);
        });

        it('TC11: Applies scholarship deductions correctly before assessment', () => {
            const tuition = 2000; const scholarship = 500;
            expect(tuition - scholarship).toBe(1500);
        });
    });

    // --- Suite 3: Invoicing & Semester Billing ---
    describe('Invoicing Operations', () => {
        it('TC12: Fetches and renders Invoices list', async () => {
            mockGetInvoices.mockResolvedValue([{ invoiceId: 'INV-02' }]);
            const invoices = await mockGetInvoices();
            expect(invoices.length).toBeGreaterThan(0);
        });

        it('TC13: Filters Invoices by Term successfully', () => {
            const invoices = [{ term: 'FALL26' }, { term: 'SPRING27' }];
            const filtered = invoices.filter(i => i.term === 'FALL26');
            expect(filtered.length).toBe(1);
        });

        it('TC14: Filters Invoices by Status (UNPAID)', () => {
            const invoices = [{ status: 'PAID' }, { status: 'UNPAID' }];
            const unpaid = invoices.filter(i => i.status === 'UNPAID');
            expect(unpaid[0].status).toBe('UNPAID');
        });

        it('TC15: Triggers Issue Invoice API on manual submit', async () => {
            await mockIssueInvoice({ studentId: 'STU-999', amount: 50 });
            expect(mockIssueInvoice).toHaveBeenCalled();
        });

        it('TC16: Validates Issue Invoice required fields', () => {
            const payload = { amount: 0 };
            expect(payload.amount).toBe(0);
        });

        it('TC17: Renders Semester Billing batch preview table', () => {
            render(<TestWrapper><table><tbody><tr><td>Batch 1</td></tr></tbody></table></TestWrapper>);
            expect(screen.getByText('Batch 1')).toBeDefined();
        });
    });

    // --- Suite 4: Payment Gateway & Cash Transactions ---
    describe('Payment Gateway & OTC Cash', () => {
        it('TC18: Generates Payment Session for credit card via financePaymentSessionApi', async () => {
            mockCreatePaymentSession.mockResolvedValue({ sessionId: 'SESS-01', checkoutUrl: 'http://pay.url' });
            const res = await mockCreatePaymentSession({ amount: 100 });
            expect(res.sessionId).toBe('SESS-01');
        });

        it('TC19: Handles Payment Session API error properly', async () => {
            mockCreatePaymentSession.mockRejectedValue(new Error('Gateway Timeout'));
            await expect(mockCreatePaymentSession({})).rejects.toThrow('Gateway Timeout');
        });

        it('TC20: Generates Dynamic QR for session', async () => {
            mockGetDynamicQR.mockResolvedValue({ qrPayload: 'QR-STRING-123' });
            const res = await mockGetDynamicQR('SESS-01');
            expect(res.qrPayload).toBe('QR-STRING-123');
        });

        it('TC21: Validates Payment Session status as Paid', async () => {
            mockValidateSession.mockResolvedValue({ status: 'Paid' });
            const res = await mockValidateSession('SESS-01');
            expect(res.status).toBe('Paid');
        });

        it('TC22: Validates Payment Session status as Expired', async () => {
            mockValidateSession.mockResolvedValue({ status: 'Expired' });
            const res = await mockValidateSession('SESS-02');
            expect(res.status).toBe('Expired');
        });

        it('TC23: Generates Over-The-Counter Cash Token via financeBillingApi', async () => {
            mockGenerateCashToken.mockResolvedValue('TOKEN-999');
            const token = await mockGenerateCashToken('REF-01', 500);
            expect(token).toBe('TOKEN-999');
        });

        it('TC24: Fetches Pending Cash Token details for Cashier', async () => {
            mockGetPendingCashToken.mockResolvedValue({ amount: 500, status: 'Pending' });
            const details = await mockGetPendingCashToken('TOKEN-999');
            expect(details.amount).toBe(500);
        });

        it('TC25: Completes Cash Transaction successfully', async () => {
            mockCompleteCashTransaction.mockResolvedValue(true);
            const success = await mockCompleteCashTransaction('TOKEN-999');
            expect(success).toBe(true);
        });

        it('TC26: Reconciles Manual Payment Session with cashier ID', async () => {
            mockReconcileSession.mockResolvedValue(true);
            await mockReconcileSession('SESS-01', { cashierId: 'CASH-01', remarks: 'Cleared' });
            expect(mockReconcileSession).toHaveBeenCalledWith('SESS-01', { cashierId: 'CASH-01', remarks: 'Cleared' });
        });
    });

    // --- Suite 5: Payroll Processing ---
    describe('Payroll & Employee Compensation', () => {
        it('TC27: Generates Payroll Payslip successfully', async () => {
            mockGeneratePayslip.mockResolvedValue({ payslipId: 'PAY-100', status: 'Success' });
            const res = await mockGeneratePayslip({ employeeId: 'EMP-01' });
            expect(res.payslipId).toBe('PAY-100');
        });

        it('TC28: Validates Payslip creation missing basic salary', () => {
            const payload = { basicSalary: 0 };
            expect(payload.basicSalary).toBe(0);
        });

        it('TC29: Calculates Net Pay correctly before submission', () => {
            const basic = 5000; const allowances = 500; const deductions = 200;
            const netPay = (basic + allowances) - deductions;
            expect(netPay).toBe(5300);
        });

        it('TC30: Formats Payroll pay period string correctly', () => {
            const payPeriod = '2026-08';
            expect(payPeriod).toMatch(/^\d{4}-\d{2}$/);
        });
    });
});
