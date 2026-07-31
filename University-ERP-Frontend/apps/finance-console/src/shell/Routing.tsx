import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { StudentBillingPage } from '../features/StudentBilling/StudentBilling.page';
import { PayrollProcessingPage } from '../features/PayrollProcessing/PayrollProcessing.page';

const AppShell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-50">
        <nav className="w-64 bg-slate-900 text-white p-4">
            <div className="text-xl font-bold mb-8">Finance Console</div>
            <ul className="space-y-2">
                <li><Link to="/billing" className="block p-2 rounded hover:bg-slate-800">Student Billing (A/R)</Link></li>
                <li><Link to="/payroll" className="block p-2 rounded hover:bg-slate-800">Payroll Processing</Link></li>
            </ul>
        </nav>
        <main className="flex-1 overflow-auto">
            {children}
        </main>
    </div>
);

export const Routing: React.FC = () => {
    return (
        <BrowserRouter>
            <AppShell>
                <Routes>
                    <Route path="/billing" element={<StudentBillingPage />} />
                    <Route path="/payroll" element={<PayrollProcessingPage />} />
                    <Route path="*" element={<div className="p-6">Select a module from the sidebar.</div>} />
                </Routes>
            </AppShell>
        </BrowserRouter>
    );
};
