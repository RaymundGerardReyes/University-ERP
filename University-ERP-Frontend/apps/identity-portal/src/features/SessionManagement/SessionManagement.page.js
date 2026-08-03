import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, PageHeader, Badge, Button } from '@university-erp/ui-kit';
import { useSessionManagement } from './SessionManagement.hooks';
export default function SessionManagement() {
    const { data: sessions, isLoading, error } = useSessionManagement();
    if (isLoading)
        return _jsx("div", { children: "Loading active sessions..." });
    if (error)
        return _jsx("div", { children: "Failed to load session data." });
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Active Sessions" }), _jsx("div", { style: { display: 'grid', gap: '1rem', marginTop: '2rem' }, children: sessions?.map((session) => (_jsxs(Card, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 0.5rem 0', color: 'white' }, children: session.device }), _jsxs("p", { style: { margin: 0, color: '#aaa', fontSize: '0.9rem' }, children: ["Location: ", session.location, " | Last Active: ", new Date(session.lastActive).toLocaleString()] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx(Badge, { colorScheme: "info", children: "Active" }), _jsx(Button, { variant: "primary", children: "Revoke" })] })] }, session.sessionId))) })] }));
}
