// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: AdmissionFees
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/Fees/AdmissionFees.page.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useQuery } from '@tanstack/react-query';
import { AdmissionFeesPage } from '../../../apps/admissions-portal/src/features/Fees/AdmissionFees.page';

vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn()
}));
vi.mock('@university-erp/api-clients', () => ({
    financeApi: {
        getInvoices: vi.fn()
    }
}));

describe('Admissions Portal - Fees Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default window.alert mock
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: false });
    });

    const setup = () => render(<AdmissionFeesPage />);

    it('UT-FEES-001: Renders the PageHeader with correct title "Admission Fees"', () => {
        setup();
        expect(screen.getByText('Admission Fees')).toBeDefined();
    });

    it('UT-FEES-002: Renders the PageHeader subtitle correctly', () => {
        setup();
        expect(screen.getByText(/Track application fee payments and financial clearances/i)).toBeDefined();
    });

    it('UT-FEES-003: Renders "TOTAL INVOICES" KPI card label', () => {
        setup();
        expect(screen.getByText('TOTAL INVOICES')).toBeDefined();
    });

    it('UT-FEES-004: Renders "PENDING PAYMENT" KPI card label', () => {
        setup();
        expect(screen.getByText('PENDING PAYMENT')).toBeDefined();
    });

    it('UT-FEES-005: Renders "PAID TODAY" KPI card label', () => {
        setup();
        expect(screen.getByText('PAID TODAY')).toBeDefined();
    });

    it('UT-FEES-006: KPI: Displays "..." for TOTAL INVOICES while loading', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        setup();
        const totalNode = screen.getByText('TOTAL INVOICES').nextElementSibling;
        expect(totalNode?.textContent).toBe('...');
    });

    it('UT-FEES-007: KPI: Displays "..." for PENDING PAYMENT while loading', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        setup();
        const pendingNode = screen.getByText('PENDING PAYMENT').nextElementSibling;
        expect(pendingNode?.textContent).toBe('...');
    });

    it('UT-FEES-008: KPI: Displays "..." for PAID TODAY while loading', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        setup();
        const paidNode = screen.getByText('PAID TODAY').nextElementSibling;
        expect(paidNode?.textContent).toBe('...');
    });

    it('UT-FEES-009: Table: Displays "Loading invoices..." row while loading', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        setup();
        expect(screen.getByText(/Loading invoices\.\.\./i)).toBeDefined();
    });

    it('UT-FEES-010: KPI: Computes TOTAL INVOICES count correctly when data exists', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, status: 'Pending' }, { id: 2, status: 'Paid' }, { id: 3, status: 'Pending' }],
            isLoading: false
        });
        setup();
        const totalNode = screen.getByText('TOTAL INVOICES').nextElementSibling;
        expect(totalNode?.textContent).toBe('3');
    });

    it('UT-FEES-011: KPI: Computes PENDING PAYMENT count correctly by filtering "Pending"', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, status: 'Pending' }, { id: 2, status: 'Paid' }, { id: 3, status: 'Pending' }],
            isLoading: false
        });
        setup();
        const pendingNode = screen.getByText('PENDING PAYMENT').nextElementSibling;
        expect(pendingNode?.textContent).toBe('2');
    });

    it('UT-FEES-012: KPI: Computes PAID TODAY count correctly by filtering "Paid"', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, status: 'Pending' }, { id: 2, status: 'Paid' }, { id: 3, status: 'Pending' }],
            isLoading: false
        });
        setup();
        const paidNode = screen.getByText('PAID TODAY').nextElementSibling;
        expect(paidNode?.textContent).toBe('1');
    });

    it('UT-FEES-013: KPI: Defaults TOTAL INVOICES to 0 when data is empty/undefined', () => {
        setup();
        const totalNode = screen.getByText('TOTAL INVOICES').nextElementSibling;
        expect(totalNode?.textContent).toBe('0');
    });

    it('UT-FEES-014: KPI: Defaults PENDING PAYMENT to 0 when data is empty/undefined', () => {
        setup();
        const pendingNode = screen.getByText('PENDING PAYMENT').nextElementSibling;
        expect(pendingNode?.textContent).toBe('0');
    });

    it('UT-FEES-015: KPI: Defaults PAID TODAY to 0 when data is empty/undefined', () => {
        setup();
        const paidNode = screen.getByText('PAID TODAY').nextElementSibling;
        expect(paidNode?.textContent).toBe('0');
    });

    it('UT-FEES-016: Table: Renders all expected column headers', () => {
        setup();
        expect(screen.getByText('Invoice ID')).toBeDefined();
        expect(screen.getByText('Applicant Name')).toBeDefined();
        expect(screen.getByText('Amount')).toBeDefined();
        expect(screen.getByText('Date')).toBeDefined();
        expect(screen.getByText('Status')).toBeDefined();
        expect(screen.getByText('Action')).toBeDefined();
    });

    it('UT-FEES-017: Table: Renders invoice ID properly in the row', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 'INV-12345', status: 'Pending' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('INV-12345')).toBeDefined();
    });

    it('UT-FEES-018: Table: Renders applicant name properly', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: '1', studentName: 'Alice Anderson', status: 'Pending' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('Alice Anderson')).toBeDefined();
    });

    it('UT-FEES-019: Table: Renders invoice amount properly', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: '1', amount: '250.00', status: 'Pending' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('$250.00')).toBeDefined();
    });

    it('UT-FEES-020: Table: Renders date accurately based on locale', () => {
        const mockDate = new Date('2026-09-04T00:00:00Z');
        (useQuery as any).mockReturnValue({
            data: [{ id: '1', dueDate: mockDate.toISOString(), status: 'Pending' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText(mockDate.toLocaleDateString())).toBeDefined();
    });

    it('UT-FEES-021: Badge: Renders "Pending" status correctly', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: '1', status: 'Pending' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('Pending')).toBeDefined();
    });

    it('UT-FEES-022: Badge: Renders "Paid" status correctly', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: '1', status: 'Paid' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('Paid')).toBeDefined();
    });

    it('UT-FEES-023: Button: Renders "View" button for each row', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: '1', status: 'Paid' }, { id: '2', status: 'Pending' }],
            isLoading: false
        });
        const { getAllByRole } = setup();
        const buttons = getAllByRole('button', { name: /view/i });
        expect(buttons.length).toBe(2);
    });

    it('UT-FEES-024: Action: Clicking "View" button triggers an alert with invoice ID', async () => {
        const user = userEvent.setup();
        (useQuery as any).mockReturnValue({
            data: [{ id: 'INV-TEST-99', status: 'Paid' }],
            isLoading: false
        });
        setup();
        
        const button = screen.getByRole('button', { name: /view/i });
        await user.click(button);
        
        expect(window.alert).toHaveBeenCalledWith('Viewing details for invoice ID: INV-TEST-99');
    });
});
