import { jsx as _jsx } from "react/jsx-runtime";
export const Card = ({ children, style, ...props }) => {
    const baseStyle = {
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        ...style
    };
    return (_jsx("div", { style: baseStyle, ...props, children: children }));
};
