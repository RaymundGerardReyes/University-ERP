import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useGradebook, useSubmitGrades } from './Assessments.hooks';

export const AssessmentsPage: React.FC = () => {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();
    
    const { data: roster, isLoading, isError } = useGradebook(sectionId || '');
    const submitGradesMutation = useSubmitGrades(sectionId || '');

    // Local state to hold draft grades before submission
    const [draftGrades, setDraftGrades] = useState<Record<string, { prelim: number|string, midterm: number|string, final: number|string }>>({});

    if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;
    if (isError || !roster) return <div className="stub-page">Failed to load gradebook.</div>;

    const handleGradeChange = (studentId: string, term: 'prelim' | 'midterm' | 'final', value: string) => {
        setDraftGrades(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { prelim: '', midterm: '', final: '' }),
                [term]: value
            }
        }));
    };

    const handleSubmit = () => {
        if(window.confirm("Are you sure you want to submit these grades? This action will permanently update the students' academic records.")) {
            submitGradesMutation.mutate(draftGrades);
        }
    };

    return (
        <div className="fade-in">
            <Button variant="outline" onClick={() => navigate('/teaching')} style={{ marginBottom: 'var(--space-4)' }}>
                 Back to Dashboard
            </Button>
            
            <PageHeader 
                title={`Gradebook: ${sectionId}`} 
                subtitle="Enter and submit official term grades for your enrolled students." 
            />

            <Card className="fade-in-delay-1">
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Prelim</th>
                            <th>Midterm</th>
                            <th>Final</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((student: any) => (
                            <tr key={student.studentId}>
                                <td style={{ fontFamily: 'monospace' }}>{student.studentId}</td>
                                <td style={{ fontWeight: 'bold' }}>{student.studentName}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        defaultValue={student.prelim || ''}
                                        onChange={(e) => handleGradeChange(student.studentId, 'prelim', e.target.value)}
                                        style={{ width: '70px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        defaultValue={student.midterm || ''}
                                        onChange={(e) => handleGradeChange(student.studentId, 'midterm', e.target.value)}
                                        style={{ width: '70px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="number" 
                                        defaultValue={student.final || ''}
                                        onChange={(e) => handleGradeChange(student.studentId, 'final', e.target.value)}
                                        style={{ width: '70px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                                    />
                                </td>
                                <td>
                                    <Badge colorScheme={student.status === 'Graded' ? 'success' : 'warning'}>
                                        {student.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit}
                        disabled={submitGradesMutation.isPending || Object.keys(draftGrades).length === 0}
                    >
                        {submitGradesMutation.isPending ? 'Submitting...' : 'Submit Official Grades'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};