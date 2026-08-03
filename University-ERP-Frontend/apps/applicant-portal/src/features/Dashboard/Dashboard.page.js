import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, PageHeader } from '@university-erp/ui-kit';
import { useApplicantJourney } from '../ApplicantJourney.hooks';
export const DashboardPage = () => {
    const { data, isLoading } = useApplicantJourney();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading your journey..." });
    if (!data)
        return null;
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: `Welcome, ${data.applicantName}`, subtitle: `Applicant ID: ${data.applicantId}` }), _jsxs(Card, { children: [_jsx("h3", { style: { margin: '0 0 var(--space-4) 0', color: 'var(--text-primary)' }, children: "Your Admissions Journey" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }, children: data.milestones.map(m => {
                            let color = 'var(--text-secondary)';
                            let icon = '⏳';
                            let bg = 'var(--bg-base)';
                            if (m.status === 'Completed') {
                                color = 'var(--success-text)';
                                icon = '✔';
                                bg = 'var(--success-bg)';
                            }
                            else if (m.status === 'Active') {
                                color = 'var(--brand-primary)';
                                icon = '▶';
                                bg = 'var(--brand-primary-light, rgba(0, 112, 243, 0.1))'; // Assuming primary light exists
                            }
                            else if (m.status === 'Locked') {
                                color = 'var(--text-muted)';
                                icon = '🔒';
                            }
                            return (_jsxs("div", { style: {
                                    display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: bg,
                                    border: '1px solid var(--border-subtle)',
                                    opacity: m.status === 'Locked' ? 0.6 : 1
                                }, children: [_jsx("div", { style: { fontSize: '1.25rem' }, children: icon }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("h4", { style: { margin: '0 0 var(--space-1) 0', color: m.status === 'Completed' ? 'var(--text-primary)' : color }, children: m.title }), _jsx("p", { style: { margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }, children: m.description })] }), m.dateCompleted && (_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)' }, children: m.dateCompleted }))] }, m.id));
                        }) })] })] }));
};
