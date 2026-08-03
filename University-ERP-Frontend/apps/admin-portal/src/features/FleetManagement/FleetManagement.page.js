import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { transportApi } from '@university-erp/api-clients';
export const useAssignRoute = () => {
    return useMutation({
        mutationFn: (payload) => transportApi.assignRoute(payload),
    });
};
export const FleetManagementPage = () => {
    const { mutateAsync: assignRoute, isPending } = useAssignRoute();
    const [routeId, setRouteId] = useState('');
    const [driverId, setDriverId] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        await assignRoute({ routeId, driverId });
        alert('Route assigned to driver successfully');
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Transport: Fleet Management" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Bus Route ID", value: routeId, onChange: e => setRouteId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Driver ID", value: driverId, onChange: e => setDriverId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: "Assign Route" })] }) })] }));
};
