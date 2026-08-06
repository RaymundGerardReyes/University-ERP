import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

const Stub = ({ title }: { title: string }) => (
    <div className="stub-page fade-in">
        <div className="stub-icon">🛡️</div>
        <div className="stub-title">{title}</div>
        <div className="stub-subtitle">Security module pending UI implementation.</div>
    </div>
);

export const Routing: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthGuard><AppShell /></AuthGuard>}>
                    <Route path="/dashboard" element={<Stub title="Security Dashboard" />} />
                    <Route path="/campus-access" element={<Stub title="Campus Access Control" />} />
                    <Route path="/visitor-pass" element={<Stub title="Visitor Pass System" />} />
                    <Route path="/vehicle-access" element={<Stub title="Vehicle Access" />} />
                    <Route path="/gate-logs" element={<Stub title="Gate Logs" />} />
                    <Route path="/incidents" element={<Stub title="Incident Reports" />} />
                    <Route path="/emergency" element={<Stub title="Emergency Response" />} />
                    <Route path="/lost-found" element={<Stub title="Lost and Found" />} />
                    <Route path="/id-verification" element={<Stub title="ID Verification" />} />
                    <Route path="/cctv" element={<Stub title="CCTV Requests" />} />
                    <Route path="/reports" element={<Stub title="Security Reports" />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
