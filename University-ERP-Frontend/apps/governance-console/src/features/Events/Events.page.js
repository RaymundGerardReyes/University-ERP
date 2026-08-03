import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
export const usePlanEvent = () => {
    return useMutation({
        mutationFn: (payload) => governanceApi.createEvent(payload),
    });
};
export const EventsPage = () => {
    const { mutateAsync: planEvent, isPending } = usePlanEvent();
    const [eventName, setEventName] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [venue, setVenue] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [maxCapacity, setMaxCapacity] = useState(100);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await planEvent({ eventName, organizerId, venue, scheduledDate: new Date(scheduledDate).toISOString(), maxCapacity });
            alert(`Event Planned! ID: ${result.eventId}`);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Campus Event Management" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Event Name", value: eventName, onChange: e => setEventName(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Organizer ID", value: organizerId, onChange: e => setOrganizerId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Venue", value: venue, onChange: e => setVenue(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "datetime-local", required: true, value: scheduledDate, onChange: e => setScheduledDate(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "number", required: true, placeholder: "Max Capacity", value: maxCapacity, onChange: e => setMaxCapacity(parseInt(e.target.value)), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-indigo-600 text-white py-2 rounded", children: "Plan Event" })] }) })] }));
};
