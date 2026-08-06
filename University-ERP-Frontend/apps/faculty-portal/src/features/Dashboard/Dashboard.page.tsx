import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="fade-in">
            <PageHeader
                title={`Welcome, ${user?.name || 'Professor'}`}
                subtitle="Your academic overview for the current semester."
            />

            <div className="grid-3 fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" />
                    <span className="stat-label">Active Courses</span>
                    <span className="stat-value">4</span>
                    <span className="stat-trend" style={{ color: 'var(--text-accent)' }}>Fall Semester</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" />
                    <span className="stat-label">Total Students</span>
                    <span className="stat-value">128</span>
                    <span className="stat-trend" style={{ color: 'var(--text-muted)' }}>Across all sections</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" />
                    <span className="stat-label">Unread Messages</span>
                    <span className="stat-value" style={{ color: 'var(--warning-text)' }}>3</span>
                    <span className="stat-trend" style={{ color: 'var(--warning-text)' }}>Requires attention</span>
                </Card>
            </div>
        </div>
    );
};