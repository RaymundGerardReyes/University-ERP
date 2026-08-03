import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useJobPostings } from './CareerDashboard.hooks';
export const CareerDashboardPage = () => {
    const { data: jobs, isLoading, isError } = useJobPostings();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading career opportunities..." });
    if (isError || !jobs)
        return _jsx("div", { style: { color: 'red' }, children: "Failed to load job postings." });
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Career & Placement Dashboard" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }, children: jobs.map(job => (_jsxs(Card, { children: [_jsx("h3", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }, children: job.jobTitle }), _jsx("h4", { style: { color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }, children: job.companyName }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }, children: [_jsxs("p", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }, children: ["\uD83D\uDCCD ", job.location] }), _jsxs("p", { style: { color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }, children: ["\uD83D\uDCC5 Apply by: ", new Date(job.deadline).toLocaleDateString()] })] }), _jsx("div", { style: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }, children: job.tags.map(tag => _jsx(Badge, { colorScheme: "info", children: tag }, tag)) }), _jsx(Button, { variant: "outline", style: { width: '100%' }, children: "Apply Now" })] }, job.id))) })] }));
};
