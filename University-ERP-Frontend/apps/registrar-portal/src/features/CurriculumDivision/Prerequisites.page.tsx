import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useCourses, useUpdatePrerequisite } from './Curriculum.hooks';

export const PrerequisitesPage: React.FC = () => {
    const { data: courses, isLoading } = useCourses();
    const updateMutation = useUpdatePrerequisite();
    
    // State to manage the currently selected course and search filter
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Real data mapping
    const displayCourses = courses || [];

    // Filter the left pane based on the search input
    const filteredCourses = displayCourses.filter((c: any) => 
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCourse = displayCourses.find((c: any) => c.courseId === selectedCourseId);

    const handleToggleEnforcement = (ruleId: string, currentStatus: boolean) => {
        if (!selectedCourseId) return;
        updateMutation.mutate({ courseId: selectedCourseId, ruleId, isEnforced: !currentStatus });
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Prerequisite Management"
                subtitle="Configure and enforce prerequisites and co-requisites for the university catalog."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Course Directory (Master) */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <input 
                            type="text" 
                            placeholder="Search course code or title..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} 
                        />
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredCourses.map((course: any) => (
                            <div 
                                key={course.courseId}
                                onClick={() => setSelectedCourseId(course.courseId)}
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))',
                                    cursor: 'pointer',
                                    background: selectedCourseId === course.courseId ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: selectedCourseId === course.courseId ? '4px solid var(--brand-primary)' : '4px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{course.code}</strong>
                                    {course.prerequisites.length > 0 && (
                                        <Badge colorScheme="info">{course.prerequisites.length} Rules</Badge>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{course.title}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Relationship Manager (Detail) */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-elevated, var(--bg-surface))' }}>
                    {selectedCourse ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-6)' }}>
                                <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>{selectedCourse.code}</h2>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{selectedCourse.title} • {selectedCourse.units} Units</div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Required Prerequisites</h3>
                                    <Button variant="primary" size="small">+ Add Rule</Button>
                                </div>

                                {selectedCourse.prerequisites.length === 0 ? (
                                    <div style={{ padding: 'var(--space-6)', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                        <p style={{ color: 'var(--text-muted)' }}>This course has no prerequisites.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        {selectedCourse.prerequisites.map((rule: any) => (
                                            <div key={rule.ruleId} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${rule.isEnforced ? 'var(--danger-text, #ef4444)' : 'var(--warning-text, #f59e0b)'}` }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                                                        <strong style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: 'var(--text-bright, var(--text-primary))' }}>{rule.requiredCourseId}</strong>
                                                        <Badge colorScheme={rule.isEnforced ? 'danger' : 'warning'}>
                                                            {rule.isEnforced ? 'Strict Enforcement' : 'Advisory Only'}
                                                        </Badge>
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        Minimum Grade Required: <strong style={{ color: 'var(--text-primary)' }}>{rule.minimumGrade}</strong>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button 
                                                        variant={rule.isEnforced ? 'outline' : 'secondary'} 
                                                        size="small"
                                                        onClick={() => handleToggleEnforcement(rule.ruleId, rule.isEnforced)}
                                                    >
                                                        {rule.isEnforced ? 'Make Advisory' : 'Enforce Strictly'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔗</div>
                            <h3>No Course Selected</h3>
                            <p>Select a course from the directory to view and manage its relationship rules.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};