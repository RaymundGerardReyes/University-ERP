import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CirculationPage } from '../features/Circulation/Circulation.page';

const AppShell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-50">
        <nav className="w-64 bg-slate-900 text-white p-4">
            <div className="text-xl font-bold mb-8">Library Portal</div>
            <ul className="space-y-2">
                <li><Link to="/circulation" className="block p-2 rounded hover:bg-slate-800">Circulation</Link></li>
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
                    <Route path="/circulation" element={<CirculationPage />} />
                    <Route path="*" element={<div className="p-6">Select a module from the sidebar.</div>} />
                </Routes>
            </AppShell>
        </BrowserRouter>
    );
};
