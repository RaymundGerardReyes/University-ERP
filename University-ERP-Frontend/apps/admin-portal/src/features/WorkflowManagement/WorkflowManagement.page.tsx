import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useActiveWorkflows } from './WorkflowManagement.hooks';

export const WorkflowManagementPage: React.FC = () => {
    const { data: workflows, isLoading } = useActiveWorkflows();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

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
                    {workflows?.map((workflow, idx) => (
                        <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-base)' }}>
                            <h3 style={{ color: 'var(--brand-primary)', margin: '0 0 1rem 0' }}>{workflow.workflowName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {workflow.steps.map((step, sIdx) => {
                                    const isActive = step.status === 'Active' || step.status === 'Pending';
                                    const isCompleted = step.status === 'Completed';

                                    return (
                                        <React.Fragment key={sIdx}>
                                            <span style={{
                                                padding: '0.5rem 1rem',
                                                background: isActive ? 'var(--info-bg)' : isCompleted ? 'var(--success-bg)' : 'var(--bg-elevated)',
                                                color: isActive ? 'var(--info-text)' : isCompleted ? 'var(--success-text)' : 'inherit',
                                                borderRadius: '999px',
                                                border: `1px solid ${isActive ? 'var(--info-border)' : isCompleted ? 'var(--success-border)' : 'var(--border-subtle)'}`
                                            }}>
                                                {step.stepName}
                                            </span>
                                            {sIdx < workflow.steps.length - 1 && <span>&rarr;</span>}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};