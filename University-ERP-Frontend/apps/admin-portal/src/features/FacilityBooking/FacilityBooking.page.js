import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { facilitiesApi } from '@university-erp/api-clients';
export const useBookFacility = () => {
    return useMutation({
        mutationFn: (payload) => facilitiesApi.bookFacility(payload),
    });
};
export const FacilityBookingPage = () => {
    const { mutateAsync: book, isPending } = useBookFacility();
    const [roomName, setRoomName] = useState('');
    const [reservedBy, setReservedBy] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await book({
            roomName,
            reservedBy,
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString()
        });
        alert(`Facility Booked: ${result.reservationId}`);
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Facilities: Room Booking" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Room Name (e.g., Auditorium A)", value: roomName, onChange: e => setRoomName(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Reserved By (ID/Name)", value: reservedBy, onChange: e => setReservedBy(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-blue-600 text-white py-2 rounded", children: "Book Facility" })] }) })] }));
};
