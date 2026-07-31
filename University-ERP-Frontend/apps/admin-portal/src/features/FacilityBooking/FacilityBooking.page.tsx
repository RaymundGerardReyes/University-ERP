import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export const useBookFacility = () => {
    return useMutation({
        mutationFn: async (payload: any) => {
            const response = await fetch('/api/v1/facilities/reservations/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to book facility');
            return response.json();
        },
    });
};

export const FacilityBookingPage: React.FC = () => {
    const { mutateAsync: book, isPending } = useBookFacility();
    const [roomName, setRoomName] = useState('');
    const [reservedBy, setReservedBy] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await book({ 
            roomName, 
            reservedBy, 
            startTime: new Date().toISOString(), 
            endTime: new Date(Date.now() + 3600000).toISOString() 
        });
        alert(`Facility Booked: ${result.reservationId}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Facilities: Room Booking</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Room Name (e.g., Auditorium A)" value={roomName} onChange={e => setRoomName(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Reserved By (ID/Name)" value={reservedBy} onChange={e => setReservedBy(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">Book Facility</button>
                </form>
            </div>
        </div>
    );
};
