import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'CurriculumMatching');

// Simulated DTO for Transfer Credits
interface TransferCourseDto {
  id: string;
  externalCourseCode: string;
  externalCourseName: string;
  credits: number;
  grade: string;
  mappedInternalCode?: string;
}

export const CurriculumMatchingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  // Local state to hold the current mappings being edited
  const [mappings, setMappings] = useState<Record<string, string>>({});

  // Fetch applicants awaiting curriculum matching
  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['admissions', 'curriculumMatchingQueue'],
    queryFn: async () => {
      // Stubbed data for UI Blueprint
      return [
        { 
          id: 'APP-TR-2026-01', 
          applicantName: 'Elias Thorne', 
          program: 'BS Computer Science',
          previousInstitution: 'State Tech University',
          transferCourses: [
            { id: 'TC-1', externalCourseCode: 'CS100', externalCourseName: 'Intro to Tech', credits: 3, grade: 'A' },
            { id: 'TC-2', externalCourseCode: 'MTH150', externalCourseName: 'Calculus I', credits: 4, grade: 'B+' }
          ]
        }
      ];
    }
  });

  const selectedApp = queue.find((app: any) => app.id === selectedAppId);

  // Mutation to save the mapped curriculum
  const saveMappingMutation = useMutation({
    mutationFn: async (payload: { applicationId: string, mappings: Record<string, string> }) => {
      // Future API hookup: await admissionsApi.saveCurriculumMapping(payload);
      return new Promise(resolve => setTimeout(resolve, 600));
    },
    onSuccess: () => {
      logger.info(`Curriculum mapping saved successfully for ${selectedAppId}`);
      queryClient.invalidateQueries({ queryKey: ['admissions', 'curriculumMatchingQueue'] });
      setSelectedAppId(null);
      setMappings({});
      alert('Transfer credits successfully mapped and saved!');
    },
    onError: (err) => {
      logger.error('Failed to save curriculum mapping', err);
    }
  });

  const handleMappingChange = (transferCourseId: string, internalCode: string) => {
    setMappings(prev => ({ ...prev, [transferCourseId]: internalCode }));
  };

  if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="Curriculum Matching & Transfer Credits" 
        subtitle="Evaluate external transcripts and map them to internal course equivalents." 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        
        {/* LEFT PANE: Transfer Applicant Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Pending Evaluations</h3>
          {queue.map((app: any) => (
            <Card 
              key={app.id} 
              onClick={() => {
                setSelectedAppId(app.id);
                setMappings({}); // Reset mappings when switching applicants
              }}
              style={{ 
                cursor: 'pointer',
                borderColor: selectedAppId === app.id ? 'var(--brand-primary)' : 'var(--border-color)',
                background: selectedAppId === app.id ? 'var(--bg-active)' : 'var(--bg-surface)',
                transition: 'all 0.2s ease',
                padding: 'var(--space-4)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.applicantName}</span>
                <Badge colorScheme="warning">Transfer</Badge>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                {app.program}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                From: {app.previousInstitution}
              </div>
            </Card>
          ))}
          {queue.length === 0 && (
            <div className="text-muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              No pending transfer evaluations.
            </div>
          )}
        </div>

        {/* RIGHT PANE: Mapping Workspace */}
        <Card style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {!selectedApp ? (
            <div className="stub-page">
              <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>🔄</div>
              <div className="stub-title">Select a Transfer Applicant</div>
              <div className="stub-subtitle">Choose a student from the queue to map their previous coursework.</div>
            </div>
          ) : (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright)' }}>
                  {selectedApp.applicantName}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Evaluating credits from <strong style={{ color: 'var(--text-primary)' }}>{selectedApp.previousInstitution}</strong>
                </div>
              </div>

              {/* Mapping Table */}
              <div style={{ flex: 1 }}>
                <Table>
                  <thead>
                    <tr>
                      <th>External Course</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th>Internal Equivalent Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedApp.transferCourses.map((tc: TransferCourseDto) => (
                      <tr key={tc.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tc.externalCourseCode}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tc.externalCourseName}</div>
                        </td>
                        <td>{tc.credits}</td>
                        <td style={{ color: 'var(--success-text)', fontWeight: 600 }}>{tc.grade}</td>
                        <td>
                          <select 
                            value={mappings[tc.id] || ''}
                            onChange={(e) => handleMappingChange(tc.id, e.target.value)}
                            style={{ 
                              width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', 
                              background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' 
                            }}
                          >
                            <option value="">-- Select Internal Equivalent --</option>
                            <option value="CS101">CS101 - Intro to Programming</option>
                            <option value="MATH201">MATH201 - Calculus I</option>
                            <option value="ENG101">ENG101 - Basic English</option>
                            <option value="NO_CREDIT">No Equivalent (Elective Only)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <Button 
                  variant="primary" 
                  onClick={() => saveMappingMutation.mutate({ applicationId: selectedApp.id, mappings })}
                  disabled={saveMappingMutation.isPending || Object.keys(mappings).length === 0}
                >
                  {saveMappingMutation.isPending ? 'Saving...' : 'Save Curriculum Mapping'}
                </Button>
              </div>

            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
