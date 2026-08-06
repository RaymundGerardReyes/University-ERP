.
|-- Directory.Build.props
|-- Rebuild_Dependencies.ps1
|-- domain
|   |-- adr
|   |-- model
|   `-- runbooks
|       |-- data-recovery
|       |-- incident-response
|       `-- module-onboarding
|-- ops
|   |-- cloudflare
|   |   |-- dns
|   |   |   `-- university-erp-zone.tf
|   |   |-- page-rules
|   |   |   |-- bypass-cache-api.json
|   |   |   `-- cache-static-assets.json
|   |   |-- tunnel
|   |   |   `-- config.yml
|   |   |-- waf-rules
|   |   |   |-- bot-fight-mode.json
|   |   |   |-- owasp-managed-ruleset.json
|   |   |   `-- rate-limiting.json
|   |   `-- workers
|   |       `-- security-headers-worker.js
|   |-- db-migrations
|   |   `-- StudentInformation
|   |       |-- 20260731000000_Initial_StudentInformation.Designer.cs
|   |       |-- 20260731000000_Initial_StudentInformation.cs
|   |       `-- StudentInformationDbContextModelSnapshot.cs
|   |-- nginx
|   |   |-- nginx.conf
|   |   |-- sites-available
|   |   |   |-- admin.university.edu.conf
|   |   |   |-- api.university.edu.conf
|   |   |   |-- applicant.university.edu.conf
|   |   |   |-- auth.university.edu.conf
|   |   |   |-- faculty.university.edu.conf
|   |   |   |-- finance.university.edu.conf
|   |   |   |-- governance.university.edu.conf
|   |   |   |-- library.university.edu.conf
|   |   |   |-- lms.university.edu.conf
|   |   |   |-- localhost-identity.conf
|   |   |   |-- localhost.conf
|   |   |   |-- platform.university.edu.conf
|   |   |   |-- portal.university.edu.conf
|   |   |   `-- student.university.edu.conf
|   |   |-- sites-enabled
|   |   |-- snippets
|   |   |   |-- proxy-common.conf
|   |   |   |-- rate-limit.conf
|   |   |   `-- security-headers.conf
|   |   `-- ssl
|   |-- observability
|   |   |-- alert-rules
|   |   |   |-- finance-invoice-failure-rate.yaml
|   |   |   |-- grievance-sla-breach.yaml
|   |   |   `-- identityaccess-auth-latency.yaml
|   |   `-- dashboards
|   |       |-- academic-cluster-dashboard.json
|   |       |-- finance-cluster-dashboard.json
|   |       `-- governance-cluster-dashboard.json
|   |-- ops
|   |   `-- db-migrations
|   |       `-- Admissions
|   |           `-- 20260806014149_AddAdmissionsApprovalFields.cs
|   `-- pipelines
|       |-- Audit_Dependencies.ps1
|       |-- app-build
|       |   |-- avalonia-client.pipeline.yaml
|       |   `-- react-apps.pipeline.yaml
|       |-- app-release
|       |   `-- selective-release.pipeline.yaml
|       |-- app-test
|       |   `-- per-app-test.pipeline.yaml
|       |-- edge-deploy
|       |   `-- cloudflare-nginx-sync.pipeline.yaml
|       |-- module-build
|       |   |-- academic-modules.pipeline.yaml
|       |   |-- administration-modules.pipeline.yaml
|       |   `-- platform-modules.pipeline.yaml
|       |-- module-release
|       |   `-- selective-release.pipeline.yaml
|       `-- module-test
|           `-- per-module-test.pipeline.yaml
|-- src
|   |-- Bootstrap
|   |   |-- UniversityErp.Api
|   |   |   |-- Dockerfile
|   |   |   |-- Middleware
|   |   |   |   |-- AuthorizationDelegationMiddleware.cs
|   |   |   |   |-- CorrelationIdMiddleware.cs
|   |   |   |   `-- GlobalExceptionMiddleware.cs
|   |   |   |-- ModuleRegistration
|   |   |   |   |-- AcademicModulesRegistration.cs
|   |   |   |   |-- AdministrationModulesRegistration.cs
|   |   |   |   |-- GovernanceModulesRegistration.cs
|   |   |   |   |-- PlatformModulesRegistration.cs
|   |   |   |   `-- StudentLifecycleModulesRegistration.cs
|   |   |   |-- Program.cs
|   |   |   |-- Properties
|   |   |   |   `-- launchSettings.json
|   |   |   |-- UniversityErp.Api.csproj
|   |   |   |-- UniversityErp.Api.http
|   |   |   |-- appsettings
|   |   |   |   `-- appsettings.Production.json
|   |   |   `-- appsettings.json
|   |   |-- UniversityErp.Migrator
|   |   |   |-- Dockerfile
|   |   |   |-- MigrationRunners
|   |   |   |   `-- PerModuleMigrationRunner.cs
|   |   |   |-- Program.cs
|   |   |   `-- UniversityErp.Migrator.csproj
|   |   `-- UniversityErp.Worker
|   |       |-- Consumers
|   |       |   |-- AcademicEventConsumers.cs
|   |       |   |-- FinanceEventConsumers.cs
|   |       |   `-- GovernanceEventConsumers.cs
|   |       |-- Dockerfile
|   |       |-- Program.cs
|   |       |-- Properties
|   |       |   `-- launchSettings.json
|   |       |-- ScheduledJobs
|   |       |   |-- PayrollMonthlyBatchJob.cs
|   |       |   |-- SlaBreachScannerJob.cs
|   |       |   |-- TermStartBatchInvoicingJob.cs
|   |       |   `-- WaitlistPromotionJob.cs
|   |       |-- UniversityErp.Worker.csproj
|   |       |-- Worker.cs
|   |       `-- appsettings.json
|   |-- Contracts
|   |   |-- IntegrationEvents
|   |   |   |-- Academic
|   |   |   |   |-- ExamResultPublishedIntegrationEvent.cs
|   |   |   |   `-- StudentEnrolledIntegrationEvent.cs
|   |   |   |-- Administration
|   |   |   |   |-- InvoiceIssuedIntegrationEvent.cs
|   |   |   |   `-- PayrollCalculatedIntegrationEvent.cs
|   |   |   |-- Governance
|   |   |   |   |-- GrievanceSubmittedIntegrationEvent.cs
|   |   |   |   `-- SupportTicketRequestedIntegrationEvent.cs
|   |   |   |-- Platform
|   |   |   |   `-- AccountProvisionedIntegrationEvent.cs
|   |   |   `-- StudentLifecycle
|   |   |       |-- ApplicantAcceptedIntegrationEvent.cs
|   |   |       `-- RoomAllocatedIntegrationEvent.cs
|   |   |-- PublicApiContracts
|   |   |   |-- Academic
|   |   |   |   |-- Examination.ResultQueryApi.cs
|   |   |   |   `-- Registrar.CurriculumApi.cs
|   |   |   |-- Administration
|   |   |   |   `-- Finance.BillingApi.cs
|   |   |   |-- Governance
|   |   |   |   `-- Facilities.SpaceAvailabilityApi.cs
|   |   |   |-- Platform
|   |   |   |   `-- IdentityAccess.AuthorizationApi.cs
|   |   |   `-- StudentLifecycle
|   |   |       `-- StudentInformation.StudentReadModel.cs
|   |   `-- UniversityErp.Contracts.csproj
|   |-- Modules
|   |   |-- Academic
|   |   |   |-- AcademicScheduling
|   |   |   |   |-- AcademicScheduling.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- IAcademicSchedulingRepository.cs
|   |   |   |   |   |   `-- IClassSessionRepository.cs
|   |   |   |   |   |-- AcademicScheduling.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- AllocateRoom
|   |   |   |   |   |   |   `-- AllocateRoomCommand.cs
|   |   |   |   |   |   |-- GetFacultyCourses
|   |   |   |   |   |   |   `-- GetFacultyCoursesQuery.cs
|   |   |   |   |   |   |-- GetStudentTimetable
|   |   |   |   |   |   |   `-- GetStudentTimetableQuery.cs
|   |   |   |   |   |   `-- SubmitAttendance
|   |   |   |   |   |       `-- SubmitAttendanceCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- AcademicScheduling.Contracts
|   |   |   |   |   `-- AcademicScheduling.Contracts.csproj
|   |   |   |   |-- AcademicScheduling.Domain
|   |   |   |   |   |-- AcademicScheduling.Domain.csproj
|   |   |   |   |   `-- Aggregates
|   |   |   |   |       |-- AttendanceRecord.cs
|   |   |   |   |       |-- ClassSession.cs
|   |   |   |   |       |-- CourseSection.cs
|   |   |   |   |       `-- RoomAllocation.cs
|   |   |   |   |-- AcademicScheduling.Infrastructure
|   |   |   |   |   |-- AcademicScheduling.Infrastructure.csproj
|   |   |   |   |   |-- AcademicSchedulingModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- AcademicSchedulingDbContext.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       |-- AcademicSchedulingRepository.cs
|   |   |   |   |       `-- ClassSessionRepository.cs
|   |   |   |   `-- AcademicScheduling.Presentation
|   |   |   |       |-- AcademicScheduling.Presentation.csproj
|   |   |   |       `-- Endpoints
|   |   |   |           |-- AllocateRoomEndpoint.cs
|   |   |   |           |-- GetStudentTimetableEndpoint.cs
|   |   |   |           `-- TeachingEndpoint.cs
|   |   |   |-- Examination
|   |   |   |   |-- Examination.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- IExamSessionRepository.cs
|   |   |   |   |   |   `-- IExaminationRepository.cs
|   |   |   |   |   |-- Examination.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- CreateQuestion
|   |   |   |   |   |   |   `-- CreateQuestionCommand.cs
|   |   |   |   |   |   |-- GetExamSessions
|   |   |   |   |   |   |   |-- GetExamSessionsQuery.cs
|   |   |   |   |   |   |   `-- GetExamSessionsQueryHandler.cs
|   |   |   |   |   |   |-- GetGradebook
|   |   |   |   |   |   |   `-- GetGradebookQuery.cs
|   |   |   |   |   |   |-- LogProctoringIncident
|   |   |   |   |   |   |   `-- LogProctoringIncidentCommand.cs
|   |   |   |   |   |   |-- PublishExamResult
|   |   |   |   |   |   |   `-- PublishExamResultCommand.cs
|   |   |   |   |   |   `-- SubmitGrades
|   |   |   |   |   |       `-- SubmitGradesCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Examination.Contracts
|   |   |   |   |   `-- Examination.Contracts.csproj
|   |   |   |   |-- Examination.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |-- ExamResult.cs
|   |   |   |   |   |   |-- ExamSession.cs
|   |   |   |   |   |   |-- GradebookRecord.cs
|   |   |   |   |   |   `-- QuestionItem.cs
|   |   |   |   |   `-- Examination.Domain.csproj
|   |   |   |   |-- Examination.Infrastructure
|   |   |   |   |   |-- Examination.Infrastructure.csproj
|   |   |   |   |   |-- ExaminationModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- ExaminationDbContext.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       |-- ExamSessionRepository.cs
|   |   |   |   |       `-- ExaminationRepository.cs
|   |   |   |   `-- Examination.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   |-- CreateQuestionEndpoint.cs
|   |   |   |       |   |-- GradebookEndpoint.cs
|   |   |   |       |   |-- LogProctoringIncidentEndpoint.cs
|   |   |   |       |   |-- PublishExamResultEndpoint.cs
|   |   |   |       |   `-- SessionsEndpoint.cs
|   |   |   |       `-- Examination.Presentation.csproj
|   |   |   |-- LearningManagement
|   |   |   |   |-- LearningManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- ILearningManagementRepository.cs
|   |   |   |   |   |   |-- IOfflineSubmissionRepository.cs
|   |   |   |   |   |   `-- IScheduleTokenVerifier.cs
|   |   |   |   |   |-- Events
|   |   |   |   |   |   `-- Handlers
|   |   |   |   |   |       `-- StudentEnrolledEventHandler.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- Analytics
|   |   |   |   |   |   |   `-- GetClassPerformanceQuery.cs
|   |   |   |   |   |   |-- Assessments
|   |   |   |   |   |   |   `-- GetAssessmentsQuery.cs
|   |   |   |   |   |   |-- GetOfflineModulePackage
|   |   |   |   |   |   |   `-- GetOfflineModulePackageQuery.cs
|   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmission
|   |   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmissionCommand.cs
|   |   |   |   |   |   |   `-- ProcessOfflineAssessmentSubmissionCommandHandler.cs
|   |   |   |   |   |   `-- ProcessOfflineAssignmentSubmission
|   |   |   |   |   |       |-- ProcessOfflineAssignmentSubmissionCommand.cs
|   |   |   |   |   |       `-- ProcessOfflineAssignmentSubmissionCommandHandler.cs
|   |   |   |   |   |-- LearningManagement.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- LearningManagement.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- OfflineAssessmentSubmittedIntegrationEvent.cs
|   |   |   |   |   |   `-- OfflineAssignmentSubmittedIntegrationEvent.cs
|   |   |   |   |   |-- LearningManagement.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |       `-- ILearningManagementApi.cs
|   |   |   |   |-- LearningManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |-- Assessment.cs
|   |   |   |   |   |   `-- ClassPerformance.cs
|   |   |   |   |   `-- LearningManagement.Domain.csproj
|   |   |   |   |-- LearningManagement.Infrastructure
|   |   |   |   |   |-- LearningManagement.Infrastructure.csproj
|   |   |   |   |   |-- LearningManagementModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- LearningManagementDbContext.cs
|   |   |   |   |   |-- Repositories
|   |   |   |   |   |   |-- LearningManagementRepository.cs
|   |   |   |   |   |   `-- OfflineSubmissionRepository.cs
|   |   |   |   |   `-- Security
|   |   |   |   |       `-- ScheduleTokenVerifier.cs
|   |   |   |   `-- LearningManagement.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   |-- AnalyticsEndpoint.cs
|   |   |   |       |   |-- AssessmentsEndpoint.cs
|   |   |   |       |   |-- DownloadModulePackageEndpoint.cs
|   |   |   |       |   |-- SyncOfflineAssessmentsEndpoint.cs
|   |   |   |       |   `-- SyncOfflineAssignmentsEndpoint.cs
|   |   |   |       `-- LearningManagement.Presentation.csproj
|   |   |   |-- Registrar
|   |   |   |   |-- Registrar.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IRegistrarRepository.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- EvaluateCandidate
|   |   |   |   |   |   |   `-- EvaluateCandidateCommand.cs
|   |   |   |   |   |   |-- EvaluateGraduationClearance
|   |   |   |   |   |   |   `-- EvaluateGraduationClearanceCommand.cs
|   |   |   |   |   |   |-- LockSectionGrades
|   |   |   |   |   |   |   `-- LockSectionGradesCommand.cs
|   |   |   |   |   |   |-- ProcessTranscriptRequest
|   |   |   |   |   |   |   `-- ProcessTranscriptRequestCommand.cs
|   |   |   |   |   |   |-- RegisterCourse
|   |   |   |   |   |   |   `-- RegisterCourseCommand.cs
|   |   |   |   |   |   |-- RequestTranscript
|   |   |   |   |   |   |   `-- RequestTranscriptCommand.cs
|   |   |   |   |   |   |-- Schedule
|   |   |   |   |   |   |   `-- GetFacultyScheduleQuery.cs
|   |   |   |   |   |   `-- ValidateEnrollment
|   |   |   |   |   |       `-- ValidateEnrollmentCommand.cs
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- Registrar.Application.csproj
|   |   |   |   |-- Registrar.Contracts
|   |   |   |   |   `-- Registrar.Contracts.csproj
|   |   |   |   |-- Registrar.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |-- CourseRegistration.cs
|   |   |   |   |   |   |-- CourseSection.cs
|   |   |   |   |   |   |-- GraduationClearance.cs
|   |   |   |   |   |   `-- TranscriptRequest.cs
|   |   |   |   |   `-- Registrar.Domain.csproj
|   |   |   |   |-- Registrar.Infrastructure
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- RegistrarDbContext.cs
|   |   |   |   |   |-- Registrar.Infrastructure.csproj
|   |   |   |   |   |-- RegistrarModuleRegistration.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       `-- RegistrarRepository.cs
|   |   |   |   `-- Registrar.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   |-- EvaluateGraduationClearanceEndpoint.cs
|   |   |   |       |   |-- RegisterCourseEndpoint.cs
|   |   |   |       |   |-- RequestTranscriptEndpoint.cs
|   |   |   |       |   `-- ScheduleEndpoint.cs
|   |   |   |       `-- Registrar.Presentation.csproj
|   |   |   `-- StudentInformation
|   |   |       |-- StudentInformation.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |   `-- IStudentRepository.cs
|   |   |       |   |-- Features
|   |   |       |   |   |-- EnrollStudent
|   |   |       |   |   |   |-- EnrollStudentCommand.cs
|   |   |       |   |   |   |-- EnrollStudentCommandHandler.cs
|   |   |       |   |   |   `-- EnrollStudentCommandValidator.cs
|   |   |       |   |   |-- GetAdvisees
|   |   |       |   |   |   |-- GetAdviseesQuery.cs
|   |   |       |   |   |   `-- GetAdviseesQueryHandler.cs
|   |   |       |   |   |-- GetMyStudents
|   |   |       |   |   |   `-- GetMyStudentsQuery.cs
|   |   |       |   |   |-- GetStudentInformation
|   |   |       |   |   |   `-- GetStudentInformationQuery.cs
|   |   |       |   |   `-- UpdateContactInfo
|   |   |       |   |       `-- UpdateContactInfoCommand.cs
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- StudentInformation.Application.csproj
|   |   |       |-- StudentInformation.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |   |-- FacultyAdvisee.cs
|   |   |       |   |   `-- Student.cs
|   |   |       |   |-- DomainEvents
|   |   |       |   |   `-- StudentEnrolledDomainEvent.cs
|   |   |       |   |-- StudentInformation.Domain.csproj
|   |   |       |   `-- ValueObjects
|   |   |       |       |-- EnrollmentStatus.cs
|   |   |       |       `-- StudentId.cs
|   |   |       |-- StudentInformation.Infrastructure
|   |   |       |   |-- Persistence
|   |   |       |   |   |-- StudentConfiguration.cs
|   |   |       |   |   `-- StudentInformationDbContext.cs
|   |   |       |   |-- Repositories
|   |   |       |   |   `-- StudentRepository.cs
|   |   |       |   |-- StudentInformation.Infrastructure.csproj
|   |   |       |   `-- StudentInformationModuleRegistration.cs
|   |   |       `-- StudentInformation.Presentation
|   |   |           |-- Contracts
|   |   |           |   `-- EnrollStudentRequest.cs
|   |   |           |-- Controllers
|   |   |           |   `-- StudentsController.cs
|   |   |           |-- Endpoints
|   |   |           |   |-- AdvisingEndpoint.cs
|   |   |           |   |-- FacultyStudentsEndpoint.cs
|   |   |           |   `-- GetStudentInformationEndpoints.cs
|   |   |           `-- StudentInformation.Presentation.csproj
|   |   |-- Administration
|   |   |   |-- AssetManagement
|   |   |   |   |-- AssetManagement.Application
|   |   |   |   |   |-- AssetManagement.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- RegisterAsset
|   |   |   |   |   |       `-- RegisterAssetCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- AssetManagement.Contracts
|   |   |   |   |   `-- AssetManagement.Contracts.csproj
|   |   |   |   |-- AssetManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- Asset.cs
|   |   |   |   |   `-- AssetManagement.Domain.csproj
|   |   |   |   |-- AssetManagement.Infrastructure
|   |   |   |   |   `-- AssetManagement.Infrastructure.csproj
|   |   |   |   `-- AssetManagement.Presentation
|   |   |   |       |-- AssetManagement.Presentation.csproj
|   |   |   |       `-- Endpoints
|   |   |   |           `-- RegisterAssetEndpoint.cs
|   |   |   |-- Facilities
|   |   |   |   |-- Facilities.Application
|   |   |   |   |   |-- Facilities.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- BookFacility
|   |   |   |   |   |       `-- BookFacilityCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Facilities.Contracts
|   |   |   |   |   `-- Facilities.Contracts.csproj
|   |   |   |   |-- Facilities.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- FacilityReservation.cs
|   |   |   |   |   `-- Facilities.Domain.csproj
|   |   |   |   |-- Facilities.Infrastructure
|   |   |   |   |   `-- Facilities.Infrastructure.csproj
|   |   |   |   `-- Facilities.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- BookFacilityEndpoint.cs
|   |   |   |       `-- Facilities.Presentation.csproj
|   |   |   |-- Finance
|   |   |   |   |-- Finance.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IStudentBillingRepository.cs
|   |   |   |   |   |-- Events
|   |   |   |   |   |   `-- Handlers
|   |   |   |   |   |       `-- StudentEnrolledEventHandler.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- ApplyScholarship
|   |   |   |   |   |   |   `-- ApplyScholarshipCommand.cs
|   |   |   |   |   |   |-- AssessTuition
|   |   |   |   |   |   |   `-- AssessTuitionCommand.cs
|   |   |   |   |   |   |-- ClearBalance
|   |   |   |   |   |   |   `-- ClearBalanceCommand.cs
|   |   |   |   |   |   |-- GetInvoices
|   |   |   |   |   |   |   |-- GetInvoicesQuery.cs
|   |   |   |   |   |   |   `-- GetInvoicesQueryHandler.cs
|   |   |   |   |   |   |-- IssueInvoice
|   |   |   |   |   |   |   `-- IssueInvoiceCommand.cs
|   |   |   |   |   |   `-- ProcessPayment
|   |   |   |   |   |       `-- ProcessPaymentCommand.cs
|   |   |   |   |   |-- Finance.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Finance.Contracts
|   |   |   |   |   `-- Finance.Contracts.csproj
|   |   |   |   |-- Finance.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- StudentBilling.cs
|   |   |   |   |   `-- Finance.Domain.csproj
|   |   |   |   |-- Finance.Infrastructure
|   |   |   |   |   |-- Finance.Infrastructure.csproj
|   |   |   |   |   |-- FinanceModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- FinanceDbContext.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       `-- StudentBillingRepository.cs
|   |   |   |   `-- Finance.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   |-- InvoicesEndpoint.cs
|   |   |   |       |   `-- IssueInvoiceEndpoint.cs
|   |   |   |       `-- Finance.Presentation.csproj
|   |   |   |-- HumanResources
|   |   |   |   |-- HumanResources.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IEmployeeRepository.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- OnboardEmployee
|   |   |   |   |   |       `-- OnboardEmployeeCommand.cs
|   |   |   |   |   |-- HumanResources.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- HumanResources.Contracts
|   |   |   |   |   `-- HumanResources.Contracts.csproj
|   |   |   |   |-- HumanResources.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- Employee.cs
|   |   |   |   |   `-- HumanResources.Domain.csproj
|   |   |   |   |-- HumanResources.Infrastructure
|   |   |   |   |   |-- HumanResources.Infrastructure.csproj
|   |   |   |   |   |-- HumanResourcesModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- HumanResourcesDbContext.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       `-- EmployeeRepository.cs
|   |   |   |   `-- HumanResources.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- OnboardEmployeeEndpoint.cs
|   |   |   |       `-- HumanResources.Presentation.csproj
|   |   |   |-- Inventory
|   |   |   |   |-- Inventory.Application
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- AdjustStock
|   |   |   |   |   |       `-- AdjustStockCommand.cs
|   |   |   |   |   |-- Inventory.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Inventory.Contracts
|   |   |   |   |   `-- Inventory.Contracts.csproj
|   |   |   |   |-- Inventory.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- StockItem.cs
|   |   |   |   |   `-- Inventory.Domain.csproj
|   |   |   |   |-- Inventory.Infrastructure
|   |   |   |   |   `-- Inventory.Infrastructure.csproj
|   |   |   |   `-- Inventory.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- AdjustStockEndpoint.cs
|   |   |   |       `-- Inventory.Presentation.csproj
|   |   |   |-- Library
|   |   |   |   |-- Library.Application
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- CheckoutItem
|   |   |   |   |   |       `-- CheckoutItemCommand.cs
|   |   |   |   |   |-- Library.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Library.Contracts
|   |   |   |   |   `-- Library.Contracts.csproj
|   |   |   |   |-- Library.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- CatalogItem.cs
|   |   |   |   |   `-- Library.Domain.csproj
|   |   |   |   |-- Library.Infrastructure
|   |   |   |   |   `-- Library.Infrastructure.csproj
|   |   |   |   `-- Library.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- CheckoutItemEndpoint.cs
|   |   |   |       `-- Library.Presentation.csproj
|   |   |   |-- MessCanteen
|   |   |   |   |-- MessCanteen.Application
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- ReserveMeal
|   |   |   |   |   |       `-- ReserveMealCommand.cs
|   |   |   |   |   |-- MessCanteen.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- MessCanteen.Contracts
|   |   |   |   |   `-- MessCanteen.Contracts.csproj
|   |   |   |   |-- MessCanteen.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- MealPlan.cs
|   |   |   |   |   `-- MessCanteen.Domain.csproj
|   |   |   |   |-- MessCanteen.Infrastructure
|   |   |   |   |   `-- MessCanteen.Infrastructure.csproj
|   |   |   |   `-- MessCanteen.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- ReserveMealEndpoint.cs
|   |   |   |       `-- MessCanteen.Presentation.csproj
|   |   |   |-- Payroll
|   |   |   |   |-- Payroll.Application
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- GeneratePayslip
|   |   |   |   |   |       `-- GeneratePayslipCommand.cs
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- Payroll.Application.csproj
|   |   |   |   |-- Payroll.Contracts
|   |   |   |   |   `-- Payroll.Contracts.csproj
|   |   |   |   |-- Payroll.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- Payslip.cs
|   |   |   |   |   `-- Payroll.Domain.csproj
|   |   |   |   |-- Payroll.Infrastructure
|   |   |   |   |   `-- Payroll.Infrastructure.csproj
|   |   |   |   `-- Payroll.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- GeneratePayslipEndpoint.cs
|   |   |   |       `-- Payroll.Presentation.csproj
|   |   |   |-- Procurement
|   |   |   |   |-- Procurement.Application
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- CreatePurchaseOrder
|   |   |   |   |   |       `-- CreatePurchaseOrderCommand.cs
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- Procurement.Application.csproj
|   |   |   |   |-- Procurement.Contracts
|   |   |   |   |   `-- Procurement.Contracts.csproj
|   |   |   |   |-- Procurement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- PurchaseOrder.cs
|   |   |   |   |   `-- Procurement.Domain.csproj
|   |   |   |   |-- Procurement.Infrastructure
|   |   |   |   |   `-- Procurement.Infrastructure.csproj
|   |   |   |   `-- Procurement.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- CreatePurchaseOrderEndpoint.cs
|   |   |   |       `-- Procurement.Presentation.csproj
|   |   |   `-- Transport
|   |   |       |-- Transport.Application
|   |   |       |   |-- Features
|   |   |       |   |   `-- AssignRoute
|   |   |       |   |       `-- AssignRouteCommand.cs
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- Transport.Application.csproj
|   |   |       |-- Transport.Contracts
|   |   |       |   `-- Transport.Contracts.csproj
|   |   |       |-- Transport.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |   `-- BusRoute.cs
|   |   |       |   `-- Transport.Domain.csproj
|   |   |       |-- Transport.Infrastructure
|   |   |       |   `-- Transport.Infrastructure.csproj
|   |   |       `-- Transport.Presentation
|   |   |           |-- Endpoints
|   |   |           |   `-- AssignRouteEndpoint.cs
|   |   |           `-- Transport.Presentation.csproj
|   |   |-- Governance
|   |   |   |-- EventManagement
|   |   |   |   |-- EventManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IEventRepository.cs
|   |   |   |   |   |-- EventManagement.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- PlanEvent
|   |   |   |   |   |       `-- PlanEventCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- EventManagement.Contracts
|   |   |   |   |   `-- EventManagement.Contracts.csproj
|   |   |   |   |-- EventManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- CampusEvent.cs
|   |   |   |   |   `-- EventManagement.Domain.csproj
|   |   |   |   |-- EventManagement.Infrastructure
|   |   |   |   |   `-- EventManagement.Infrastructure.csproj
|   |   |   |   `-- EventManagement.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- PlanEventEndpoint.cs
|   |   |   |       `-- EventManagement.Presentation.csproj
|   |   |   |-- GrievanceManagement
|   |   |   |   |-- GrievanceManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IGrievanceRepository.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- SubmitComplaint
|   |   |   |   |   |       `-- SubmitComplaintCommand.cs
|   |   |   |   |   |-- GrievanceManagement.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- GrievanceManagement.Contracts
|   |   |   |   |   `-- GrievanceManagement.Contracts.csproj
|   |   |   |   |-- GrievanceManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- Complaint.cs
|   |   |   |   |   `-- GrievanceManagement.Domain.csproj
|   |   |   |   |-- GrievanceManagement.Infrastructure
|   |   |   |   |   `-- GrievanceManagement.Infrastructure.csproj
|   |   |   |   `-- GrievanceManagement.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- SubmitComplaintEndpoint.cs
|   |   |   |       `-- GrievanceManagement.Presentation.csproj
|   |   |   |-- Helpdesk
|   |   |   |   |-- Helpdesk.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IHelpdeskRepository.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- CreateTicket
|   |   |   |   |   |       `-- CreateTicketCommand.cs
|   |   |   |   |   |-- Helpdesk.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Helpdesk.Contracts
|   |   |   |   |   `-- Helpdesk.Contracts.csproj
|   |   |   |   |-- Helpdesk.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- ServiceTicket.cs
|   |   |   |   |   `-- Helpdesk.Domain.csproj
|   |   |   |   |-- Helpdesk.Infrastructure
|   |   |   |   |   `-- Helpdesk.Infrastructure.csproj
|   |   |   |   `-- Helpdesk.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   `-- CreateTicketEndpoint.cs
|   |   |   |       `-- Helpdesk.Presentation.csproj
|   |   |   |-- QualityAccreditation
|   |   |   |   |-- QualityAccreditation.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IAccreditationRepository.cs
|   |   |   |   |   |-- Class1.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- GetActiveWorkflows
|   |   |   |   |   |   |   `-- GetActiveWorkflowsQuery.cs
|   |   |   |   |   |   `-- SubmitEvidence
|   |   |   |   |   |       `-- SubmitEvidenceCommand.cs
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- QualityAccreditation.Application.csproj
|   |   |   |   |-- QualityAccreditation.Contracts
|   |   |   |   |   `-- QualityAccreditation.Contracts.csproj
|   |   |   |   |-- QualityAccreditation.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- AccreditationEvidence.cs
|   |   |   |   |   `-- QualityAccreditation.Domain.csproj
|   |   |   |   |-- QualityAccreditation.Infrastructure
|   |   |   |   |   `-- QualityAccreditation.Infrastructure.csproj
|   |   |   |   `-- QualityAccreditation.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   |-- SubmitEvidenceEndpoint.cs
|   |   |   |       |   `-- WorkflowEndpoint.cs
|   |   |   |       `-- QualityAccreditation.Presentation.csproj
|   |   |   `-- VisitorManagement
|   |   |       |-- VisitorManagement.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |   `-- IVisitorRepository.cs
|   |   |       |   |-- Features
|   |   |       |   |   `-- RegisterVisitor
|   |   |       |   |       `-- RegisterVisitorCommand.cs
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- VisitorManagement.Application.csproj
|   |   |       |-- VisitorManagement.Contracts
|   |   |       |   `-- VisitorManagement.Contracts.csproj
|   |   |       |-- VisitorManagement.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |   `-- VisitorLog.cs
|   |   |       |   `-- VisitorManagement.Domain.csproj
|   |   |       |-- VisitorManagement.Infrastructure
|   |   |       |   `-- VisitorManagement.Infrastructure.csproj
|   |   |       `-- VisitorManagement.Presentation
|   |   |           |-- Endpoints
|   |   |           |   `-- RegisterVisitorEndpoint.cs
|   |   |           `-- VisitorManagement.Presentation.csproj
|   |   |-- Platform
|   |   |   |-- AnalyticsBI
|   |   |   |   |-- AnalyticsBI.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IAnalyticsRepository.cs
|   |   |   |   |   |-- AnalyticsBI.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- GenerateReport
|   |   |   |   |   |   |   `-- GenerateReportCommand.cs
|   |   |   |   |   |   |-- GetClassPerformance
|   |   |   |   |   |   |   `-- GetClassPerformanceQuery.cs
|   |   |   |   |   |   `-- GetSystemHealth
|   |   |   |   |   |       `-- GetSystemHealthQuery.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- AnalyticsBI.Contracts
|   |   |   |   |   `-- AnalyticsBI.Contracts.csproj
|   |   |   |   |-- AnalyticsBI.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- DashboardReport.cs
|   |   |   |   |   `-- AnalyticsBI.Domain.csproj
|   |   |   |   |-- AnalyticsBI.Infrastructure
|   |   |   |   |   `-- AnalyticsBI.Infrastructure.csproj
|   |   |   |   `-- AnalyticsBI.Presentation
|   |   |   |       |-- AnalyticsBI.Presentation.csproj
|   |   |   |       `-- Endpoints
|   |   |   |           |-- AcademicAnalyticsEndpoint.cs
|   |   |   |           |-- GenerateReportEndpoint.cs
|   |   |   |           `-- IntegrationHealthEndpoint.cs
|   |   |   |-- CRM
|   |   |   |   |-- CRM.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- ICRMRepository.cs
|   |   |   |   |   |-- CRM.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   `-- RegisterProspect
|   |   |   |   |   |       `-- RegisterProspectCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- CRM.Contracts
|   |   |   |   |   `-- CRM.Contracts.csproj
|   |   |   |   |-- CRM.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- Prospect.cs
|   |   |   |   |   `-- CRM.Domain.csproj
|   |   |   |   |-- CRM.Infrastructure
|   |   |   |   |   `-- CRM.Infrastructure.csproj
|   |   |   |   `-- CRM.Presentation
|   |   |   |       |-- CRM.Presentation.csproj
|   |   |   |       `-- Endpoints
|   |   |   |           `-- RegisterProspectEndpoint.cs
|   |   |   |-- Communication
|   |   |   |   |-- Communication.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- ICommunicationRepository.cs
|   |   |   |   |   |-- Communication.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- GetInbox
|   |   |   |   |   |   |   `-- GetInboxQuery.cs
|   |   |   |   |   |   `-- SendMessage
|   |   |   |   |   |       `-- SendMessageCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Communication.Contracts
|   |   |   |   |   `-- Communication.Contracts.csproj
|   |   |   |   |-- Communication.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- DirectMessage.cs
|   |   |   |   |   `-- Communication.Domain.csproj
|   |   |   |   |-- Communication.Infrastructure
|   |   |   |   |   |-- Communication.Infrastructure.csproj
|   |   |   |   |   |-- CommunicationModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- CommunicationDbContext.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       `-- CommunicationRepository.cs
|   |   |   |   `-- Communication.Presentation
|   |   |   |       |-- Communication.Presentation.csproj
|   |   |   |       `-- Endpoints
|   |   |   |           |-- AcademicInboxEndpoint.cs
|   |   |   |           |-- GetInboxEndpoint.cs
|   |   |   |           `-- SendMessageEndpoint.cs
|   |   |   |-- DocumentManagement
|   |   |   |   |-- DocumentManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IDocumentRepository.cs
|   |   |   |   |   |-- DocumentManagement.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- GetFacultyDocuments
|   |   |   |   |   |   |   `-- GetFacultyDocumentsQuery.cs
|   |   |   |   |   |   `-- UploadDocument
|   |   |   |   |   |       `-- UploadDocumentCommand.cs
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- DocumentManagement.Contracts
|   |   |   |   |   `-- DocumentManagement.Contracts.csproj
|   |   |   |   |-- DocumentManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- CorporateDocument.cs
|   |   |   |   |   `-- DocumentManagement.Domain.csproj
|   |   |   |   |-- DocumentManagement.Infrastructure
|   |   |   |   |   |-- DocumentManagement.Infrastructure.csproj
|   |   |   |   |   |-- DocumentManagementModuleRegistration.cs
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- DocumentManagementDbContext.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       `-- DocumentRepository.cs
|   |   |   |   `-- DocumentManagement.Presentation
|   |   |   |       |-- DocumentManagement.Presentation.csproj
|   |   |   |       `-- Endpoints
|   |   |   |           |-- AcademicDocumentsEndpoint.cs
|   |   |   |           `-- UploadDocumentEndpoint.cs
|   |   |   |-- IdentityAccess
|   |   |   |   |-- IdentityAccess.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IUserRepository.cs
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- AuthenticateUser
|   |   |   |   |   |   |   |-- AuthenticateUserQuery.cs
|   |   |   |   |   |   |   `-- AuthenticateUserQueryHandler.cs
|   |   |   |   |   |   |-- FacultySettings
|   |   |   |   |   |   |   `-- FacultySettingsHandlers.cs
|   |   |   |   |   |   |-- GetSecurityRoles
|   |   |   |   |   |   |   `-- GetRolesQuery.cs
|   |   |   |   |   |   `-- RegisterUser
|   |   |   |   |   |       |-- RegisterUserCommand.cs
|   |   |   |   |   |       |-- RegisterUserCommandHandler.cs
|   |   |   |   |   |       `-- RegisterUserCommandValidator.cs
|   |   |   |   |   |-- IdentityAccess.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- IdentityAccess.Contracts
|   |   |   |   |   |-- IdentityAccess.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- UserRegisteredIntegrationEvent.cs
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- IdentityAccess.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- User.cs
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   `-- UserRegisteredDomainEvent.cs
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- IdentityAccess.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |       |-- Email.cs
|   |   |   |   |       |-- PersonName.cs
|   |   |   |   |       `-- UserId.cs
|   |   |   |   |-- IdentityAccess.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- IdentityAccess.Infrastructure.csproj
|   |   |   |   |   |-- IdentityAccessModuleRegistration.cs
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |-- IdentityAccessDbContext.cs
|   |   |   |   |   |   `-- IdentityAccessDbContextDesignTimeFactory.cs
|   |   |   |   |   `-- Repositories
|   |   |   |   |       `-- UserRepository.cs
|   |   |   |   |-- IdentityAccess.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |-- FacultySettingsEndpoint.cs
|   |   |   |   |   |   |-- LoginEndpoint.cs
|   |   |   |   |   |   |-- RegisterUserEndpoint.cs
|   |   |   |   |   |   `-- SecurityAdministrationEndpoint.cs
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- IdentityAccess.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- IdentityAccess.Tests.Architecture
|   |   |   |   |   |-- IdentityAccess.Tests.Architecture.csproj
|   |   |   |   |   `-- UnitTest1.cs
|   |   |   |   |-- IdentityAccess.Tests.Integration
|   |   |   |   |   |-- IdentityAccess.Tests.Integration.csproj
|   |   |   |   |   `-- UnitTest1.cs
|   |   |   |   `-- IdentityAccess.Tests.Unit
|   |   |   |       |-- IdentityAccess.Tests.Unit.csproj
|   |   |   |       `-- UnitTest1.cs
|   |   |   |-- MultiCampus
|   |   |   |   |-- MultiCampus.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- ICampusRepository.cs
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- ConfigureCampus
|   |   |   |   |   |   |   `-- ConfigureCampusCommand.cs
|   |   |   |   |   |   `-- GetOrganizationHierarchy
|   |   |   |   |   |       `-- GetOrganizationHierarchyQuery.cs
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- MultiCampus.Application.csproj
|   |   |   |   |-- MultiCampus.Contracts
|   |   |   |   |   `-- MultiCampus.Contracts.csproj
|   |   |   |   |-- MultiCampus.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   `-- Campus.cs
|   |   |   |   |   `-- MultiCampus.Domain.csproj
|   |   |   |   |-- MultiCampus.Infrastructure
|   |   |   |   |   `-- MultiCampus.Infrastructure.csproj
|   |   |   |   `-- MultiCampus.Presentation
|   |   |   |       |-- Endpoints
|   |   |   |       |   |-- ConfigureCampusEndpoint.cs
|   |   |   |       |   `-- OrganizationEndpoint.cs
|   |   |   |       `-- MultiCampus.Presentation.csproj
|   |   |   `-- Notification
|   |   |       |-- Notification.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |   `-- INotificationRepository.cs
|   |   |       |   |-- Features
|   |   |       |   |   `-- SendNotification
|   |   |       |   |       `-- SendNotificationCommand.cs
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- Notification.Application.csproj
|   |   |       |-- Notification.Contracts
|   |   |       |   `-- Notification.Contracts.csproj
|   |   |       |-- Notification.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |   `-- NotificationMessage.cs
|   |   |       |   `-- Notification.Domain.csproj
|   |   |       |-- Notification.Infrastructure
|   |   |       |   `-- Notification.Infrastructure.csproj
|   |   |       `-- Notification.Presentation
|   |   |           |-- Endpoints
|   |   |           |   `-- SendNotificationEndpoint.cs
|   |   |           `-- Notification.Presentation.csproj
|   |   `-- StudentLifecycle
|   |       |-- Admissions
|   |       |   |-- Admissions.Application
|   |       |   |   |-- Abstractions
|   |       |   |   |   |-- IAdmissionApplicationRepository.cs
|   |       |   |   |   `-- IProgramOfferingRepository.cs
|   |       |   |   |-- Admissions.Application.csproj
|   |       |   |   |-- Class1.cs
|   |       |   |   |-- Features
|   |       |   |   |   |-- ActivateEnrollment
|   |       |   |   |   |   `-- ActivateEnrollmentCommand.cs
|   |       |   |   |   |-- ApproveApplication
|   |       |   |   |   |   `-- ApproveApplicationCommand.cs
|   |       |   |   |   |-- CheckEligibility
|   |       |   |   |   |   `-- CheckEligibilityQuery.cs
|   |       |   |   |   |-- CompleteInterview
|   |       |   |   |   |   `-- CompleteInterviewCommand.cs
|   |       |   |   |   |-- EndorseApplication
|   |       |   |   |   |   `-- EndorseApplicationCommand.cs
|   |       |   |   |   |-- EvaluateApplication
|   |       |   |   |   |   `-- EvaluateApplicationCommand.cs
|   |       |   |   |   |-- GetApplicantJourney
|   |       |   |   |   |   `-- GetApplicantJourneyQuery.cs
|   |       |   |   |   |-- GetApplicationStatus
|   |       |   |   |   |   `-- GetApplicationStatusQuery.cs
|   |       |   |   |   |-- GetPendingApplications
|   |       |   |   |   |   `-- GetPendingApplicationsQuery.cs
|   |       |   |   |   |-- GetProgramCatalog
|   |       |   |   |   |   `-- GetProgramCatalogQuery.cs
|   |       |   |   |   |-- RecommendAdmission
|   |       |   |   |   |   `-- RecommendAdmissionCommand.cs
|   |       |   |   |   |-- SubmitApplication
|   |       |   |   |   |   `-- SubmitApplicationCommand.cs
|   |       |   |   |   |-- UploadDocument
|   |       |   |   |   |   `-- UploadDocumentCommand.cs
|   |       |   |   |   `-- VerifyDocuments
|   |       |   |   |       `-- VerifyDocumentsCommand.cs
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- Admissions.Contracts
|   |       |   |   `-- Admissions.Contracts.csproj
|   |       |   |-- Admissions.Domain
|   |       |   |   |-- Admissions.Domain.csproj
|   |       |   |   |-- Aggregates
|   |       |   |   |   |-- AdmissionApplication.cs
|   |       |   |   |   `-- ProgramOffering.cs
|   |       |   |   |-- Entities
|   |       |   |   |   |-- AdmissionDocument.cs
|   |       |   |   |   `-- ApplicationTimelineEvent.cs
|   |       |   |   `-- Events
|   |       |   |       `-- StudentEnrolledDomainEvent.cs
|   |       |   |-- Admissions.Infrastructure
|   |       |   |   |-- Admissions.Infrastructure.csproj
|   |       |   |   |-- AdmissionsModuleRegistration.cs
|   |       |   |   |-- Persistence
|   |       |   |   |   |-- AdmissionsDbContext.cs
|   |       |   |   |   `-- AdmissionsDbContextDesignTimeFactory.cs  C#
|   |       |   |   `-- Repositories
|   |       |   |       |-- AdmissionApplicationRepository.cs
|   |       |   |       `-- ProgramOfferingRepository.cs
|   |       |   `-- Admissions.Presentation
|   |       |       |-- Admissions.Presentation.csproj
|   |       |       `-- Endpoints
|   |       |           |-- AdmissionsWorkflowEndpoint.cs
|   |       |           |-- ApplicationsEndpoint.cs
|   |       |           |-- EligibilityEndpoint.cs
|   |       |           |-- FacultyAdmissionsEndpoint.cs
|   |       |           |-- GetApplicationStatusEndpoint.cs
|   |       |           `-- ProgramsEndpoint.cs
|   |       |-- Alumni
|   |       |   |-- Alumni.Application
|   |       |   |   |-- Alumni.Application.csproj
|   |       |   |   |-- Features
|   |       |   |   |   `-- GetAlumniStatus
|   |       |   |   |       `-- GetAlumniStatusQuery.cs
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- Alumni.Contracts
|   |       |   |   `-- Alumni.Contracts.csproj
|   |       |   |-- Alumni.Domain
|   |       |   |   `-- Alumni.Domain.csproj
|   |       |   |-- Alumni.Infrastructure
|   |       |   |   `-- Alumni.Infrastructure.csproj
|   |       |   `-- Alumni.Presentation
|   |       |       |-- Alumni.Presentation.csproj
|   |       |       `-- Endpoints
|   |       |           `-- GetAlumniStatusEndpoint.cs
|   |       |-- GuidanceCounseling
|   |       |   |-- GuidanceCounseling.Application
|   |       |   |   |-- Features
|   |       |   |   |   `-- GetGuidanceSessions
|   |       |   |   |       `-- GetGuidanceSessionsQuery.cs
|   |       |   |   |-- GuidanceCounseling.Application.csproj
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- GuidanceCounseling.Contracts
|   |       |   |   `-- GuidanceCounseling.Contracts.csproj
|   |       |   |-- GuidanceCounseling.Domain
|   |       |   |   `-- GuidanceCounseling.Domain.csproj
|   |       |   |-- GuidanceCounseling.Infrastructure
|   |       |   |   `-- GuidanceCounseling.Infrastructure.csproj
|   |       |   `-- GuidanceCounseling.Presentation
|   |       |       |-- Endpoints
|   |       |       |   `-- GetGuidanceSessionsEndpoint.cs
|   |       |       `-- GuidanceCounseling.Presentation.csproj
|   |       |-- HealthCenter
|   |       |   |-- HealthCenter.Application
|   |       |   |   |-- Features
|   |       |   |   |   `-- GetHealthAppointments
|   |       |   |   |       `-- GetHealthAppointmentsQuery.cs
|   |       |   |   |-- HealthCenter.Application.csproj
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- HealthCenter.Contracts
|   |       |   |   `-- HealthCenter.Contracts.csproj
|   |       |   |-- HealthCenter.Domain
|   |       |   |   `-- HealthCenter.Domain.csproj
|   |       |   |-- HealthCenter.Infrastructure
|   |       |   |   `-- HealthCenter.Infrastructure.csproj
|   |       |   `-- HealthCenter.Presentation
|   |       |       |-- Endpoints
|   |       |       |   `-- GetHealthAppointmentsEndpoint.cs
|   |       |       `-- HealthCenter.Presentation.csproj
|   |       |-- Hostel
|   |       |   |-- Hostel.Application
|   |       |   |   |-- Features
|   |       |   |   |   `-- GetRoomAllocation
|   |       |   |   |       `-- GetRoomAllocationQuery.cs
|   |       |   |   |-- Hostel.Application.csproj
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- Hostel.Contracts
|   |       |   |   `-- Hostel.Contracts.csproj
|   |       |   |-- Hostel.Domain
|   |       |   |   `-- Hostel.Domain.csproj
|   |       |   |-- Hostel.Infrastructure
|   |       |   |   `-- Hostel.Infrastructure.csproj
|   |       |   `-- Hostel.Presentation
|   |       |       |-- Endpoints
|   |       |       |   `-- GetRoomAllocationEndpoint.cs
|   |       |       `-- Hostel.Presentation.csproj
|   |       `-- PlacementCareer
|   |           |-- PlacementCareer.Application
|   |           |   |-- Features
|   |           |   |   `-- GetJobPostings
|   |           |   |       `-- GetJobPostingsQuery.cs
|   |           |   |-- ModuleRegistration.cs
|   |           |   `-- PlacementCareer.Application.csproj
|   |           |-- PlacementCareer.Contracts
|   |           |   `-- PlacementCareer.Contracts.csproj
|   |           |-- PlacementCareer.Domain
|   |           |   `-- PlacementCareer.Domain.csproj
|   |           |-- PlacementCareer.Infrastructure
|   |           |   `-- PlacementCareer.Infrastructure.csproj
|   |           `-- PlacementCareer.Presentation
|   |               |-- Endpoints
|   |               |   `-- GetJobPostingsEndpoint.cs
|   |               `-- PlacementCareer.Presentation.csproj
|   |-- Platform
|   `-- SharedKernel
|       |-- SharedKernel.Application
|       |   |-- Abstractions
|       |   |-- Behaviors
|       |   |-- Pagination
|       |   |-- Results
|       |   `-- SharedKernel.Application.csproj
|       |-- SharedKernel.Domain
|       |   |-- Audit
|       |   |-- Identifiers
|       |   |-- Primitives
|       |   |   |-- AggregateRoot.cs
|       |   |   |-- Entity.cs
|       |   |   |-- IDomainEvent.cs
|       |   |   |-- Result.cs
|       |   |   `-- ValueObject.cs
|       |   |-- SharedKernel.Domain.csproj
|       |   `-- ValueObjects
|       |-- SharedKernel.Infrastructure
|       |   |-- Inbox
|       |   |-- Messaging
|       |   |-- Outbox
|       |   |-- Persistence
|       |   `-- SharedKernel.Infrastructure.csproj
|       `-- SharedKernel.Observability
|           |-- HealthChecks
|           |-- Logging
|           |-- Metrics
|           |-- SharedKernel.Observability.csproj
|           `-- Tracing
`-- tests
    |-- ArchitectureTests
    |   |-- ContractOnlyDependencyTests.cs
    |   |-- ModuleRegistrationConventionTests.cs
    |   |-- NoCrossModuleDomainReferenceTests.cs
    |   `-- SharedKernelPurityTests.cs
    |-- DomainTests
    |   |-- Finance
    |   |   `-- InvoiceBalancingTests.cs
    |   |-- GrievanceManagement
    |   |   `-- EscalationChainTests.cs
    |   |-- Hostel
    |   |   `-- RoomCapacityInvariantTests.cs
    |   `-- StudentInformation
    |       `-- EnrollmentInvariantTests.cs
    |-- EndToEndTests
    |   |-- AdmissionToEnrollmentFlow.cs
    |   |-- GrievanceToFacilitiesFlow.cs
    |   `-- HostelAllocationToBillingFlow.cs
    |-- PerformanceTests
    |   |-- InvoiceIssuanceThroughput.cs
    |   |-- PayrollBatchCalculation.cs
    |   `-- RegistrationPeakLoad.cs
    `-- SecurityTests
        |-- AuthorizationPolicyTests.cs
        `-- DataClassificationLeakTests.cs

550 directories, 608 files
