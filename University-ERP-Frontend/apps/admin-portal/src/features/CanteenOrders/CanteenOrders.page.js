import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { canteenApi } from '@university-erp/api-clients';
export const useReserveMeal = () => {
    return useMutation({
        mutationFn: (payload) => canteenApi.reserveMeal(payload),
    });
};
export const CanteenOrdersPage = () => {
    const { mutateAsync: reserve, isPending } = useReserveMeal();
    const [studentId, setStudentId] = useState('');
    const [mealPlanId, setMealPlanId] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await reserve({ studentId, mealPlanId, reservationDate: new Date().toISOString() });
        alert(`Meal Reserved: ${result.reservationId}`);
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Mess & Canteen: Meal Reservations" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Student ID", value: studentId, onChange: e => setStudentId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Meal Plan ID", value: mealPlanId, onChange: e => setMealPlanId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: "Reserve Meal" })] }) })] }));
};
