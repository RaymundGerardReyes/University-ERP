import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../react/useAuth';

export type RegistrarDivisionRole = 
    | 'ROLE_REGISTRAR_ADMIN'
    | 'ROLE_ADMISSIONS_OFFICER'
    | 'ROLE_ENROLLMENT_OFFICER'
    | 'ROLE_REGISTRY_OFFICER'
    | 'ROLE_RECORDS_OFFICER'
    | 'ROLE_CURRICULUM_OFFICER'
    | 'ROLE_GRADUATION_OFFICER'
    | 'ROLE_CERTIFICATION_OFFICER'
    | 'ROLE_SERVICES_OFFICER'
    | 'ROLE_COMPLIANCE_OFFICER'
    | 'ROLE_SECURITY_OFFICER';

interface RegistrarGuardProps {
    allowedRoles: RegistrarDivisionRole[];
}

export const RegistrarGuard: React.FC<RegistrarGuardProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Registrar Admins have access to all divisions
    if (user?.roles?.includes('ROLE_REGISTRAR_ADMIN')) {
        return <Outlet />;
    }

    const hasAccess = allowedRoles.some(role => user?.roles?.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
