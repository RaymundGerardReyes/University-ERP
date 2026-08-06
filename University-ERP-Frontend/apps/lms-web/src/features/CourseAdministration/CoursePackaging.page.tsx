import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { LMSWorkflow } from '@university-erp/workflow-sdk';

export const CoursePackagingPage: React.FC = () => {
    const handleProvision = async (courseId: string) => {
        await LMSWorkflow.process(courseId, 'ProvisionCourses');
        alert(`Offline Package for course ${courseId} has been compiled and is ready for Avalonia clients to download.`);
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Offline Course Packaging</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Compile modules, quizzes, and videos into compressed packages for the Avalonia Student Client.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Module Title</th>
                            <th>Package Size</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>CS101</td>
                            <td>Introduction to Programming (Week 1-4)</td>
                            <td>~45 MB</td>
                            <td><Badge variant="warning">Draft</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleProvision('CS101')}>
                                    Compile & Publish Package
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
