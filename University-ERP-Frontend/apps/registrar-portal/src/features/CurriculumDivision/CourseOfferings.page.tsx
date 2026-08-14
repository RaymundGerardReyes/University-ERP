import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';

export const CourseOfferingsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for UI demonstration
    const offerings = [
        { section: 'CS101-B', course: 'Intro to Programming', instructor: 'Dr. Alan Turing', schedule: 'MWF 10:00 - 11:30', enrolled: 39, capacity: 40, waitlist: 0, status: 'Open' },
        { section: 'CS201-A', course: 'Data Structures', instructor: 'Prof. Ada Lovelace', schedule: 'TTh 13:00 - 14:30', enrolled: 40, capacity: 40, waitlist: 5, status: 'Full' },
        { section: 'IT401-C', course: 'Artificial Intelligence', instructor: 'Dr. John McCarthy', schedule: 'MWF 14:00 - 15:30', enrolled: 15, capacity: 30, waitlist: 0, status: 'Open' },
    ];

    const getCapacityPercentage = (enrolled: number, capacity: number) => (enrolled / capacity) * 100;

    return (
        <div className="fade-in">
            <PageHeader 
                title="Course Offerings & Capacity" 
                subtitle="Monitor active term course offerings, section capacities, and waitlists." 
                action={<Button variant="primary">+ Add Section</Button>}
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)' }}>
                    <input 
                        type="text" 
                        placeholder="Search sections or courses..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} 
                    />
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Section Code</th>
                            <th>Course & Instructor</th>
                            <th>Schedule</th>
                            <th>Capacity Monitor</th>
                            <th>Waitlist</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offerings.map((offering) => {
                            const percent = getCapacityPercentage(offering.enrolled, offering.capacity);
                            const barColor = percent >= 100 ? 'var(--danger-text, #ef4444)' : percent > 80 ? 'var(--warning-text, #f59e0b)' : 'var(--success-text, #10b981)';

                            return (
                                <tr key={offering.section}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright, var(--text-primary))' }}>{offering.section}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{offering.course}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{offering.instructor}</div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{offering.schedule}</td>
                                    <td style={{ minWidth: '150px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                                            <span>{offering.enrolled} / {offering.capacity}</span>
                                            <span style={{ color: barColor }}>{Math.round(percent)}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'var(--bg-base)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: barColor, width: `${percent}%`, transition: 'width 0.3s' }} />
                                        </div>
                                    </td>
                                    <td>
                                        {offering.waitlist > 0 ? (
                                            <Badge colorScheme="warning">{offering.waitlist} Waiting</Badge>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <Badge colorScheme={offering.status === 'Open' ? 'success' : 'danger'}>
                                            {offering.status}
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
