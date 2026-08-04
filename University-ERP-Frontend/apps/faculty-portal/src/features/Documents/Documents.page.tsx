import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useFacultyDocuments } from './Documents.hooks';

export const DocumentsPage: React.FC = () => {
    const { data: documents, isLoading } = useFacultyDocuments();
    const [filter, setFilter] = useState<string>('All');

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    const categories = ['All', 'Syllabus', 'Policy', 'Form', 'Research'];
    const filteredDocs = filter === 'All' ? documents : documents?.filter(d => d.category === filter);

    return (
        <div className="fade-in">
            <PageHeader
                title="Document Repository"
                subtitle="Access institutional policies, forms, and your uploaded files."
                action={<Button variant="primary">Upload Document</Button>}
            />

            <Card style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Filter by Category:</span>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={filter === cat ? 'primary' : 'outline'}
                            onClick={() => setFilter(cat)}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </Card>

            <div className="grid-auto fade-in-delay-1">
                {filteredDocs?.map(doc => (
                    <Card key={doc.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <Badge colorScheme={doc.category === 'Policy' ? 'danger' : doc.category === 'Syllabus' ? 'info' : 'warning'}>
                                {doc.category}
                            </Badge>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size}</span>
                        </div>
                        <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)', fontSize: '1.1rem', wordBreak: 'break-word' }}>
                            {doc.name}
                        </h3>
                        <p style={{ margin: '0 0 var(--space-6) 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="outline" style={{ flex: 1 }}>Preview</Button>
                            <Button variant="secondary" style={{ flex: 1 }}>Download</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};