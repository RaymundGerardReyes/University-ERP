import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

const WIZARD_STEPS = ['Personal Info', 'Educational Background', 'Program Selection', 'Guardian Info', 'Review'];

export const ApplicationWizardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="fade-in">
      <PageHeader title="Application Wizard" subtitle="Complete your admission application." />
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-8)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--border-subtle)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '12px', left: 0, width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%`, height: '2px', backgroundColor: 'var(--brand-primary)', zIndex: 0, transition: 'width 0.3s' }} />
        
        {WIZARD_STEPS.map((step, idx) => (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 'var(--space-2)' }}>
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '50%', 
              backgroundColor: idx <= currentStep ? 'var(--brand-primary)' : 'var(--bg-base)',
              border: `2px solid ${idx <= currentStep ? 'var(--brand-primary)' : 'var(--border-color)'}`,
              color: idx <= currentStep ? 'white' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600
            }}>
              {idx + 1}
            </div>
            <span style={{ fontSize: '0.75rem', color: idx <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: idx <= currentStep ? 600 : 400 }}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <Card style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>
          {WIZARD_STEPS[currentStep]}
        </h3>
        
        <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          [ {WIZARD_STEPS[currentStep]} Form Fields Component ]
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
          <Button variant="outline" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0}>
            Previous
          </Button>
          {currentStep < WIZARD_STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setCurrentStep(prev => Math.min(WIZARD_STEPS.length - 1, prev + 1))}>
              Next Step
            </Button>
          ) : (
            <Button variant="primary">
              Submit Application
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
