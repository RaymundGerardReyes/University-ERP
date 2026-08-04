import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WIZARD_STEPS = ['Personal Info', 'Academics', 'Program', 'Review'];

export const ApplicationWizardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '', highSchool: '', gpa: '', program: '', term: 'Fall 2026' });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await admissionsApi.submitApplication({
        ...formData,
        applicantId: user?.id || '738263fb-7f91-488d-8058-5de99cd2a53b',
        programId: formData.program || 'p1',
        firstName: formData.firstName || (user as any)?.firstName || 'Applicant',
        lastName: formData.lastName || (user as any)?.lastName || 'User',
        dateOfBirth: formData.dob || '2000-01-01',
        nationality: 'Domestic'
      });
      navigate('/');
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' };

  return (
    <div className="fade-in">
      <PageHeader title="Application Wizard" subtitle="Complete your admission application." />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-8)', position: 'relative' }} className="fade-in-delay-1">
        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border-subtle)', zIndex: 0, transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '0', width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%`, height: '2px', background: 'var(--brand-primary)', zIndex: 0, transition: 'width 0.4s ease', transform: 'translateY(-50%)' }} />
        {WIZARD_STEPS.map((step, idx) => (
          <div key={step} style={{ background: idx <= currentStep ? 'var(--brand-primary)' : 'var(--bg-surface)', border: `2px solid ${idx <= currentStep ? 'var(--brand-primary)' : 'var(--border-color)'}`, width: '24px', height: '24px', borderRadius: '50%', zIndex: 1, transition: 'all 0.3s' }} />
        ))}
      </div>

      <Card style={{ maxWidth: '700px', margin: '0 auto' }} className="fade-in-delay-2">
        <div className="card-accent-top" />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>{WIZARD_STEPS[currentStep]}</h2>

        <div style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {currentStep === 0 && (
            <>
              <div className="grid-2">
                <div><label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>First Name</label><input type="text" name="firstName" onChange={handleChange} style={inputStyle} /></div>
                <div><label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>Last Name</label><input type="text" name="lastName" onChange={handleChange} style={inputStyle} /></div>
              </div>
              <div><label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>Date of Birth</label><input type="date" name="dob" onChange={handleChange} style={inputStyle} /></div>
            </>
          )}
          {currentStep === 1 && (
            <>
              <div><label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>High School</label><input type="text" name="highSchool" onChange={handleChange} style={inputStyle} /></div>
              <div><label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>Cumulative GPA</label><input type="number" step="0.01" name="gpa" onChange={handleChange} style={inputStyle} /></div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div>
                <label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>Intended Program</label>
                <select name="program" onChange={handleChange} style={inputStyle}>
                  <option value="">Select a program...</option>
                  <option value="BS Computer Science">B.S. Computer Science</option>
                  <option value="BS Business Admin">B.S. Business Administration</option>
                </select>
              </div>
              <div>
                <label className="data-label" style={{ display: 'block', marginBottom: '8px' }}>Entry Term</label>
                <select name="term" onChange={handleChange} style={inputStyle}><option>Fall 2026</option><option>Spring 2027</option></select>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div className="data-row"><span className="data-label">Name</span><span className="data-value">{formData.firstName} {formData.lastName}</span></div>
              <div className="data-row"><span className="data-label">High School</span><span className="data-value">{formData.highSchool} ({formData.gpa})</span></div>
              <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}><span className="data-label">Program</span><span className="data-value">{formData.program} - {formData.term}</span></div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="outline" onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0}>Back</Button>
          {currentStep < 3 ? (
            <Button variant="primary" onClick={() => setCurrentStep(p => Math.min(3, p + 1))}>Next Step</Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Application'}</Button>
          )}
        </div>
      </Card>
    </div>
  );
};