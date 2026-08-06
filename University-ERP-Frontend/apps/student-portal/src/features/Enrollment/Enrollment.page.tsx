import { useMutation, useQuery } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const EnrollmentPage: React.FC = () => {
    const { identity } = useAuth();
    
    // In a real app we'd fetch this from the catalog API, but for the Registrar flow demo we mock
    const availableSections = [
        { id: 'SEC-101', code: 'CS101', name: 'Intro to Programming', credits: 3, schedule: 'MWF 9:00 AM' },
        { id: 'SEC-102', code: 'CS102', name: 'Data Structures', credits: 3, schedule: 'TTh 1:00 PM' },
        { id: 'SEC-103', code: 'MATH201', name: 'Linear Algebra', credits: 4, schedule: 'MWF 11:00 AM' },
    ];

    const registerMutation = useMutation({
        mutationFn: (courseCode: string) => 
            registrarApi.registerCourse({ studentId: identity?.id || 'demo-student', courseCode, academicTerm: 'Fall 2026' }),
        onSuccess: () => alert('Successfully registered for course!'),
        onError: () => alert('Failed to register. You may already be registered or missing prerequisites.')
    });

    return (
        <div className="fade-in">
            <PageHeader
                title="Course Registration"
                subtitle="Select your courses for the upcoming academic term."
            />
            
            <div className="grid-auto">
                {availableSections.map(section => (
                    <Card key={section.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--brand-primary)' }}>{section.code}</span>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{section.credits} Credits</span>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>{section.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                            Schedule: {section.schedule}
                        </p>
                        <Button 
                            variant="primary" 
                            style={{ width: '100%' }}
                            onClick={() => registerMutation.mutate(section.code)}
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? 'Registering...' : 'Register'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};
