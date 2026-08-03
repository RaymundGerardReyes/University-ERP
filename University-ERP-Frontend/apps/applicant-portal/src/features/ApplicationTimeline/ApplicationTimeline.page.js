import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, PageHeader } from '@university-erp/ui-kit';
import { useApplicantJourney } from '../ApplicantJourney.hooks';
export const ApplicationTimelinePage = () => {
    const { data, isLoading } = useApplicantJourney();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading audit trail..." });
    if (!data)
        return null;
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Application Timeline", subtitle: "Detailed audit history of your admission journey." }), _jsxs(Card, { style: { position: 'relative', overflow: 'hidden' }, children: [_jsx("div", { style: { position: 'absolute', left: 'var(--space-6)', top: 'var(--space-6)', bottom: 'var(--space-6)', width: '2px', backgroundColor: 'var(--border-subtle)' } }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }, children: data.timeline.map((event, idx) => (_jsxs("div", { style: { display: 'flex', gap: 'var(--space-5)', position: 'relative', zIndex: 1 }, children: [_jsx("div", { style: {
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        backgroundColor: idx === 0 ? 'var(--brand-primary)' : 'var(--bg-base)',
                                        border: `2px solid ${idx === 0 ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                                        marginTop: 'var(--space-1)'
                                    } }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }, children: event.date }), _jsx("h4", { style: { margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)' }, children: event.event }), _jsx("p", { style: { margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }, children: event.detail })] })] }, idx))) })] })] }));
};
