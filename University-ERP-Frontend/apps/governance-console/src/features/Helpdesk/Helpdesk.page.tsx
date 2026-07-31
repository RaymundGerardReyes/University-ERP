import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface TicketPayload {
    requesterId: string;
    category: string;
    issueDescription: string;
    priority: string;
}

export const useCreateTicket = () => {
    return useMutation({
        mutationFn: async (payload: TicketPayload) => {
            const response = await fetch('/api/v1/governance/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to create ticket');
            return response.json();
        },
    });
};

export const HelpdeskPage: React.FC = () => {
    const { mutateAsync: createTicket, isPending, error } = useCreateTicket();
    const [requesterId, setRequesterId] = useState('');
    const [category, setCategory] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await createTicket({ requesterId, category, issueDescription, priority });
            setSuccessMsg(`Service Ticket Created! ID: ${result.ticketId}`);
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Institutional Helpdesk</h1>
            <p className="text-gray-600 mb-8">Operational IT, Maintenance, and Administrative Service Requests.</p>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-600 bg-red-50 p-2 rounded">{error.message}</div>}
                    {successMsg && <div className="text-green-600 bg-green-50 p-2 rounded">{successMsg}</div>}
                    
                    <input type="text" required placeholder="Requester ID" value={requesterId} onChange={e => setRequesterId(e.target.value)} className="w-full p-2 border rounded" />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
                            <option value="" disabled>Select Issue Category</option>
                            <option value="IT">IT & Network</option>
                            <option value="LMS">LMS Support</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Accounts">Accounts & Passwords</option>
                        </select>

                        <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-2 border rounded">
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                            <option value="Critical">Critical Priority</option>
                        </select>
                    </div>

                    <textarea required placeholder="Describe the issue..." value={issueDescription} onChange={e => setIssueDescription(e.target.value)} className="w-full p-2 border rounded h-32"></textarea>
                    
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        {isPending ? 'Submitting...' : 'Create Support Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
};
