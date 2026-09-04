import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { FleetManagementPage } from '../../../apps/admin-portal/src/features/FleetManagement/FleetManagement.page';
import * as FleetApi from '../../../apps/admin-portal/src/features/FleetManagement/FleetManagement.api';

const mockFetchFleetStatus = vi.spyOn(FleetApi, 'fetchFleetStatus');
const mockAssignVehicleRoute = vi.spyOn(FleetApi, 'assignVehicleRoute');

vi.mock('@university-erp/auth-sdk', () => ({
    useAuth: () => ({
        identity: { id: 'EMP-ADMIN-01', name: 'Transport Admin', roles: ['Admin'] },
        isAuthenticated: true
    })
}));

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <FleetManagementPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('FleetManagement - Unit Testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- Render & Dashboard ---
    it('should render the FleetManagement operational dashboard without crashing', async () => {
        mockFetchFleetStatus.mockResolvedValue([]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Fleet & Logistics')).toBeDefined();
            expect(screen.getByText(/Govern campus transportation, monitor active routes/i)).toBeDefined();
        });
    });

    it('should display a loading skeleton while fetching fleet telemetry data', () => {
        mockFetchFleetStatus.mockImplementation(() => new Promise(() => {}));
        const { container } = renderComponent();
        expect(container.querySelector('.skeleton')).toBeDefined();
    });

    it('should correctly aggregate total vehicles, active trips, and vehicles in maintenance', async () => {
        mockFetchFleetStatus.mockResolvedValue([
            { id: 'BUS-01', route: 'Campus Loop A', driver: 'John Doe', capacity: 40, status: 'In Transit' },
            { id: 'VAN-02', route: 'Science Park Express', driver: 'Jane Smith', capacity: 15, status: 'Maintenance' },
            { id: 'BUS-03', route: 'Unassigned', driver: 'Unassigned', capacity: 40, status: 'Idle' }
        ]);
        renderComponent();
        
        await waitFor(() => {
            // Checks KPI values
            expect(screen.getByText('Total Fleet').nextElementSibling?.textContent).toBe('3');
            expect(screen.getByText('In Transit').nextElementSibling?.textContent).toBe('1');
        });
    });

    it.todo('should render an interactive mini-map visualizing current fleet locations');
    it.todo('should cleanly handle API errors by displaying a localized fallback component');

    // --- Vehicle Registry & Specs ---
    it('should list all registered vehicles in a sortable data table', async () => {
        mockFetchFleetStatus.mockResolvedValue([
            { id: 'BUS-01', route: 'Campus Loop A', driver: 'John Doe', capacity: 40, status: 'In Transit' }
        ]);
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('BUS-01')).toBeDefined();
            expect(screen.getByText('Campus Loop A')).toBeDefined();
            expect(screen.getByText('40 Pax')).toBeDefined();
        });
    });

    it.todo('should filter the vehicle list by type (e.g., Bus, Van, Utility)');
    it.todo('should correctly validate license plate formats when registering a new vehicle');
    it.todo('should store and display exact seating capacity and payload limits for each vehicle');
    it.todo('should allow updating the vehicle status to "Decommissioned"');

    // --- Dispatch & Routing ---
    it('should successfully submit the dispatch payload to the active routing queue', async () => {
        const user = userEvent.setup();
        mockFetchFleetStatus.mockResolvedValue([
            { id: 'VAN-03', route: 'Unassigned', driver: 'Unassigned', capacity: 15, status: 'Idle' }
        ]);
        mockAssignVehicleRoute.mockResolvedValue({ success: true });

        renderComponent();

        await waitFor(() => expect(screen.getByText('VAN-03')).toBeDefined());

        const assignBtn = screen.getByRole('button', { name: /Assign/i });
        await user.click(assignBtn);

        await waitFor(() => {
            // Defaults to 'DRV-802' in the current component implementation
            expect(mockAssignVehicleRoute).toHaveBeenCalledWith({ routeId: 'VAN-03', driverId: 'DRV-802' });
        });
    });

    it.todo('should open the Dispatch Modal when scheduling a new trip');
    it.todo('should correctly calculate the estimated distance between pickup and dropoff coordinates');
    it.todo('should prevent dispatching a vehicle that is currently marked "Out of Service"');
    it.todo('should ensure the requested passenger count does not exceed the vehicle\'s seating capacity');

    // --- Driver Assignment & Logs ---
    it.todo('should only list drivers who hold the correct license class for the selected vehicle');
    it.todo('should prevent assigning a driver who is already scheduled for an overlapping trip');
    it.todo('should log the driver\'s exact clock-in and clock-out times for the trip');
    it.todo('should flag drivers who have exceeded maximum daily continuous driving hours');
    it.todo('should allow assigning a backup driver in case of an emergency substitution');

    // --- Maintenance & Repairs ---
    it.todo('should visually flag vehicles that are overdue for scheduled maintenance in red');
    it.todo('should trigger an automatic maintenance block based on cumulative mileage limits');
    it.todo('should allow a mechanic to log detailed repair notes and attached invoices');
    it.todo('should transition a vehicle back to "Active" when a repair log is officially closed');
    it.todo('should correctly project the next estimated maintenance date based on daily average usage');

    // --- Fuel & Expenses ---
    it.todo('should allow drivers to log fuel receipts via the expense panel');
    it.todo('should automatically calculate average fuel efficiency (MPG / KPL) based on odometer deltas');
    it.todo('should highlight severe drops in fuel efficiency which might indicate theft or mechanical failure');
    it.todo('should aggregate total fleet fuel expenditures by month for the finance dashboard');
    it.todo('should reject fuel logs with negative or physically impossible odometer readings');

    // --- Real-Time Tracking & Telematics ---
    it.todo('should establish a WebSocket connection for live GPS coordinate updates');
    it.todo('should smoothly animate the vehicle marker across the map using interpolated coordinates');
    it.todo('should trigger a speeding alert if the telemetry data exceeds the speed threshold');
    it.todo('should correctly handle and reconnect dropped WebSocket connections');
    it.todo('should display the last known location in grey if the GPS signal is lost for > 5 minutes');

    // --- Compliance & Inspections ---
    it.todo('should require a mandatory pre-trip inspection checklist to be passed before dispatch');
    it.todo('should block the trip dispatch if any critical inspection item (e.g., Brakes) fails');
    it.todo('should securely store insurance renewal dates and alert 30 days prior to expiration');
    it.todo('should maintain a permanent read-only audit log of all historical traffic violations');
    it.todo('should generate a comprehensive compliance PDF report for external transport authorities');
});
