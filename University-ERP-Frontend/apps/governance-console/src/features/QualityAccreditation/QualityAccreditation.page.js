import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { governanceApi } from '@university-erp/api-clients';
export const useSubmitEvidence = () => {
    return useMutation({
        mutationFn: (payload) => governanceApi.submitEvidence(payload),
    });
};
export const QualityAccreditationPage = () => {
    const { mutateAsync: submitEvidence, isPending } = useSubmitEvidence();
    const [standardCode, setStandardCode] = useState('');
    const [submitterId, setSubmitterId] = useState('');
    const [documentReference, setDocumentReference] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await submitEvidence({ standardCode, submitterId, documentReference });
            alert(`Accreditation Evidence Logged! ID: ${result.evidenceId}`);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Quality Assurance & Accreditation" }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", required: true, placeholder: "Standard Code (e.g., ISO-9001-2025)", value: standardCode, onChange: e => setStandardCode(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Submitter ID (Department Head)", value: submitterId, onChange: e => setSubmitterId(e.target.value), className: "w-full p-2 border rounded" }), _jsx("input", { type: "text", required: true, placeholder: "Document URL / Reference Link", value: documentReference, onChange: e => setDocumentReference(e.target.value), className: "w-full p-2 border rounded" }), _jsx("button", { type: "submit", disabled: isPending, className: "w-full bg-purple-600 text-white py-2 rounded", children: "Submit Evidence for Review" })] }) })] }));
};
