import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface EvidencePayload {
    standardCode: string;
    submitterId: string;
    documentReference: string;
}

export const useSubmitEvidence = () => {
    return useMutation({
        mutationFn: async (payload: EvidencePayload) => {
            const response = await fetch('/api/v1/governance/accreditation/evidence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to submit evidence');
            return response.json();
        },
    });
};

export const QualityAccreditationPage: React.FC = () => {
    const { mutateAsync: submitEvidence, isPending } = useSubmitEvidence();
    const [standardCode, setStandardCode] = useState('');
    const [submitterId, setSubmitterId] = useState('');
    const [documentReference, setDocumentReference] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await submitEvidence({ standardCode, submitterId, documentReference });
            alert(`Accreditation Evidence Logged! ID: ${result.evidenceId}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quality Assurance & Accreditation</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" required placeholder="Standard Code (e.g., ISO-9001-2025)" value={standardCode} onChange={e => setStandardCode(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Submitter ID (Department Head)" value={submitterId} onChange={e => setSubmitterId(e.target.value)} className="w-full p-2 border rounded" />
                    <input type="text" required placeholder="Document URL / Reference Link" value={documentReference} onChange={e => setDocumentReference(e.target.value)} className="w-full p-2 border rounded" />
                    <button type="submit" disabled={isPending} className="w-full bg-purple-600 text-white py-2 rounded">Submit Evidence for Review</button>
                </form>
            </div>
        </div>
    );
};
