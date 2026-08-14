import React from 'react';
import { Card, PageHeader, Badge, Button, Table } from '@university-erp/ui-kit';
import { useNavigate } from 'react-router-dom';

export const RegistrarDashboardPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fade-in">
            <PageHeader 
                title="Registrar Dashboard" 
                subtitle="What needs your attention right now?"
            />

            {/* Top Row: KPI Stat Cards */}
            <div className="grid-auto" style={{ marginBottom: 'var(--space-8)' }}>
                <Card style={{ borderTop: '3px solid var(--brand-primary)', cursor: 'pointer' }} onClick={() => navigate('/admissions/activation')}>
                    <div className="stat-label">Pending Activations</div>
                    <div className="stat-value">12</div>
                    <div className="stat-trend"><Badge colorScheme="warning">Action Required</Badge></div>
                </Card>
                <Card style={{ borderTop: '3px solid var(--warning-text, #f59e0b)', cursor: 'pointer' }} onClick={() => navigate('/enrollment/exceptions')}>
                    <div className="stat-label">Registration Exceptions</div>
                    <div className="stat-value">8</div>
                    <div className="stat-trend"><Badge colorScheme="warning">Awaiting Review</Badge></div>
                </Card>
                <Card style={{ borderTop: '3px solid var(--info-text, #3b82f6)', cursor: 'pointer' }} onClick={() => navigate('/certification/transcripts')}>
                    <div className="stat-label">Transcript Requests</div>
                    <div className="stat-value">21</div>
                    <div className="stat-trend"><Badge colorScheme="info">Processing</Badge></div>
                </Card>
                <Card style={{ borderTop: '3px solid var(--success-text, #10b981)', cursor: 'pointer' }} onClick={() => navigate('/graduation')}>
                    <div className="stat-label">Graduation Candidates</div>
                    <div className="stat-value">4</div>
                    <div className="stat-trend"><Badge colorScheme="success">Ready for Audit</Badge></div>
                </Card>
            </div>

            {/* Main Body: 60/40 Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-6)' }}>
                {/* 60%: My Work Queue */}
                <Card>
                    <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-bright, var(--text-primary))' }}>My Urgent Work Queue</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Item</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Badge colorScheme="warning">Exception</Badge></td>
                                <td><strong>STU-2023-011</strong> - Prerequisite Waiver</td>
                                <td>Pending</td>
                                <td><Button size="small" variant="outline" onClick={() => navigate('/enrollment/exceptions')}>Review</Button></td>
                            </tr>
                            <tr>
                                <td><Badge colorScheme="info">Request</Badge></td>
                                <td><strong>REQ-8831</strong> - Official TOR</td>
                                <td>Overdue</td>
                                <td><Button size="small" variant="outline" onClick={() => navigate('/certification/transcripts')}>Process</Button></td>
                            </tr>
                            <tr>
                                <td><Badge colorScheme="danger">Correction</Badge></td>
                                <td><strong>COR-9192</strong> - Name Change</td>
                                <td>Evidence Submitted</td>
                                <td><Button size="small" variant="outline" onClick={() => navigate('/services/corrections')}>Review</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>

                {/* 40%: Alerts & Deadlines */}
                <Card style={{ background: 'var(--bg-elevated, var(--bg-surface))' }}>
                    <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-bright, var(--text-primary))' }}>System Alerts & Deadlines</h3>
                    
                    <div style={{ padding: 'var(--space-3)', background: 'var(--danger-bg, rgba(239, 68, 68, 0.1))', borderLeft: '4px solid var(--danger-text, #ef4444)', borderRadius: '4px', marginBottom: 'var(--space-3)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))', marginBottom: '4px' }}>CHED Report E-1 Due</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Statutory enrollment reporting is due in 2 days.</div>
                    </div>

                    <div style={{ padding: 'var(--space-3)', background: 'var(--info-bg, rgba(59, 130, 246, 0.1))', borderLeft: '4px solid var(--info-text, #3b82f6)', borderRadius: '4px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))', marginBottom: '4px' }}>Registration Window Closing</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Late registration penalty goes into effect at midnight.</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
