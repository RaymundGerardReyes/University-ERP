import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useFinalizeAssessment, usePendingAssessments } from './SemesterBilling.hooks';
import { SemesterAssessmentDto } from './SemesterBilling.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const SemesterBillingPage: React.FC = () => {
    const currentTermId = "TERM-FALL-2026";
    const { data: rawAssessments, isLoading } = usePendingAssessments(currentTermId);
    const assessments: SemesterAssessmentDto[] = toSafeArray<SemesterAssessmentDto>(rawAssessments);
    const finalizeMutation = useFinalizeAssessment();

    return (
        <div className="fade-in">
            <PageHeader
                title="Semester Billing & Assessment"
                subtitle="Review and finalize tuition assessments for enrolled students to generate invoices."
            />

            {isLoading ? (
              <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
            ) : (
              <Card>
                  <Table>
                      <thead>
                          <tr>
                              <th>Assessment ID</th>
                              <th>Student ID</th>
                              <th>Total Assessed</th>
                              <th>Status</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {assessments.length > 0 ? assessments.map((assessment) => (
                              <tr key={assessment.assessmentId}>
                                  <td><span style={{ fontFamily: 'monospace' }}>{assessment.assessmentId?.substring(0, 8) ?? 'N/A'}</span></td>
                                  <td><strong>{assessment.studentId}</strong></td>
                                  <td>${(assessment.totalAssessed ?? 0).toFixed(2)}</td>
                                  <td>
                                      <Badge colorScheme={assessment.status === 'FINALIZED' ? 'success' : 'warning'}>
                                          {assessment.status}
                                      </Badge>
                                  </td>
                                  <td>
                                      <Button
                                          variant="primary"
                                          size="small"
                                          disabled={assessment.status === 'FINALIZED' || finalizeMutation.isPending}
                                          onClick={() => finalizeMutation.mutate(assessment.assessmentId)}
                                      >
                                          {finalizeMutation.isPending ? 'Processing...' : 'Finalize & Invoice'}
                                      </Button>
                                  </td>
                              </tr>
                          )) : (
                              <tr>
                                  <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
                                      No pending assessments for this term.
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </Table>
              </Card>
            )}
        </div>
    );
};
