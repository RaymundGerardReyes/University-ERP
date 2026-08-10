import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useSubjectCatalog } from './Curriculum.hooks';
import { SubjectCatalogItem } from './Curriculum.types';

export const SubjectCatalogPage: React.FC = () => {
    const { data: catalog = [], isLoading } = useSubjectCatalog();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Subject Catalog" subtitle="Manage university course offerings and prerequisites." />

            <Card>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
                    <Button variant="primary">Add New Subject</Button>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Units</th>
                            <th>Prerequisites</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {catalog.map((subject: SubjectCatalogItem) => (
                            <tr key={subject.code}>
                                <td style={{ fontWeight: 'bold' }}>{subject.code}</td>
                                <td>{subject.title}</td>
                                <td>{subject.units}</td>
                                <td>{subject.prerequisites || 'None'}</td>
                                <td>
                                    <Badge colorScheme={subject.status === 'Active' ? 'success' : 'default'}>
                                        {subject.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};