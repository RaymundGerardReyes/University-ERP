import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const AuditCompliancePage: React.FC = () => {
    const auditLogs = [
        { id: 'EVT-9021', action: 'ROLE_CHANGED', user: 'admin@university.edu', target: 'Dr. Sarah Jenkins', timestamp: '2026-08-05 02:30:15 UTC', status: 'Success' },
        { id: 'EVT-9022', action: 'GRADE_OVERRIDE', user: 'registrar@university.edu', target: 'STU-1042', timestamp: '2026-08-05 01:15:00 UTC', status: 'Flagged' },
        { id: 'EVT-9023', action: 'SYSTEM_CONFIG_UPDATED', user: 'sysadmin@university.edu', target: 'Global Feature Flags', timestamp: '2026-08-04 22:45:10 UTC', status: 'Success' },
        { id: 'EVT-9024', action: 'FAILED_LOGIN_ATTEMPT', user: 'unknown', target: 'admin@university.edu', timestamp: '2026-08-04 21:10:05 UTC', status: 'Warning' },
    ];

    return (
        <div className="fade-in">
            <PageHeader
                title="Audit & Compliance"
                subtitle="Immutable event logs for security, governance, and compliance tracking."
                action={<Button variant="outline">Export CSV</Button>}
            />

            <Card className="fade-in-delay-1">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input type="text" placeholder="Search by Event ID, User, or Action..." style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'white' }} />
                    <Button variant="secondary">Filter by Date</Button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Timestamp (UTC)</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Actor</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Target</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{log.timestamp}</td>
                                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--brand-primary)' }}>{log.action}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{log.user}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{log.target}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Badge colorScheme={log.status === 'Success' ? 'success' : log.status === 'Warning' ? 'warning' : 'danger'}>
                                        {log.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};