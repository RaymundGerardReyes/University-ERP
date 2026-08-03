import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@university-erp/auth-sdk';
import { Card } from '@university-erp/ui-kit';
import { useEffect, useState } from 'react';
export const AuthGuard = ({ children }) => {
    const { isAuthenticated, identity, login } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    useEffect(() => {
        if (!isAuthenticated) {
            setIsRedirecting(true);
            login();
            return;
        }
        // 2. Authorization Check: We have an identity. Are they a Student?
        // MOCK: Simulate fetching the Student Profile from /api/student-information/me
        setTimeout(() => {
            // In a real scenario, an Applicant logging in would not have a Student profile yet.
            // We authorize Jane Doe's mock identity for local development
            const hasStudentProfile = identity?.id === 'ID-84920-ABCD';
            setIsAuthorized(hasStudentProfile);
        }, 500);
    }, [isAuthenticated, identity, login]);
    if (isRedirecting) {
        return _jsx("div", { style: { color: 'var(--text-secondary)', padding: '2rem' }, children: "Redirecting to Central Identity Server..." });
    }
    if (!isAuthenticated || isAuthorized === null) {
        return _jsx("div", { style: { color: 'var(--text-secondary)', padding: '2rem' }, children: "Verifying Student Authorization..." });
    }
    if (isAuthorized === false) {
        // 3. 403 Forbidden: Identity verified, but no authorization for this portal.
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)' }, children: _jsxs(Card, { style: { maxWidth: '500px', textAlign: 'center', borderTop: '4px solid var(--danger-text)' }, children: [_jsx("h2", { style: { color: 'var(--danger-text)', margin: '0 0 var(--space-2) 0' }, children: "403 Forbidden" }), _jsxs("p", { style: { color: 'var(--text-secondary)' }, children: ["Your identity (", _jsx("strong", { children: identity?.email }), ") has been verified, but you do not have an active ", _jsx("strong", { children: "Student Profile" }), ". If you are an applicant, please use the Applicant Portal."] })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
