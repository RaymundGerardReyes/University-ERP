import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { useUserLogin } from './UserLogin.hooks';
export default function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const loginMutation = useUserLogin();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginMutation.mutateAsync({ email, passwordHash: password });
            // Establish Global SSO Session
            localStorage.setItem('global_identity_token', response.token);
            // Handle OIDC Redirect Flow
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUri = urlParams.get('redirect_uri');
            if (redirectUri) {
                window.location.href = redirectUri + (redirectUri.includes('#') ? '&' : '#') + 'token=' + response.token;
            }
            else {
                navigate('/');
            }
        }
        catch (error) {
            console.error('Login failed', error);
        }
    };
    return (_jsxs("div", { style: { maxWidth: '400px', margin: '4rem auto' }, children: [_jsx(PageHeader, { title: "Sign In to University ERP" }), _jsxs(Card, { gradient: true, style: { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }, children: [_jsxs("form", { onSubmit: handleLogin, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontSize: '0.9rem' }, children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: {
                                            width: '100%', padding: '0.75rem', borderRadius: '4px',
                                            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                                        } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontSize: '0.9rem' }, children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, style: {
                                            width: '100%', padding: '0.75rem', borderRadius: '4px',
                                            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                                        } })] }), _jsx(Button, { variant: "primary", style: { width: '100%', marginTop: '1rem' }, disabled: loginMutation.isPending, children: loginMutation.isPending ? 'Authenticating...' : 'Sign In' })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }, children: [_jsx("a", { href: "/forgot-password", style: { color: 'var(--brand-primary)', textDecoration: 'none' }, children: "Forgot Password?" }), _jsx("a", { href: "/register", style: { color: 'var(--brand-primary)', textDecoration: 'none' }, children: "Register Account" })] })] })] }));
}
