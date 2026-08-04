import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const OrganizationManagementPage: React.FC = () => {
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
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>College of Engineering</strong>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyle: 'circle' }}>
                                <li>Department of Computer Science</li>
                                <li>Department of Civil Engineering</li>
                            </ul>
                        </li>
                        <li style={{ padding: '0.5rem 0' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>College of Business</strong>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyle: 'circle' }}>
                                <li>Department of Accountancy</li>
                            </ul>
                        </li>
                    </ul>
                </Card>
                <Card>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Facilities & Infrastructure</h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select a building to manage its rooms and offices.</div>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>Main Administration Building</div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>Science & Technology Annex</div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>University Library</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};