import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useGuidanceSessions } from './GuidanceSessions.hooks';
export const GuidanceSessionsPage = () => {
    const { data: sessions, isLoading, isError } = useGuidanceSessions();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading guidance sessions..." });
    if (isError || !sessions)
        return _jsx("div", { style: { color: 'red' }, children: "Failed to load sessions." });
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Guidance & Counseling" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, children: sessions.map(session => (_jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }, children: session.counselorName }), _jsxs("p", { style: { color: 'var(--text-secondary)', margin: 0 }, children: ["Type: ", session.sessionType, " \u2022 ", session.date, " at ", session.time] })] }), session.meetingLink && (_jsx(Button, { onClick: () => window.open(session.meetingLink, '_blank'), children: "Join Meeting" }))] }) }, session.id))) })] }));
};
