import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const EligibilityCheckerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [applicantType, setApplicantType] = useState<string | null>(null);

  return (
    <div className="fade-in">
      <PageHeader title="Eligibility Checker" subtitle="Let's find the right admission path for you." />
      
      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>1. What type of applicant are you?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {['High School Graduate (Freshman)', 'College Transferee', 'International Student', 'Returning Student'].map(type => (
                <label key={type} style={{ 
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', 
                  padding: 'var(--space-4)', 
                  border: `1px solid ${applicantType === type ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: applicantType === type ? 'var(--bg-surface)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input 
                    type="radio" 
                    name="applicantType" 
                    value={type} 
                    checked={applicantType === type}
                    onChange={() => setApplicantType(type)} 
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{type}</span>
                </label>
              ))}
            </div>
            <Button variant="primary" onClick={() => setStep(2)} disabled={!applicantType}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>2. Eligibility Confirmed!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Based on your profile as a <strong>{applicantType}</strong>, you are eligible to apply for our undergraduate programs.</p>
            
            <div style={{ backgroundColor: 'var(--info-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
              <h4 style={{ margin: '0 0 var(--space-2) 0' }}>Required Documents you will need:</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                <li>Birth Certificate</li>
                <li>{applicantType === 'High School Graduate (Freshman)' ? 'Form 138 (Report Card)' : 'Transcript of Records'}</li>
                <li>Certificate of Good Moral Character</li>
                <li>2x2 ID Photo</li>
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</Button>
              <Button variant="primary" style={{ flex: 2 }}>Start Application Wizard</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
