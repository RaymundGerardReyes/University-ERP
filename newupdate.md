On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   CodebaseInfrastructure.md
	new file:   University-ERP-Backend/ops/ops/db-migrations/Admissions/20260806014149_AddAdmissionsApprovalFields.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/ModuleRegistration/AcademicModulesRegistration.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Migrator/Program.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Infrastructure/AcademicSchedulingModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Application/Abstractions/IExamSessionRepository.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Application/Features/GetExamSessions/GetExamSessionsQuery.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Application/Features/GetExamSessions/GetExamSessionsQueryHandler.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Infrastructure/ExaminationModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Infrastructure/Repositories/ExamSessionRepository.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Presentation/Endpoints/SessionsEndpoint.cs
	new file:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/Events/Handlers/StudentEnrolledEventHandler.cs
	modified:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/LearningManagement.Application.csproj
	deleted:    University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/LearningManagementApplicationRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Infrastructure/LearningManagementModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Infrastructure/Persistence/LearningManagementDbContext.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/Features/EvaluateCandidate/EvaluateCandidateCommand.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/Features/LockSectionGrades/LockSectionGradesCommand.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/Features/ProcessTranscriptRequest/ProcessTranscriptRequestCommand.cs
	new file:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/Features/ValidateEnrollment/ValidateEnrollmentCommand.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Domain/Aggregates/CourseRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Domain/Aggregates/CourseSection.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Domain/Aggregates/GraduationClearance.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Domain/Aggregates/TranscriptRequest.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Infrastructure/Persistence/RegistrarDbContext.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Infrastructure/RegistrarModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Infrastructure/Persistence/StudentInformationDbContext.cs
	modified:   University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Presentation/Endpoints/FacultyStudentsEndpoint.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Abstractions/IStudentBillingRepository.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Events/Handlers/StudentEnrolledEventHandler.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/ApplyScholarship/ApplyScholarshipCommand.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/AssessTuition/AssessTuitionCommand.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/ClearBalance/ClearBalanceCommand.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/GetInvoices/GetInvoicesQuery.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/GetInvoices/GetInvoicesQueryHandler.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/ProcessPayment/ProcessPaymentCommand.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Finance.Application.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Domain/Aggregates/StudentBilling.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Infrastructure/Repositories/StudentBillingRepository.cs
	new file:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Presentation/Endpoints/InvoicesEndpoint.cs
	modified:   University-ERP-Backend/src/Modules/Platform/AnalyticsBI/AnalyticsBI.Presentation/Endpoints/AcademicAnalyticsEndpoint.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Application/Features/GetInbox/GetInboxQuery.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Application/Features/SendMessage/SendMessageCommand.cs
	modified:   University-ERP-Backend/src/Modules/Platform/IdentityAccess/IdentityAccess.Application/Features/AuthenticateUser/AuthenticateUserQueryHandler.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/ActivateEnrollment/ActivateEnrollmentCommand.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/ApproveApplication/ApproveApplicationCommand.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/CompleteInterview/CompleteInterviewCommand.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/EndorseApplication/EndorseApplicationCommand.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/EvaluateApplication/EvaluateApplicationCommand.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/GetApplicationStatus/GetApplicationStatusQuery.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/GetPendingApplications/GetPendingApplicationsQuery.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/RecommendAdmission/RecommendAdmissionCommand.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Application/Features/VerifyDocuments/VerifyDocumentsCommand.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Domain/Aggregates/AdmissionApplication.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Domain/Events/StudentEnrolledDomainEvent.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Infrastructure/Admissions.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Infrastructure/Persistence/AdmissionsDbContext.cs
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Infrastructure/Persistence/AdmissionsDbContextDesignTimeFactory.cs  C#
	new file:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Presentation/Endpoints/AdmissionsWorkflowEndpoint.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Presentation/Endpoints/GetApplicationStatusEndpoint.cs
	new file:   University-ERP-Backend/structure.md
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/AdmissionsProcessing/AdmissionsWorkspace.page.tsx
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/AdmissionsProcessing/components/ChairpersonEvaluationView.tsx
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/AdmissionsProcessing/components/RegistrarEnrollmentView.tsx
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/AdmissionsProcessing/components/SecretaryIntakeView.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/AuditCompliance/AuditCompliance.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/CanteenOrders/CanteenOrders.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/EmployeeManagement/EmployeeManagement.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/FleetManagement/FleetManagement.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.page.tsx
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/RegistrarWorkspace/RegistrarWorkspace.page.tsx
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/RegistrarWorkspace/components/GraduationClearanceView.tsx
	new file:   University-ERP-Frontend/apps/admin-portal/src/features/RegistrarWorkspace/components/TranscriptRequestsView.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/RoleAdministration/RoleAdministration.api.ts
	modified:   University-ERP-Frontend/apps/admin-portal/src/main.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/shell/AppShell.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/vite.config.ts
	new file:   University-ERP-Frontend/apps/admissions-portal/index.html
	new file:   University-ERP-Frontend/apps/admissions-portal/package.json
	new file:   University-ERP-Frontend/apps/admissions-portal/src/App.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Communication/ApplicantCommunication.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Dashboard/Dashboard.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Examination/EntranceExamination.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Fees/AdmissionFees.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Intake/ApplicationIntake.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Queue/AdmissionQueue.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Reports/AdmissionsReports.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Review/ApplicationReview.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/features/Verification/ApplicationVerification.page.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/index.css
	new file:   University-ERP-Frontend/apps/admissions-portal/src/main.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/shell/AppShell.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/src/shell/Routing.tsx
	new file:   University-ERP-Frontend/apps/admissions-portal/tsconfig.json
	new file:   University-ERP-Frontend/apps/admissions-portal/vite.config.ts
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicantJourney.hooks.ts
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationForm/ApplicationForm.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationStatus/ApplicationStatus.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.types.ts
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/DocumentUpload/DocumentUpload.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.page.tsx
	deleted:    University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentApprovals/EnrollmentApprovals.hooks.ts
	deleted:    University-ERP-Frontend/apps/applicant-portal/src/features/EnrollmentApprovals/EnrollmentApprovals.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/InterviewScheduling/InterviewScheduling.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/Offers/Offers.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/shell/AppShell.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/theme.css
	modified:   University-ERP-Frontend/apps/applicant-portal/vite.config.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Analytics/Analytics.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Assessments/Assessments.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/ChairpersonWorkspace/AcademicEvaluation.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/ChairpersonWorkspace/EvaluationQueue.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/ChairpersonWorkspace/Recommendation.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Communication/Communication.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Dashboard/Dashboard.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/DeanWorkspace/CollegeApproval.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/DeanWorkspace/Endorsement.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/DeanWorkspace/RecommendationQueue.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Documents/Documents.page.tsx
	deleted:    University-ERP-Frontend/apps/faculty-portal/src/features/EnrollmentApprovals/EnrollmentApprovals.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/FacultySecurity/ApplicantAccess.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/FacultySecurity/RecommendationAudit.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Research/Research.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Schedule/Schedule.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/SecretaryWorkspace/AdmissionQueue.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/SecretaryWorkspace/DocumentVerification.page.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/features/SecretaryWorkspace/InterviewScheduling.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Settings/Settings.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Students/Students.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Teaching/Teaching.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/main.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/shell/AppShell.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/shell/Routing.tsx
	new file:   University-ERP-Frontend/apps/faculty-portal/src/theme.css
	modified:   University-ERP-Frontend/apps/faculty-portal/vite.config.ts
	new file:   University-ERP-Frontend/apps/finance-console/src/features/Cashier/ClearanceApproval.page.tsx
	new file:   University-ERP-Frontend/apps/finance-console/src/features/Cashier/PaymentGateway.page.tsx
	new file:   University-ERP-Frontend/apps/finance-console/src/features/StudentBilling/ScholarshipGrants.page.tsx
	new file:   University-ERP-Frontend/apps/finance-console/src/features/StudentBilling/StatementOfAccount.page.tsx
	new file:   University-ERP-Frontend/apps/finance-console/src/features/TuitionAssessment/TuitionAssessment.page.tsx
	modified:   University-ERP-Frontend/apps/finance-console/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/finance-console/vite.config.ts
	modified:   University-ERP-Frontend/apps/governance-console/vite.config.ts
	new file:   University-ERP-Frontend/apps/identity-portal/src/features/Email/EmailProvisioning.page.tsx
	new file:   University-ERP-Frontend/apps/identity-portal/src/features/MFA/AccessRevocation.page.tsx
	new file:   University-ERP-Frontend/apps/identity-portal/src/features/MFA/MFASetup.page.tsx
	new file:   University-ERP-Frontend/apps/identity-portal/src/features/UniversityAccount/AccountProvisioning.page.tsx
	new file:   University-ERP-Frontend/apps/identity-portal/src/features/UniversityAccount/DirectorySearch.page.tsx
	modified:   University-ERP-Frontend/apps/identity-portal/src/features/UserLogin/UserLogin.page.tsx
	modified:   University-ERP-Frontend/apps/identity-portal/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/identity-portal/vite.config.ts
	modified:   University-ERP-Frontend/apps/library-portal/vite.config.ts
	new file:   University-ERP-Frontend/apps/lms-web/src/features/CourseAdministration/CoursePackaging.page.tsx
	new file:   University-ERP-Frontend/apps/lms-web/src/features/GradebookOrchestration/GradebookSync.page.tsx
	new file:   University-ERP-Frontend/apps/lms-web/src/features/OfflineSubmissionReview/SubmissionReview.page.tsx
	modified:   University-ERP-Frontend/apps/lms-web/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/lms-web/vite.config.ts
	modified:   University-ERP-Frontend/apps/platform-console/vite.config.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/index.html
	new file:   University-ERP-Frontend/apps/registrar-portal/package.json
	new file:   University-ERP-Frontend/apps/registrar-portal/src/App.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicComplianceDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicComplianceDivision/CHEDCompliance.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicComplianceDivision/Compliance.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicComplianceDivision/Compliance.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicComplianceDivision/Compliance.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicComplianceDivision/ResidencyRules.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicStanding.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision/OfficialGrades.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision/Records.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision/Records.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AcademicRecordsDivision/Records.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/Admissions/EnrollmentActivation.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AdmissionsDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AdmissionsDivision/Admissions.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AdmissionsDivision/Admissions.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AdmissionsDivision/Admissions.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AdmissionsDivision/AdmissionsQueue.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/AdmissionsDivision/FacultyEndorsements.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CertificationDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CertificationDivision/Certification.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CertificationDivision/Certification.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CertificationDivision/Certification.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CertificationDivision/DiplomaVerification.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CertificationDivision/TranscriptRequests.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision/CourseOfferings.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision/Curriculum.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision/Curriculum.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision/Curriculum.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/CurriculumDivision/SubjectCatalog.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision/Enrollment.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision/Enrollment.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision/Enrollment.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentValidation.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/EnrollmentDivision/SubjectLoading.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/GraduationDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/GraduationDivision/Graduation.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/GraduationDivision/Graduation.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/GraduationDivision/Graduation.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/GraduationDivision/GraduationCandidates.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/GraduationDivision/LatinHonors.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarSecurity/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarSecurity/RecordAccessAudit.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarSecurity/Security.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarSecurity/Security.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarSecurity/Security.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/RegistrarSecurity/SensitiveVault.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision/LeaveOfAbsence.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision/MasterStudentList.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision/Registry.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision/Registry.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentRegistryDivision/Registry.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentServicesDivision/.gitkeep
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentServicesDivision/DataCorrections.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentServicesDivision/Services.api.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentServicesDivision/Services.hooks.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentServicesDivision/Services.types.ts
	new file:   University-ERP-Frontend/apps/registrar-portal/src/features/StudentServicesDivision/StudentInquiries.page.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/main.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/shell/AppShell.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/src/shell/Routing.tsx
	new file:   University-ERP-Frontend/apps/registrar-portal/tsconfig.json
	new file:   University-ERP-Frontend/apps/registrar-portal/vite.config.ts
	new file:   University-ERP-Frontend/apps/security-portal/index.html
	new file:   University-ERP-Frontend/apps/security-portal/package.json
	new file:   University-ERP-Frontend/apps/security-portal/src/App.tsx
	new file:   University-ERP-Frontend/apps/security-portal/src/main.tsx
	new file:   University-ERP-Frontend/apps/security-portal/src/shell/AppShell.tsx
	new file:   University-ERP-Frontend/apps/security-portal/src/shell/Routing.tsx
	new file:   University-ERP-Frontend/apps/security-portal/tsconfig.json
	new file:   University-ERP-Frontend/apps/security-portal/vite.config.ts
	new file:   University-ERP-Frontend/apps/structuring.md
	modified:   University-ERP-Frontend/apps/student-portal/src/features/AcademicRecord/AcademicRecord.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/features/Clearance/Clearance.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/features/Enrollment/Enrollment.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/features/LearningManagement/LearningManagement.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/features/MyEnrollments/MyEnrollments.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/features/Timetable/Timetable.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/main.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/shell/AppShell.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/student-portal/vite.config.ts
	modified:   University-ERP-Frontend/bootstrap.sh
	modified:   University-ERP-Frontend/libs/api-clients/academic/analyticsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/assessmentApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/communicationApi.ts
	new file:   University-ERP-Frontend/libs/api-clients/academic/registrarApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/administration/financeApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/index.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/admissionsApi.ts
	modified:   University-ERP-Frontend/libs/auth-sdk/index.ts
	modified:   University-ERP-Frontend/libs/auth-sdk/react/AuthContext.ts
	modified:   University-ERP-Frontend/libs/auth-sdk/react/AuthProvider.tsx
	new file:   University-ERP-Frontend/libs/auth-sdk/src/guards/FacultyGuard.tsx
	new file:   University-ERP-Frontend/libs/auth-sdk/src/guards/FinanceGuard.tsx
	new file:   University-ERP-Frontend/libs/auth-sdk/src/guards/IdentityGuard.tsx
	new file:   University-ERP-Frontend/libs/auth-sdk/src/guards/LMSGuard.tsx
	new file:   University-ERP-Frontend/libs/auth-sdk/src/guards/RegistrarGuard.tsx
	modified:   University-ERP-Frontend/libs/shell-kit/AuthGuard.tsx
	modified:   University-ERP-Frontend/libs/ui-kit/src/components/Badge.tsx
	modified:   University-ERP-Frontend/libs/ui-kit/src/components/Button.tsx
	new file:   University-ERP-Frontend/libs/ui-kit/src/components/FormInput.tsx
	new file:   University-ERP-Frontend/libs/ui-kit/src/components/Modal.tsx
	new file:   University-ERP-Frontend/libs/ui-kit/src/components/Table.tsx
	modified:   University-ERP-Frontend/libs/ui-kit/src/index.ts
	new file:   University-ERP-Frontend/libs/ui-kit/src/styles.css
	modified:   University-ERP-Frontend/libs/vite-config/index.ts
	modified:   University-ERP-Frontend/libs/vite-config/package.json
	new file:   University-ERP-Frontend/libs/workflow-sdk/package.json
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/AcademicRecordWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/AdmissionWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/AuditWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/CertificationWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/EnrollmentWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/FinanceWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/GraduationWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/IdentityWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/LMSWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/LibraryWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/NotificationWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/StudentLifecycleWorkflow.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/src/index.ts
	new file:   University-ERP-Frontend/libs/workflow-sdk/tsconfig.json
	modified:   University-ERP-Frontend/package-lock.json
	modified:   University-ERP-Frontend/package.json
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/AcademicAudit/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/CHEDCompliance/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/EnrollmentRules/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/GraduationRules/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/MaximumLoad/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/PolicyValidation/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/PrerequisiteValidation/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicComplianceDivision/ResidencyRules/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicDeficiencies/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicEvaluation/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicHistory/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicStanding/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/AcademicVerification/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/GradeCorrections/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/Grades/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/ScholasticRecords/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/Transcript/.gitkeep
	new file:   apps/registrar-portal/src/features/AcademicRecordsDivision/TrueCopyOfGrades/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/AdmissionDecision/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/AdmissionOffers/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/AdmissionQueue/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/AdmissionReports/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/AdmissionReview/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/DeferredApplications/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/EnrollmentActivation/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/FacultyEndorsements/.gitkeep
	new file:   apps/registrar-portal/src/features/AdmissionsDivision/RejectedApplications/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/CertificateRequests/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/DigitalCertificates/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/DiplomaVerification/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/DocumentAuthentication/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/EnrollmentCertificates/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/GovernmentVerification/.gitkeep
	new file:   apps/registrar-portal/src/features/CertificationDivision/TranscriptRequests/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/AcademicCalendar/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/CourseOfferings/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/Curriculum/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/FacultyAssignments/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/Prerequisites/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/Programs/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/Schedules/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/SectionManagement/.gitkeep
	new file:   apps/registrar-portal/src/features/CurriculumDivision/SubjectCatalog/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/ChangeOfProgram/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/ChangeOfSection/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/CrossEnrollment/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentAdjustment/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentDashboard/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentHistory/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentQueue/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/EnrollmentValidation/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/LateEnrollment/.gitkeep
	new file:   apps/registrar-portal/src/features/EnrollmentDivision/SubjectEnrollment/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/Commencement/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/DiplomaPrinting/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/GraduationCandidates/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/GraduationClearance/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/GraduationEvaluation/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/GraduationReports/.gitkeep
	new file:   apps/registrar-portal/src/features/GraduationDivision/LatinHonors/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/AuditTrail/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/Dashboard/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/DataRetention/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/DigitalSignatures/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/DocumentVerification/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/PermissionManagement/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/PrivacyCompliance/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/RecordRecovery/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/SensitiveDocuments/.gitkeep
	new file:   apps/registrar-portal/src/features/RegistrarSecurity/StudentRecordAccess/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/Alumni/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/LeaveOfAbsence/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/MasterStudents/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/Readmission/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/ReturningStudents/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/StudentClassification/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/StudentNumber/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/StudentStatus/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/TransferStudents/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentRegistryDivision/UniversityID/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/BirthdateCorrection/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/CorrectionRequests/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/DocumentRelease/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/NameCorrection/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/Notifications/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/RequestTracking/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/StudentInquiry/.gitkeep
	new file:   apps/registrar-portal/src/features/StudentServicesDivision/StudentRequests/.gitkeep
	new file:   logs.md
	new file:   release_all.sh
	new file:   structure.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   newupdate.md

