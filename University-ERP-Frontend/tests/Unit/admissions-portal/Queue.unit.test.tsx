// Test Type: Unit Testing
//
// Portal: admissions-portal
// Feature: AdmissionQueue
//
// Source References:
// University-ERP-Frontend/apps/admissions-portal/src/features/Queue/AdmissionQueue.page.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useQuery } from '@tanstack/react-query';
import { AdmissionQueuePage } from '../../../apps/admissions-portal/src/features/Queue/AdmissionQueue.page';

vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn()
}));
vi.mock('@university-erp/api-clients', () => ({
    admissionsApi: {
        getPendingApplications: vi.fn()
    }
}));

describe('Admissions Portal - Queue Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        (useQuery as any).mockReturnValue({ data: [], isLoading: false });
    });

    const setup = () => render(<AdmissionQueuePage />);

    it('UT-QUEUE-001: Renders the PageHeader with correct title "Application Queue"', () => {
        setup();
        expect(screen.getByText('Application Queue')).toBeDefined();
    });

    it('UT-QUEUE-002: Renders the PageHeader subtitle correctly', () => {
        setup();
        expect(screen.getByText(/Real-time pipeline of admissions processing/i)).toBeDefined();
    });

    it('UT-QUEUE-003: Renders "INBOX" column header', () => {
        setup();
        expect(screen.getByText('INBOX')).toBeDefined();
    });

    it('UT-QUEUE-004: Renders "IN REVIEW" column header', () => {
        setup();
        expect(screen.getByText('IN REVIEW')).toBeDefined();
    });

    it('UT-QUEUE-005: Renders "PENDING EXAM" column header', () => {
        setup();
        expect(screen.getByText('PENDING EXAM')).toBeDefined();
    });

    it('UT-QUEUE-006: Renders "COMMITTEE DECISION" column header', () => {
        setup();
        expect(screen.getByText('COMMITTEE DECISION')).toBeDefined();
    });

    it('UT-QUEUE-007: Column: Displays "Loading..." in Inbox when fetching data', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        const { container } = setup();
        // First column is Inbox
        const inboxCol = container.querySelector('div[style*="min-width: 320px"]');
        expect(inboxCol?.textContent).toContain('Loading...');
    });

    it('UT-QUEUE-008: Column: Displays "Loading..." in Review when fetching data', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        const { container } = setup();
        const cols = container.querySelectorAll('div[style*="min-width: 320px"]');
        expect(cols[1]?.textContent).toContain('Loading...');
    });

    it('UT-QUEUE-009: Column: Displays "Loading..." in Exam when fetching data', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        const { container } = setup();
        const cols = container.querySelectorAll('div[style*="min-width: 320px"]');
        expect(cols[2]?.textContent).toContain('Loading...');
    });

    it('UT-QUEUE-010: Column: Displays "Loading..." in Decision when fetching data', () => {
        (useQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        const { container } = setup();
        const cols = container.querySelectorAll('div[style*="min-width: 320px"]');
        expect(cols[3]?.textContent).toContain('Loading...');
    });

    it('UT-QUEUE-011: Grouping: Places "Pending Intake" stage into the Inbox column', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, name: 'Alice Intake', stage: 'Pending Intake' }],
            isLoading: false
        });
        const { container } = setup();
        const inboxCol = container.querySelectorAll('div[style*="min-width: 320px"]')[0];
        expect(inboxCol.textContent).toContain('Alice Intake');
    });

    it('UT-QUEUE-012: Grouping: Places "SecretaryQueue" stage into the Inbox column', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 2, name: 'Bob Secretary', stage: 'SecretaryQueue' }],
            isLoading: false
        });
        const { container } = setup();
        const inboxCol = container.querySelectorAll('div[style*="min-width: 320px"]')[0];
        expect(inboxCol.textContent).toContain('Bob Secretary');
    });

    it('UT-QUEUE-013: Grouping: Places "DeanEndorsement" stage into the Review column', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 3, name: 'Charlie Dean', stage: 'DeanEndorsement' }],
            isLoading: false
        });
        const { container } = setup();
        const reviewCol = container.querySelectorAll('div[style*="min-width: 320px"]')[1];
        expect(reviewCol.textContent).toContain('Charlie Dean');
    });

    it('UT-QUEUE-014: Grouping: Places "ChairpersonQueue" stage into the Review column', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 4, name: 'Dave Chair', stage: 'ChairpersonQueue' }],
            isLoading: false
        });
        const { container } = setup();
        const reviewCol = container.querySelectorAll('div[style*="min-width: 320px"]')[1];
        expect(reviewCol.textContent).toContain('Dave Chair');
    });

    it('UT-QUEUE-015: Grouping: Places "ExamScheduled" stage into the Exam column', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 5, name: 'Eve Exam', stage: 'ExamScheduled' }],
            isLoading: false
        });
        const { container } = setup();
        const examCol = container.querySelectorAll('div[style*="min-width: 320px"]')[2];
        expect(examCol.textContent).toContain('Eve Exam');
    });

    it('UT-QUEUE-016: Grouping: Places any other stage into the Decision column', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 6, name: 'Frank Decision', stage: 'FinalApproval' }],
            isLoading: false
        });
        const { container } = setup();
        const decisionCol = container.querySelectorAll('div[style*="min-width: 320px"]')[3];
        expect(decisionCol.textContent).toContain('Frank Decision');
    });

    it('UT-QUEUE-017: Card: Renders applicant name correctly', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 7, name: 'George Test', stage: 'Pending Intake' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('George Test')).toBeDefined();
    });

    it('UT-QUEUE-018: Card: Renders applicant date accurately', () => {
        const mockDate = new Date('2026-09-04T00:00:00Z');
        (useQuery as any).mockReturnValue({
            data: [{ id: 8, name: 'Date Test', stage: 'Pending Intake', submittedAt: mockDate.toISOString() }],
            isLoading: false
        });
        setup();
        expect(screen.getByText(mockDate.toLocaleDateString())).toBeDefined();
    });

    it('UT-QUEUE-019: Card: Renders applicant program/department', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 9, name: 'Program Test', stage: 'Pending Intake', program: 'Computer Science' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('Computer Science')).toBeDefined();
    });

    it('UT-QUEUE-020: Card: Renders fallback "N/A" if program is missing', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 10, name: 'No Program', stage: 'Pending Intake' }],
            isLoading: false
        });
        setup();
        expect(screen.getByText('N/A')).toBeDefined();
    });

    it('UT-QUEUE-021: Badge: Renders correct count badge for Inbox', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, stage: 'Pending Intake' }, { id: 2, stage: 'Pending Intake' }],
            isLoading: false
        });
        const { container } = setup();
        const inboxCol = container.querySelectorAll('div[style*="min-width: 320px"]')[0];
        // The count is rendered in a span (Badge)
        expect(inboxCol.querySelector('span')?.textContent).toBe('2');
    });

    it('UT-QUEUE-022: Badge: Renders correct count badge for Review', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, stage: 'DeanEndorsement' }],
            isLoading: false
        });
        const { container } = setup();
        const reviewCol = container.querySelectorAll('div[style*="min-width: 320px"]')[1];
        expect(reviewCol.querySelector('span')?.textContent).toBe('1');
    });

    it('UT-QUEUE-023: Badge: Renders correct count badge for Exam', () => {
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, stage: 'ExamScheduled' }, { id: 2, stage: 'ExamScheduled' }, { id: 3, stage: 'ExamScheduled' }],
            isLoading: false
        });
        const { container } = setup();
        const examCol = container.querySelectorAll('div[style*="min-width: 320px"]')[2];
        expect(examCol.querySelector('span')?.textContent).toBe('3');
    });

    it('UT-QUEUE-024: Badge: Renders correct count badge for Decision', () => {
        (useQuery as any).mockReturnValue({
            data: [],
            isLoading: false
        });
        const { container } = setup();
        const decisionCol = container.querySelectorAll('div[style*="min-width: 320px"]')[3];
        expect(decisionCol.querySelector('span')?.textContent).toBe('0');
    });

    it('UT-QUEUE-025: Action: Clicking an application card triggers alert', async () => {
        const user = userEvent.setup();
        (useQuery as any).mockReturnValue({
            data: [{ id: 1, name: 'Click Test', stage: 'Pending Intake' }],
            isLoading: false
        });
        setup();
        const card = screen.getByText('Click Test');
        await user.click(card);
        expect(window.alert).toHaveBeenCalledWith('Opening details for Click Test');
    });

    it('UT-QUEUE-026: Gracefully handles completely empty array fallback', () => {
        (useQuery as any).mockReturnValue({
            data: [],
            isLoading: false
        });
        const { container } = setup();
        const cols = container.querySelectorAll('div[style*="min-width: 320px"]');
        expect(cols[0].querySelector('span')?.textContent).toBe('0');
        expect(cols[1].querySelector('span')?.textContent).toBe('0');
        expect(cols[2].querySelector('span')?.textContent).toBe('0');
        expect(cols[3].querySelector('span')?.textContent).toBe('0');
    });
});
