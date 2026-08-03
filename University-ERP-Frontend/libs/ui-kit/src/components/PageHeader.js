import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PageHeader = ({ title, subtitle, action }) => {
    return (_jsxs("div", { style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
        }, children: [_jsxs("div", { children: [_jsx("h1", { style: {
                            fontSize: '1.875rem', // 30px
                            fontWeight: 700,
                            margin: 0,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.02em'
                        }, children: title }), subtitle && (_jsx("p", { style: {
                            margin: '0.35rem 0 0 0',
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary)'
                        }, children: subtitle }))] }), action && _jsx("div", { children: action })] }));
};
