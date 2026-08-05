import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useFacultyDocuments } from './Documents.hooks';

export const DocumentsPage: React.FC = () => {
    const { data: documents, isLoading, isError } = useFacultyDocuments();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !documents) return (
        <div className="stub-page fade-in">
            <div className="stub-icon">📁</div>
            <div className="stub-title">Failed to load documents.</div>
            <div className="stub-subtitle">Unable to fetch your secure files from the server.</div>
        </div>
    );

    return (
        <div className="fade-in">
            <PageHeader
                title="Document Repository"
                subtitle="Manage your syllabi, institutional policies, and research templates."
                action={<Button variant="primary">Upload File</Button>}
            />

            <div className="grid-auto fade-in-delay-1">
                {documents.map((doc, idx) => {
                    let badgeColor: 'info' | 'success' | 'warning' | 'default' = 'default';
                    if (doc.category === 'Syllabus') badgeColor = 'info';
                    if (doc.category === 'Policy') badgeColor = 'warning';
                    if (doc.category === 'Research') badgeColor = 'success';

                    return (
                        <Card key={doc.id} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: badgeColor === 'default' ? 'var(--text-muted)' : `var(--${badgeColor}-text)` }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                                    {doc.id}
                                </span>
                                <Badge colorScheme={badgeColor}>{doc.category}</Badge>
                            </div>

                            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 var(--space-4) 0', fontSize: '1.1rem', wordBreak: 'break-word' }}>
                                {doc.name}
                            </h3>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-4)', flex: 1 }}>
                                <div className="data-row">
                                    <span className="data-label">Size</span>
                                    <span className="data-value">{doc.size}</span>
                                </div>
                                <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                    <span className="data-label">Uploaded</span>
                                    <span className="data-value">{doc.uploadDate}</span>
                                </div>
                            </div>

                            <Button variant="outline" style={{ width: '100%' }}>Download</Button>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};