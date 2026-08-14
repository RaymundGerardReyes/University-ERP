import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'CollegeApproval');

// Simulated DTO for Program Capacity
interface ProgramCapacityDto {
  programId: string;
  programName: string;
  targetCapacity: number;
  totalEndorsed: number; // Students approved by Chairperson
  pendingReview: number;
}

export const CollegeApprovalPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch capacity data (Using initialData as a safe stub for the UI blueprint)
  const { data: capacities = [], isLoading } = useQuery<ProgramCapacityDto[]>({
    queryKey: ['admissions', 'programCapacities'],
    queryFn: async () => {
      // Future API hookup: return await admissionsApi.getProgramCapacities();
      return [];
    },
    initialData: [
      { programId: 'PROG-CS', programName: 'BS Computer Science', targetCapacity: 50, totalEndorsed: 47, pendingReview: 12 },
      { programId: 'PROG-IT', programName: 'BS Information Technology', targetCapacity: 40, totalEndorsed: 46, pendingReview: 5 },
      { programId: 'PROG-IS', programName: 'BS Information Systems', targetCapacity: 35, totalEndorsed: 15, pendingReview: 8 }
    ]
  });

  const handleApproveBatch = (programId: string) => {
    logger.info(`Initiating batch approval for program: ${programId}`);
    setIsProcessing(true);
    // Simulate batch processing delay
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully endorsed approved batch for ${programId} to the University Registrar.`);
    }, 800);
  };

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="College Admissions Capacity" 
        subtitle="Monitor program enrollment limits and endorse applicant batches to the Registrar." 
      />

      <div className="grid-auto">
        {capacities.map((program) => {
          const percentage = (program.totalEndorsed / program.targetCapacity) * 100;
          const isOverCapacity = percentage > 100;
          const isWarning = percentage >= 90 && !isOverCapacity;

          // Determine UI colors based on UX rules
          let barColor = 'var(--success-text)';
          let statusBadge = <Badge colorScheme="success">Under Capacity</Badge>;

          if (isWarning) {
            barColor = 'var(--warning-text)';
            statusBadge = <Badge colorScheme="warning">Nearing Capacity</Badge>;
          } else if (isOverCapacity) {
            barColor = 'var(--danger-text)';
            statusBadge = <Badge colorScheme="danger">⚠ Over Capacity</Badge>;
          }

          return (
            <Card key={program.programId} style={{ display: 'flex', flexDirection: 'column', borderColor: isOverCapacity ? 'var(--danger-border)' : 'var(--border-color)' }}>
              {isOverCapacity && <div className="card-accent-top" style={{ background: 'var(--danger-text)', opacity: 1 }} />}
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-bright)', fontSize: '1.1rem' }}>
                    {program.programName}
                  </h3>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {program.programId}
                  </div>
                </div>
                {statusBadge}
              </div>

              {/* Metrics & Progress Bar */}
              <div style={{ marginBottom: 'var(--space-6)', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Endorsed</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isOverCapacity ? 'var(--danger-text)' : 'var(--text-primary)', lineHeight: 1 }}>
                      {program.totalEndorsed} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {program.targetCapacity}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {Math.round(percentage)}% Filled
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-active)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`, 
                      height: '100%', 
                      background: barColor,
                      transition: 'width 0.4s ease, background-color 0.4s ease'
                    }} 
                  />
                </div>
                
                <div style={{ marginTop: 'var(--space-3)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{program.pendingReview}</strong> applicants pending Chair review
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                <Button 
                  variant="outline" 
                  style={{ flex: 1 }}
                  onClick={() => logger.info(`Viewing waitlist for ${program.programId}`)}
                >
                  Review Waitlist
                </Button>
                <Button 
                  variant={isOverCapacity ? 'danger' : 'primary'} 
                  style={{ flex: 1 }}
                  disabled={isProcessing}
                  onClick={() => handleApproveBatch(program.programId)}
                >
                  Approve Batch
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
