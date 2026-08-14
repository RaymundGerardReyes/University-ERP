// src/features/CurriculumDivision/CourseOfferings.page.tsx
import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, FormInput, EmptyState } from '@university-erp/ui-kit';

export const CourseOfferingsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for UI demonstration
    const offerings = [
        { section: 'CS101-B', course: 'Intro to Programming', instructor: 'Dr. Alan Turing', schedule: 'MWF 10:00 - 11:30', enrolled: 39, capacity: 40, waitlist: 0, status: 'Open' },
        { section: 'CS201-A', course: 'Data Structures', instructor: 'Prof. Ada Lovelace', schedule: 'TTh 13:00 - 14:30', enrolled: 40, capacity: 40, waitlist: 5, status: 'Full' },
        { section: 'IT401-C', course: 'Artificial Intelligence', instructor: 'Dr. John McCarthy', schedule: 'MWF 14:00 - 15:30', enrolled: 15, capacity: 30, waitlist: 0, status: 'Open' },
    ];

    const getCapacityPercentage = (enrolled: number, capacity: number) => (enrolled / capacity) * 100;

    const filteredOfferings = offerings.filter(o => 
        o.section.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSections = offerings.length;
    const fullSections = offerings.filter(o => o.status === 'Full').length;
    const waitlistedCount = offerings.reduce((acc, curr) => acc + curr.waitlist, 0);

    // Reusable Capacity Bar Component
    const CapacityBar = ({ enrolled, capacity }: { enrolled: number, capacity: number }) => {
        const percent = getCapacityPercentage(enrolled, capacity);
        const barColor = percent >= 100 ? 'var(--danger-text, #ef4444)' : percent > 80 ? 'var(--warning-text, #f59e0b)' : 'var(--success-text, #10b981)';
        return (
            <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{enrolled} / {capacity}</span>
                    <span style={{ color: barColor, fontWeight: 600 }}>{Math.round(percent)}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-base)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: barColor, width: `${percent}%`, transition: 'width 0.3s' }} />
                </div>
            </div>
        );
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Course Offerings & Capacity" 
                subtitle="Monitor active term course offerings, section capacities, and waitlists." 
                action={<Button variant="primary">+ Add Section</Button>}
            />

            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--info-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sections</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalSections}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Sections</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{fullSections}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--danger-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Waitlisted</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger-text)' }}>{waitlistedCount}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon"> </span>
                    <FormInput 
                        placeholder="Search sections, courses, or instructors..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
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
                                {filteredOfferings.map((offering) => (
                                    <tr key={offering.section}>
                                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright, var(--text-primary))' }}>{offering.section}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{offering.course}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{offering.instructor}</div>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>{offering.schedule}</td>
                                        <td>
                                            <CapacityBar enrolled={offering.enrolled} capacity={offering.capacity} />
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
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW */}
            <div className="mobile-only flex-stack fade-in">
                {filteredOfferings.map((offering) => (
                    <Card key={offering.section}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{offering.section}</span>
                            <Badge colorScheme={offering.status === 'Open' ? 'success' : 'danger'}>
                                {offering.status}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{offering.course}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{offering.instructor} • {offering.schedule}</p>
                        
                        <div style={{ background: 'var(--bg-base)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Capacity Details</div>
                            <CapacityBar enrolled={offering.enrolled} capacity={offering.capacity} />
                            
                            {offering.waitlist > 0 && (
                                <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <Badge colorScheme="warning">{offering.waitlist} Students Waitlisted</Badge>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredOfferings.length === 0 && (
                <EmptyState 
                    title="No Offerings Found" 
                    description={`No section matches your search for "${searchTerm}".`} 
                    icon=" " 
                />
            )}
        </div>
    );
};
