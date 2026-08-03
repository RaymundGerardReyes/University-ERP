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
        // 2. Authorization Check: We have an identity. Are they allowed in Applicant Portal?
        // Usually, ANY verified identity can start an application. 
        // We mock authorization success here.
        setTimeout(() => {
            setIsAuthorized(true);
        }, 300);
    }, [isAuthenticated, identity, login]);
    if (isRedirecting) {
        return _jsx("div", { style: { color: 'var(--text-secondary)', padding: '2rem' }, children: "Redirecting to Central Identity Server..." });
    }
    if (!isAuthenticated || isAuthorized === null) {
        return _jsx("div", { style: { color: 'var(--text-secondary)', padding: '2rem' }, children: "Verifying Applicant Authorization..." });
    }
    if (isAuthorized === false) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)' }, children: _jsxs(Card, { style: { maxWidth: '500px', textAlign: 'center', borderTop: '4px solid var(--danger-text)' }, children: [_jsx("h2", { style: { color: 'var(--danger-text)', margin: '0 0 var(--space-2) 0' }, children: "403 Forbidden" }), _jsx("p", { style: { color: 'var(--text-secondary)' }, children: "You do not have permission to access the Applicant Portal." })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
