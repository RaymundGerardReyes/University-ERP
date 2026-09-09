import React, { useState } from 'react';
import { Badge, Button, Card, FormInput, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { useCrossEnrollmentRequests, useSubmitCrossEnrollment } from './CrossEnrollment.hooks';
import { SubmitCrossEnrollmentRequest } from './CrossEnrollment.types';

export const CrossEnrollmentPage: React.FC = () => {
  const { identity } = useAuth();
  const studentId = identity?.id || 'STU-2026-001';
  const { data: requests, isLoading } = useCrossEnrollmentRequests(studentId);
  const submitMutation = useSubmitCrossEnrollment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SubmitCrossEnrollmentRequest>({
    studentId,
    hostInstitution: '',
    subjects: []
  });
  const [subjectInput, setSubjectInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hostInstitution || !subjectInput.trim()) return;
    const subjects = subjectInput.split(',').map(s => s.trim()).filter(Boolean);
    await submitMutation.mutateAsync({
      ...formData,
      studentId,
      subjects
    });
    setIsModalOpen(false);
    setFormData({ studentId, hostInstitution: '', subjects: [] });
    setSubjectInput('');
  };

  const items = requests?.length ? requests : [
    { requestId: 'REQ-CR-001', studentId, hostInstitution: 'National Institute of Technology', subjects: ['PHYS205', 'MATH305'], status: 'REGISTRAR_APPROVED' as const, submittedAt: '2026-08-10' },
    { requestId: 'REQ-CR-002', studentId, hostInstitution: 'State University of Arts', subjects: ['HUM102'], status: 'DEAN_APPROVED' as const, submittedAt: '2026-08-28' }
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="CrossEnrollment Workspace"
        subtitle="Manage cross-enrollment requests and partnerships across partner academic institutions."
        action={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Submit Cross-Enrollment Request
          </Button>
        }
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Host Institution</th>
                <th>Subjects</th>
                <th>Submitted Date</th>
                <th>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.requestId}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.requestId}</td>
                  <td style={{ fontWeight: 600 }}>{r.hostInstitution}</td>
                  <td>{Array.isArray(r.subjects) ? r.subjects.join(', ') : r.subjects}</td>
                  <td>{r.submittedAt}</td>
                  <td>
                    <Badge colorScheme={r.status === 'REGISTRAR_APPROVED' ? 'success' : (r.status === 'REJECTED' ? 'danger' : 'warning')}>
                      {r.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Submit Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>New Cross-Enrollment Request</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Host Partner Institution</label>
              <FormInput
                placeholder="e.g. State Polytechnic University"
                value={formData.hostInstitution}
                onChange={(e) => setFormData({ ...formData, hostInstitution: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Intended Subjects (comma-separated codes)</label>
              <FormInput
                placeholder="e.g. CS410, MATH315"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? 'Submitting...' : 'Submit Permit'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
