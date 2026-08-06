import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const CourseOfferingsPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Course Offerings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage active term course offerings and section capacities.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Section Code</th>
                            <th>Course</th>
                            <th>Schedule</th>
                            <th>Capacity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>CS101-B</td>
                            <td>Intro to Programming</td>
                            <td>MWF 10:00 - 11:30</td>
                            <td>39 / 40</td>
                            <td><Badge variant="success">Open</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
