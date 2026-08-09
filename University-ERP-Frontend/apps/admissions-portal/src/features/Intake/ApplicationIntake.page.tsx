import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients/student-lifecycle/admissionsApi';
import React, { useState } from 'react';

export const ApplicationIntakePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const queryClient = useQueryClient();

    const { data: applications, isLoading, error } = useQuery({
        queryKey: ['pendingApplications', departmentFilter],
        queryFn: () => admissionsApi.getPendingApplications(departmentFilter || undefined)
    });

    const processMutation = useMutation({
        mutationFn: (appId: string) => admissionsApi.verifyDocumentsAndForward(appId),
        onSuccess: () => {
            alert('Application successfully processed and forwarded!');
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        },
        onError: () => alert('Failed to process application. Please try again.')
    });

    return (
        <div className="fade-in">
            <PageHeader
                title="Application Intake"
                subtitle="Review and process incoming student applications."
            />

            <Card style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search by Applicant ID or Name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, minWidth: '250px', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                />
                <select 
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                >
                    <option value="">All Programs</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business Admin">Business Admin</option>
                    <option value="Nursing">Nursing</option>
                </select>
                <select style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                    <option>Status: All</option>
                    <option>Pending Intake</option>
                    <option>Under Review</option>
                </select>
                <Button onClick={() => alert('Filter applied')}>Apply Filters</Button>
            </Card>

            <Card style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Applicant Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Program</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date Submitted</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading pending applications...</td></tr>
                        )}
                        {error && (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-text)' }}>Failed to load applications. Is the backend running?</td></tr>
                        )}
                        {applications && applications.length === 0 && (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No applications pending intake.</td></tr>
                        )}
                        {applications && applications
                            .filter((app: any) => app.name?.toLowerCase().includes(searchTerm.toLowerCase()) || app.id?.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((item: any, idx: number) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{item.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.program || item.department || 'N/A'}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(item.submittedAt || Date.now()).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}><Badge colorScheme="warning">{item.stage || 'Pending Intake'}</Badge></td>
                                <td style={{ padding: '1rem' }}><Button variant="secondary" size="small" onClick={() => processMutation.mutate(item.id)}>Process</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
