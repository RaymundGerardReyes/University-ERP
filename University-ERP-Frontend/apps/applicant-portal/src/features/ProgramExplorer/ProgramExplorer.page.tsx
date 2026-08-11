import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { ProgramOfferingDto } from '@university-erp/api-clients';
import React from 'react';
import { useProgramCatalog } from './ProgramExplorer.hooks';

export const ProgramExplorerPage: React.FC = () => {
  const { data: programs, isLoading } = useProgramCatalog();

  if (isLoading) return <div className="skeleton" />;

  return (
    <div className="fade-in">
      <PageHeader
        title="Academic Programs"
        subtitle="Explore our degree offerings and prepare your application for the upcoming term."
      />

      <div className="grid-auto fade-in-delay-1">
        {programs?.map((program: ProgramOfferingDto) => {
          // Derive a display name from degree + major since ProgramOfferingDto has no 'name' field
          const displayName = `${program.degree} in ${program.major}`;
          // Intake field signals availability — treat as 'Open' if an intake is set
          const status = program.intake ? 'Open' : 'Closed';

          return (
            <Card key={program.id} className="card">
              <div className="card-accent-top" />

              <div className="data-row">
                <span className="data-value">{displayName}</span>
                <Badge colorScheme={status === 'Open' ? 'success' : 'warning'}>
                  {status}
                </Badge>
              </div>

              <div className="data-row">
                <span className="data-label">Program Code</span>
                <span className="data-value">{program.id}</span>
              </div>

              <div className="data-row">
                <span className="data-label">College</span>
                <span className="data-value">{program.college}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Duration</span>
                <span className="data-value">{program.duration}</span>
              </div>

              <div className="data-row">
                <Button variant="outline">View Curriculum</Button>
                <Button variant="primary" disabled={status === 'Closed'}>
                  Start Application
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};