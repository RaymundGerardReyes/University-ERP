import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
import { SubmitGrievancePayload } from '@university-erp/domain-viewmodels';

export const useSubmitComplaint = () => {
    return useMutation({
        mutationFn: (payload: SubmitGrievancePayload) => governanceApi.submitGrievance(payload),
    });
};

export const GrievancesPage: React.FC = () => {
    const { mutateAsync: submit, isPending, error } = useSubmitComplaint();
    const [complainantId, setComplainantId] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        try {
            const result = await submit({ complainantId, category, description });
            setSuccessMsg(`Grievance submitted successfully! Case ID: ${result.complaintId}`);
            setComplainantId('');
            setCategory('');
            setDescription('');
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Grievance Management</h1>
            <p className="text-gray-600 mb-8">Formal institutional complaints requiring investigation, escalation, and compliance auditing.</p>
            
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">File a Formal Complaint</h2>
                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{error.message}</div>}
                {successMsg && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">{successMsg}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Complainant ID (Anonymous allowed if empty string)" value={complainantId} onChange={e => setComplainantId(e.target.value)} className="w-full p-2 border rounded" />
                    
                    <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
                        <option value="" disabled>Select Category</option>
                        <option value="Academic">Academic</option>
                        <option value="Conduct">Student/Faculty Conduct</option>
                        <option value="Harassment">Harassment/Discrimination</option>
                        <option value="Facilities">Facilities/Health</option>
                    </select>

                    <textarea required placeholder="Detailed Description of the Grievance (Attach evidence via separate upload module)" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded h-32"></textarea>
                    
                    <button type="submit" disabled={isPending} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                        {isPending ? 'Submitting...' : 'Submit Grievance'}
                    </button>
                </form>
            </div>
        </div>
    );
};
