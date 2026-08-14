import React, { useState } from 'react';
import { Badge, Button, Card, Table } from '@university-erp/ui-kit';

export const StudentProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('OVERVIEW');

    // Tab Navigation Configuration
    const tabs = ['OVERVIEW', 'ENROLLMENT', 'ACADEMIC RECORDS', 'REQUESTS', 'AUDIT'];

    return (
        <div className="fade-in">
            {/* 1. Comprehensive Identity Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-6)', 
                marginBottom: 'var(--space-6)', 
                paddingBottom: 'var(--space-4)', 
                borderBottom: '1px solid var(--border-color)',
                flexWrap: 'wrap'
            }}>
                <div style={{ 
                    width: '84px', height: '84px', borderRadius: 'var(--radius-full, 50%)', 
                    background: 'var(--brand-gradient, var(--brand-primary))', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'white', 
                    boxShadow: 'var(--shadow-glow, 0 0 15px rgba(0,0,0,0.2))' 
                }}>
                    A
                </div>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-bright, var(--text-primary))' }}>Alex Mercer</h1>
                        <Badge colorScheme="success">Enrolled</Badge>
                        <Badge colorScheme="success">Good Standing</Badge>
                        <Badge colorScheme="danger">1 Active Hold</Badge>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '1rem', display: 'flex', gap: 'var(--space-4)' }}>
                        <span><strong>ID:</strong> STU-2024-0012</span>
                        <span><strong>Program:</strong> BS Computer Science (3rd Year)</span>
                        <span><strong>Term:</strong> AY 26-27, Sem 1</span>
                    </div>
                </div>
                
                {/* Primary Contextual Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <Button variant="outline" size="small">Add Note</Button>
                    <Button variant="outline" size="small">Request Document</Button>
                    <Button variant="primary">Start Workflow</Button>
                </div>
            </div>

            {/* 2. Contextual Navigation Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            paddingBottom: 'var(--space-3)', 
                            borderBottom: activeTab === tab ? '3px solid var(--brand-primary)' : '3px solid transparent', 
                            color: activeTab === tab ? 'var(--text-bright, var(--text-primary))' : 'var(--text-muted)', 
                            fontWeight: 600, 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* 3. Tab Content Area */}
            <div className="fade-in" key={activeTab}>
                {activeTab === 'OVERVIEW' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
                        
                        {/* Left Column: Summary & Alerts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            <Card>
                                <h4 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>CONTACT & ADVISING</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Email</span>
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>alex.mercer@university.edu</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Phone</span>
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>+1 (555) 123-4567</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Academic Advisor</span>
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Dr. Alan Turing</span>
                                    </div>
                                </div>
                            </Card>

                            <Card style={{ border: '1px solid var(--danger-border, var(--border-color))', background: 'var(--danger-bg, rgba(239, 68, 68, 0.1))' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <h4 style={{ margin: 0, color: 'var(--danger-text, #ef4444)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>ACTIVE ALERTS & HOLDS</h4>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-sm, 4px)', borderLeft: '3px solid var(--danger-text, #ef4444)' }}>
                                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                                    <div>
                                        <strong style={{ display: 'block', color: 'var(--text-bright, var(--text-primary))', fontSize: '0.9rem' }}>Finance Balance Due</strong>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending financial clearance for the current academic term. Prevents transcript generation.</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Schedule & Activity */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            <Card>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>CURRENT SCHEDULE</h4>
                                    <Button variant="ghost" size="small">Edit Load</Button>
                                </div>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>CS201</td>
                                            <td>Data Structures</td>
                                            <td style={{ color: 'var(--text-muted)' }}>MWF 10:00</td>
                                            <td style={{ textAlign: 'right' }}>3.0 U</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>CS202</td>
                                            <td>Computer Architecture</td>
                                            <td style={{ color: 'var(--text-muted)' }}>TTh 13:00</td>
                                            <td style={{ textAlign: 'right' }}>3.0 U</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card>

                            <Card>
                                <h4 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>RECENT REGISTRAR ACTIVITY</h4>
                                <div style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>August 4, 2026 • 10:45 AM</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Official Transcript of Records requested via Portal.</div>
                                </div>
                                <div style={{ padding: 'var(--space-3) 0' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>August 1, 2026 • 09:12 AM</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Enrollment officially validated for Term 1.</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Stubs for other tabs to demonstrate interactivity */}
                {activeTab !== 'OVERVIEW' && (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', filter: 'grayscale(1)', opacity: 0.5 }}>📁</div>
                        <h3 style={{ color: 'var(--text-bright, var(--text-primary))' }}>{activeTab} Workspace</h3>
                        <p style={{ color: 'var(--text-muted)' }}>This section dynamically loads the student's {activeTab.toLowerCase()} data via the domain APIs.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};
