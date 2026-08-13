import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../react/useAuth';

export type LMSRole = 
    | 'ROLE_LMS_ADMIN'
    | 'ROLE_INSTRUCTOR';

interface LMSGuardProps {
    allowedRoles: LMSRole[];
}

export const LMSGuard: React.FC<LMSGuardProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Explicitly block students, as they should use the Avalonia offline client
    if (user?.roles?.includes('ROLE_STUDENT') || user?.roles?.includes('Student')) {
        return <Navigate to="/unauthorized-offline-client-required" replace />;
    }

    if (user?.roles?.includes('ROLE_LMS_ADMIN') || user?.roles?.includes('Admin')) {
        return <Outlet />;
    }

    const hasAccess = allowedRoles.some(role => user?.roles?.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
