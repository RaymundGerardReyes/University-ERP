import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const DocumentsPage: React.FC = () => {
    const { user } = useAuth();
    const { data: documents, isLoading } = useQuery({
        queryKey: ['facultyDocuments', user?.id],
        queryFn: () => documentsApi.getDocuments(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Institutional Documents" subtitle="Access syllabi templates and policies." />
            <div className="grid-auto fade-in-delay-1">
                {documents?.map((doc) => (
                    <Card key={doc.id}>
                        <div className="card-accent-top" />
                        <Badge colorScheme="default" style={{ marginBottom: 'var(--space-3)' }}>{doc.category}</Badge>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>{doc.name}</h3>
                        <div className="data-row" style={{ borderBottom: 'none' }}>
                            <span className="data-label">{doc.size}</span>
                            <Button variant="outline">Download</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};