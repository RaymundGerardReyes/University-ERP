import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const RoleAdministrationPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="Role Administration (RBAC)"
                subtitle="Define global roles, permissions, and departmental scopes."
                action={<Button variant="primary">Create New Role</Button>}
            />
            <Card className="fade-in-delay-1">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Role Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Description</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Users Assigned</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'System Administrator', desc: 'Full access to all platform configurations.', count: 3 },
                            { name: 'Dean', desc: 'Academic governance for a specific college.', count: 12 },
                            { name: 'Registrar', desc: 'Management of student records and enrollments.', count: 8 },
                            { name: 'Faculty', desc: 'Standard teaching and grading access.', count: 450 },
                        ].map(role => (
                            <tr key={role.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{role.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{role.desc}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{role.count}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Button variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Edit Permissions</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};