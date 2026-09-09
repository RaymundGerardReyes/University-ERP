import React from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useAssessmentCandidates, usePerformAssessment } from './TuitionAssessment.hooks';

export const TuitionAssessmentPage: React.FC = () => {
  const { data: candidates, isLoading } = useAssessmentCandidates();
  const assessMutation = usePerformAssessment();

  const handleAssess = async (studentId: string) => {
    await assessMutation.mutateAsync({ studentId, termId: 'TERM-FALL-2026' });
    alert(`Tuition assessment completed for ${studentId}.`);
  };

  const students = candidates?.length ? candidates : [
    { studentId: 'STU-2026-8812', studentName: 'Michael Corleone', program: 'BS Computer Science', enrolledUnits: 18, ratePerUnit: 120, miscellaneousFees: 350, scholarshipDeduction: 500, assessedTotal: 2010, status: 'Pending' },
    { studentId: 'STU-2026-9041', studentName: 'Elena Rostova', program: 'BS Information Systems', enrolledUnits: 15, ratePerUnit: 120, miscellaneousFees: 350, scholarshipDeduction: 0, assessedTotal: 2150, status: 'Pending' },
    { studentId: 'STU-2026-7732', studentName: 'David Chen', program: 'BS Data Science', enrolledUnits: 21, ratePerUnit: 120, miscellaneousFees: 400, scholarshipDeduction: 1000, assessedTotal: 1920, status: 'Assessed' }
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Tuition Assessment"
        subtitle="Evaluate enrolled units, apply scholarship deductions, and calculate tuition liabilities."
      />

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Program</th>
              <th>Units</th>
              <th>Rate / Unit</th>
              <th>Misc Fees</th>
              <th>Scholarship</th>
              <th>Assessed Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s: any) => (
              <tr key={s.studentId}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                <td>{s.studentName}</td>
                <td>{s.program}</td>
                <td>{s.enrolledUnits}</td>
                <td>${s.ratePerUnit}</td>
                <td>${s.miscellaneousFees}</td>
                <td style={{ color: s.scholarshipDeduction > 0 ? 'var(--success-text)' : 'inherit' }}>
                  -${s.scholarshipDeduction}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                  ${s.assessedTotal.toFixed(2)}
                </td>
                <td>
                  <Badge colorScheme={s.status === 'Assessed' ? 'success' : 'warning'}>
                    {s.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="small"
                    variant="primary"
                    disabled={s.status === 'Assessed' || assessMutation.isPending}
                    onClick={() => handleAssess(s.studentId)}
                  >
                    {s.status === 'Assessed' ? 'Assessed' : 'Assess Tuition'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
