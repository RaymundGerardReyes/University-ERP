import React, { useState } from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useOfflineSubmissions, useGradeSubmission } from './SubmissionReview.hooks';

export const SubmissionReviewPage: React.FC = () => {
  const { data: submissions, isLoading } = useOfflineSubmissions();
  const gradeMutation = useGradeSubmission();
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [gradeInput, setGradeInput] = useState('95');
  const [feedbackInput, setFeedbackInput] = useState('Excellent algorithmic complexity analysis.');

  const defaultSubmissions = [
    {
      id: 'SUB-2026-001',
      studentId: 'STU-2026-8812',
      studentName: 'Alice Chen',
      courseCode: 'CS101',
      assignmentTitle: 'CS101 - Lab 1: Binary Search',
      syncedAtUtc: '2026-08-06 08:30 AM',
      status: 'Pending Review' as const,
      maxScore: 100
    },
    {
      id: 'SUB-2026-002',
      studentId: 'STU-2026-9934',
      studentName: 'Bob Martinez',
      courseCode: 'CS203',
      assignmentTitle: 'CS203 - Red-Black Trees',
      syncedAtUtc: '2026-08-06 09:15 AM',
      status: 'Graded' as const,
      score: 88,
      maxScore: 100
    }
  ];

  const submissionList = (submissions && submissions.length > 0) ? submissions : defaultSubmissions;

  const handleGrade = async () => {
    if (!selectedSubmission) return;
    await gradeMutation.mutateAsync({
      submissionId: selectedSubmission.id,
      score: parseInt(gradeInput, 10),
      feedback: feedbackInput
    });
    setSelectedSubmission(null);
  };

  return (
    <div className="fade-in" style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
        Offline Submission Review
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Review and grade assignments that have been synced back from the Avalonia Student Clients.
      </p>

      {isLoading ? (
        <div className="skeleton" style={{ height: '300px' }} />
      ) : (
        <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
          <Table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Assignment</th>
                <th>Synced At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissionList.map((sub: any) => (
                <tr key={sub.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{sub.studentId}</td>
                  <td>{sub.assignmentTitle || sub.assignment}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{sub.syncedAtUtc || sub.syncedAt}</td>
                  <td>
                    <Badge variant={sub.status === 'Graded' ? 'success' : 'warning'}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="small"
                      variant="primary"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {selectedSubmission && (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-elevated)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Grade Submission: {selectedSubmission.studentId}</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <label>Score (/100):</label>
            <input
              type="number"
              value={gradeInput}
              onChange={e => setGradeInput(e.target.value)}
              style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Feedback:</label>
            <textarea
              rows={3}
              value={feedbackInput}
              onChange={e => setFeedbackInput(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="primary" onClick={handleGrade} disabled={gradeMutation.isPending}>
              {gradeMutation.isPending ? 'Saving...' : 'Submit Grade & Notify Student'}
            </Button>
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
