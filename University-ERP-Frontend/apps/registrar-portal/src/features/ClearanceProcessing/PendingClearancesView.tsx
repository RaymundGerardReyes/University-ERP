import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { EmptyState, Button, Card, Badge, PageHeader, Table, FormInput } from '@university-erp/ui-kit';

export const PendingClearancesView: React.FC = () => {
    // 1. Fetch data
    const { data: clearances, isLoading, isError } = useQuery({
        queryKey: ['pendingClearances'],
        queryFn: () => registrarApi.getPendingClearances()
    });

    const [searchTerm, setSearchTerm] = useState('');

    // 2. Loading State
    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    
    // 3. Error State
    if (isError) return <EmptyState title="System Error" description="Unable to fetch pending clearances." icon="⚠️" />;
    
    // Derived state for stats
    const totalPending = clearances?.length || 0;
    const flaggedCount = clearances?.filter((c: any) => c.status.includes('Finance') || c.status.includes('Flagged')).length || 0;

    // Filtered clearances based on search
    const filteredClearances = clearances?.filter((c: any) => 
        c.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // 4. Empty State
    if (!clearances || clearances.length === 0) {
        return (
            <div className="fade-in">
                <EmptyState 
                    title="No Pending Clearances" 
                    description="All student clearance requests have been processed. Great job!"
                    icon="✅"
                    action={<Button variant="outline" onClick={() => window.location.reload()}>Refresh List</Button>}
                />
            </div>
        );
    }

    // 5. Standard Render
    return (
        <div className="fade-in">
            <PageHeader 
                title="Pending Student Clearances" 
                subtitle="Review and process graduation and transfer clearances." 
            />

            {/* KPI STATS (Information Architecture) */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Pending</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalPending}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--danger-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flagged Issues</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger-text)' }}>{flaggedCount}</div>
                </Card>
            </div>

            {/* TOOLBAR (Search & Contextual Actions) */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <FormInput 
                        placeholder="Search by Student ID or Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <div className="toolbar-actions">
                    <Button variant="outline">Filter: All Types</Button>
                    <Button variant="primary">Batch Approve</Button>
                </div>
            </div>

            {/* DESKTOP VIEW: TABLE (Data-Heavy Interfaces) */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Full Name</th>
                                    <th>Program & Type</th>
                                    <th>Status</th>
                                    <th>Requested</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClearances.map((item: any) => (
                                    <tr key={item.studentId}>
                                        <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{item.studentId}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.fullName}</td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem' }}>{item.program}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.clearanceType} Clearance</div>
                                        </td>
                                        <td>
                                            <Badge colorScheme={item.status.includes('Finance') ? 'danger' : 'warning'}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.requestDate}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="outline" size="small">Process</Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredClearances.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW: CARDS (Responsive Layouts) */}
            <div className="mobile-only flex-stack fade-in">
                {filteredClearances.map((item: any) => (
                    <Card key={item.studentId}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{item.studentId}</span>
                            <Badge colorScheme={item.status.includes('Finance') ? 'danger' : 'warning'}>
                                {item.status}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{item.fullName}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {item.program}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                            {item.clearanceType} Clearance • Requested: {item.requestDate}
                        </p>
                        <Button variant="outline" style={{ width: '100%' }}>
                            Process Clearance
                        </Button>
                    </Card>
                ))}
                {filteredClearances.length === 0 && (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                    </Card>
                )}
            </div>
        </div>
    );
};
