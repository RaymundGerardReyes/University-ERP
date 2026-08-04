import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const UserAdministrationPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="User Administration"
                subtitle="Govern identities, access states, and account lifecycles."
                action={<Button variant="primary">Provision New User</Button>}
            />

            <Card className="fade-in-delay-1">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input type="text" placeholder="Search by ID, Email, or Name..." style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'white' }} />
                    <Button variant="outline">Filter Roles</Button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>User Identity</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Global Role</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Last Login</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 'ID-9921', name: 'Dr. Sarah Jenkins', role: 'Faculty', status: 'Active', login: '2 mins ago' },
                            { id: 'ID-8834', name: 'Michael Ross', role: 'Student', status: 'Suspended', login: '14 days ago' },
                            { id: 'ID-1002', name: 'James Chen', role: 'Registrar', status: 'Active', login: '1 hour ago' },
                        ].map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.id}</div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: user.status === 'Active' ? 'var(--success-bg)' : 'var(--danger-bg)', color: user.status === 'Active' ? 'var(--success-text)' : 'var(--danger-text)' }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.login}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Button variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Manage</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};