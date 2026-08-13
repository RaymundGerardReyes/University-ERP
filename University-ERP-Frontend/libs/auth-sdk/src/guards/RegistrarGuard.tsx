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
        // Let AuthGuard handle the redirect gracefully
        return null;
    }

    // Registrar Admins have access to all divisions
    if (user?.roles?.includes('ROLE_REGISTRAR_ADMIN') || user?.roles?.includes('Admin') || user?.roles?.includes('Registrar')) {
        return <Outlet />;
    }

    const hasAccess = allowedRoles.some(role => user?.roles?.includes(role));

    if (!hasAccess) {
        return (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
                 <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>Division Access Denied</h2>
                 <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
                    You lack the specific officer permissions ({allowedRoles.join(' or ')}) required to access this division.
                 </p>
             </div>
        );
    }

    return <Outlet />;
};
