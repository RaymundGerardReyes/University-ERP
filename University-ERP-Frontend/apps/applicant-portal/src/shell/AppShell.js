import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '@university-erp/auth-sdk';
import { Button } from '@university-erp/ui-kit';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
export const AppShell = () => {
    const { identity, logout } = useAuth();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    // Initialize theme from localStorage or system preference
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    const closeMobileMenu = () => setIsMobileOpen(false);
    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Explore Programs', path: '/programs' },
        { label: 'Check Eligibility', path: '/eligibility' },
        { label: 'Application Wizard', path: '/apply' },
        { label: 'My Documents', path: '/documents' },
        { label: 'Journey Timeline', path: '/timeline' },
        { label: 'Admission Status', path: '/admissions' }
    ];
    return (_jsxs("div", { className: "app-layout", children: [_jsxs("header", { className: "mobile-header-bar", children: [_jsx("button", { className: "icon-btn", onClick: () => setIsMobileOpen(true), "aria-label": "Open Navigation Menu", children: "\u2630" }), _jsx("span", { style: { fontWeight: 700, color: 'var(--brand-primary)' }, children: "University ERP" }), _jsx("button", { className: "icon-btn", onClick: toggleTheme, "aria-label": "Toggle Theme", children: theme === 'light' ? '🌙' : '☀️' })] }), _jsxs("aside", { className: `sidebar ${isMobileOpen ? 'open' : ''}`, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', padding: '0 0.5rem' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--brand-primary)' }, children: "University ERP" }), _jsx("span", { style: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }, children: "Applicant Portal" })] }), _jsx("button", { className: "icon-btn mobile-menu-btn", onClick: closeMobileMenu, "aria-label": "Close Navigation Sidebar", children: "\u2715" })] }), _jsx("nav", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }, children: navItems.map(item => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (_jsx(Link, { to: item.path, onClick: closeMobileMenu, style: {
                                    padding: 'var(--space-2) var(--space-3)',
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                    backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                                    border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.875rem',
                                    transition: 'all 0.15s ease'
                                }, children: item.label }, item.path));
                        }) }), _jsxs("div", { style: { marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }, children: [_jsx("button", { onClick: toggleTheme, className: "icon-btn", style: { width: '100%', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)', fontSize: '0.85rem' }, children: theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode' }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }, children: [_jsxs("div", { style: { overflow: 'hidden' }, children: [_jsx("div", { style: { fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }, children: identity?.name || 'Applicant Account' }), _jsx("div", { style: { fontSize: '0.725rem', color: 'var(--text-muted)' }, children: identity?.id })] }), _jsx(Button, { variant: "outline", onClick: logout, style: { padding: 'var(--space-1) var(--space-2)', fontSize: '0.75rem' }, children: "Logout" })] })] })] }), _jsx("main", { className: "main-content", children: _jsx("div", { className: "content-container", children: _jsx(Outlet, {}) }) }), isMobileOpen && (_jsx("div", { onClick: closeMobileMenu, style: {
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 40
                } }))] }));
};
