import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import { useAdmissionStatus } from './AdmissionStatus.hooks';
export const AdmissionStatusPage = () => {
    const { data: applications, isLoading, isError } = useAdmissionStatus();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading admission status..." });
    if (isError || !applications)
        return _jsx("div", { style: { color: 'var(--danger-text)' }, children: "Failed to load admission data." });
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Admission Status" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, children: applications.map((app) => (_jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 var(--space-2) 0', fontSize: '1.1rem' }, children: app.programName }), _jsxs("div", { style: { display: 'flex', gap: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: '0.85rem' }, children: [_jsxs("span", { children: [_jsx("strong", { style: { color: 'var(--text-primary)' }, children: "ID:" }), " ", app.id] }), _jsxs("span", { children: [_jsx("strong", { style: { color: 'var(--text-primary)' }, children: "Submitted:" }), " ", new Date(app.submittedDate).toLocaleDateString()] })] })] }), _jsx(Badge, { colorScheme: app.status === 'Enrolled' || app.status === 'Accepted' ? 'success' : 'warning', children: app.status })] }) }, app.id))) })] }));
};
