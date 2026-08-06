import React from 'react';
import { Card, Button } from '@university-erp/ui-kit';
import { useCHEDReports } from './Compliance.hooks';

export const CHEDCompliancePage: React.FC = () => {
    const { isLoading } = useCHEDReports();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>CHED Compliance Reporting</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate statutory enrollment and graduation reports for the Commission on Higher Education.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)', padding: '2rem' }}>
                {isLoading ? <div style={{ textAlign: 'center' }}>Loading Report Data...</div> : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                        <div style={{ padding: '1.5rem', background: 'var(--surface-default)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ margin: '0 0 1rem 0' }}>Form E-1</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enrollment List by Program and Year Level</p>
                            <Button variant="primary" style={{ width: '100%' }}>Generate Report</Button>
                        </div>
                        <div style={{ padding: '1.5rem', background: 'var(--surface-default)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ margin: '0 0 1rem 0' }}>Form G-1</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>List of Graduates for Current Academic Year</p>
                            <Button variant="primary" style={{ width: '100%' }}>Generate Report</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
