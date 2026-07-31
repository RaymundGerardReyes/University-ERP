import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export const useAssignRoute = () => {
    return useMutation({
        mutationFn: async (payload: any) => {
            const response = await fetch(`/api/v1/transport/routes/${payload.routeId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driverId: payload.driverId }),
            });
            if (!response.ok) throw new Error('Failed to assign route');
            return response.json();
        },
    });
};

export const FleetManagementPage: React.FC = () => {
    const { mutateAsync: assignRoute, isPending } = useAssignRoute();
    const [routeId, setRouteId] = useState('');
    const [driverId, setDriverId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await assignRoute({ routeId, driverId });
        alert('Route assigned to driver successfully');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Transport: Fleet Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Bus Route ID" value={routeId} onChange={e => setRouteId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Driver ID" value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">Assign Route</button>
                </form>
            </div>
        </div>
    );
};
