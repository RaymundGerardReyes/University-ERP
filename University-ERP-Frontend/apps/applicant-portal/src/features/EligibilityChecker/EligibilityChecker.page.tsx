import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { admissionsApi } from '@university-erp/api-clients';

export const EligibilityCheckerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [applicantType, setApplicantType] = useState<string | null>(null);
  const [gpa, setGpa] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const data = await admissionsApi.checkEligibility({
        applicantType,
        gpa: parseFloat(gpa),
        country: 'Domestic'
      });
      setResult(data);
      setStep(3);
    } catch (error) {
      console.error('Failed to check eligibility', error);
      alert('Error occurred while checking eligibility');
    } finally {
      setIsChecking(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.25rem' }}>1. Select Your Applicant Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {[
                { type: 'Freshman', desc: 'Recent High School Graduate', icon: '🎓' },
                { type: 'Transferee', desc: 'Transferring from another college', icon: '🔄' },
                { type: 'International', desc: 'Applying from outside the country', icon: '🌍' },
                { type: 'Returning', desc: 'Returning after a leave of absence', icon: '↩️' }
              ].map((item) => (
                <Card 
                  key={item.type} 
                  onClick={() => setApplicantType(item.type)}
                  style={{ 
                    cursor: 'pointer',
                    border: applicantType === item.type ? '2px solid var(--brand-primary)' : '2px solid transparent',
                    background: applicantType === item.type ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-4)', textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: applicantType === item.type ? '0 10px 25px -5px rgba(59, 130, 246, 0.2)' : 'none'
                  }}
                  className="hover-lift"
                >
                  <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{item.type}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                </Card>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <Button variant="primary" onClick={() => setStep(2)} disabled={!applicantType}>Next Step →</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.25rem' }}>2. Academic Standing</h3>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Cumulative GPA (4.0 Scale)</label>
              <input 
                type="number" 
                step="0.01" 
                max="4.0" 
                min="0.0" 
                value={gpa} 
                onChange={(e) => setGpa(e.target.value)} 
                placeholder="e.g. 3.50"
                style={{
                  width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                  background: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '1.25rem', textAlign: 'center'
                }}
              />
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
                Please enter your unweighted cumulative GPA.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={handleCheck} disabled={!gpa || parseFloat(gpa) > 4.0 || parseFloat(gpa) < 0}>
                {isChecking ? 'Analyzing...' : 'Check Eligibility ✨'}
              </Button>
            </div>
          </div>
        );
      case 3:
        if (!result) return null;
        const status = result.isEligible ? 'eligible' : 'conditional';
        
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                {status === 'eligible' ? '🎉' : '⚠️'}
              </div>
              <h2 style={{ 
                margin: '0 0 var(--space-2) 0', 
                color: status === 'eligible' ? 'var(--success-text)' : 'var(--warning-text)' 
              }}>
                {status === 'eligible' ? 'Eligible!' : 'Conditionally Eligible'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '80%', margin: '0 auto' }}>
                {result.message}
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--brand-primary)' }}>Required Documents to Prepare:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {result.requiredDocuments?.map((doc: string) => (
                  <div key={doc} style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--text-secondary)' }}><span>📄</span> {doc}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
              <Button variant="outline" onClick={() => setStep(1)}>Check Another Profile</Button>
              <Link to="/apply" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Proceed to Application →</Button>
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader 
        title="Eligibility Checker" 
        subtitle="Instantly discover if you meet the requirements for admission." 
      />
      
      <Card style={{ maxWidth: '700px', margin: '0 auto', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background blur */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(50px)', pointerEvents: 'none' }} />
        
        {renderStep()}
      </Card>
    </div>
  );
};
