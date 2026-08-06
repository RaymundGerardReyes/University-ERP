import { Badge, Card, PageHeader, Button } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useAuditLedger, useSubmitEvidence } from './AuditCompliance.hooks';
import { SubmitEvidencePayload } from './AuditCompliance.types';

export const AuditCompliancePage: React.FC = () => {
  const { data: records, isLoading } = useAuditLedger();
  const { mutateAsync: submitEvidence, isPending } = useSubmitEvidence();
  
  const [formData, setFormData] = useState<SubmitEvidencePayload>({
    standardCode: 'ISO-27001',
    submitterId: 'ADMIN-100',
    documentReference: ''
  });

  const handleSubmission = async () => {
    if (!formData.documentReference) return;
    try {
      await submitEvidence(formData);
      setFormData({ ...formData, documentReference: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 'var(--space-1)', marginBottom: 'var(--space-4)'
  };

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

  return (
    <div className="fade-in">
      <PageHeader 
        title="Audit & Compliance" 
        subtitle="Manage institutional accreditation, regulatory standards, and compliance evidence." 
      />

      <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
          <span className="stat-label">Active Audits</span>
          <span className="stat-value">3</span>
          <span className="stat-trend">ISO & Regional Accreditation</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
          <span className="stat-label">Pending Reviews</span>
          <span className="stat-value" style={{ color: 'var(--warning-text)' }}>14</span>
          <span className="stat-trend">Awaiting validation</span>
        </Card>
      </div>

      <div className="grid-2 fade-in-delay-2">
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
          <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Evidence Ledger</h2>
          </div>
          
          <div style={{ padding: '0 var(--space-6)' }}>
            {records?.map((record: any, idx: number) => (
              <div key={record.id} className="data-row" style={{ borderBottom: idx === records.length - 1 ? 'none' : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="data-value" style={{ textAlign: 'left' }}>{record.standard}</span>
                  <span className="data-label">{record.submitter} &bull; {record.date}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                  <Badge colorScheme={record.status === 'Verified' ? 'success' : 'warning'}>{record.status}</Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{record.id}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card-accent-top" style={{ background: 'var(--brand-secondary)' }} />
          <h2 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Submit Evidence File</h2>
          
          <div>
            <label className="data-label">Accreditation Standard</label>
            <select style={inputStyle} value={formData.standardCode} onChange={e => setFormData({...formData, standardCode: e.target.value})}>
              <option value="ISO-27001">ISO 27001 Security Standard</option>
              <option value="HED-ACCRED">Higher Education Core Accreditation</option>
              <option value="FIN-Q3">Financial Audit (Q3)</option>
            </select>

            <label className="data-label">Document Reference URI</label>
            <input 
              type="text" 
              placeholder="e.g. s3://university-vault/evidence-492.pdf"
              style={inputStyle} 
              value={formData.documentReference} 
              onChange={e => setFormData({...formData, documentReference: e.target.value})} 
            />

            <Button variant="primary" onClick={handleSubmission} disabled={isPending || !formData.documentReference} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
              {isPending ? 'Logging Evidence...' : 'Submit to Compliance Ledger'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};