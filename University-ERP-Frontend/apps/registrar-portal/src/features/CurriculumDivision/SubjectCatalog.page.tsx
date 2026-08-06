import React from 'react';
import { Card, Table, Badge } from '@university-erp/ui-kit';
import { useSubjectCatalog } from './Curriculum.hooks';
import { SubjectCatalogItem } from './Curriculum.types';

export const SubjectCatalogPage: React.FC = () => {
    const { data: catalog = [], isLoading } = useSubjectCatalog();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Subject Catalog</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage university-wide curriculums, courses, and prerequisite chains.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Descriptive Title</th>
                                <th>Units</th>
                                <th>Prerequisites</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {catalog.map((course: SubjectCatalogItem) => (
                                <tr key={course.code}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{course.code}</td>
                                    <td>{course.title}</td>
                                    <td>{course.units}</td>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{course.prerequisites}</td>
                                    <td><Badge variant="success">{course.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
