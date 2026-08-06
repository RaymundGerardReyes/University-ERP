import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useActiveEmployees, useOnboardEmployee } from './EmployeeManagement.hooks';
import { OnboardEmployeePayload } from './EmployeeManagement.types';

export const EmployeeManagementPage: React.FC = () => {
    const { data: employees, isLoading } = useActiveEmployees();
    const { mutateAsync: onboard, isPending } = useOnboardEmployee();

    const [formData, setFormData] = useState<OnboardEmployeePayload>({
        firstName: '',
        lastName: '',
        role: 'Professor',
        departmentId: 'DEPT-CS'
    });

    const handleOnboard = async () => {
        try {
            await onboard(formData);
            setFormData({ firstName: '', lastName: '', role: 'Professor', departmentId: 'DEPT-CS' });
        } catch (error) {
            console.error(error);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 'var(--space-1)', marginBottom: 'var(--space-4)'
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Employee Management"
                subtitle="Govern human resources, track staff, and onboard new university personnel."
            />

            <div className="grid-2 fade-in-delay-1">
                {/* Active Staff List */}
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-accent-top" style={{ background: 'var(--info-text)' }} />
                    <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Active Personnel</h2>
                    </div>
                    <div style={{ padding: '0 var(--space-6)' }}>
                        {employees?.map((emp: any, idx: number) => (
                            <div key={emp.id} className="data-row" style={{ borderBottom: idx === employees.length - 1 ? 'none' : undefined }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="data-value" style={{ textAlign: 'left', color: 'var(--text-bright)' }}>{emp.name}</span>
                                    <span className="data-label">{emp.role} &bull; {emp.department}</span>
                                </div>
                                <Badge colorScheme={emp.status === 'Active' ? 'success' : 'warning'}>{emp.status}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Onboard Form */}
                <Card>
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <h2 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Quick Onboard</h2>

                    <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
                        <div>
                            <label className="data-label">First Name</label>
                            <input style={inputStyle} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                        </div>
                        <div>
                            <label className="data-label">Last Name</label>
                            <input style={inputStyle} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                        </div>
                    </div>

                    <label className="data-label">System Role</label>
                    <select style={inputStyle} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="Professor">Professor</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Support Staff">Support Staff</option>
                    </select>

                    <label className="data-label">Department Assignment</label>
                    <select style={inputStyle} value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}>
                        <option value="DEPT-CS">Computer Science</option>
                        <option value="DEPT-ENG">Engineering</option>
                        <option value="DEPT-FIN">Finance</option>
                    </select>

                    <Button variant="primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={handleOnboard} disabled={isPending || !formData.firstName}>
                        {isPending ? 'Provisioning...' : 'Provision Employee Account'}
                    </Button>
                </Card>
            </div>
        </div>
    );
};