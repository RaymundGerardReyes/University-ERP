import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { useUserRegistration } from './UserRegistration.hooks';
export default function UserRegistration() {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'Student'
    });
    const navigate = useNavigate();
    const registerMutation = useUserRegistration();
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerMutation.mutateAsync(formData);
            navigate('/login');
        }
        catch (error) {
            console.error('Registration failed', error);
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (_jsxs("div", { style: { maxWidth: '500px', margin: '4rem auto' }, children: [_jsx(PageHeader, { title: "Create an Account" }), _jsxs(Card, { gradient: true, style: { display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }, children: [_jsxs("form", { onSubmit: handleRegister, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "First Name" }), _jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Last Name" }), _jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Email Address" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Role" }), _jsxs("select", { name: "role", value: formData.role, onChange: handleChange, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }, children: [_jsx("option", { value: "Student", children: "Student" }), _jsx("option", { value: "Faculty", children: "Faculty" })] })] }), _jsx(Button, { variant: "primary", style: { width: '100%', marginTop: '1rem' }, disabled: registerMutation.isPending, children: registerMutation.isPending ? 'Registering...' : 'Create Account' })] }), _jsx("div", { style: { textAlign: 'center', fontSize: '0.85rem' }, children: _jsx("a", { href: "/login", style: { color: 'hsl(220, 90%, 75%)', textDecoration: 'none' }, children: "Already have an account? Sign in" }) })] })] }));
}
