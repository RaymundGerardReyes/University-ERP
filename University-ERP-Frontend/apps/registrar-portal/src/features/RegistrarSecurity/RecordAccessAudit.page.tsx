import React from 'react';
import { Card, Table, Badge } from '@university-erp/ui-kit';
import { useAuditLogs } from './Security.hooks';
import { AuditLogItem } from './Security.types';

export const RecordAccessAuditPage: React.FC = () => {
    const { data: logs = [], isLoading } = useAuditLogs();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Record Access Audit Log</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Immutable ledger tracking all access and modifications to sensitive academic records.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Audit Trails...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Target Record</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: AuditLogItem, idx: number) => (
                                <tr key={idx}>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                                    <td style={{ fontWeight: 600 }}>{log.actor}</td>
                                    <td><Badge variant={log.action.includes('MODIFICATION') ? 'warning' : 'info'}>{log.action}</Badge></td>
                                    <td style={{ fontFamily: 'monospace' }}>{log.target}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
