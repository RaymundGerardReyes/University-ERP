import { Button, Card, PageHeader, EmptyState } from '@university-erp/ui-kit';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';
import { useProgramCatalog, useSubmitApplication } from './ApplicationWizard.hooks';
import { ApplicationFormData } from './ApplicationWizard.types';

export const ApplicationWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProgramId = searchParams.get('programId') || searchParams.get('program') || '';
  const { user, identity } = useAuth();
  const applicantId = user?.id || identity?.id;
  const { data: programs = [], isLoading } = useProgramCatalog();
  const { mutateAsync: submitApp, isPending } = useSubmitApplication();

  const [formData, setFormData] = useState<ApplicationFormData>({
    programId: initialProgramId,
    previousSchool: '',
    gpa: ''
  });

  useEffect(() => {
    const urlProg = searchParams.get('programId') || searchParams.get('program');
    if (urlProg && !formData.programId) {
      setFormData(prev => ({ ...prev, programId: urlProg }));
    }
  }, [searchParams, formData.programId]);

  const [step, setStep] = useState(1);

  const handleSubmit = async () => {
    if (!applicantId) return;
    try {
      const fullName = (user?.name || identity?.name || 'Applicant').trim();
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || 'Applicant';
      const lastName = nameParts.slice(1).join(' ') || 'Candidate';

      const payload = {
        applicantId,
        programId: formData.programId,
        firstName,
        lastName,
        dateOfBirth: '2000-01-01',
        nationality: 'Domestic'
      };

      await submitApp(payload);
      setStep(3); // Success Step
    } catch (error) {
      console.error('Application submission failed:', error);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-2) var(--space-3)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    marginTop: 'var(--space-1)'
  };

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

  if (!applicantId) {
    return (
      <div className="fade-in">
        <PageHeader
          title="Application Wizard"
          subtitle="Begin your journey. Select your program and submit your academic history."
        />
        <Card style={{ maxWidth: '700px', margin: '0 auto' }}>
          <EmptyState
            title="Authentication Required"
            description="Please log in to start or submit a university application."
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Application Wizard"
        subtitle="Begin your journey. Select your program and submit your academic history."
      />

      <div className="content-container fade-in-delay-1" style={{ maxWidth: '700px' }}>
        <Card>
          <div className="card-accent-top" style={{ background: 'var(--brand-gradient)' }} />

          {/* Step 1: Program Selection */}
          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-bright)', marginBottom: 'var(--space-6)' }}>
                Step 1: Program Selection
              </h2>

              <div className="data-row" style={{ borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <label className="data-label">Select Intended Program</label>
                <select
                  style={inputStyle}
                  value={formData.programId}
                  onChange={e => setFormData({ ...formData, programId: e.target.value })}
                >
                  <option value="">-- Choose a Program --</option>
                  {programs.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.degree} {p.major || p.name} ({p.college})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
                <Button variant="primary" disabled={!formData.programId} onClick={() => setStep(2)}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Academic History */}
          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-bright)', marginBottom: 'var(--space-6)' }}>
                Step 2: Academic History
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="data-row" style={{ borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', padding: 0 }}>
                  <label className="data-label">Previous Institution</label>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="High School or College Name"
                    value={formData.previousSchool}
                    onChange={e => setFormData({ ...formData, previousSchool: e.target.value })}
                  />
                </div>

                <div className="data-row" style={{ borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', padding: 0 }}>
                  <label className="data-label">Cumulative GPA</label>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="e.g. 3.8"
                    value={formData.gpa}
                    onChange={e => setFormData({ ...formData, gpa: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  disabled={isPending || !formData.previousSchool}
                  onClick={handleSubmit}
                >
                  {isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="fade-in" style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--success-text)', marginBottom: 'var(--space-2)' }}>
                Application Submitted!
              </h2>
              <p className="data-label">
                Your application has been routed to the Admissions Office. Track your progress in the Timeline and Document tabs.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};