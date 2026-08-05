import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useGradebook, useSubmitGrades } from './Assessments.hooks';

export const AssessmentsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('SEC-1001');
    const { data: records, isLoading, isError } = useGradebook(activeSection);
    const { mutateAsync: submitGrades, isPending } = useSubmitGrades();

    const handlePublish = async () => {
        try {
            await submitGrades({ sectionId: activeSection, payload: { timestamp: new Date().toISOString() } });
        } catch (err) {
            console.error(err);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '60px', padding: 'var(--space-1)', background: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace"
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !records) return <div className="stub-page fade-in"><div className="stub-title">Gradebook Unavailable</div></div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="Gradebook & Assessments"
                subtitle="Manage student evaluations, input grades, and publish official academic records."
                action={
                    <Button variant="primary" onClick={handlePublish} disabled={isPending}>
                        {isPending ? 'Publishing...' : 'Publish Grades'}
                    </Button>
                }
            />

            <Card className="fade-in-delay-1" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="card-accent-top" style={{ background: 'var(--brand-secondary)' }} />

                <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <select
                        style={{ ...inputStyle, width: '200px', padding: 'var(--space-2)' }}
                        value={activeSection}
                        onChange={e => setActiveSection(e.target.value)}
                    >
                        <option value="SEC-1001">CS-101: BSCS-1A</option>
                        <option value="SEC-1002">CS-305: BSCS-3C</option>
                    </select>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{records.length} Enrolled</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <th style={{ padding: 'var(--space-3) var(--space-6)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                                <th style={{ padding: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prelim</th>
                                <th style={{ padding: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Midterm</th>
                                <th style={{ padding: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final</th>
                                <th style={{ padding: 'var(--space-3) var(--space-6)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record.studentId} style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                                    <td style={{ padding: 'var(--space-3) var(--space-6)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{record.studentName}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{record.studentId}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--space-3)' }}><input type="number" style={inputStyle} defaultValue={record.prelim ?? ''} /></td>
                                    <td style={{ padding: 'var(--space-3)' }}><input type="number" style={inputStyle} defaultValue={record.midterm ?? ''} /></td>
                                    <td style={{ padding: 'var(--space-3)' }}><input type="number" style={inputStyle} defaultValue={record.final ?? ''} /></td>
                                    <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right' }}>
                                        <Badge colorScheme={record.status === 'Graded' ? 'success' : record.status === 'Pending' ? 'warning' : 'danger'}>
                                            {record.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};