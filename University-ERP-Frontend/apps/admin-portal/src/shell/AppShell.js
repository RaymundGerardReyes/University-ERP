import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
export default function AppShell() {
    return (_jsxs("div", { style: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'hsl(220, 30%, 15%)' }, children: [_jsx("header", { style: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("div", { style: {
                                width: '40px', height: '40px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, hsl(340, 80%, 55%), hsl(30, 90%, 55%))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.2rem', fontWeight: 'bold', color: 'white'
                            }, children: "A" }), _jsx("h1", { style: { color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: 600 }, children: "Admin Portal" })] }) }), _jsx("main", { style: { flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }, children: _jsx(Outlet, {}) }), _jsxs("footer", { style: {
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }, children: ["\u00A9 ", new Date().getFullYear(), " University ERP Administration."] })] }));
}
