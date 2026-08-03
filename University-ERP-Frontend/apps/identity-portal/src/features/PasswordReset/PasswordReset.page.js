import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { usePasswordReset } from './PasswordReset.hooks';
export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const resetMutation = usePasswordReset();
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await resetMutation.mutateAsync(email);
            setSubmitted(true);
        }
        catch (error) {
            console.error('Password reset failed', error);
        }
    };
    return (_jsxs("div", { style: { maxWidth: '400px', margin: '4rem auto' }, children: [_jsx(PageHeader, { title: "Reset Password" }), _jsx(Card, { style: { marginTop: '2rem' }, children: submitted ? (_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '3rem', marginBottom: '1rem' }, children: "\uD83D\uDCE7" }), _jsx("h3", { style: { color: 'white', marginBottom: '1rem' }, children: "Check your email" }), _jsxs("p", { style: { color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem' }, children: ["If an account exists for ", email, ", you will receive a secure link to reset your password."] }), _jsx("a", { href: "/login", style: { color: 'hsl(220, 90%, 75%)', textDecoration: 'none', display: 'block' }, children: "Return to Login" })] })) : (_jsxs("form", { onSubmit: handleReset, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsx("p", { style: { color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem', marginTop: 0 }, children: "Enter the email address associated with your account, and we'll send you a link to reset your password." }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: {
                                        width: '100%', padding: '0.75rem', borderRadius: '4px',
                                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                                    } })] }), _jsx(Button, { variant: "primary", style: { width: '100%', marginTop: '1rem' }, disabled: resetMutation.isPending, children: resetMutation.isPending ? 'Sending...' : 'Send Reset Link' }), _jsx("div", { style: { textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem' }, children: _jsx("a", { href: "/login", style: { color: 'hsl(220, 90%, 75%)', textDecoration: 'none' }, children: "Back to Sign In" }) })] })) })] }));
}
