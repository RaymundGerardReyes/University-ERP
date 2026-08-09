import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useOrganizationHierarchy } from './OrganizationManagement.hooks';

export const OrganizationManagementPage: React.FC = () => {
    const { data: hierarchy, isLoading, isError } = useOrganizationHierarchy();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
    if (isError || !hierarchy) return <div className="stub-page"><div className="stub-title">Failed to load hierarchy</div></div>;

    const colleges = hierarchy.filter(h => h.type === 'College');
    const facilities = hierarchy.filter(h => h.type === 'Facility');

    return (
        <div className="fade-in">
            <PageHeader
                title="Organization Management"
                subtitle="Manage the structural hierarchy of the university."
                action={<Button variant="primary">Add Node</Button>}
            />
            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Colleges & Departments</h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)' }}>
                        {colleges.map((college, idx) => (
                            <li key={idx} style={{ padding: '0.5rem 0', borderBottom: idx === colleges.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                                <strong style={{ color: 'var(--text-primary)' }}>{college.name}</strong>
                                {college.children && college.children.length > 0 && (
                                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyle: 'circle' }}>
                                        {college.children.map((dept, i) => (
                                            <li key={i}>{dept}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Facilities & Infrastructure</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select a building to manage its rooms and offices.</div>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {facilities.map((facility, idx) => (
                            <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                                {facility.name}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};