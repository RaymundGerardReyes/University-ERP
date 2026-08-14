import React, { useState } from 'react';
import { Card, PageHeader, Badge, Button, Table } from '@university-erp/ui-kit';

export const CHEDCompliancePage: React.FC = () => {
    // State to handle the exception drill-down as specified in the blueprint
    const [activeException, setActiveException] = useState<string | null>(null);

    return (
        <div className="fade-in">
            <PageHeader 
                title="Academic Compliance Workspace" 
                subtitle="Exception-driven statutory reporting and residency monitoring." 
            />

            {/* Top Level: Status Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                <Card style={{ borderTop: '3px solid var(--success-text, #10b981)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-bright, var(--text-primary))' }}>Form E-1 (Enrollment)</h3>
                        <Badge colorScheme="success">Healthy</Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        No action required. All enrollment records match statutory requirements.
                    </p>
                    <Button variant="outline" size="small" style={{ width: '100%' }}>Generate PDF</Button>
                </Card>

                <Card style={{ borderTop: '3px solid var(--warning-text, #f59e0b)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-bright, var(--text-primary))' }}>Form G-1 (Graduates)</h3>
                        <Badge colorScheme="warning">Attention Required</Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        4 records contain potential formatting issues or missing data.
                    </p>
                    <Button 
                        variant="primary" 
                        size="small" 
                        style={{ width: '100%' }}
                        onClick={() => setActiveException(activeException === 'GRAD' ? null : 'GRAD')}
                    >
                        Review Exceptions
                    </Button>
                </Card>

                <Card style={{ borderTop: '3px solid var(--danger-text, #ef4444)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-bright, var(--text-primary))' }}>Residency (MRR)</h3>
                        <Badge colorScheme="danger">Critical</Badge>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        7 students exceed the Maximum Residency Rule policy threshold.
                    </p>
                    <Button 
                        variant="danger" 
                        size="small" 
                        style={{ width: '100%' }}
                        onClick={() => setActiveException(activeException === 'MRR' ? null : 'MRR')}
                    >
                        Resolve Violations
                    </Button>
                </Card>
            </div>

            {/* Drill-down View: Conditional Rendering based on selected exception */}
            {activeException === 'MRR' && (
                <Card className="fade-in" style={{ border: '1px solid var(--danger-border, var(--border-color))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ margin: 0, color: 'var(--danger-text, #ef4444)' }}>Maximum Residency Exceedances</h3>
                        <Button variant="ghost" size="small" onClick={() => setActiveException(null)}>Close</Button>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Program</th>
                                <th>Years Active</th>
                                <th>Limit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span style={{ fontFamily: 'monospace' }}>STU-2018-0012</span></td>
                                <td>John Smith</td>
                                <td>BS Engineering</td>
                                <td style={{ color: 'var(--danger-text, #ef4444)', fontWeight: 'bold' }}>8 Years</td>
                                <td>7 Years</td>
                                <td>
                                    <Button variant="outline" size="small">Initiate Waiver Workflow</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            )}

            {activeException === 'GRAD' && (
                <Card className="fade-in" style={{ border: '1px solid var(--warning-border, var(--border-color))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ margin: 0, color: 'var(--warning-text, #f59e0b)' }}>Form G-1 Record Anomalies</h3>
                        <Button variant="ghost" size="small" onClick={() => setActiveException(null)}>Close</Button>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Program</th>
                                <th>Issue</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span style={{ fontFamily: 'monospace' }}>STU-2022-0891</span></td>
                                <td>Maria Santos</td>
                                <td>BS Accountancy</td>
                                <td style={{ color: 'var(--warning-text, #f59e0b)' }}>Missing Middle Name / SO Number</td>
                                <td>
                                    <Button variant="outline" size="small">Edit Details</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};
