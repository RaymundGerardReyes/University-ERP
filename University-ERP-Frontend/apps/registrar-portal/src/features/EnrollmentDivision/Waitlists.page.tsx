import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useWaitlists } from './Enrollment.hooks';

export const WaitlistsPage: React.FC = () => {
    const { data: waitlists, isLoading } = useWaitlists();
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Mock Data grouping waitlists by Section for the Master-Detail view
    const activeWaitlists = [
        {
            sectionId: 'CS201-A',
            courseTitle: 'Data Structures',
            capacity: '40/40',
            students: [
                { waitlistId: 'WL-001', studentId: 'STU-2024-0101', name: 'James Smith', position: 1, status: 'ACTIVE', requestedAt: 'Aug 10, 09:00 AM' },
                { waitlistId: 'WL-002', studentId: 'STU-2024-0105', name: 'Maria Garcia', position: 2, status: 'ACTIVE', requestedAt: 'Aug 10, 10:30 AM' }
            ]
        },
        {
            sectionId: 'IT401-C',
            courseTitle: 'Artificial Intelligence',
            capacity: '30/30',
            students: [
                { waitlistId: 'WL-003', studentId: 'STU-2023-0891', name: 'David Lee', position: 1, status: 'PROMOTED', requestedAt: 'Aug 09, 02:15 PM' }
            ]
        }
    ];

    const selectedData = activeWaitlists.find(w => w.sectionId === selectedSection);

    return (
        <div className="fade-in">
            <PageHeader
                title="Waitlist Monitor"
                subtitle="Manage section capacities and process chronological waitlist queue promotions."
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Sections with Waitlists */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-bright, var(--text-primary))' }}>Active Waitlists</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {activeWaitlists.map((wl) => (
                            <div 
                                key={wl.sectionId}
                                onClick={() => setSelectedSection(wl.sectionId)}
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))',
                                    cursor: 'pointer',
                                    background: selectedSection === wl.sectionId ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: `4px solid ${selectedSection === wl.sectionId ? 'var(--brand-primary)' : 'transparent'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{wl.sectionId}</strong>
                                    <Badge colorScheme="warning">{wl.students.filter(s => s.status === 'ACTIVE').length} Waiting</Badge>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{wl.courseTitle}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Waitlist Queue Details */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedData ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>{selectedData.sectionId} Queue</h2>
                                        <div style={{ color: 'var(--text-secondary)' }}>{selectedData.courseTitle}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Capacity</div>
                                        <strong style={{ color: 'var(--danger-text, #ef4444)' }}>{selectedData.capacity} (FULL)</strong>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Pos</th>
                                            <th>Student</th>
                                            <th>Requested</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedData.students.map((student) => (
                                            <tr key={student.waitlistId}>
                                                <td><strong>#{student.position}</strong></td>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                                                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.studentId}</div>
                                                </td>
                                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{student.requestedAt}</td>
                                                <td>
                                                    <Badge colorScheme={student.status === 'ACTIVE' ? 'warning' : 'success'}>{student.status}</Badge>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {student.status === 'ACTIVE' ? (
                                                        <Button variant="outline" size="small" onClick={() => alert(`Promoted ${student.name} into the active roster.`)}>
                                                            Promote
                                                        </Button>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Enrolled</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⏱️</div>
                            <h3>No Waitlist Selected</h3>
                            <p>Select a section from the left pane to view and process its queue.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};