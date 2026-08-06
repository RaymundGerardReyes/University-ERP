import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../react/useAuth';

export type FacultyOfficeRole = 
    | 'ROLE_FACULTY_ADMIN'
    | 'ROLE_FACULTY_SECRETARY'
    | 'ROLE_DEPARTMENT_CHAIRPERSON'
    | 'ROLE_COLLEGE_DEAN'
    | 'ROLE_FACULTY_SECURITY';

interface FacultyGuardProps {
    allowedRoles: FacultyOfficeRole[];
}

export const FacultyGuard: React.FC<FacultyGuardProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.roles?.includes('ROLE_FACULTY_ADMIN')) {
        return <Outlet />;
    }

    const hasAccess = allowedRoles.some(role => user?.roles?.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
