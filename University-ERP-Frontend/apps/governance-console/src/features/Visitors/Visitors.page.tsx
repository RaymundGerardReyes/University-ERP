import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
import { LogVisitorPayload } from '@university-erp/domain-viewmodels';

export const useRegisterVisitor = () => {
    return useMutation({
        mutationFn: (payload: LogVisitorPayload) => governanceApi.logVisitor(payload),
    });
};

export const VisitorsPage: React.FC = () => {
    const { mutateAsync: registerVisitor, isPending } = useRegisterVisitor();
    const [visitorName, setVisitorName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [hostId, setHostId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await registerVisitor({ visitorName, purpose, hostId });
            alert(`Visitor Registered! Log ID: ${result.logId}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Visitor Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Visitor Name" value={visitorName} onChange={e => setVisitorName(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Purpose of Visit" value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Host/Employee ID" value={hostId} onChange={e => setHostId(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-emerald-600 text-white py-2 rounded">Register Visitor Access</button>
                </form>
            </div>
        </div>
    );
};
