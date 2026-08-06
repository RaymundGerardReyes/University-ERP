import { PageHeader, Card } from '@university-erp/ui-kit';
import React from 'react';

export const TimetablePage: React.FC = () => {
    const mockSchedule = [
        { time: '09:00 AM', monday: 'CS101 (Room A201)', wednesday: 'CS101 (Room A201)', friday: 'CS101 (Room A201)' },
        { time: '11:00 AM', monday: 'MATH201 (Room B105)', wednesday: 'MATH201 (Room B105)', friday: 'MATH201 (Room B105)' },
        { time: '01:00 PM', tuesday: 'CS102 (Room C304)', thursday: 'CS102 (Room C304)' },
    ];

    return (
        <div className="fade-in">
            <PageHeader title="My Timetable" subtitle="Your class schedule for Fall 2026." />
            
            <Card style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: 'var(--space-3)' }}>Time</th>
                            <th style={{ padding: 'var(--space-3)' }}>Monday</th>
                            <th style={{ padding: 'var(--space-3)' }}>Tuesday</th>
                            <th style={{ padding: 'var(--space-3)' }}>Wednesday</th>
                            <th style={{ padding: 'var(--space-3)' }}>Thursday</th>
                            <th style={{ padding: 'var(--space-3)' }}>Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockSchedule.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: 'var(--space-3)', fontWeight: 'bold' }}>{row.time}</td>
                                <td style={{ padding: 'var(--space-3)', color: 'var(--brand-primary)' }}>{row.monday || '-'}</td>
                                <td style={{ padding: 'var(--space-3)', color: 'var(--brand-primary)' }}>{row.tuesday || '-'}</td>
                                <td style={{ padding: 'var(--space-3)', color: 'var(--brand-primary)' }}>{row.wednesday || '-'}</td>
                                <td style={{ padding: 'var(--space-3)', color: 'var(--brand-primary)' }}>{row.thursday || '-'}</td>
                                <td style={{ padding: 'var(--space-3)', color: 'var(--brand-primary)' }}>{row.friday || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
