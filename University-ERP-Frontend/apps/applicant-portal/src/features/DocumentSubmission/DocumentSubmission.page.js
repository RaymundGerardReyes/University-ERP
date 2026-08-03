import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useApplicantJourney } from '../ApplicantJourney.hooks';
export const DocumentSubmissionPage = () => {
    const { data, isLoading } = useApplicantJourney();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading document requirements..." });
    if (!data)
        return null;
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Required Documents", subtitle: "Upload and manage your admission requirements." }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, children: data.documents.map(doc => {
                    let badgeColor = 'default';
                    if (doc.status === 'Verified')
                        badgeColor = 'success';
                    if (doc.status === 'Uploaded')
                        badgeColor = 'info';
                    if (doc.status === 'Needs Resubmission' || doc.status === 'Rejected')
                        badgeColor = 'danger';
                    if (doc.status === 'Pending')
                        badgeColor = 'warning';
                    return (_jsxs(Card, { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }, children: [_jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)' }, children: doc.name }), doc.uploadedAt && _jsxs("p", { style: { margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }, children: ["Uploaded on ", new Date(doc.uploadedAt).toLocaleDateString()] }), doc.feedback && _jsxs("p", { style: { margin: 'var(--space-2) 0 0 0', fontSize: '0.85rem', color: 'var(--danger-text)' }, children: [_jsx("strong", { children: "Feedback:" }), " ", doc.feedback] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }, children: [_jsx(Badge, { colorScheme: badgeColor, children: doc.status }), (doc.status === 'Pending' || doc.status === 'Needs Resubmission' || doc.status === 'Rejected') && (_jsx(Button, { variant: "outline", children: "Upload" }))] })] }, doc.id));
                }) })] }));
};
