import { jsx as _jsx } from "react/jsx-runtime";
export const Badge = ({ children, colorScheme = 'default', style, ...props }) => {
    let background = 'var(--bg-hover)';
    let color = 'var(--text-secondary)';
    if (colorScheme === 'success') {
        background = 'var(--success-bg)';
        color = 'var(--success-text)';
    }
    else if (colorScheme === 'warning') {
        background = 'var(--warning-bg)';
        color = 'var(--warning-text)';
    }
    else if (colorScheme === 'info') {
        background = 'var(--info-bg)';
        color = 'var(--info-text)';
    }
    else if (colorScheme === 'danger') {
        background = 'var(--danger-bg)';
        color = 'var(--danger-text)';
    }
    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: 'var(--space-1) var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: background,
        color: color,
        letterSpacing: '0.01em',
        ...style
    };
    return (_jsx("span", { style: baseStyle, ...props, children: children }));
};
