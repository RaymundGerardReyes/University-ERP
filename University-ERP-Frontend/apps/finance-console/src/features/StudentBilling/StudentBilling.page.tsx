import React, { useState } from 'react';
import { useIssueInvoice } from './StudentBilling.hooks';

export const StudentBillingPage: React.FC = () => {
    const { mutateAsync: issueInvoice, isPending, error } = useIssueInvoice();
    
    const [studentId, setStudentId] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        
        try {
            const result = await issueInvoice({ 
                studentId, 
                amount: Number(amount), 
                description 
            });
            setSuccessMsg(`Invoice generated successfully! ID: ${result.invoiceId}`);
            setStudentId('');
            setAmount('');
            setDescription('');
        } catch (err: any) {
            console.error('Error generating invoice', err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Billing & Accounts Receivable</h1>
            <p className="text-gray-600 mb-8">Manage student invoices, tuition fees, and auxiliary charges.</p>
            
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Issue New Invoice</h2>
                
                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{error.message}</div>}
                {successMsg && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">{successMsg}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID (GUID)</label>
                        <input type="text" required value={studentId} onChange={(e) => setStudentId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                            placeholder="00000000-0000-0000-0000-000000000000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                        <input type="number" required min="1" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                            placeholder="e.g., Fall 2026 Tuition Fee" />
                    </div>
                    
                    <button type="submit" disabled={isPending}
                        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {isPending ? 'Processing...' : 'Issue Invoice'}
                    </button>
                </form>
            </div>
        </div>
    );
};
