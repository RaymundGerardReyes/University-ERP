import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import AuthGuard from './AuthGuard';
export function Routing() {
    return (_jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(AppShell, {}), children: [_jsx(Route, { element: _jsx(AuthGuard, {}), children: _jsx(Route, { path: "/", element: _jsxs("div", { style: { padding: '2rem' }, children: [_jsx("h1", { children: "Learning Management System" }), _jsx("p", { style: { color: 'hsl(220, 10%, 60%)' }, children: "Select a module from the sidebar to get started." })] }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
