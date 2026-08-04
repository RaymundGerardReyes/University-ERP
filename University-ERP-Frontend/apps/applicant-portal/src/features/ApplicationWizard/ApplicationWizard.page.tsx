import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { useNavigate } from 'react-router-dom';

const WIZARD_STEPS = ['Personal Info', 'Educational Background', 'Program Selection', 'Guardian Info', 'Review'];

export const ApplicationWizardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  
  const [highSchool, setHighSchool] = useState('');
  const [gpa, setGpa] = useState('');
  
  const [program, setProgram] = useState('');
  const [term, setTerm] = useState('Fall 2026');
  

  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        applicantId: user?.id || 'TEST_USER_ID',
        programId: program || 'p1', // fallback if empty
        firstName,
        lastName,
        dateOfBirth: dob,
        nationality: 'Domestic'
      };
      
      await admissionsApi.submitApplication(data);
      // Navigate to dashboard after successful submission
      navigate('/');
    } catch (error) {
      console.error('Failed to submit application', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" style={inputStyle} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inputStyle} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>High School Name</label>
              <input type="text" value={highSchool} onChange={e => setHighSchool(e.target.value)} placeholder="Lincoln High" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cumulative GPA (4.0 Scale)</label>
              <input type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} placeholder="3.85" style={inputStyle} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Intended Major / Program</label>
              <select value={program} onChange={e => setProgram(e.target.value)} style={inputStyle}>
                <option value="" disabled>Select a program...</option>
                <option value="BS Computer Science">B.S. Computer Science</option>
                <option value="BS Business Admin">B.S. Business Administration</option>
                <option value="BA Psychology">B.A. Psychology</option>
                <option value="BS Nursing">B.S. Nursing</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Entry Term</label>
              <select value={term} onChange={e => setTerm(e.target.value)} style={inputStyle}>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Primary Guardian Name</label>
              <input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} placeholder="John Doe" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Guardian Phone Number</label>
              <input type="tel" value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} placeholder="+1 (555) 123-4567" style={inputStyle} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--brand-primary)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', paddingBottom: 'var(--space-2)' }}>Review Application</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name</div>
                  <div style={{ color: 'var(--text-primary)' }}>{firstName || 'N/A'} {lastName || ''}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DOB</div>
                  <div style={{ color: 'var(--text-primary)' }}>{dob || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High School</div>
                  <div style={{ color: 'var(--text-primary)' }}>{highSchool || 'N/A'} (GPA: {gpa || 'N/A'})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Program</div>
                  <div style={{ color: 'var(--text-primary)' }}>{program || 'N/A'} ({term})</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              By submitting this application, I certify that the information provided is accurate and complete.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeader title="Application Wizard" subtitle="Complete your admission application." />
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 var(--space-4)' }}>
        <div style={{ position: 'absolute', top: '16px', left: '30px', right: '30px', height: '2px', backgroundColor: 'var(--border-subtle)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '16px', left: '30px', width: `calc(${(currentStep / (WIZARD_STEPS.length - 1)) * 100}% - 60px)`, height: '2px', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))', zIndex: 0, transition: 'width 0.4s ease' }} />
        
        {WIZARD_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 'var(--space-2)' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                backgroundColor: isCompleted || isActive ? 'var(--brand-primary)' : 'var(--bg-base)',
                border: `2px solid ${isCompleted || isActive ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                boxShadow: isActive ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                color: isCompleted || isActive ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600,
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '0.75rem', color: isActive ? 'var(--brand-primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400, textAlign: 'center', maxWidth: '80px' }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <Card style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative corner glow */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(30px)', pointerEvents: 'none' }} />

        <h3 style={{ margin: 0, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)', fontSize: '1.25rem' }}>
          {WIZARD_STEPS[currentStep]}
        </h3>
        
        <div style={{ minHeight: '250px' }}>
          {renderStepContent()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
          <Button variant="outline" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0}>
            ← Previous
          </Button>
          {currentStep < WIZARD_STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setCurrentStep(prev => Math.min(WIZARD_STEPS.length - 1, prev + 1))}>
              Next Step →
            </Button>
          ) : (
            <Button 
              variant="primary" 
              style={{ background: 'linear-gradient(to right, var(--success-bg), #10b981)' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(0, 0, 0, 0.2)',
  color: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};
