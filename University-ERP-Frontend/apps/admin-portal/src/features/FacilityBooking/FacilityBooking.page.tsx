import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useBookFacility, useCampusFacilities } from './FacilityBooking.hooks';

export const FacilityBookingPage: React.FC = () => {
    const { data: facilities, isLoading } = useCampusFacilities();
    const { mutateAsync: bookFacility, isPending } = useBookFacility();

    const handleBooking = async (facilityName: string) => {
        await bookFacility({
            roomName: facilityName,
            reservedBy: 'ADMIN-OVERRIDE',
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 7200000).toISOString()
        });
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Facility Bookings"
                subtitle="Manage and override campus space reservations."
            />

            <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
                    <span className="stat-label">Available Spaces</span>
                    <span className="stat-value" style={{ color: 'var(--success-text)' }}>42</span>
                    <span className="stat-trend">Ready for booking</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
                    <span className="stat-label">Currently In Use</span>
                    <span className="stat-value" style={{ color: 'var(--warning-text)' }}>18</span>
                    <span className="stat-trend">Active classes/events</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" style={{ background: 'var(--danger-text)' }} />
                    <span className="stat-label">Under Maintenance</span>
                    <span className="stat-value" style={{ color: 'var(--danger-text)' }}>3</span>
                    <span className="stat-trend">Out of commission</span>
                </Card>
            </div>

            <div className="grid-auto fade-in-delay-2">
                {facilities?.map((fac) => {
                    let badgeColor: 'success' | 'warning' | 'danger' = 'success';
                    if (fac.status === 'In Use') badgeColor = 'warning';
                    if (fac.status === 'Maintenance') badgeColor = 'danger';

                    return (
                        <Card key={fac.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" style={{ background: `var(--${badgeColor}-text)` }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{fac.id}</span>
                                <Badge colorScheme={badgeColor}>{fac.status}</Badge>
                            </div>

                            <h3 style={{ color: 'var(--text-bright)', margin: '0 0 var(--space-1) 0', fontSize: '1.15rem' }}>{fac.name}</h3>
                            <p style={{ color: 'var(--brand-primary)', margin: '0 0 var(--space-4) 0', fontSize: '0.85rem', fontWeight: 600 }}>{fac.type}</p>

                            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
                                <div className="data-row" style={{ padding: 0, borderBottom: 'none' }}>
                                    <span className="data-label">Max Capacity</span>
                                    <span className="data-value">{fac.capacity} pax</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <Button
                                    variant={fac.status === 'Available' ? 'primary' : 'secondary'}
                                    disabled={fac.status !== 'Available' || isPending}
                                    onClick={() => handleBooking(fac.name)}
                                    style={{ width: '100%' }}
                                >
                                    {fac.status === 'Available' ? 'Force Reservation' : 'Unavailable'}
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};