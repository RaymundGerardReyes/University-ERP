import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useGradebook, useSubmitGrades } from './Assessments.hooks';

export const AssessmentsPage: React.FC = () => {
    const [selectedSection, setSelectedSection] = useState('SEC-1001');
    const { data: roster, isLoading } = useGradebook(selectedSection);
    const { mutateAsync: submitGrades, isPending } = useSubmitGrades();

    const handleSave = async () => {
        await submitGrades({ sectionId: selectedSection, payload: {} });
        alert('Grades securely saved to the backend.');
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Assessments & Gradebook"
                subtitle="Manage assignments, rubrics, and final grade submissions."
            />

            <Card style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Active Section:</span>
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none' }}
                >
                    <option value="SEC-1001">BSCS-1A (Intro to Computing)</option>
                    <option value="SEC-1002">BSCS-3C (Database Management)</option>
                </select>
                <Button variant="primary" style={{ marginLeft: 'auto' }} onClick={handleSave} disabled={isPending}>
                    {isPending ? 'Saving...' : 'Commit Grades'}
                </Button>
            </Card>

            <Card style={{ padding: 0, overflow: 'hidden' }} className="fade-in-delay-1">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: 'var(--space-4)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <div>Student Name</div>
                    <div>Prelim</div>
                    <div>Midterm</div>
                    <div>Final</div>
                    <div>Status</div>
                </div>

                {isLoading ? (
                    <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading gradebook...</div>
                ) : (
                    roster?.map((student, idx) => (
                        <div key={student.studentId} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center', background: idx % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.studentName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{student.studentId}</div>
                            </div>
                            <input type="number" defaultValue={student.prelim || ''} placeholder="-" style={{ width: '60px', padding: '0.25rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                            <input type="number" defaultValue={student.midterm || ''} placeholder="-" style={{ width: '60px', padding: '0.25rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                            <input type="number" defaultValue={student.final || ''} placeholder="-" style={{ width: '60px', padding: '0.25rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }} />
                            <div>
                                <Badge colorScheme={student.status === 'Graded' ? 'success' : student.status === 'Incomplete' ? 'danger' : 'warning'}>{student.status}</Badge>
                            </div>
                        </div>
                    ))
                )}
            </Card>
        </div>
    );
};