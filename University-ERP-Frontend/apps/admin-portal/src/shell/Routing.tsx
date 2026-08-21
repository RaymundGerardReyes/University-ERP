import { AuthGuard } from '@university-erp/shell-kit';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

import { PurchaseOrdersPage } from '../features/PurchaseOrders/PurchaseOrders.page';

const Stub = ({ title }: { title: string }) => (
    <div className="stub-page fade-in">
        <div className="stub-icon">⚙️</div>
        <div className="stub-title">{title}</div>
        <div className="stub-subtitle">Administrative module pending UI/UX implementation.</div>
    </div>
);

export const Routing: React.FC = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route element={<AuthGuard><AppShell /></AuthGuard>}>
                    <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                    <Route path="/academic-config" element={<Stub title="Academic Configuration" />} />
                    <Route path="/assets" element={<Stub title="Asset Registry" />} />
                    <Route path="/audit" element={<Stub title="Audit Compliance" />} />
                    <Route path="/canteen" element={<Stub title="Canteen Orders" />} />
                    <Route path="/dashboard" element={<Stub title="Dashboard" />} />
                    <Route path="/employees" element={<Stub title="Employee Management" />} />
                    <Route path="/facility" element={<Stub title="Facility Booking" />} />
                    <Route path="/fleet" element={<Stub title="Fleet Management" />} />
                    <Route path="/identity" element={<Stub title="Identity Security" />} />
                    <Route path="/integration" element={<Stub title="Integration Management" />} />
                    <Route path="/organization" element={<Stub title="Organization Management" />} />
                    <Route path="/reports" element={<Stub title="Reports" />} />
                    <Route path="/roles" element={<Stub title="Role Administration" />} />
                    <Route path="/monitoring" element={<Stub title="Platform Monitoring" />} />
                    <Route path="/stock" element={<Stub title="Stock Management" />} />
                    <Route path="/system" element={<Stub title="System Administration" />} />
                    <Route path="/users" element={<Stub title="User Administration" />} />
                    <Route path="/workflows" element={<Stub title="Workflow Management" />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};