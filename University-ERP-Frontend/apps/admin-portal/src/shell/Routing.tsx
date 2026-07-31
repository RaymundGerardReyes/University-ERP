import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { EmployeeManagementPage } from '../features/EmployeeManagement/EmployeeManagement.page';
import { PurchaseOrdersPage } from '../features/PurchaseOrders/PurchaseOrders.page';
import { StockManagementPage } from '../features/StockManagement/StockManagement.page';
import { AssetRegistryPage } from '../features/AssetRegistry/AssetRegistry.page';
import { FleetManagementPage } from '../features/FleetManagement/FleetManagement.page';
import { CanteenOrdersPage } from '../features/CanteenOrders/CanteenOrders.page';
import { FacilityBookingPage } from '../features/FacilityBooking/FacilityBooking.page';

const AppShell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-50">
        <nav className="w-64 bg-slate-900 text-white p-4">
            <div className="text-xl font-bold mb-8">Admin Portal</div>
            <ul className="space-y-2">
                <li className="pt-2 text-gray-400 text-xs uppercase font-bold">Core Admin</li>
                <li><Link to="/hr/employees" className="block p-2 rounded hover:bg-slate-800">Human Resources</Link></li>
                <li><Link to="/procurement/orders" className="block p-2 rounded hover:bg-slate-800">Procurement</Link></li>
                <li><Link to="/inventory/stock" className="block p-2 rounded hover:bg-slate-800">Inventory</Link></li>
                <li><Link to="/assets/registry" className="block p-2 rounded hover:bg-slate-800">Asset Management</Link></li>
                
                <li className="pt-4 text-gray-400 text-xs uppercase font-bold">Campus Life</li>
                <li><Link to="/transport/fleet" className="block p-2 rounded hover:bg-slate-800">Fleet Management</Link></li>
                <li><Link to="/canteen/orders" className="block p-2 rounded hover:bg-slate-800">Canteen Orders</Link></li>
                <li><Link to="/facilities/booking" className="block p-2 rounded hover:bg-slate-800">Facility Booking</Link></li>
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
                    <Route path="/hr/employees" element={<EmployeeManagementPage />} />
                    <Route path="/procurement/orders" element={<PurchaseOrdersPage />} />
                    <Route path="/inventory/stock" element={<StockManagementPage />} />
                    <Route path="/assets/registry" element={<AssetRegistryPage />} />
                    <Route path="/transport/fleet" element={<FleetManagementPage />} />
                    <Route path="/canteen/orders" element={<CanteenOrdersPage />} />
                    <Route path="/facilities/booking" element={<FacilityBookingPage />} />
                    <Route path="*" element={<div className="p-6">Select a module from the sidebar.</div>} />
                </Routes>
            </AppShell>
        </BrowserRouter>
    );
};
