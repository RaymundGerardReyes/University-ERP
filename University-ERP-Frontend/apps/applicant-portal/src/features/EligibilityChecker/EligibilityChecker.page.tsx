import { admissionsApi } from '@university-erp/api-clients';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const EligibilityCheckerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [applicantType, setApplicantType] = useState<string | null>(null);
  const [gpa, setGpa] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const data = await admissionsApi.checkEligibility({ applicantType, gpa: parseFloat(gpa), country: 'Domestic' });
      setResult(data);
      setStep(3);
    } catch (error) {
      alert('Error occurred while checking eligibility');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fade-in">
      <PageHeader title="Eligibility Checker" subtitle="Instantly discover if you meet the academic requirements." />

      <Card style={{ maxWidth: '700px', margin: '0 auto' }} className="fade-in-delay-1">
        <div className="card-accent-top" />
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-6)', color: 'var(--text-primary)' }}>1. Select Applicant Profile</h3>
            <div className="grid-2">
              {['Freshman', 'Transferee', 'International', 'Returning'].map((type) => (
                <div
                  key={type} onClick={() => setApplicantType(type)}
                  style={{
                    padding: 'var(--space-6)', textAlign: 'center', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    border: applicantType === type ? '2px solid var(--brand-primary)' : '2px solid var(--border-subtle)',
                    background: applicantType === type ? 'var(--info-bg)' : 'var(--bg-elevated)',
                    transition: 'all 0.2s'
                  }}
                >
                  <h4 style={{ margin: 0, color: applicantType === type ? 'var(--text-accent)' : 'var(--text-primary)', fontSize: '1.1rem' }}>{type}</h4>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
              <Button variant="primary" onClick={() => setStep(2)} disabled={!applicantType}>Next Step →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-6)', color: 'var(--text-primary)' }}>2. Academic Standing</h3>
            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>Cumulative GPA (4.0 Scale)</label>
              <input
                type="number" step="0.01" max="4.0" min="0.0" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="0.00"
                style={{
                  width: '150px', padding: '1rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)',
                  background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '2rem', textAlign: 'center', outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={handleCheck} disabled={!gpa || parseFloat(gpa) > 4.0 || parseFloat(gpa) < 0}>
                {isChecking ? 'Analyzing...' : 'Check Eligibility'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: result.isEligible ? 'var(--success-text)' : 'var(--warning-text)', marginBottom: 'var(--space-4)' }}>
              {result.isEligible ? 'Highly Eligible!' : 'Conditionally Eligible'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 'var(--space-6)' }}>{result.message}</p>

            <div style={{ background: 'var(--info-bg)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--info-border)', textAlign: 'left', marginBottom: 'var(--space-6)' }}>
              <h4 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-accent)' }}>Required Documents to Prepare:</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                {result.requiredDocuments?.map((doc: string) => <li key={doc}>{doc}</li>)}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
              <Link to="/apply" style={{ textDecoration: 'none' }}><Button variant="primary">Proceed to Application</Button></Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};