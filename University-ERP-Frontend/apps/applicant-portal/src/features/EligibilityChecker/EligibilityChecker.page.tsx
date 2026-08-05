import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useCheckEligibility } from './EligibilityChecker.hooks';
import { EligibilityResponse } from './EligibilityChecker.types';

export const EligibilityCheckerPage: React.FC = () => {
  const { mutateAsync: checkEligibility, isPending } = useCheckEligibility();
  const [result, setResult] = useState<EligibilityResponse | null>(null);

  const [formData, setFormData] = useState({
    programId: 'CS-BS',
    gpa: 3.5,
    previousDegree: 'High School Diploma'
  });

  const handleCheck = async () => {
    try {
      // Utilize the actual backend response
      const res = await checkEligibility(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-3)',
    background: 'var(--bg-base)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-4)',
    fontFamily: 'inherit'
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Eligibility Checker"
        subtitle="Instantly verify your academic qualifications before starting an application."
      />

      <div className="grid-2 fade-in-delay-1">
        <Card>
          <div className="card-accent-top" style={{ background: 'var(--brand-gradient)' }} />
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-6)' }}>
            Academic Profile
          </h2>

          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Target Program</label>
          <select style={inputStyle} value={formData.programId} onChange={e => setFormData({ ...formData, programId: e.target.value })}>
            <option value="CS-BS">B.S. Computer Science</option>
            <option value="ENG-BS">B.S. Engineering</option>
            <option value="BUS-BA">B.A. Business Administration</option>
          </select>

          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Cumulative GPA (4.0 Scale)</label>
          <input
            type="number"
            step="0.1"
            style={inputStyle}
            value={formData.gpa}
            onChange={e => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
          />

          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Highest Attained Degree</label>
          <input
            type="text"
            style={inputStyle}
            value={formData.previousDegree}
            onChange={e => setFormData({ ...formData, previousDegree: e.target.value })}
          />

          <Button variant="primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={handleCheck} disabled={isPending}>
            {isPending ? 'Analyzing Records...' : 'Check Eligibility'}
          </Button>
        </Card>

        <div>
          {result ? (
            <Card className="fade-in" style={{ borderColor: result.isEligible ? 'var(--success-border)' : 'var(--danger-border)' }}>
              <div className="card-accent-top" style={{ background: result.isEligible ? 'var(--success-text)' : 'var(--danger-text)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ margin: 0, color: 'var(--text-bright)' }}>Results</h3>
                <Badge colorScheme={result.isEligible ? 'success' : 'danger'}>
                  {result.isEligible ? 'Eligible' : 'Does Not Meet Criteria'}
                </Badge>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>{result.message}</p>

              {result.missingPrerequisites && result.missingPrerequisites.length > 0 && (
                <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--warning-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Missing Prerequisites</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {result.missingPrerequisites.map(prereq => <li key={prereq}>{prereq}</li>)}
                  </ul>
                </div>
              )}
            </Card>
          ) : (
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', opacity: 0.6 }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎓</div>
              <p style={{ color: 'var(--text-muted)' }}>Fill out your profile to view eligibility.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};