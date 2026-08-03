import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import AuthGuard from './AuthGuard';
import UserLogin from '@features/UserLogin/UserLogin.page';
import UserRegistration from '@features/UserRegistration/UserRegistration.page';
import PasswordReset from '@features/PasswordReset/PasswordReset.page';
import MfaVerification from '@features/MfaVerification/MfaVerification.page';
import SessionManagement from '@features/SessionManagement/SessionManagement.page';
import SecuritySettings from '@features/SecuritySettings/SecuritySettings.page';
export function Routing() {
    return (_jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(AppShell, {}), children: [_jsx(Route, { path: "/login", element: _jsx(UserLogin, {}) }), _jsx(Route, { path: "/register", element: _jsx(UserRegistration, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(PasswordReset, {}) }), _jsx(Route, { path: "/mfa", element: _jsx(MfaVerification, {}) }), _jsxs(Route, { element: _jsx(AuthGuard, {}), children: [_jsx(Route, { path: "/sessions", element: _jsx(SessionManagement, {}) }), _jsx(Route, { path: "/security", element: _jsx(SecuritySettings, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }) }) }));
}
