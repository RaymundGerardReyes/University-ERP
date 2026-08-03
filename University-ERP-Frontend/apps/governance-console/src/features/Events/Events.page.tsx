import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
import { CreateEventPayload } from '@university-erp/domain-viewmodels';

export const usePlanEvent = () => {
    return useMutation({
        mutationFn: (payload: CreateEventPayload) => governanceApi.createEvent(payload),
    });
};

export const EventsPage: React.FC = () => {
    const { mutateAsync: planEvent, isPending } = usePlanEvent();
    const [eventName, setEventName] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [venue, setVenue] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [maxCapacity, setMaxCapacity] = useState(100);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await planEvent({ eventName, organizerId, venue, scheduledDate: new Date(scheduledDate).toISOString(), maxCapacity });
            alert(`Event Planned! ID: ${result.eventId}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Campus Event Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Event Name" value={eventName} onChange={e => setEventName(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Organizer ID" value={organizerId} onChange={e => setOrganizerId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="datetime-local" required value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" required placeholder="Max Capacity" value={maxCapacity} onChange={e => setMaxCapacity(parseInt(e.target.value))} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-indigo-600 text-white py-2 rounded">Plan Event</button>
                </form>
            </div>
        </div>
    );
};
