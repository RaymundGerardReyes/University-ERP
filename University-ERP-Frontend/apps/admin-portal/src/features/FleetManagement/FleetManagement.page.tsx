import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useAssignRoute, useFleetStatus } from './FleetManagement.hooks';

export const FleetManagementPage: React.FC = () => {
    const { data: fleet, isLoading } = useFleetStatus();
    const { mutateAsync: assignRoute, isPending } = useAssignRoute();

    const [selectedDriver, setSelectedDriver] = useState<string>('DRV-802');

    const handleAssign = async (vehicleId: string) => {
        try {
            await assignRoute({ routeId: vehicleId, driverId: selectedDriver });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

    const activeVehicles = fleet?.filter((v: any) => v.status === 'In Transit').length || 0;

    return (
        <div className="fade-in">
            <PageHeader
                title="Fleet & Logistics"
                subtitle="Govern campus transportation, monitor active routes, and assign personnel."
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                    <span className="stat-label">Total Fleet</span>
                    <span className="stat-value">{fleet?.length || 0}</span>
                    <span className="stat-trend">Registered Vehicles</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">In Transit</span>
                    <span className="stat-value" style={{ color: 'var(--success-text)' }}>{activeVehicles}</span>
                    <span className="stat-trend">Active on Campus</span>
                </Card>
            </div>

            <div className="grid-auto fade-in-delay-2">
                {fleet?.map((vehicle: any) => {
                    let badgeColor: 'info' | 'success' | 'danger' = 'info';
                    if (vehicle.status === 'In Transit') badgeColor = 'success';
                    if (vehicle.status === 'Maintenance') badgeColor = 'danger';

                    return (
                        <Card key={vehicle.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: `var(--${badgeColor}-text)` }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '1.25rem', color: 'var(--text-bright)', fontWeight: 800 }}>{vehicle.id}</span>
                                <Badge colorScheme={badgeColor}>{vehicle.status}</Badge>
                            </div>

                            <h3 style={{ color: 'var(--brand-primary)', margin: '0 0 var(--space-4) 0', fontSize: '0.95rem' }}>{vehicle.route}</h3>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)', flex: 1 }}>
                                <div className="data-row">
                                    <span className="data-label">Driver</span>
                                    <span className="data-value">{vehicle.driver}</span>
                                </div>
                                <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                    <span className="data-label">Capacity</span>
                                    <span className="data-value">{vehicle.capacity} Pax</span>
                                </div>
                            </div>

                            {vehicle.status === 'Idle' && (
                                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'auto' }}>
                                    <select
                                        style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', padding: '0 var(--space-2)' }}
                                        value={selectedDriver}
                                        onChange={e => setSelectedDriver(e.target.value)}
                                    >
                                        <option value="DRV-802">Marcus Johnson</option>
                                        <option value="DRV-805">David Kim</option>
                                    </select>
                                    <Button variant="primary" disabled={isPending} onClick={() => handleAssign(vehicle.id)}>
                                        Assign
                                    </Button>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};