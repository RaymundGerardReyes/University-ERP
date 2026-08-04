import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const WorkflowManagementPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="Workflow Management"
                subtitle="Configure state machines and approval routing."
            />
            <Card className="fade-in-delay-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>Active Workflows</h2>
                    <Button variant="primary">Create Workflow</Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-base)' }}>
                        <h3 style={{ color: 'var(--brand-primary)', margin: '0 0 1rem 0' }}>Undergraduate Admissions Routing</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>Application Submitted</span>
                            <span>→</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>Secretary (Document Verification)</span>
                            <span>→</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>Faculty (Evaluation)</span>
                            <span>→</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: '999px', border: '1px solid var(--success-border)' }}>Dean (Final Decision)</span>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-base)' }}>
                        <h3 style={{ color: 'var(--brand-primary)', margin: '0 0 1rem 0' }}>Grade Appeal Process</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>Appeal Filed</span>
                            <span>→</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>Professor Review</span>
                            <span>→</span>
                            <span style={{ padding: '0.5rem 1rem', background: 'var(--bg-elevated)', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>Department Head</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};