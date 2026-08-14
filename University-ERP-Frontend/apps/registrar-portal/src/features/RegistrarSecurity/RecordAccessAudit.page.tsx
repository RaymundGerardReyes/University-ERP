import React, { useState } from 'react';
import { Card, Table, Badge, FormInput, PageHeader, EmptyState, Button } from '@university-erp/ui-kit';
import { useAuditLogs } from './Security.hooks';
import { AuditLogItem } from './Security.types';

export const RecordAccessAuditPage: React.FC = () => {
    // 1. Fetch Data
    const { data: logs = [], isLoading, isError } = useAuditLogs();
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Loading & Error States
    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError) return <EmptyState title="Audit System Unavailable" description="Unable to connect to the secure audit ledger." icon="🛡️" />;

    // Derived Statistics (Information Architecture)
    const totalLogs = logs.length;
    const modifications = logs.filter((l: AuditLogItem) => l.action.includes('MODIFICATION') || l.action.includes('UPDATE') || l.action.includes('DELETE')).length;

    // Filtering logic
    const filteredLogs = logs.filter((log: AuditLogItem) => 
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Empty State (No records at all)
    if (logs.length === 0) {
        return (
            <div className="fade-in" style={{ padding: 'var(--space-4)' }}>
                <PageHeader 
                    title="Record Access Audit Log" 
                    subtitle="Immutable ledger tracking all access and modifications to sensitive academic records." 
                />
                <EmptyState 
                    title="No Audit Logs Found" 
                    description="The secure audit ledger is currently empty."
                    icon="📋"
                />
            </div>
        );
    }

    // 4. Main Render with Responsive Architecture
    return (
        <div className="fade-in" style={{ padding: 'var(--space-4)' }}>
            <PageHeader 
                title="Record Access Audit Log" 
                subtitle="Immutable ledger tracking all access and modifications to sensitive academic records." 
            />

            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--info-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Logged Events</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalLogs}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical Modifications</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{modifications}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <FormInput 
                        placeholder="Search by Actor, Target, or Action..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <Button variant="outline">Filter: Modifications Only</Button>
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            {/* DESKTOP VIEW: TABLE */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
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
                                {filteredLogs.map((log: AuditLogItem, idx: number) => (
                                    <tr key={idx}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.actor}</td>
                                        <td>
                                            <Badge colorScheme={log.action.includes('MODIFICATION') ? 'warning' : 'info'}>
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{log.target}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{log.ip}</td>
                                    </tr>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>No audit logs matched your search.</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW: CARDS */}
            <div className="mobile-only flex-stack fade-in">
                {filteredLogs.map((log: AuditLogItem, idx: number) => (
                    <Card key={idx}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                            <Badge colorScheme={log.action.includes('MODIFICATION') ? 'warning' : 'info'}>
                                {log.action}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{log.actor}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Target: <span style={{ fontFamily: 'monospace' }}>{log.target}</span>
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                            IP: {log.ip}
                        </p>
                    </Card>
                ))}
                {filteredLogs.length === 0 && (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>No audit logs matched your search.</span>
                    </Card>
                )}
            </div>
        </div>
    );
};
