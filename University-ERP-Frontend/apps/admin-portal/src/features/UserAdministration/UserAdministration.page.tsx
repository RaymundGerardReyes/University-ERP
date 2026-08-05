import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useRevokeAccess, useSystemUsers } from './UserAdministration.hooks';

export const UserAdministrationPage: React.FC = () => {
    const { data: users, isLoading } = useSystemUsers();
    const { mutateAsync: revokeAccess, isPending } = useRevokeAccess();

    if (isLoading) return <div className="skeleton" />;

    const lockedUsers = users?.filter(u => u.status === 'Locked').length || 0;

    return (
        <div className="fade-in">
            <PageHeader
                title="User Administration"
                subtitle="Govern identity access, roles, and security standing for all platform users."
            />

            <div className="grid-stats fade-in-delay-1">
                <Card className="stat-card">
                    <div className="card-accent-top" />
                    <span className="stat-label">Total Identities</span>
                    <span className="stat-value">{users?.length || 0}</span>
                    <span className="stat-trend">Registered Accounts</span>
                </Card>
                <Card className="stat-card">
                    <div className="card-accent-top" />
                    <span className="stat-label">Locked Accounts</span>
                    <span className="stat-value">{lockedUsers}</span>
                    <span className="stat-trend">Requires Review</span>
                </Card>
            </div>

            <div className="grid-auto fade-in-delay-2">
                {users?.map((user) => (
                    <Card key={user.id} className="card">
                        <div className="card-accent-top" />

                        <div className="data-row">
                            <span className="data-value">{user.name}</span>
                            <Badge colorScheme={user.status === 'Active' ? 'success' : 'danger'}>
                                {user.status}
                            </Badge>
                        </div>

                        <div className="data-row">
                            <span className="data-label">Identity ID</span>
                            <span className="data-value">{user.id}</span>
                        </div>

                        <div className="data-row">
                            <span className="data-label">Email Context</span>
                            <span className="data-value">{user.email}</span>
                        </div>

                        <div className="data-row">
                            <span className="data-label">System Role</span>
                            <span className="data-value">{user.role}</span>
                        </div>

                        <div className="data-row">
                            <Button variant="outline">Reset MFA</Button>
                            <Button
                                variant={user.status === 'Locked' ? 'primary' : 'secondary'}
                                disabled={isPending}
                                onClick={() => revokeAccess(user.id)}
                            >
                                {user.status === 'Locked' ? 'Unlock Account' : 'Revoke Access'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};