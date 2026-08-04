import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ModuleTimelinePage: React.FC = () => {
    const navigate = useNavigate();

    const course = {
        code: 'CS-101',
        title: 'Introduction to Computer Science',
        faculty: 'Dr. Alan Turing',
        modules: [
            { id: 'MOD-1', title: 'Week 1: Fundamentals of Logic', status: 'Completed', type: 'Lesson' },
            { id: 'MOD-2', title: 'Week 2: Control Structures', status: 'Active', type: 'Lesson' },
            { id: 'MOD-3', title: 'Assignment: First Algorithm', status: 'Pending', type: 'Assignment', due: 'In 3 days' },
            { id: 'MOD-4', title: 'Quiz: Boolean Logic', status: 'Locked', type: 'Quiz', due: 'Next Week' },
        ]
    };

    return (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Button variant="outline" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
                ← Back to Dashboard
            </Button>

            <PageHeader
                title={`${course.code}: ${course.title}`}
                subtitle={`Instructor: ${course.faculty}`}
                action={<Button variant="primary">Download Offline Package</Button>}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                {course.modules.map((mod, idx) => (
                    <Card key={mod.id} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1.5rem' }}>
                        {/* Visual Timeline Connector */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: mod.status === 'Completed' ? 'var(--success-text)' : mod.status === 'Active' ? 'var(--brand-primary)' : 'var(--border-color)', zIndex: 2 }} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{mod.type}</span>
                                {mod.due && <span style={{ fontSize: '0.75rem', color: 'var(--warning-text)' }}>Due: {mod.due}</span>}
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: mod.status === 'Locked' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                {mod.title}
                            </h3>
                        </div>

                        <div>
                            {mod.status === 'Locked' ? (
                                <Badge colorScheme="default">Locked</Badge>
                            ) : mod.status === 'Completed' ? (
                                <Badge colorScheme="success">Completed</Badge>
                            ) : mod.type === 'Assignment' ? (
                                <Button variant="primary" onClick={() => navigate(`/assignment/${mod.id}`)}>Start Draft</Button>
                            ) : mod.type === 'Quiz' ? (
                                <Button variant="primary" style={{ background: 'var(--danger-text)' }} onClick={() => navigate(`/quiz/${mod.id}`)}>Begin Quiz</Button>
                            ) : (
                                <Button variant="outline">View Lesson</Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};