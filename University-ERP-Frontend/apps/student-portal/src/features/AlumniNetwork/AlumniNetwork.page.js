import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import { useAlumniStatus } from './AlumniNetwork.hooks';
export const AlumniNetworkPage = () => {
    const { data: alumni, isLoading, isError } = useAlumniStatus();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading alumni profile..." });
    if (isError || !alumni)
        return _jsx("div", { style: { color: 'red' }, children: "Failed to load alumni data." });
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Alumni Network" }), _jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }, children: [_jsxs("div", { children: [_jsxs("h2", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }, children: ["Class of ", alumni.graduationYear] }), _jsxs("p", { style: { color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }, children: ["Regional Chapter: ", _jsx("strong", { children: alumni.chapter || 'Unassigned' })] }), _jsx("h4", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }, children: "Active Benefits:" }), _jsx("p", { style: { color: 'var(--text-secondary)', margin: 0 }, children: alumni.benefitsActive ? 'Benefits are active' : 'No active benefits' })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx(Badge, { colorScheme: alumni.alumniStatus === 'Active Member' || alumni.alumniStatus === 'Registered' ? 'success' : 'warning', children: alumni.alumniStatus === 'Active Member' || alumni.alumniStatus === 'Registered' ? 'Active Alumni' : 'Pending Registration' }), _jsxs("p", { style: { color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 'var(--space-4)' }, children: ["Clearance: ", alumni.alumniStatus] })] })] }) })] }));
};
