import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { GrievancesPage } from '../features/Grievances/Grievances.page';
import { HelpdeskPage } from '../features/Helpdesk/Helpdesk.page';
import { EventsPage } from '../features/Events/Events.page';
import { VisitorsPage } from '../features/Visitors/Visitors.page';
import { QualityAccreditationPage } from '../features/QualityAccreditation/QualityAccreditation.page';

const AppShell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-50">
        <nav className="w-64 bg-slate-900 text-white p-4">
            <div className="text-xl font-bold mb-8">Governance Console</div>
            <ul className="space-y-2">
                <li><Link to="/grievances" className="block p-2 rounded hover:bg-slate-800 text-red-300">Grievances (Formal)</Link></li>
                <li><Link to="/helpdesk" className="block p-2 rounded hover:bg-slate-800 text-blue-300">IT Helpdesk</Link></li>
                <li><Link to="/events" className="block p-2 rounded hover:bg-slate-800 text-indigo-300">Events</Link></li>
                <li><Link to="/visitors" className="block p-2 rounded hover:bg-slate-800 text-emerald-300">Visitors</Link></li>
                <li><Link to="/accreditation" className="block p-2 rounded hover:bg-slate-800 text-purple-300">Quality QA</Link></li>
            </ul>
        </nav>
        <main className="flex-1 overflow-auto">
            {children}
        </main>
    </div>
);

export const Routing: React.FC = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppShell>
                <Routes>
                    <Route path="/grievances" element={<GrievancesPage />} />
                    <Route path="/helpdesk" element={<HelpdeskPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/visitors" element={<VisitorsPage />} />
                    <Route path="/accreditation" element={<QualityAccreditationPage />} />
                    <Route path="*" element={<div className="p-6">Select a module from the sidebar.</div>} />
                </Routes>
            </AppShell>
        </BrowserRouter>
    );
};
