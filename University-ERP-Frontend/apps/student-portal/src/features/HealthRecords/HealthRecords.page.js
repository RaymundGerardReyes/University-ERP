import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import { useHealthAppointments } from './HealthRecords.hooks';
export const HealthRecordsPage = () => {
    const { data: appointments, isLoading, isError } = useHealthAppointments();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading health records..." });
    if (isError || !appointments)
        return _jsx("div", { style: { color: 'red' }, children: "Failed to load health records." });
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Health & Wellness" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, children: appointments.map(apt => (_jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }, children: apt.doctorName }), _jsxs("p", { style: { color: 'var(--text-secondary)', margin: 0 }, children: [apt.specialty, " \u2022 ", apt.date, " at ", apt.time] })] }), _jsx(Badge, { colorScheme: apt.status === 'Scheduled' ? 'info' : 'default', children: apt.status })] }) }, apt.id))) })] }));
};
