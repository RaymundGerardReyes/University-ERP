import { admissionsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, FormInput, PageHeader } from '@university-erp/ui-kit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

export const InterviewSchedulingPage: React.FC = () => {
    const { identity } = useAuth();
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const studentId = identity?.id || '00000000-0000-0000-0000-000000000001';

    // Fetch the Application ID via the Journey endpoint
    const { data: journey, isLoading } = useQuery({
        queryKey: ['applicantJourney', studentId],
        queryFn: () => admissionsApi.getApplicantJourney(studentId),
        enabled: !!studentId
    });

    const scheduleMutation = useMutation({
        mutationFn: () => admissionsApi.scheduleInterview(journey!.applicantId, { 
            date: selectedDate, 
            time: selectedTime 
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applicantJourney', studentId] });
        }
    });

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
    
    if (!journey || !journey.applicantId) return <div>No active application found.</div>;

    // Determine if an interview is already scheduled by checking the timeline
    const scheduledEvent = journey.timeline.find(t => t.event === 'Interview Scheduled');

    return (
        <div className="fade-in">
            <PageHeader 
                title="Interview Scheduling" 
                subtitle="Select an available date and time for your admissions interview." 
            />

            <Card>
                {scheduledEvent ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h3>Interview Confirmed</h3>
                        <p style={{ margin: '1rem 0' }}>{scheduledEvent.detail}</p>
                        <Badge colorScheme="success">Scheduled</Badge>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>Date</label>
                            <FormInput type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>Time</label>
                            <select 
                                value={selectedTime} 
                                onChange={(e) => setSelectedTime(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                            >
                                <option value="">Select a time...</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="02:00 PM">02:00 PM</option>
                            </select>
                        </div>
                        <Button 
                            variant="primary" 
                            onClick={() => scheduleMutation.mutate()}
                            disabled={!selectedDate || !selectedTime || scheduleMutation.isPending}
                        >
                            {scheduleMutation.isPending ? 'Scheduling...' : 'Book Interview'}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};
