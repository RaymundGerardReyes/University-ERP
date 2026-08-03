import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CirculationPage } from '../features/Circulation/Circulation.page';
const AppShell = ({ children }) => (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("nav", { className: "w-64 bg-slate-900 text-white p-4", children: [_jsx("div", { className: "text-xl font-bold mb-8", children: "Library Portal" }), _jsx("ul", { className: "space-y-2", children: _jsx("li", { children: _jsx(Link, { to: "/circulation", className: "block p-2 rounded hover:bg-slate-800", children: "Circulation" }) }) })] }), _jsx("main", { className: "flex-1 overflow-auto", children: children })] }));
export const Routing = () => {
    return (_jsx(BrowserRouter, { children: _jsx(AppShell, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/circulation", element: _jsx(CirculationPage, {}) }), _jsx(Route, { path: "*", element: _jsx("div", { className: "p-6", children: "Select a module from the sidebar." }) })] }) }) }));
};
