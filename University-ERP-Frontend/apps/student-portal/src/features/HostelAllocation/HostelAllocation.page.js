import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import { useHostelAllocation } from './HostelAllocation.hooks';
export const HostelAllocationPage = () => {
    const { data: allocation, isLoading, isError } = useHostelAllocation();
    if (isLoading)
        return _jsx("div", { style: { color: 'var(--text-secondary)' }, children: "Loading hostel details..." });
    if (isError || !allocation)
        return _jsx("div", { style: { color: 'red' }, children: "Failed to load hostel allocation." });
    return (_jsxs("div", { className: "fade-in", children: [_jsx(PageHeader, { title: "Hostel Allocation" }), _jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }, children: [_jsxs("div", { children: [_jsx("h2", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-1) 0' }, children: allocation.hostelName }), _jsxs("p", { style: { color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }, children: ["Room: ", _jsx("strong", { children: allocation.roomNumber }), " (", allocation.roomType, ")"] }), _jsx("h4", { style: { color: 'var(--text-primary)', margin: '0 0 var(--space-2) 0' }, children: "Roommates:" }), _jsx("ul", { style: { color: 'var(--text-secondary)', margin: 0, paddingLeft: 'var(--space-4)' }, children: allocation.roommates.map(rm => _jsx("li", { style: { marginBottom: 'var(--space-1)' }, children: rm }, rm)) })] }), _jsx("div", { style: { textAlign: 'right' }, children: _jsx(Badge, { colorScheme: "success", children: allocation.status }) })] }) })] }));
};
