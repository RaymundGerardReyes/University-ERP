import React, { useState, useEffect } from 'react';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { fetchAcademicConfig, updateAcademicConfig } from './AcademicConfiguration.api';

export const AcademicConfigurationPage: React.FC = () => {
    const auth = useAuth();
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isAddTermModalOpen, setIsAddTermModalOpen] = useState(false);
    const [termNameInput, setTermNameInput] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadConfig = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await fetchAcademicConfig();
            setConfig(res);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    // 1. Role verification
    const userRoles = auth.identity?.roles || (auth.user as any)?.roles || [];
    const isAcademicAdmin = userRoles.includes('AcademicAdmin') || (auth.user as any)?.role === 'AcademicAdmin';

    if (!isAcademicAdmin) {
        return (
            <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Restricted Access</h2>
                <p style={{ color: 'var(--text-secondary)' }}>You lack the required AcademicAdmin privileges to access this console.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="fade-in">
                <PageHeader
                    title="Academic Configuration"
                    subtitle="Manage academic years, active terms, add/drop windows, and university-wide scheduling constraints."
                />
                <div className="skeleton" style={{ height: '60vh' }} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Failed to load configuration</h2>
                <p style={{ color: 'var(--danger-text)' }}>Unable to connect to the academic configuration service.</p>
                <Button variant="primary" onClick={loadConfig}>Retry</Button>
            </div>
        );
    }

    const currentTerm = config?.activeTerm || 'First Semester 2026-2027';
    const isLateAllowed = Boolean(config?.isLateEnrollmentAllowed);

    const handleSaveTerm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!termNameInput.trim()) return;
        await updateAcademicConfig({ termName: termNameInput, isLateEnrollmentAllowed: isLateAllowed });
        setToastMessage("Configuration updated successfully!");
        setIsAddTermModalOpen(false);
        setTermNameInput('');
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Academic Configuration"
                subtitle="Manage master data for calendars, programs, and curriculum rules."
                action={
                    <Button variant="outline" onClick={loadConfig}>Refresh</Button>
                }
            />

            {toastMessage && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--success-text)', color: 'var(--success-text)' }}>
                    {toastMessage}
                </div>
            )}

            <div className="grid-2 fade-in-delay-1">
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Active Semesters</h2>
                        <Button 
                            variant="primary" 
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                            disabled={config?.isTermOpen === true}
                            onClick={() => setIsAddTermModalOpen(true)}
                        >
                            Add Term
                        </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', border: '1px solid var(--border-accent)', background: 'var(--bg-active)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                                {currentTerm}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Aug 15, 2026 - Dec 20, 2026</div>
                            <div style={{ marginTop: '0.75rem', display: 'inline-block', fontSize: '0.75rem', background: 'var(--brand-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                                CURRENT TERM
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                                <input
                                    type="checkbox"
                                    aria-label="Late Enrollment Allowed"
                                    checked={isLateAllowed}
                                    onChange={e => setConfig((prev: any) => ({ ...prev, isLateEnrollmentAllowed: e.target.checked }))}
                                />
                                Late Enrollment Allowed
                            </label>
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

            {isAddTermModalOpen && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-elevated)' }}>
                    <h3>Create New Term / Academic Year</h3>
                    <form onSubmit={handleSaveTerm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Term Name:</label>
                            <input
                                type="text"
                                placeholder="Term Name (e.g. Summer 2027)"
                                value={termNameInput}
                                onChange={e => setTermNameInput(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button type="submit" variant="primary">
                                Save Configuration
                            </Button>
                            <Button variant="outline" onClick={() => setIsAddTermModalOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};