
import { useAuth } from '@university-erp/auth-sdk';
import { PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { ChairpersonEvaluationView } from './components/ChairpersonEvaluationView';
import { DeanEndorsementView } from './components/DeanEndorsementView';
import { RegistrarEnrollmentView } from './components/RegistrarEnrollmentView';
import { SecretaryIntakeView } from './components/SecretaryIntakeView';

export const AdmissionsWorkspacePage: React.FC = () => {
    const { user } = useAuth();

    // In a real implementation, 'user.role' would be derived from your Identity JWT token
    const role = user?.roles?.[0] || 'Secretary';

    const renderWorkspace = () => {
        switch (role) {
            case 'FacultySecretary':
            case 'Secretary':
                return <SecretaryIntakeView />;
            case 'DepartmentChairperson':
            case 'Chairperson':
                return <ChairpersonEvaluationView />;
            case 'CollegeDean':
            case 'Dean':
                return <DeanEndorsementView />;
            case 'Registrar':
                return <RegistrarEnrollmentView />;
            default:
                return <SecretaryIntakeView />;
        }
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Admissions Processing Workspace"
                subtitle={`Currently operating as: ${role.replace(/([A-Z])/g, ' $1').trim()}`}
            />
            {renderWorkspace()}
        </div>
    );
};