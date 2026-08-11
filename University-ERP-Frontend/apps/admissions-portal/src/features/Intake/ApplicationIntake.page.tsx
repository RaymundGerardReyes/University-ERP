import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { PageHeader, Card, Badge, Table, FormInput } from '@university-erp/ui-kit';

export const ApplicationIntakePage: React.FC = () => {
    const [selectedProgram, setSelectedProgram] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Dynamic Program Catalog Fetching replacing hardcoded <options>
    const { data: programs = [], isLoading: isLoadingPrograms } = useQuery({
        queryKey: ['programCatalog'],
        queryFn: () => admissionsApi.getProgramCatalog()
    });

    // Dynamic Applications Fetching
    const { data: applications = [], isLoading: isLoadingApps } = useQuery({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    // Client-side filtering logic based on the dynamic queries
    const filteredApps = useMemo(() => {
        return applications.filter((app) => {
            const matchesProgram = selectedProgram === 'All' || app.program.includes(selectedProgram);
            const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  app.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesProgram && matchesSearch;
        });
    }, [applications, selectedProgram, searchQuery]);

    if (isLoadingPrograms || isLoadingApps) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Application Intake" subtitle="Filter, search, and monitor incoming student applications." />

            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div className="grid-2">
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                            Filter by Program
                        </label>
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: 'var(--space-2)', 
                                borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--border-color)', 
                                background: 'var(--bg-base)', 
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        >
                            <option value="All">All Programs</option>
                            {programs.map((prog) => (
                                <option key={prog.id} value={prog.major}>
                                    {prog.degree} {prog.major}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                            Search Applicant
                        </label>
                        <FormInput
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            <Card className="fade-in-delay-1">
                <Table>
                    <thead>
                        <tr>
                            <th>Applicant ID</th>
                            <th>Name</th>
                            <th>Program</th>
                            <th>Fee Status</th>
                            <th>Submission Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.length > 0 ? (
                            filteredApps.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
                                            {app.id.substring(0, 12)}...
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{app.applicantName}</td>
                                    <td>{app.program}</td>
                                    <td>
                                        <Badge colorScheme={app.applicationFeeStatus === 'Paid' ? 'success' : 'warning'}>
                                            {app.applicationFeeStatus}
                                        </Badge>
                                    </td>
                                    <td>{app.submittedDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                                    No applications match the current filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
