import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../react/useAuth';

export type IdentityRole = 
    | 'ROLE_IDENTITY_ADMIN'
    | 'ROLE_IDENTITY_OPERATOR'
    | 'ROLE_IDENTITY_AUDITOR';

interface IdentityGuardProps {
    allowedRoles: IdentityRole[];
}

export const IdentityGuard: React.FC<IdentityGuardProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.roles?.includes('ROLE_IDENTITY_ADMIN')) {
        return <Outlet />;
    }

    const hasAccess = allowedRoles.some(role => user?.roles?.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
