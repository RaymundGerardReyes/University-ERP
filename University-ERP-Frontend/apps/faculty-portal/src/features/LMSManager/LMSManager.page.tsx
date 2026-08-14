import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useSyllabusContent, useCreateSyllabus, useAddModule, useAddContent } from './LMSManager.hooks';

export const LMSManagerPage: React.FC = () => {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();
    
    const { data: syllabus, isLoading, isError } = useSyllabusContent(sectionId || '');
    const createSyllabus = useCreateSyllabus(sectionId || '');
    const addModule = useAddModule(sectionId || '');
    const addContent = useAddContent(sectionId || '');

    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newModuleDesc, setNewModuleDesc] = useState('');
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    const handleCreateSyllabus = () => {
        createSyllabus.mutate({ title: `Syllabus for ${sectionId}`, description: 'Auto-generated syllabus shell' });
    };

    const handleAddModule = () => {
        if (!newModuleTitle) return;
        addModule.mutate({ title: newModuleTitle, description: newModuleDesc, orderSequence: (syllabus?.modules?.length || 0) + 1 }, {
            onSuccess: () => {
                setNewModuleTitle('');
                setNewModuleDesc('');
            }
        });
    };

    const handleAddContent = (moduleId: string) => {
        const name = prompt("Enter resource name (e.g., 'Week 1 Lecture Slides'):");
        if (!name) return;
        const url = prompt("Enter resource URL:");
        if (!url) return;
        
        addContent.mutate({ moduleId, name, contentType: 'URL', resourceUrl: url });
    };

    if (isLoading) return <div className="skeleton" style={{ height: '500px' }} />;

    return (
        <div className="fade-in">
            <Button variant="outline" onClick={() => navigate('/teaching')} style={{ marginBottom: 'var(--space-4)' }}>
                ← Back to Dashboard
            </Button>
            
            <PageHeader 
                title={`LMS Content Manager: ${sectionId}`} 
                subtitle="Build your course syllabus, add modules, and upload learning materials." 
            />

            {(isError || !syllabus) ? (
                <Card className="fade-in-delay-1" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    <h3>No Syllabus Found</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                        You have not created a syllabus or content structure for this section yet.
                    </p>
                    <Button variant="primary" onClick={handleCreateSyllabus} disabled={createSyllabus.isPending}>
                        {createSyllabus.isPending ? 'Initializing...' : 'Initialize Course Shell'}
                    </Button>
                </Card>
            ) : (
                <div className="fade-in-delay-1">
                    <Card style={{ marginBottom: 'var(--space-6)' }}>
                        <h3>Add Learning Module</h3>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                            <input 
                                placeholder="Module Title (e.g., Week 1)" 
                                value={newModuleTitle} 
                                onChange={e => setNewModuleTitle(e.target.value)} 
                                style={{ flex: 1, padding: '0.5rem' }} 
                            />
                            <input 
                                placeholder="Description" 
                                value={newModuleDesc} 
                                onChange={e => setNewModuleDesc(e.target.value)} 
                                style={{ flex: 2, padding: '0.5rem' }} 
                            />
                            <Button variant="primary" onClick={handleAddModule} disabled={addModule.isPending}>
                                + Add Module
                            </Button>
                        </div>
                    </Card>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {syllabus.modules?.sort((a: any, b: any) => a.orderSequence - b.orderSequence).map((mod: any) => (
                            <Card key={mod.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 var(--space-2) 0' }}>{mod.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{mod.description}</p>
                                    </div>
                                    <Button variant="outline" size="small" onClick={() => handleAddContent(mod.id)}>
                                        + Upload Resource
                                    </Button>
                                </div>
                                
                                {mod.items && mod.items.length > 0 && (
                                    <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                                        <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                                            {mod.items.map((item: any) => (
                                                <li key={item.id} style={{ marginBottom: 'var(--space-2)' }}>
                                                    <a href={item.resourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>
                                                        {item.name}
                                                    </a>
                                                    <span style={{ marginLeft: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        ({item.contentType})
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
