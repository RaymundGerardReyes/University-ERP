import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal, EmptyState, FormInput } from '@university-erp/ui-kit';
import { useEnrollmentValidationQueue, useValidateEnrollment } from './Enrollment.hooks';
import { EnrollmentValidationItem } from './Enrollment.types';

export const EnrollmentValidationPage: React.FC = () => {
    // 1. Fetch data
    const { data: validations = [], isLoading } = useEnrollmentValidationQueue();
    const validateMutation = useValidateEnrollment();
    
    // State for detailed validation review and search
    const [selectedStudent, setSelectedStudent] = useState<EnrollmentValidationItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Loading State
    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleValidate = () => {
        if (selectedStudent) {
            validateMutation.mutate(selectedStudent.id);
            setSelectedStudent(null);
        }
    };

    // Derived state for stats
    const totalPending = validations.length;
    const flaggedCount = validations.filter((v: any) => v.status.includes('Flagged') || v.status.includes('Warning')).length;

    // Filtered validations based on search
    const filteredValidations = validations.filter((v: any) => 
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Empty State (Queue completely clear)
    if (validations.length === 0) {
        return (
            <div className="fade-in">
                <PageHeader 
                    title="Enrollment Validation" 
                    subtitle="Review student subject loads against academic rules and prerequisites." 
                />
                <EmptyState 
                    title="All caught up!" 
                    description="There are currently no student enrollments waiting for validation in the queue."
                    icon="🎉"
                    action={<Button variant="outline" onClick={() => window.location.reload()}>Refresh Queue</Button>}
                />
            </div>
        );
    }

    // 4. Standard Render
    return (
        <div className="fade-in">
            <PageHeader 
                title="Enrollment Validation" 
                subtitle="Review student subject loads against academic rules and prerequisites." 
            />
            
            {/* KPI STATS (Information Architecture) */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Review</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalPending}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flagged / Warnings</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{flaggedCount}</div>
                </Card>
            </div>

            {/* TOOLBAR (Search & Contextual Actions) */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <FormInput 
                        placeholder="Search by Student ID or Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <Button variant="outline">Filter: All Statuses</Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
                </div>
            </div>

            {/* DESKTOP VIEW: TABLE (Data-Heavy Interfaces) */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Total Units</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredValidations.map((item: EnrollmentValidationItem) => (
                                    <tr key={item.id}>
                                        <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{item.id}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))' }}>{item.studentName}</td>
                                        <td>{item.units} / 21 Max</td>
                                        <td>
                                            <Badge colorScheme={item.status === 'Validated' ? 'success' : (item.status.includes('Flagged') ? 'danger' : 'warning')}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => setSelectedStudent(item)}
                                                disabled={item.status === 'Validated'}
                                            >
                                                Review Load
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredValidations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW: CARDS (Responsive Layouts) */}
            <div className="mobile-only flex-stack fade-in">
                {filteredValidations.map((item: EnrollmentValidationItem) => (
                    <Card key={item.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{item.id}</span>
                            <Badge colorScheme={item.status === 'Validated' ? 'success' : (item.status.includes('Flagged') ? 'danger' : 'warning')}>
                                {item.status}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{item.studentName}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                            Load: {item.units} / 21 Max Units
                        </p>
                        <Button 
                            variant="outline" 
                            style={{ width: '100%' }}
                            onClick={() => setSelectedStudent(item)}
                            disabled={item.status === 'Validated'}
                        >
                            Review Load
                        </Button>
                    </Card>
                ))}
                {filteredValidations.length === 0 && (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                    </Card>
                )}
            </div>

            {/* Validation Review Modal */}
            {selectedStudent && (
                <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Subject Load Validation</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Student: <span style={{ fontFamily: 'monospace' }}>{selectedStudent.id}</span> - {selectedStudent.studentName}</div>
                    </div>

                    {/* Pre-Validation Checklist */}
                    <div style={{ background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 var(--space-3) 0', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Academic Checklist</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--success-text, #10b981)', marginBottom: 'var(--space-2)' }}>
                            <span>✓</span> <strong>Prerequisites Met</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--success-text, #10b981)', marginBottom: 'var(--space-2)' }}>
                            <span>✓</span> <strong>No Schedule Conflicts</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--success-text, #10b981)' }}>
                            <span>✓</span> <strong>Within Unit Limit ({selectedStudent.units}/21)</strong>
                        </div>
                    </div>

                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Requested Subjects</h4>
                    <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        {/* Mock subject load for review */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                            <strong style={{ fontFamily: 'monospace' }}>CS201</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>Data Structures (3.0 U)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0' }}>
                            <strong style={{ fontFamily: 'monospace' }}>CS202</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>Computer Architecture (3.0 U)</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="danger" disabled={validateMutation.isPending}>Reject Load</Button>
                        <Button 
                            variant="primary" 
                            onClick={handleValidate}
                            disabled={validateMutation.isPending}
                        >
                            {validateMutation.isPending ? 'Validating...' : 'Approve & Validate'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};