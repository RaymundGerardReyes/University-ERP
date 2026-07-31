import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export const useReserveMeal = () => {
    return useMutation({
        mutationFn: async (payload: any) => {
            const response = await fetch('/api/v1/canteen/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to reserve meal');
            return response.json();
        },
    });
};

export const CanteenOrdersPage: React.FC = () => {
    const { mutateAsync: reserve, isPending } = useReserveMeal();
    const [studentId, setStudentId] = useState('');
    const [mealPlanId, setMealPlanId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await reserve({ studentId, mealPlanId, reservationDate: new Date().toISOString() });
        alert(`Meal Reserved: ${result.reservationId}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mess & Canteen: Meal Reservations</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Meal Plan ID" value={mealPlanId} onChange={e => setMealPlanId(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded">Reserve Meal</button>
                </form>
            </div>
        </div>
    );
};
