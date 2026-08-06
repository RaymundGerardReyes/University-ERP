import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useGraduationCandidates, useEvaluateCandidate } from './Graduation.hooks';
import { GraduationCandidateItem } from './Graduation.types';

export const GraduationCandidatesPage: React.FC = () => {
    const { data: candidates = [], isLoading } = useGraduationCandidates();
    const evaluateMutation = useEvaluateCandidate();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Graduation Candidates</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Evaluate graduation clearance and compute Latin Honors eligibility.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Candidate Name</th>
                                <th>Program</th>
                                <th>GWA / GPA</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((cand: GraduationCandidateItem) => (
                                <tr key={cand.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{cand.id}</td>
                                    <td style={{ fontWeight: 600 }}>{cand.name}</td>
                                    <td>{cand.program}</td>
                                    <td style={{ fontWeight: 700, color: 'hsl(45, 90%, 45%)' }}>{cand.gpa}</td>
                                    <td><Badge variant="info">{cand.status}</Badge></td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            size="small"
                                            onClick={() => evaluateMutation.mutate(cand.id)}
                                            disabled={evaluateMutation.isPending}
                                        >
                                            Evaluate
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
