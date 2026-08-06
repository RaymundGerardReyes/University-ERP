import { useQuery } from '@tanstack/react-query';
import { facultySettingsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { data: settings, isLoading } = useQuery({
        queryKey: ['facultySettings', user?.id],
        queryFn: () => facultySettingsApi.getSettings(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Platform Settings" subtitle="Configure your faculty profile and notifications." />
            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <div className="card-accent-top" />
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Office Information</h3>
                    <div className="data-row">
                        <span className="data-label">Office Location</span>
                        <span className="data-value">{settings?.officeLocation}</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Consultation Link</span>
                        <span className="data-value" style={{ color: 'var(--brand-primary)' }}>{settings?.consultationLink}</span>
                    </div>
                    <Button variant="secondary" style={{ marginTop: 'var(--space-4)' }}>Edit Info</Button>
                </Card>
            </div>
        </div>
    );
};