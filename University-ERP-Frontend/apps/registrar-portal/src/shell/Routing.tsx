import { AuthGuard } from '@university-erp/shell-kit';
import { RegistrarGuard } from '@university-erp/auth-sdk';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

// New Features
import { RegistrarDashboardPage } from '../features/RegistrarDashboard/RegistrarDashboard.page';
import { AcademicSchedulingDivisionPage } from '../features/AcademicSchedulingDivision/AcademicSchedulingDivision.page';
import { CrossEnrollmentDivisionPage } from '../features/CrossEnrollmentDivision/CrossEnrollmentDivision.page';
import { TransferDivisionPage } from '../features/TransferDivision/TransferDivision.page';

// Existing Features
import { EnrollmentActivationPage } from '../features/Admissions/EnrollmentActivation.page';
import { AdmissionsQueuePage } from '../features/AdmissionsDivision/AdmissionsQueue.page';
import { FacultyEndorsementsPage } from '../features/AdmissionsDivision/FacultyEndorsements.page';
import { EnrollmentValidationPage } from '../features/EnrollmentDivision/EnrollmentValidation.page';
import { SubjectLoadingPage } from '../features/EnrollmentDivision/SubjectLoading.page';
import { MasterStudentListPage } from '../features/StudentRegistryDivision/MasterStudentList.page';
import { LeaveOfAbsencePage } from '../features/StudentRegistryDivision/LeaveOfAbsence.page';
import { StudentNumberAssignmentPage } from '../features/StudentRegistryDivision/StudentNumberAssignment.page';
import { OfficialGradesPage } from '../features/AcademicRecordsDivision/OfficialGrades.page';
import { AcademicStandingPage } from '../features/AcademicRecordsDivision/AcademicStanding.page';
import { AcademicRecordInitializationPage } from '../features/AcademicRecordsDivision/AcademicRecordInitialization.page';
import { SubjectCatalogPage } from '../features/CurriculumDivision/SubjectCatalog.page';
import { CourseOfferingsPage } from '../features/CurriculumDivision/CourseOfferings.page';
import { PrerequisitesPage } from '../features/CurriculumDivision/Prerequisites.page';

import { RegistrationWindowsPage } from '../features/EnrollmentDivision/RegistrationWindows.page';
import { RegistrationRequestsPage } from '../features/EnrollmentDivision/RegistrationRequests.page';
import { AddDropOversightPage } from '../features/EnrollmentDivision/AddDropOversight.page';
import { WaitlistsPage } from '../features/EnrollmentDivision/Waitlists.page';
import { RegistrationExceptionsPage } from '../features/EnrollmentDivision/RegistrationExceptions.page';

import { GraduationCandidatesPage } from '../features/GraduationDivision/GraduationCandidates.page';
import { LatinHonorsPage } from '../features/GraduationDivision/LatinHonors.page';
import { TranscriptRequestsPage } from '../features/CertificationDivision/TranscriptRequests.page';
import { DiplomaVerificationPage } from '../features/CertificationDivision/DiplomaVerification.page';
import { StudentInquiriesPage } from '../features/StudentServicesDivision/StudentInquiries.page';
import { DataCorrectionsPage } from '../features/StudentServicesDivision/DataCorrections.page';
import { CHEDCompliancePage } from '../features/AcademicComplianceDivision/CHEDCompliance.page';
import { ResidencyRulesPage } from '../features/AcademicComplianceDivision/ResidencyRules.page';
import { RecordAccessAuditPage } from '../features/RegistrarSecurity/RecordAccessAudit.page';
import { SensitiveVaultPage } from '../features/RegistrarSecurity/SensitiveVault.page';

const Stub = ({ title }: { title: string }) => (
    <div className="stub-page fade-in">
        <div className="stub-icon">🎓</div>
        <div className="stub-title">{title}</div>
        <div className="stub-subtitle">Registrar Enterprise Domain module pending UI/UX implementation.</div>
    </div>
);

export const Routing: React.FC = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '/registrar-portal/'}>
            <Routes>
                <Route element={<AuthGuard><AppShell /></AuthGuard>}>
                    <Route path="/dashboard" element={<RegistrarDashboardPage />} />
                    
                    {/* 1. Admissions Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_ADMISSIONS_OFFICER']} />}>
                        <Route path="/admissions" element={<AdmissionsQueuePage />} />
                        <Route path="/admissions/endorsements" element={<FacultyEndorsementsPage />} />
                        <Route path="/admissions/activation" element={<EnrollmentActivationPage />} />
                    </Route>
                    
                    {/* 2. Enrollment Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_ENROLLMENT_OFFICER']} />}>
                        <Route path="/enrollment" element={<EnrollmentValidationPage />} />
                        <Route path="/enrollment/subjects" element={<SubjectLoadingPage />} />
                        <Route path="/enrollment/windows" element={<RegistrationWindowsPage />} />
                        <Route path="/enrollment/requests" element={<RegistrationRequestsPage />} />
                        <Route path="/enrollment/add-drop" element={<AddDropOversightPage />} />
                        <Route path="/enrollment/waitlists" element={<WaitlistsPage />} />
                        <Route path="/enrollment/exceptions" element={<RegistrationExceptionsPage />} />
                    </Route>
                    
                    {/* 3. Student Registry Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_REGISTRY_OFFICER']} />}>
                        <Route path="/registry" element={<MasterStudentListPage />} />
                        <Route path="/registry/loa" element={<LeaveOfAbsencePage />} />
                        <Route path="/registry/assignment" element={<StudentNumberAssignmentPage />} />
                    </Route>
                    
                    {/* 4. Academic Records Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_RECORDS_OFFICER']} />}>
                        <Route path="/records/grades" element={<OfficialGradesPage />} />
                        <Route path="/records/standing" element={<AcademicStandingPage />} />
                        <Route path="/records/initialization" element={<AcademicRecordInitializationPage />} />
                    </Route>

                    {/* 5. Curriculum Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_CURRICULUM_OFFICER']} />}>
                        <Route path="/curriculum/catalog" element={<SubjectCatalogPage />} />
                        <Route path="/curriculum/offerings" element={<CourseOfferingsPage />} />
                        <Route path="/curriculum/prerequisites" element={<PrerequisitesPage />} />
                    </Route>

                    {/* 6. Graduation Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_GRADUATION_OFFICER']} />}>
                        <Route path="/graduation" element={<GraduationCandidatesPage />} />
                        <Route path="/graduation/honors" element={<LatinHonorsPage />} />
                    </Route>

                    {/* 7. Certification Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_CERTIFICATION_OFFICER']} />}>
                        <Route path="/certification/transcripts" element={<TranscriptRequestsPage />} />
                        <Route path="/certification/diploma" element={<DiplomaVerificationPage />} />
                    </Route>

                    {/* 8. Student Services Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_SERVICES_OFFICER']} />}>
                        <Route path="/services" element={<StudentInquiriesPage />} />
                        <Route path="/services/corrections" element={<DataCorrectionsPage />} />
                    </Route>

                    {/* 9. Academic Compliance Division */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_COMPLIANCE_OFFICER']} />}>
                        <Route path="/compliance/ched" element={<CHEDCompliancePage />} />
                        <Route path="/compliance/residency" element={<ResidencyRulesPage />} />
                    </Route>

                    {/* 10. Registrar Security */}
                    <Route element={<RegistrarGuard allowedRoles={['ROLE_SECURITY_OFFICER']} />}>
                        <Route path="/security/audit" element={<RecordAccessAuditPage />} />
                        <Route path="/security/documents" element={<SensitiveVaultPage />} />
                    </Route>

                    {/* New Divisions */}
                    <Route path="/scheduling" element={<AcademicSchedulingDivisionPage />} />
                    <Route path="/cross-enrollment" element={<CrossEnrollmentDivisionPage />} />
                    <Route path="/transfer" element={<TransferDivisionPage />} />
                    
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
