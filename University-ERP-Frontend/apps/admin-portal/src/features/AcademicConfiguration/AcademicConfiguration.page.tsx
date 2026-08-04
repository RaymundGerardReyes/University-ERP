import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const AcademicConfigurationPage: React.FC = () => {
    return (
        <div className="fade-in">
            <PageHeader
                title="Academic Configuration"
                subtitle="Manage master data for calendars, programs, and curriculum rules."
            />

            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Active Semesters</h2>
                        <Button variant="primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Add Term</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', border: '1px solid var(--border-accent)', background: 'var(--bg-active)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>First Semester 2026-2027</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Aug 15, 2026 - Dec 20, 2026</div>
                            <div style={{ marginTop: '0.75rem', display: 'inline-block', fontSize: '0.75rem', background: 'var(--brand-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>CURRENT TERM</div>
                        </div>
                        <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Second Semester 2026-2027</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jan 10, 2027 - May 25, 2027</div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Enrollment Windows</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Freshmen Enrollment</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Opens: Aug 1 • Closes: Aug 10</div>
                            </div>
                            <Button variant="outline" style={{ fontSize: '0.75rem' }}>Edit</Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Add/Drop Deadline</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Strict cutoff for all colleges</div>
                            </div>
                            <span style={{ color: 'var(--danger-text)', fontWeight: 600, fontSize: '0.9rem' }}>Sept 5, 2026</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};