import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../react/useAuth';

export type FinanceRole = 
    | 'ROLE_FINANCE_ADMIN'
    | 'ROLE_FINANCE_ASSESSOR'
    | 'ROLE_FINANCE_CASHIER'
    | 'ROLE_FINANCE_AUDITOR';

interface FinanceGuardProps {
    allowedRoles: FinanceRole[];
}

export const FinanceGuard: React.FC<FinanceGuardProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.roles?.includes('ROLE_FINANCE_ADMIN')) {
        return <Outlet />;
    }

    const hasAccess = allowedRoles.some(role => user?.roles?.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
