import { jsx as _jsx } from "react/jsx-runtime";
import { createLogger } from '@university-erp/core-logger';
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
const logger = createLogger('auth-sdk', 'AuthProvider');
export const AuthProvider = ({ children }) => {
    const [identity, setIdentity] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    useEffect(() => {
        logger.debug('Initializing federated identity state...');
        // Simulate OIDC Token Restoration & Cross-Origin Handoff
        let mockToken = localStorage.getItem('global_identity_token');
        // Check if we are returning from Identity Portal with a token fragment
        if (window.location.hash.includes('token=')) {
            const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
            const tokenFromFragment = fragmentParams.get('token');
            if (tokenFromFragment) {
                mockToken = tokenFromFragment;
                localStorage.setItem('global_identity_token', mockToken);
                logger.info('Received identity token via cross-origin handoff.');
                // Clean the URL fragment to prevent token leakage
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }
        if (mockToken) {
            logger.info('Global Identity session found in storage.');
            setIdentity({
                id: 'ID-84920-ABCD',
                name: 'Jane Doe',
                email: 'jane.doe@personal.com',
                emailVerified: true
            });
        }
        else {
            logger.warn('No active identity session found. User must authenticate via Identity Portal.');
        }
        setTimeout(() => setIsInitializing(false), 300);
    }, []);
    const login = () => {
        logger.info('Redirecting to Identity Portal for Authentication...');
        const identityUrl = import.meta.env.VITE_IDENTITY_PORTAL_URL || 'http://localhost:8081';
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `${identityUrl}/login?redirect_uri=${currentUrl}`;
    };
    const logout = () => {
        logger.warn('Identity logged out. Destroying global session.');
        localStorage.removeItem('global_identity_token');
        setIdentity(null);
    };
    if (isInitializing)
        return _jsx("div", { style: { color: 'var(--text-secondary)', padding: '2rem' }, children: "Establishing Identity..." });
    return (_jsx(AuthContext.Provider, { value: { identity, user: identity, isAuthenticated: !!identity, login, logout }, children: children }));
};
