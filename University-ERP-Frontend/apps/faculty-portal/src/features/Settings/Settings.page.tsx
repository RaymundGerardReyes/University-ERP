import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useEffect, useState } from 'react';
import { useFacultySettings, useUpdateSettings } from './Settings.hooks';

export const SettingsPage: React.FC = () => {
    const { data: settings, isLoading } = useFacultySettings();
    const { mutateAsync: updateSettings, isPending } = useUpdateSettings();

    const [formData, setFormData] = useState({
        officeLocation: '',
        consultationLink: '',
        emailNotifications: true,
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                officeLocation: settings.officeLocation,
                consultationLink: settings.consultationLink,
                emailNotifications: settings.emailNotifications,
            });
        }
    }, [settings]);

    const handleSave = async () => {
        await updateSettings(formData);
        alert('Settings successfully updated.');
    };

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', marginTop: '0.5rem' };

    return (
        <div className="fade-in">
            <PageHeader title="Portal Settings" subtitle="Manage your profile configuration and preferences." />

            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>Profile Configuration</h2>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Physical Office Location</label>
                        <input type="text" value={formData.officeLocation} onChange={e => setFormData({ ...formData, officeLocation: e.target.value })} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Virtual Consultation Link (Teams/Zoom)</label>
                        <input type="url" value={formData.consultationLink} onChange={e => setFormData({ ...formData, consultationLink: e.target.value })} style={inputStyle} />
                    </div>
                    <Button variant="primary" onClick={handleSave} disabled={isPending}>{isPending ? 'Saving...' : 'Save Profile'}</Button>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>Notification Preferences</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Email Notifications</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive daily digests and urgent alerts.</div>
                        </div>
                        <input type="checkbox" checked={formData.emailNotifications} onChange={e => setFormData({ ...formData, emailNotifications: e.target.checked })} style={{ transform: 'scale(1.5)', cursor: 'pointer' }} />
                    </div>
                </Card>
            </div>
        </div>
    );
};