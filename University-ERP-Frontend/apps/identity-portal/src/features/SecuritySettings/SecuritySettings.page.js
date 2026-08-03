import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { useSecuritySettings } from './SecuritySettings.hooks';
export default function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const settingsMutation = useSecuritySettings();
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            await settingsMutation.mutateAsync({ currentPassword, newPassword });
            setMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        catch {
            setMessage('Failed to update password');
        }
    };
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Security Settings" }), _jsxs(Card, { style: { marginTop: '2rem', maxWidth: '600px' }, children: [_jsx("h3", { style: { margin: '0 0 1rem 0', color: 'white' }, children: "Change Password" }), _jsxs("form", { onSubmit: handleUpdate, style: { display: 'flex', flexDirection: 'column', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Current Password" }), _jsx("input", { type: "password", value: currentPassword, onChange: e => setCurrentPassword(e.target.value), required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "New Password" }), _jsx("input", { type: "password", value: newPassword, onChange: e => setNewPassword(e.target.value), required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }, children: "Confirm New Password" }), _jsx("input", { type: "password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), required: true, style: { width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' } })] }), _jsx(Button, { variant: "primary", style: { width: '200px', marginTop: '1rem' }, disabled: settingsMutation.isPending, children: "Update Password" }), message && _jsx("div", { style: { color: message.includes('success') ? 'hsl(120, 70%, 70%)' : 'hsl(0, 70%, 70%)', fontSize: '0.85rem' }, children: message })] })] }), _jsxs(Card, { style: { marginTop: '2rem', maxWidth: '600px', borderColor: 'hsl(0, 50%, 30%)' }, children: [_jsx("h3", { style: { margin: '0 0 1rem 0', color: 'hsl(0, 70%, 70%)' }, children: "Danger Zone" }), _jsx("p", { style: { color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }, children: "Once you delete your account, there is no going back. Please be certain." }), _jsx(Button, { variant: "primary", children: "Delete Account" })] })] }));
}
