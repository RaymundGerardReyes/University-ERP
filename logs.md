.
|-- Analysis_Task_Orchestration.md
|-- CodebaseInfrastructure.md
|-- ERPstructure.md
|-- README.md
|-- SEMANTIC_VERSIONING_PROMPT.md
|-- University-ERP-Backend
|   |-- Directory.Build.props
|   |-- Rebuild_Dependencies.ps1
|   |-- University-ERP-Backend.md
|   |-- domain
|   |   |-- adr
|   |   |   |-- ADR-001-modular-monolith-over-microservices.md
|   |   |   |-- ADR-002-shared-kernel-scope-restriction.md
|   |   |   |-- ADR-003-anti-corruption-layer-health-guidance.md
|   |   |   |-- ADR-004-event-driven-cross-module-integration.md
|   |   |   `-- ADR-NNN-template.md
|   |   |-- model
|   |   |   |-- aggregate-catalog.md
|   |   |   |-- bounded-context-catalog.md
|   |   |   |-- business-capability-map.md
|   |   |   |-- business-rules-catalog.md
|   |   |   |-- context-map.md
|   |   |   |-- domain-event-catalog.md
|   |   |   |-- entity-catalog.md
|   |   |   |-- ubiquitous-language-glossary.md
|   |   |   `-- value-object-catalog.md
|   |   `-- runbooks
|   |       |-- data-recovery
|   |       |   `-- student-enrollment-rollback.md
|   |       |-- incident-response
|   |       |   |-- finance-invoice-outbox-stuck.md
|   |       |   |-- grievance-sla-breach-storm.md
|   |       |   `-- identityaccess-outage.md
|   |       `-- module-onboarding
|   |           `-- new-bounded-context-checklist.md
|   |-- ops
|   |   |-- cloudflare
|   |   |   |-- dns
|   |   |   |   `-- university-erp-zone.tf
|   |   |   |-- page-rules
|   |   |   |   |-- bypass-cache-api.json
|   |   |   |   `-- cache-static-assets.json
|   |   |   |-- tunnel
|   |   |   |   `-- config.yml
|   |   |   |-- waf-rules
|   |   |   |   |-- bot-fight-mode.json
|   |   |   |   |-- owasp-managed-ruleset.json
|   |   |   |   `-- rate-limiting.json
|   |   |   `-- workers
|   |   |       `-- security-headers-worker.js
|   |   |-- db-migrations
|   |   |   `-- StudentInformation
|   |   |       |-- 20260731000000_Initial_StudentInformation.Designer.cs
|   |   |       |-- 20260731000000_Initial_StudentInformation.cs
|   |   |       `-- StudentInformationDbContextModelSnapshot.cs
|   |   |-- nginx
|   |   |   |-- nginx.conf
|   |   |   |-- sites-available
|   |   |   |   |-- admin.university.edu.conf
|   |   |   |   |-- api.university.edu.conf
|   |   |   |   |-- applicant.university.edu.conf
|   |   |   |   |-- auth.university.edu.conf
|   |   |   |   |-- faculty.university.edu.conf
|   |   |   |   |-- finance.university.edu.conf
|   |   |   |   |-- governance.university.edu.conf
|   |   |   |   |-- library.university.edu.conf
|   |   |   |   |-- lms.university.edu.conf
|   |   |   |   |-- localhost-identity.conf
|   |   |   |   |-- localhost.conf
|   |   |   |   |-- platform.university.edu.conf
|   |   |   |   |-- portal.university.edu.conf
|   |   |   |   `-- student.university.edu.conf
|   |   |   |-- sites-enabled
|   |   |   |-- snippets
|   |   |   |   |-- proxy-common.conf
|   |   |   |   |-- rate-limit.conf
|   |   |   |   `-- security-headers.conf
|   |   |   `-- ssl
|   |   |-- observability
|   |   |   |-- alert-rules
|   |   |   |   |-- finance-invoice-failure-rate.yaml
|   |   |   |   |-- grievance-sla-breach.yaml
|   |   |   |   `-- identityaccess-auth-latency.yaml
|   |   |   `-- dashboards
|   |   |       |-- academic-cluster-dashboard.json
|   |   |       |-- finance-cluster-dashboard.json
|   |   |       `-- governance-cluster-dashboard.json
|   |   |-- ops
|   |   |   `-- db-migrations
|   |   |       `-- Admissions
|   |   |           `-- 20260806014149_AddAdmissionsApprovalFields.cs
|   |   `-- pipelines
|   |       |-- Audit_Dependencies.ps1
|   |       |-- app-build
|   |       |   |-- avalonia-client.pipeline.yaml
|   |       |   `-- react-apps.pipeline.yaml
|   |       |-- app-release
|   |       |   `-- selective-release.pipeline.yaml
|   |       |-- app-test
|   |       |   `-- per-app-test.pipeline.yaml
|   |       |-- edge-deploy
|   |       |   `-- cloudflare-nginx-sync.pipeline.yaml
|   |       |-- module-build
|   |       |   |-- academic-modules.pipeline.yaml
|   |       |   |-- administration-modules.pipeline.yaml
|   |       |   `-- platform-modules.pipeline.yaml
|   |       |-- module-release
|   |       |   `-- selective-release.pipeline.yaml
|   |       `-- module-test
|   |           `-- per-module-test.pipeline.yaml
|   |-- src
|   |   |-- Bootstrap
|   |   |   |-- UniversityErp.Api
|   |   |   |   |-- Dockerfile
|   |   |   |   |-- Middleware
|   |   |   |   |   |-- AuthorizationDelegationMiddleware.cs
|   |   |   |   |   |-- CorrelationIdMiddleware.cs
|   |   |   |   |   `-- GlobalExceptionMiddleware.cs
|   |   |   |   |-- ModuleRegistration
|   |   |   |   |   |-- AcademicModulesRegistration.cs
|   |   |   |   |   |-- AdministrationModulesRegistration.cs
|   |   |   |   |   |-- GovernanceModulesRegistration.cs
|   |   |   |   |   |-- PlatformModulesRegistration.cs
|   |   |   |   |   `-- StudentLifecycleModulesRegistration.cs
|   |   |   |   |-- Program.cs
|   |   |   |   |-- Properties
|   |   |   |   |   `-- launchSettings.json
|   |   |   |   |-- UniversityErp.Api.csproj
|   |   |   |   |-- UniversityErp.Api.http
|   |   |   |   |-- appsettings
|   |   |   |   |   `-- appsettings.Production.json
|   |   |   |   `-- appsettings.json
|   |   |   |-- UniversityErp.Migrator
|   |   |   |   |-- Dockerfile
|   |   |   |   |-- MigrationRunners
|   |   |   |   |   `-- PerModuleMigrationRunner.cs
|   |   |   |   |-- Program.cs
|   |   |   |   `-- UniversityErp.Migrator.csproj
|   |   |   `-- UniversityErp.Worker
|   |   |       |-- Consumers
|   |   |       |   |-- AcademicEventConsumers.cs
|   |   |       |   |-- FinanceEventConsumers.cs
|   |   |       |   `-- GovernanceEventConsumers.cs
|   |   |       |-- Dockerfile
|   |   |       |-- Program.cs
|   |   |       |-- Properties
|   |   |       |   `-- launchSettings.json
|   |   |       |-- ScheduledJobs
|   |   |       |   |-- PayrollMonthlyBatchJob.cs
|   |   |       |   |-- SlaBreachScannerJob.cs
|   |   |       |   |-- TermStartBatchInvoicingJob.cs
|   |   |       |   `-- WaitlistPromotionJob.cs
|   |   |       |-- UniversityErp.Worker.csproj
|   |   |       |-- Worker.cs
|   |   |       `-- appsettings.json
|   |   |-- Contracts
|   |   |   |-- IntegrationEvents
|   |   |   |   |-- Academic
|   |   |   |   |   |-- CourseDroppedIntegrationEvent.cs
|   |   |   |   |   |-- ExamResultPublishedIntegrationEvent.cs
|   |   |   |   |   |-- GradesPostedIntegrationEvent.cs
|   |   |   |   |   |-- StudentEnrolledIntegrationEvent.cs
|   |   |   |   |   `-- WaitlistPromotedIntegrationEvent.cs
|   |   |   |   |-- Administration
|   |   |   |   |   |-- InvoiceIssuedIntegrationEvent.cs
|   |   |   |   |   |-- PaymentVerifiedIntegrationEvent.cs
|   |   |   |   |   `-- PayrollCalculatedIntegrationEvent.cs
|   |   |   |   |-- Governance
|   |   |   |   |   |-- GrievanceSubmittedIntegrationEvent.cs
|   |   |   |   |   `-- SupportTicketRequestedIntegrationEvent.cs
|   |   |   |   |-- Platform
|   |   |   |   |   `-- AccountProvisionedIntegrationEvent.cs
|   |   |   |   `-- StudentLifecycle
|   |   |   |       |-- ApplicantAcceptedIntegrationEvent.cs
|   |   |   |       |-- RoomAllocatedIntegrationEvent.cs
|   |   |   |       `-- StudentEnrolledIntegrationEvent.cs
|   |   |   |-- PublicApiContracts
|   |   |   |   |-- Academic
|   |   |   |   |   |-- Examination.ResultQueryApi.cs
|   |   |   |   |   `-- Registrar.CurriculumApi.cs
|   |   |   |   |-- Administration
|   |   |   |   |   `-- Finance.BillingApi.cs
|   |   |   |   |-- Governance
|   |   |   |   |   `-- Facilities.SpaceAvailabilityApi.cs
|   |   |   |   |-- Platform
|   |   |   |   |   `-- IdentityAccess.AuthorizationApi.cs
|   |   |   |   `-- StudentLifecycle
|   |   |   |       `-- StudentInformation.StudentReadModel.cs
|   |   |   `-- UniversityErp.Contracts.csproj
|   |   |-- Modules
|   |   |   |-- Academic
|   |   |   |   |-- AcademicScheduling
|   |   |   |   |   |-- AcademicScheduling.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- IAcademicSchedulingRepository.cs
|   |   |   |   |   |   |   `-- IClassSessionRepository.cs
|   |   |   |   |   |   |-- AcademicScheduling.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- AllocateRoom
|   |   |   |   |   |   |   |   `-- AllocateRoomCommand.cs
|   |   |   |   |   |   |   |-- GetFacultyCourses
|   |   |   |   |   |   |   |   `-- GetFacultyCoursesQuery.cs
|   |   |   |   |   |   |   |-- GetStudentTimetable
|   |   |   |   |   |   |   |   `-- GetStudentTimetableQuery.cs
|   |   |   |   |   |   |   `-- SubmitAttendance
|   |   |   |   |   |   |       `-- SubmitAttendanceCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- AcademicScheduling.Contracts
|   |   |   |   |   |   `-- AcademicScheduling.Contracts.csproj
|   |   |   |   |   |-- AcademicScheduling.Domain
|   |   |   |   |   |   |-- AcademicScheduling.Domain.csproj
|   |   |   |   |   |   `-- Aggregates
|   |   |   |   |   |       |-- AttendanceRecord.cs
|   |   |   |   |   |       |-- ClassSession.cs
|   |   |   |   |   |       |-- CourseSection.cs
|   |   |   |   |   |       `-- RoomAllocation.cs
|   |   |   |   |   |-- AcademicScheduling.Infrastructure
|   |   |   |   |   |   |-- AcademicScheduling.Infrastructure.csproj
|   |   |   |   |   |   |-- AcademicSchedulingModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- AcademicSchedulingDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       |-- AcademicSchedulingRepository.cs
|   |   |   |   |   |       `-- ClassSessionRepository.cs
|   |   |   |   |   `-- AcademicScheduling.Presentation
|   |   |   |   |       |-- AcademicScheduling.Presentation.csproj
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           |-- AllocateRoomEndpoint.cs
|   |   |   |   |           |-- GetStudentTimetableEndpoint.cs
|   |   |   |   |           `-- TeachingEndpoint.cs
|   |   |   |   |-- Assessments
|   |   |   |   |   |-- Assessments.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IGradebookRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   `-- SectionGradesPostedDomainEventHandler.cs
|   |   |   |   |   |   `-- Features
|   |   |   |   |   |       `-- SubmitGrades
|   |   |   |   |   |           `-- SubmitGradesCommand.cs
|   |   |   |   |   |-- Assessments.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Gradebook.cs
|   |   |   |   |   |   `-- Events
|   |   |   |   |   |       `-- SectionGradesPostedDomainEvent.cs
|   |   |   |   |   |-- Assessments.Infrastructure
|   |   |   |   |   |   |-- AssessmentsModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- AssessmentsDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- GradebookRepository.cs
|   |   |   |   |   `-- Assessments.Presentation
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           `-- AssessmentsEndpoint.cs
|   |   |   |   |-- Curriculum
|   |   |   |   |   |-- Curriculum.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- ICourseDefinitionRepository.cs
|   |   |   |   |   |   `-- Features
|   |   |   |   |   |       |-- BrowseCourses
|   |   |   |   |   |       |   `-- BrowseCoursesQuery.cs
|   |   |   |   |   |       |-- GetAllCourses
|   |   |   |   |   |       |   `-- GetAllCoursesQuery.cs
|   |   |   |   |   |       |-- UpdateMasterData
|   |   |   |   |   |       |   `-- UpdateCourseMasterDataCommand.cs
|   |   |   |   |   |       `-- UpdatePrerequisite
|   |   |   |   |   |           `-- UpdatePrerequisiteEnforcementCommand.cs
|   |   |   |   |   |-- Curriculum.Domain
|   |   |   |   |   |   `-- Aggregates
|   |   |   |   |   |       `-- CourseDefinition.cs
|   |   |   |   |   |-- Curriculum.Infrastructure
|   |   |   |   |   |   |-- CurriculumModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- CurriculumDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- CourseDefinitionRepository.cs
|   |   |   |   |   `-- Curriculum.Presentation
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           `-- CurriculumEndpoint.cs
|   |   |   |   |-- Enrollment
|   |   |   |   |   |-- Enrollment.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- ITermRegistrationRepository.cs
|   |   |   |   |   |   |   `-- IWaitlistRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- CourseDroppedDomainEventHandler.cs
|   |   |   |   |   |   |   |-- CourseDroppedIntegrationEventPublisher.cs
|   |   |   |   |   |   |   `-- WaitlistPromotedDomainEventHandler.cs
|   |   |   |   |   |   `-- Features
|   |   |   |   |   |       |-- DropCourse
|   |   |   |   |   |       |   `-- DropCourseCommand.cs
|   |   |   |   |   |       |-- GetValidationQueue
|   |   |   |   |   |       |   `-- GetEnrollmentValidationQueueQuery.cs
|   |   |   |   |   |       `-- Waitlist
|   |   |   |   |   |           `-- PromoteWaitlist
|   |   |   |   |   |               `-- PromoteWaitlistCommand.cs
|   |   |   |   |   |-- Enrollment.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- TermRegistration.cs
|   |   |   |   |   |   |   `-- WaitlistEntry.cs
|   |   |   |   |   |   `-- Events
|   |   |   |   |   |       |-- CourseDroppedDomainEvent.cs
|   |   |   |   |   |       `-- WaitlistPromotedDomainEvent.cs
|   |   |   |   |   |-- Enrollment.Infrastructure
|   |   |   |   |   |   |-- EnrollmentModuleRegistration.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- TermRegistrationRepository.cs
|   |   |   |   |   `-- Enrollment.Presentation
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           |-- RegistrarEndpoint.cs
|   |   |   |   |           `-- RegistrationEndpoint.cs
|   |   |   |   |-- Examination
|   |   |   |   |   |-- Examination.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- IExamSessionRepository.cs
|   |   |   |   |   |   |   `-- IExaminationRepository.cs
|   |   |   |   |   |   |-- Examination.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- CreateQuestion
|   |   |   |   |   |   |   |   `-- CreateQuestionCommand.cs
|   |   |   |   |   |   |   |-- GetExamSessions
|   |   |   |   |   |   |   |   |-- GetExamSessionsQuery.cs
|   |   |   |   |   |   |   |   `-- GetExamSessionsQueryHandler.cs
|   |   |   |   |   |   |   |-- GetGradebook
|   |   |   |   |   |   |   |   `-- GetGradebookQuery.cs
|   |   |   |   |   |   |   |-- LogProctoringIncident
|   |   |   |   |   |   |   |   `-- LogProctoringIncidentCommand.cs
|   |   |   |   |   |   |   |-- PublishExamResult
|   |   |   |   |   |   |   |   `-- PublishExamResultCommand.cs
|   |   |   |   |   |   |   `-- SubmitGrades
|   |   |   |   |   |   |       `-- SubmitGradesCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Examination.Contracts
|   |   |   |   |   |   `-- Examination.Contracts.csproj
|   |   |   |   |   |-- Examination.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- ExamResult.cs
|   |   |   |   |   |   |   |-- ExamSession.cs
|   |   |   |   |   |   |   |-- GradebookRecord.cs
|   |   |   |   |   |   |   `-- QuestionItem.cs
|   |   |   |   |   |   `-- Examination.Domain.csproj
|   |   |   |   |   |-- Examination.Infrastructure
|   |   |   |   |   |   |-- Examination.Infrastructure.csproj
|   |   |   |   |   |   |-- ExaminationModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- ExaminationDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       |-- ExamSessionRepository.cs
|   |   |   |   |   |       `-- ExaminationRepository.cs
|   |   |   |   |   `-- Examination.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- CreateQuestionEndpoint.cs
|   |   |   |   |       |   |-- GradebookEndpoint.cs
|   |   |   |   |       |   |-- LogProctoringIncidentEndpoint.cs
|   |   |   |   |       |   |-- PublishExamResultEndpoint.cs
|   |   |   |   |       |   `-- SessionsEndpoint.cs
|   |   |   |   |       `-- Examination.Presentation.csproj
|   |   |   |   |-- LearningManagement
|   |   |   |   |   |-- LearningManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- ICourseSyllabusRepository.cs
|   |   |   |   |   |   |   |-- ILearningManagementRepository.cs
|   |   |   |   |   |   |   |-- IOfflineSubmissionRepository.cs
|   |   |   |   |   |   |   `-- IScheduleTokenVerifier.cs
|   |   |   |   |   |   |-- Events
|   |   |   |   |   |   |   `-- Handlers
|   |   |   |   |   |   |       `-- StudentEnrolledEventHandler.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- AddContentItem
|   |   |   |   |   |   |   |   `-- AddContentItemCommand.cs
|   |   |   |   |   |   |   |-- AddLearningModule
|   |   |   |   |   |   |   |   `-- AddLearningModuleCommand.cs
|   |   |   |   |   |   |   |-- Analytics
|   |   |   |   |   |   |   |   `-- GetClassPerformanceQuery.cs
|   |   |   |   |   |   |   |-- Assessments
|   |   |   |   |   |   |   |   `-- GetAssessmentsQuery.cs
|   |   |   |   |   |   |   |-- CreateSyllabus
|   |   |   |   |   |   |   |   `-- CreateSyllabusCommand.cs
|   |   |   |   |   |   |   |-- GetCourseContent
|   |   |   |   |   |   |   |   `-- GetCourseContentQuery.cs
|   |   |   |   |   |   |   |-- GetOfflineGradesPackage
|   |   |   |   |   |   |   |   `-- GetOfflineGradesPackageQuery.cs
|   |   |   |   |   |   |   |-- GetOfflineModulePackage
|   |   |   |   |   |   |   |   |-- GetOfflineDeltaPackageQuery.cs
|   |   |   |   |   |   |   |   `-- GetOfflineModulePackageQuery.cs
|   |   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmission
|   |   |   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmissionCommand.cs
|   |   |   |   |   |   |   |   `-- ProcessOfflineAssessmentSubmissionCommandHandler.cs
|   |   |   |   |   |   |   `-- ProcessOfflineAssignmentSubmission
|   |   |   |   |   |   |       |-- ProcessOfflineAssignmentSubmissionCommand.cs
|   |   |   |   |   |   |       `-- ProcessOfflineAssignmentSubmissionCommandHandler.cs
|   |   |   |   |   |   |-- LearningManagement.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- LearningManagement.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |   |-- OfflineAssessmentSubmittedIntegrationEvent.cs
|   |   |   |   |   |   |   `-- OfflineAssignmentSubmittedIntegrationEvent.cs
|   |   |   |   |   |   |-- LearningManagement.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |       `-- ILearningManagementApi.cs
|   |   |   |   |   |-- LearningManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- Assessment.cs
|   |   |   |   |   |   |   |-- ClassPerformance.cs
|   |   |   |   |   |   |   |-- CourseSyllabus.cs
|   |   |   |   |   |   |   `-- StudentGradeRecord.cs
|   |   |   |   |   |   `-- LearningManagement.Domain.csproj
|   |   |   |   |   |-- LearningManagement.Infrastructure
|   |   |   |   |   |   |-- LearningManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- LearningManagementModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   |-- LearningManagementDbContext.cs
|   |   |   |   |   |   |   `-- LmsDbContext.cs
|   |   |   |   |   |   |-- Repositories
|   |   |   |   |   |   |   |-- CourseSyllabusRepository.cs
|   |   |   |   |   |   |   |-- LearningManagementRepository.cs
|   |   |   |   |   |   |   `-- OfflineSubmissionRepository.cs
|   |   |   |   |   |   `-- Security
|   |   |   |   |   |       `-- ScheduleTokenVerifier.cs
|   |   |   |   |   `-- LearningManagement.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- AnalyticsEndpoint.cs
|   |   |   |   |       |   |-- AssessmentsEndpoint.cs
|   |   |   |   |       |   |-- DownloadGradesPackageEndpoint.cs
|   |   |   |   |       |   |-- DownloadModulePackageEndpoint.cs
|   |   |   |   |       |   |-- LmsEndpoint.cs
|   |   |   |   |       |   |-- SyncOfflineAssessmentsEndpoint.cs
|   |   |   |   |       |   `-- SyncOfflineAssignmentsEndpoint.cs
|   |   |   |   |       `-- LearningManagement.Presentation.csproj
|   |   |   |   |-- Registrar
|   |   |   |   |   |-- Registrar.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IRegistrarRepository.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- EvaluateCandidate
|   |   |   |   |   |   |   |   `-- EvaluateCandidateCommand.cs
|   |   |   |   |   |   |   |-- EvaluateGraduationClearance
|   |   |   |   |   |   |   |   `-- EvaluateGraduationClearanceCommand.cs
|   |   |   |   |   |   |   |-- LockSectionGrades
|   |   |   |   |   |   |   |   `-- LockSectionGradesCommand.cs
|   |   |   |   |   |   |   |-- ProcessTranscriptRequest
|   |   |   |   |   |   |   |   `-- ProcessTranscriptRequestCommand.cs
|   |   |   |   |   |   |   |-- RegisterCourse
|   |   |   |   |   |   |   |   `-- RegisterCourseCommand.cs
|   |   |   |   |   |   |   |-- RequestTranscript
|   |   |   |   |   |   |   |   `-- RequestTranscriptCommand.cs
|   |   |   |   |   |   |   |-- Schedule
|   |   |   |   |   |   |   |   `-- GetFacultyScheduleQuery.cs
|   |   |   |   |   |   |   `-- ValidateEnrollment
|   |   |   |   |   |   |       `-- ValidateEnrollmentCommand.cs
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- Registrar.Application.csproj
|   |   |   |   |   |-- Registrar.Contracts
|   |   |   |   |   |   `-- Registrar.Contracts.csproj
|   |   |   |   |   |-- Registrar.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- CourseRegistration.cs
|   |   |   |   |   |   |   |-- CourseSection.cs
|   |   |   |   |   |   |   |-- GraduationClearance.cs
|   |   |   |   |   |   |   `-- TranscriptRequest.cs
|   |   |   |   |   |   `-- Registrar.Domain.csproj
|   |   |   |   |   |-- Registrar.Infrastructure
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- RegistrarDbContext.cs
|   |   |   |   |   |   |-- Registrar.Infrastructure.csproj
|   |   |   |   |   |   |-- RegistrarModuleRegistration.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- RegistrarRepository.cs
|   |   |   |   |   `-- Registrar.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- EvaluateGraduationClearanceEndpoint.cs
|   |   |   |   |       |   |-- RegisterCourseEndpoint.cs
|   |   |   |   |       |   |-- RequestTranscriptEndpoint.cs
|   |   |   |   |       |   `-- ScheduleEndpoint.cs
|   |   |   |   |       `-- Registrar.Presentation.csproj
|   |   |   |   |-- StudentInformation
|   |   |   |   |   |-- StudentInformation.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- IStudentAcademicRecordRepository.cs
|   |   |   |   |   |   |   `-- IStudentRepository.cs
|   |   |   |   |   |   |-- Consumers
|   |   |   |   |   |   |   |-- GradesPostedIntegrationEventConsumer.cs
|   |   |   |   |   |   |   `-- UserRegisteredIntegrationEventConsumer.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- EnrollStudent
|   |   |   |   |   |   |   |   |-- EnrollStudentCommand.cs
|   |   |   |   |   |   |   |   |-- EnrollStudentCommandHandler.cs
|   |   |   |   |   |   |   |   `-- EnrollStudentCommandValidator.cs
|   |   |   |   |   |   |   |-- GetAdvisees
|   |   |   |   |   |   |   |   |-- GetAdviseesQuery.cs
|   |   |   |   |   |   |   |   `-- GetAdviseesQueryHandler.cs
|   |   |   |   |   |   |   |-- GetMyStudents
|   |   |   |   |   |   |   |   `-- GetMyStudentsQuery.cs
|   |   |   |   |   |   |   |-- GetStudentInformation
|   |   |   |   |   |   |   |   `-- GetStudentInformationQuery.cs
|   |   |   |   |   |   |   |-- Graduation
|   |   |   |   |   |   |   |   |-- ApproveGraduationCommand.cs
|   |   |   |   |   |   |   |   |-- GetPendingClearancesQuery.cs
|   |   |   |   |   |   |   |   `-- ReviewClearanceCommand.cs
|   |   |   |   |   |   |   `-- UpdateContactInfo
|   |   |   |   |   |   |       `-- UpdateContactInfoCommand.cs
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- StudentInformation.Application.csproj
|   |   |   |   |   |-- StudentInformation.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- FacultyAdvisee.cs
|   |   |   |   |   |   |   |-- Student.cs
|   |   |   |   |   |   |   `-- StudentAcademicRecord.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |   `-- StudentEnrolledDomainEvent.cs
|   |   |   |   |   |   |-- StudentInformation.Domain.csproj
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |       |-- EnrollmentStatus.cs
|   |   |   |   |   |       `-- StudentId.cs
|   |   |   |   |   |-- StudentInformation.Infrastructure
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   |-- StudentConfiguration.cs
|   |   |   |   |   |   |   `-- StudentInformationDbContext.cs
|   |   |   |   |   |   |-- Repositories
|   |   |   |   |   |   |   `-- StudentRepository.cs
|   |   |   |   |   |   |-- StudentInformation.Infrastructure.csproj
|   |   |   |   |   |   `-- StudentInformationModuleRegistration.cs
|   |   |   |   |   `-- StudentInformation.Presentation
|   |   |   |   |       |-- Contracts
|   |   |   |   |       |   `-- EnrollStudentRequest.cs
|   |   |   |   |       |-- Controllers
|   |   |   |   |       |   `-- StudentsController.cs
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- AdvisingEndpoint.cs
|   |   |   |   |       |   |-- FacultyStudentsEndpoint.cs
|   |   |   |   |       |   `-- GetStudentInformationEndpoints.cs
|   |   |   |   |       `-- StudentInformation.Presentation.csproj
|   |   |   |   `-- Teaching
|   |   |   |       |-- Teaching.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |   `-- ICourseSectionRepository.cs
|   |   |   |       |   `-- Features
|   |   |   |       |       `-- GetMyCourses
|   |   |   |       |           `-- GetMyCoursesQuery.cs
|   |   |   |       |-- Teaching.Domain
|   |   |   |       |   `-- Aggregates
|   |   |   |       |       `-- CourseSection.cs
|   |   |   |       |-- Teaching.Infrastructure
|   |   |   |       |   |-- Repositories
|   |   |   |       |   |   `-- CourseSectionRepository.cs
|   |   |   |       |   `-- TeachingModuleRegistration.cs
|   |   |   |       `-- Teaching.Presentation
|   |   |   |           `-- Endpoints
|   |   |   |               `-- TeachingEndpoint.cs
|   |   |   |-- Administration
|   |   |   |   |-- AssetManagement
|   |   |   |   |   |-- AssetManagement.Application
|   |   |   |   |   |   |-- AssetManagement.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- RegisterAsset
|   |   |   |   |   |   |       `-- RegisterAssetCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- AssetManagement.Contracts
|   |   |   |   |   |   `-- AssetManagement.Contracts.csproj
|   |   |   |   |   |-- AssetManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Asset.cs
|   |   |   |   |   |   `-- AssetManagement.Domain.csproj
|   |   |   |   |   |-- AssetManagement.Infrastructure
|   |   |   |   |   |   `-- AssetManagement.Infrastructure.csproj
|   |   |   |   |   `-- AssetManagement.Presentation
|   |   |   |   |       |-- AssetManagement.Presentation.csproj
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           `-- RegisterAssetEndpoint.cs
|   |   |   |   |-- Facilities
|   |   |   |   |   |-- Facilities.Application
|   |   |   |   |   |   |-- Facilities.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- BookFacility
|   |   |   |   |   |   |       `-- BookFacilityCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Facilities.Contracts
|   |   |   |   |   |   `-- Facilities.Contracts.csproj
|   |   |   |   |   |-- Facilities.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- FacilityReservation.cs
|   |   |   |   |   |   `-- Facilities.Domain.csproj
|   |   |   |   |   |-- Facilities.Infrastructure
|   |   |   |   |   |   `-- Facilities.Infrastructure.csproj
|   |   |   |   |   `-- Facilities.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- BookFacilityEndpoint.cs
|   |   |   |   |       `-- Facilities.Presentation.csproj
|   |   |   |   |-- Finance
|   |   |   |   |   |-- Finance.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- ICashTransactionRepository.cs
|   |   |   |   |   |   |   |-- IPaymentGatewayService.cs
|   |   |   |   |   |   |   |-- IPaymentSessionRepository.cs
|   |   |   |   |   |   |   `-- IStudentBillingRepository.cs
|   |   |   |   |   |   |-- Consumers
|   |   |   |   |   |   |   |-- CourseDroppedIntegrationEventConsumer.cs
|   |   |   |   |   |   |   `-- StudentEnrolledIntegrationEventConsumer.cs
|   |   |   |   |   |   |-- Events
|   |   |   |   |   |   |   `-- Handlers
|   |   |   |   |   |   |       `-- StudentEnrolledEventHandler.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- ApplyScholarship
|   |   |   |   |   |   |   |   `-- ApplyScholarshipCommand.cs
|   |   |   |   |   |   |   |-- AssessTuition
|   |   |   |   |   |   |   |   `-- AssessTuitionCommand.cs
|   |   |   |   |   |   |   |-- CashTransactions
|   |   |   |   |   |   |   |   |-- CompleteCashTransactionCommand.cs
|   |   |   |   |   |   |   |   |-- GenerateCashTokenCommand.cs
|   |   |   |   |   |   |   |   `-- GetPendingCashTransactionQuery.cs
|   |   |   |   |   |   |   |-- ClearBalance
|   |   |   |   |   |   |   |   `-- ClearBalanceCommand.cs
|   |   |   |   |   |   |   |-- GetInvoices
|   |   |   |   |   |   |   |   |-- GetInvoicesQuery.cs
|   |   |   |   |   |   |   |   `-- GetInvoicesQueryHandler.cs
|   |   |   |   |   |   |   |-- IssueInvoice
|   |   |   |   |   |   |   |   `-- IssueInvoiceCommand.cs
|   |   |   |   |   |   |   |-- PaymentSessions
|   |   |   |   |   |   |   |   |-- CompletePaymentSessionCommand.cs
|   |   |   |   |   |   |   |   |-- CreatePaymentSessionCommand.cs
|   |   |   |   |   |   |   |   |-- GenerateDynamicQRCommand.cs
|   |   |   |   |   |   |   |   |-- GetAllPaymentSessionsQuery.cs
|   |   |   |   |   |   |   |   |-- ProcessBankingCallbackCommand.cs
|   |   |   |   |   |   |   |   |-- ReconcilePaymentSessionCommand.cs
|   |   |   |   |   |   |   |   `-- ValidatePaymentSessionQuery.cs
|   |   |   |   |   |   |   |-- ProcessPayment
|   |   |   |   |   |   |   |   `-- ProcessPaymentCommand.cs
|   |   |   |   |   |   |   `-- StudentBilling
|   |   |   |   |   |   |       |-- AdjustTuition
|   |   |   |   |   |   |       |   `-- AdjustTuitionCommand.cs
|   |   |   |   |   |   |       |-- AssessTuition
|   |   |   |   |   |   |       |   `-- AssessTuitionCommand.cs
|   |   |   |   |   |   |       `-- GetStudentBillings
|   |   |   |   |   |   |           `-- GetAllStudentBillingsQuery.cs
|   |   |   |   |   |   |-- Finance.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Finance.Contracts
|   |   |   |   |   |   `-- Finance.Contracts.csproj
|   |   |   |   |   |-- Finance.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- CashTransaction.cs
|   |   |   |   |   |   |   |-- PaymentSession.cs
|   |   |   |   |   |   |   `-- StudentBilling.cs
|   |   |   |   |   |   `-- Finance.Domain.csproj
|   |   |   |   |   |-- Finance.Infrastructure
|   |   |   |   |   |   |-- Finance.Infrastructure.csproj
|   |   |   |   |   |   |-- FinanceModuleRegistration.cs
|   |   |   |   |   |   |-- Migrations
|   |   |   |   |   |   |   |-- 20260811094007_AddPaymentSessions.Designer.cs
|   |   |   |   |   |   |   |-- 20260811094007_AddPaymentSessions.cs
|   |   |   |   |   |   |   |-- 20260811164412_AddCashTransactions.cs
|   |   |   |   |   |   |   |-- 20260813141220_AddBankReferenceToPaymentSession.Designer.cs
|   |   |   |   |   |   |   |-- 20260813141220_AddBankReferenceToPaymentSession.cs
|   |   |   |   |   |   |   `-- FinanceDbContextModelSnapshot.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   |-- FinanceDbContext.cs
|   |   |   |   |   |   |   `-- FinanceDbContextDesignTimeFactory.cs
|   |   |   |   |   |   |-- Repositories
|   |   |   |   |   |   |   |-- CashTransactionRepository.cs
|   |   |   |   |   |   |   |-- PaymentSessionRepository.cs
|   |   |   |   |   |   |   `-- StudentBillingRepository.cs
|   |   |   |   |   |   `-- Services
|   |   |   |   |   |       `-- BankingIntegrationService.cs
|   |   |   |   |   `-- Finance.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- BankingCallbackEndpoint.cs
|   |   |   |   |       |   |-- CashTransactionsEndpoint.cs
|   |   |   |   |       |   |-- InvoicesEndpoint.cs
|   |   |   |   |       |   |-- IssueInvoiceEndpoint.cs
|   |   |   |   |       |   |-- PaymentSessionEndpoint.cs
|   |   |   |   |       |   |-- StudentBillingEndpoint.cs
|   |   |   |   |       |   `-- StudentFinancialsEndpoint.cs
|   |   |   |   |       `-- Finance.Presentation.csproj
|   |   |   |   |-- HumanResources
|   |   |   |   |   |-- HumanResources.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IEmployeeRepository.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- OnboardEmployee
|   |   |   |   |   |   |       `-- OnboardEmployeeCommand.cs
|   |   |   |   |   |   |-- HumanResources.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- HumanResources.Contracts
|   |   |   |   |   |   `-- HumanResources.Contracts.csproj
|   |   |   |   |   |-- HumanResources.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Employee.cs
|   |   |   |   |   |   `-- HumanResources.Domain.csproj
|   |   |   |   |   |-- HumanResources.Infrastructure
|   |   |   |   |   |   |-- HumanResources.Infrastructure.csproj
|   |   |   |   |   |   |-- HumanResourcesModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- HumanResourcesDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- EmployeeRepository.cs
|   |   |   |   |   `-- HumanResources.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- OnboardEmployeeEndpoint.cs
|   |   |   |   |       `-- HumanResources.Presentation.csproj
|   |   |   |   |-- Inventory
|   |   |   |   |   |-- Inventory.Application
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- AdjustStock
|   |   |   |   |   |   |       `-- AdjustStockCommand.cs
|   |   |   |   |   |   |-- Inventory.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Inventory.Contracts
|   |   |   |   |   |   `-- Inventory.Contracts.csproj
|   |   |   |   |   |-- Inventory.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- StockItem.cs
|   |   |   |   |   |   `-- Inventory.Domain.csproj
|   |   |   |   |   |-- Inventory.Infrastructure
|   |   |   |   |   |   `-- Inventory.Infrastructure.csproj
|   |   |   |   |   `-- Inventory.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- AdjustStockEndpoint.cs
|   |   |   |   |       `-- Inventory.Presentation.csproj
|   |   |   |   |-- Library
|   |   |   |   |   |-- Library.Application
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- CheckoutItem
|   |   |   |   |   |   |       `-- CheckoutItemCommand.cs
|   |   |   |   |   |   |-- Library.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Library.Contracts
|   |   |   |   |   |   `-- Library.Contracts.csproj
|   |   |   |   |   |-- Library.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- CatalogItem.cs
|   |   |   |   |   |   `-- Library.Domain.csproj
|   |   |   |   |   |-- Library.Infrastructure
|   |   |   |   |   |   `-- Library.Infrastructure.csproj
|   |   |   |   |   `-- Library.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- CheckoutItemEndpoint.cs
|   |   |   |   |       `-- Library.Presentation.csproj
|   |   |   |   |-- MessCanteen
|   |   |   |   |   |-- MessCanteen.Application
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- ReserveMeal
|   |   |   |   |   |   |       `-- ReserveMealCommand.cs
|   |   |   |   |   |   |-- MessCanteen.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- MessCanteen.Contracts
|   |   |   |   |   |   `-- MessCanteen.Contracts.csproj
|   |   |   |   |   |-- MessCanteen.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- MealPlan.cs
|   |   |   |   |   |   `-- MessCanteen.Domain.csproj
|   |   |   |   |   |-- MessCanteen.Infrastructure
|   |   |   |   |   |   `-- MessCanteen.Infrastructure.csproj
|   |   |   |   |   `-- MessCanteen.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- ReserveMealEndpoint.cs
|   |   |   |   |       `-- MessCanteen.Presentation.csproj
|   |   |   |   |-- Payroll
|   |   |   |   |   |-- Payroll.Application
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- GeneratePayslip
|   |   |   |   |   |   |       `-- GeneratePayslipCommand.cs
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- Payroll.Application.csproj
|   |   |   |   |   |-- Payroll.Contracts
|   |   |   |   |   |   `-- Payroll.Contracts.csproj
|   |   |   |   |   |-- Payroll.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Payslip.cs
|   |   |   |   |   |   `-- Payroll.Domain.csproj
|   |   |   |   |   |-- Payroll.Infrastructure
|   |   |   |   |   |   `-- Payroll.Infrastructure.csproj
|   |   |   |   |   `-- Payroll.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- GeneratePayslipEndpoint.cs
|   |   |   |   |       `-- Payroll.Presentation.csproj
|   |   |   |   |-- Procurement
|   |   |   |   |   |-- Procurement.Application
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- CreatePurchaseOrder
|   |   |   |   |   |   |       `-- CreatePurchaseOrderCommand.cs
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- Procurement.Application.csproj
|   |   |   |   |   |-- Procurement.Contracts
|   |   |   |   |   |   `-- Procurement.Contracts.csproj
|   |   |   |   |   |-- Procurement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- PurchaseOrder.cs
|   |   |   |   |   |   `-- Procurement.Domain.csproj
|   |   |   |   |   |-- Procurement.Infrastructure
|   |   |   |   |   |   `-- Procurement.Infrastructure.csproj
|   |   |   |   |   `-- Procurement.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- CreatePurchaseOrderEndpoint.cs
|   |   |   |   |       `-- Procurement.Presentation.csproj
|   |   |   |   `-- Transport
|   |   |   |       |-- Transport.Application
|   |   |   |       |   |-- Features
|   |   |   |       |   |   `-- AssignRoute
|   |   |   |       |   |       `-- AssignRouteCommand.cs
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- Transport.Application.csproj
|   |   |   |       |-- Transport.Contracts
|   |   |   |       |   `-- Transport.Contracts.csproj
|   |   |   |       |-- Transport.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- BusRoute.cs
|   |   |   |       |   `-- Transport.Domain.csproj
|   |   |   |       |-- Transport.Infrastructure
|   |   |   |       |   `-- Transport.Infrastructure.csproj
|   |   |   |       `-- Transport.Presentation
|   |   |   |           |-- Endpoints
|   |   |   |           |   `-- AssignRouteEndpoint.cs
|   |   |   |           `-- Transport.Presentation.csproj
|   |   |   |-- Governance
|   |   |   |   |-- EventManagement
|   |   |   |   |   |-- EventManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IEventRepository.cs
|   |   |   |   |   |   |-- EventManagement.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- PlanEvent
|   |   |   |   |   |   |       `-- PlanEventCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- EventManagement.Contracts
|   |   |   |   |   |   `-- EventManagement.Contracts.csproj
|   |   |   |   |   |-- EventManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- CampusEvent.cs
|   |   |   |   |   |   `-- EventManagement.Domain.csproj
|   |   |   |   |   |-- EventManagement.Infrastructure
|   |   |   |   |   |   `-- EventManagement.Infrastructure.csproj
|   |   |   |   |   `-- EventManagement.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- PlanEventEndpoint.cs
|   |   |   |   |       `-- EventManagement.Presentation.csproj
|   |   |   |   |-- GrievanceManagement
|   |   |   |   |   |-- GrievanceManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IGrievanceRepository.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- SubmitComplaint
|   |   |   |   |   |   |       `-- SubmitComplaintCommand.cs
|   |   |   |   |   |   |-- GrievanceManagement.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- GrievanceManagement.Contracts
|   |   |   |   |   |   `-- GrievanceManagement.Contracts.csproj
|   |   |   |   |   |-- GrievanceManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Complaint.cs
|   |   |   |   |   |   `-- GrievanceManagement.Domain.csproj
|   |   |   |   |   |-- GrievanceManagement.Infrastructure
|   |   |   |   |   |   `-- GrievanceManagement.Infrastructure.csproj
|   |   |   |   |   `-- GrievanceManagement.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- SubmitComplaintEndpoint.cs
|   |   |   |   |       `-- GrievanceManagement.Presentation.csproj
|   |   |   |   |-- Helpdesk
|   |   |   |   |   |-- Helpdesk.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IHelpdeskRepository.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- CreateTicket
|   |   |   |   |   |   |       `-- CreateTicketCommand.cs
|   |   |   |   |   |   |-- Helpdesk.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Helpdesk.Contracts
|   |   |   |   |   |   `-- Helpdesk.Contracts.csproj
|   |   |   |   |   |-- Helpdesk.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- ServiceTicket.cs
|   |   |   |   |   |   `-- Helpdesk.Domain.csproj
|   |   |   |   |   |-- Helpdesk.Infrastructure
|   |   |   |   |   |   `-- Helpdesk.Infrastructure.csproj
|   |   |   |   |   `-- Helpdesk.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   `-- CreateTicketEndpoint.cs
|   |   |   |   |       `-- Helpdesk.Presentation.csproj
|   |   |   |   |-- QualityAccreditation
|   |   |   |   |   |-- QualityAccreditation.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IAccreditationRepository.cs
|   |   |   |   |   |   |-- Class1.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- GetActiveWorkflows
|   |   |   |   |   |   |   |   `-- GetActiveWorkflowsQuery.cs
|   |   |   |   |   |   |   `-- SubmitEvidence
|   |   |   |   |   |   |       `-- SubmitEvidenceCommand.cs
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- QualityAccreditation.Application.csproj
|   |   |   |   |   |-- QualityAccreditation.Contracts
|   |   |   |   |   |   `-- QualityAccreditation.Contracts.csproj
|   |   |   |   |   |-- QualityAccreditation.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- AccreditationEvidence.cs
|   |   |   |   |   |   `-- QualityAccreditation.Domain.csproj
|   |   |   |   |   |-- QualityAccreditation.Infrastructure
|   |   |   |   |   |   `-- QualityAccreditation.Infrastructure.csproj
|   |   |   |   |   `-- QualityAccreditation.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- SubmitEvidenceEndpoint.cs
|   |   |   |   |       |   `-- WorkflowEndpoint.cs
|   |   |   |   |       `-- QualityAccreditation.Presentation.csproj
|   |   |   |   `-- VisitorManagement
|   |   |   |       |-- VisitorManagement.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |   `-- IVisitorRepository.cs
|   |   |   |       |   |-- Features
|   |   |   |       |   |   `-- RegisterVisitor
|   |   |   |       |   |       `-- RegisterVisitorCommand.cs
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- VisitorManagement.Application.csproj
|   |   |   |       |-- VisitorManagement.Contracts
|   |   |   |       |   `-- VisitorManagement.Contracts.csproj
|   |   |   |       |-- VisitorManagement.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- VisitorLog.cs
|   |   |   |       |   `-- VisitorManagement.Domain.csproj
|   |   |   |       |-- VisitorManagement.Infrastructure
|   |   |   |       |   `-- VisitorManagement.Infrastructure.csproj
|   |   |   |       `-- VisitorManagement.Presentation
|   |   |   |           |-- Endpoints
|   |   |   |           |   `-- RegisterVisitorEndpoint.cs
|   |   |   |           `-- VisitorManagement.Presentation.csproj
|   |   |   |-- Platform
|   |   |   |   |-- AnalyticsBI
|   |   |   |   |   |-- AnalyticsBI.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IAnalyticsRepository.cs
|   |   |   |   |   |   |-- AnalyticsBI.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- GenerateReport
|   |   |   |   |   |   |   |   `-- GenerateReportCommand.cs
|   |   |   |   |   |   |   |-- GetClassPerformance
|   |   |   |   |   |   |   |   `-- GetClassPerformanceQuery.cs
|   |   |   |   |   |   |   `-- GetSystemHealth
|   |   |   |   |   |   |       `-- GetSystemHealthQuery.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- AnalyticsBI.Contracts
|   |   |   |   |   |   `-- AnalyticsBI.Contracts.csproj
|   |   |   |   |   |-- AnalyticsBI.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- DashboardReport.cs
|   |   |   |   |   |   `-- AnalyticsBI.Domain.csproj
|   |   |   |   |   |-- AnalyticsBI.Infrastructure
|   |   |   |   |   |   `-- AnalyticsBI.Infrastructure.csproj
|   |   |   |   |   `-- AnalyticsBI.Presentation
|   |   |   |   |       |-- AnalyticsBI.Presentation.csproj
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           |-- AcademicAnalyticsEndpoint.cs
|   |   |   |   |           |-- GenerateReportEndpoint.cs
|   |   |   |   |           `-- IntegrationHealthEndpoint.cs
|   |   |   |   |-- CRM
|   |   |   |   |   |-- CRM.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- ICRMRepository.cs
|   |   |   |   |   |   |-- CRM.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- RegisterProspect
|   |   |   |   |   |   |       `-- RegisterProspectCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- CRM.Contracts
|   |   |   |   |   |   `-- CRM.Contracts.csproj
|   |   |   |   |   |-- CRM.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Prospect.cs
|   |   |   |   |   |   `-- CRM.Domain.csproj
|   |   |   |   |   |-- CRM.Infrastructure
|   |   |   |   |   |   `-- CRM.Infrastructure.csproj
|   |   |   |   |   `-- CRM.Presentation
|   |   |   |   |       |-- CRM.Presentation.csproj
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           `-- RegisterProspectEndpoint.cs
|   |   |   |   |-- Communication
|   |   |   |   |   |-- Communication.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- ICommunicationRepository.cs
|   |   |   |   |   |   |-- Communication.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- GetInbox
|   |   |   |   |   |   |   |   `-- GetInboxQuery.cs
|   |   |   |   |   |   |   `-- SendMessage
|   |   |   |   |   |   |       `-- SendMessageCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Communication.Contracts
|   |   |   |   |   |   `-- Communication.Contracts.csproj
|   |   |   |   |   |-- Communication.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- DirectMessage.cs
|   |   |   |   |   |   `-- Communication.Domain.csproj
|   |   |   |   |   |-- Communication.Infrastructure
|   |   |   |   |   |   |-- Communication.Infrastructure.csproj
|   |   |   |   |   |   |-- CommunicationModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- CommunicationDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- CommunicationRepository.cs
|   |   |   |   |   `-- Communication.Presentation
|   |   |   |   |       |-- Communication.Presentation.csproj
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           |-- AcademicInboxEndpoint.cs
|   |   |   |   |           |-- GetInboxEndpoint.cs
|   |   |   |   |           `-- SendMessageEndpoint.cs
|   |   |   |   |-- DocumentManagement
|   |   |   |   |   |-- DocumentManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IDocumentRepository.cs
|   |   |   |   |   |   |-- DocumentManagement.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- GetFacultyDocuments
|   |   |   |   |   |   |   |   `-- GetFacultyDocumentsQuery.cs
|   |   |   |   |   |   |   `-- UploadDocument
|   |   |   |   |   |   |       `-- UploadDocumentCommand.cs
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- DocumentManagement.Contracts
|   |   |   |   |   |   `-- DocumentManagement.Contracts.csproj
|   |   |   |   |   |-- DocumentManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- CorporateDocument.cs
|   |   |   |   |   |   `-- DocumentManagement.Domain.csproj
|   |   |   |   |   |-- DocumentManagement.Infrastructure
|   |   |   |   |   |   |-- DocumentManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- DocumentManagementModuleRegistration.cs
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- DocumentManagementDbContext.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- DocumentRepository.cs
|   |   |   |   |   `-- DocumentManagement.Presentation
|   |   |   |   |       |-- DocumentManagement.Presentation.csproj
|   |   |   |   |       `-- Endpoints
|   |   |   |   |           |-- AcademicDocumentsEndpoint.cs
|   |   |   |   |           `-- UploadDocumentEndpoint.cs
|   |   |   |   |-- IdentityAccess
|   |   |   |   |   |-- IdentityAccess.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IUserRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |       `-- StudentEnrolledIntegrationEventConsumer.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- AuthenticateUser
|   |   |   |   |   |   |   |   |-- AuthenticateUserQuery.cs
|   |   |   |   |   |   |   |   `-- AuthenticateUserQueryHandler.cs
|   |   |   |   |   |   |   |-- FacultySettings
|   |   |   |   |   |   |   |   `-- FacultySettingsHandlers.cs
|   |   |   |   |   |   |   |-- GetSecurityRoles
|   |   |   |   |   |   |   |   `-- GetRolesQuery.cs
|   |   |   |   |   |   |   `-- RegisterUser
|   |   |   |   |   |   |       |-- RegisterUserCommand.cs
|   |   |   |   |   |   |       |-- RegisterUserCommandHandler.cs
|   |   |   |   |   |   |       `-- RegisterUserCommandValidator.cs
|   |   |   |   |   |   |-- IdentityAccess.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- IdentityAccess.Contracts
|   |   |   |   |   |   |-- IdentityAccess.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |   `-- UserRegisteredIntegrationEvent.cs
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- IdentityAccess.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- User.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |   `-- UserRegisteredDomainEvent.cs
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- IdentityAccess.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |       |-- Email.cs
|   |   |   |   |   |       |-- PersonName.cs
|   |   |   |   |   |       `-- UserId.cs
|   |   |   |   |   |-- IdentityAccess.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- IdentityAccess.Infrastructure.csproj
|   |   |   |   |   |   |-- IdentityAccessModuleRegistration.cs
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   |-- IdentityAccessDbContext.cs
|   |   |   |   |   |   |   `-- IdentityAccessDbContextDesignTimeFactory.cs
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |       `-- UserRepository.cs
|   |   |   |   |   |-- IdentityAccess.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- FacultySettingsEndpoint.cs
|   |   |   |   |   |   |   |-- LoginEndpoint.cs
|   |   |   |   |   |   |   |-- RegisterUserEndpoint.cs
|   |   |   |   |   |   |   `-- SecurityAdministrationEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- IdentityAccess.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- IdentityAccess.Tests.Architecture
|   |   |   |   |   |   |-- IdentityAccess.Tests.Architecture.csproj
|   |   |   |   |   |   `-- UnitTest1.cs
|   |   |   |   |   |-- IdentityAccess.Tests.Integration
|   |   |   |   |   |   |-- IdentityAccess.Tests.Integration.csproj
|   |   |   |   |   |   `-- UnitTest1.cs
|   |   |   |   |   `-- IdentityAccess.Tests.Unit
|   |   |   |   |       |-- IdentityAccess.Tests.Unit.csproj
|   |   |   |   |       `-- UnitTest1.cs
|   |   |   |   |-- MultiCampus
|   |   |   |   |   |-- MultiCampus.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- ICampusRepository.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- ConfigureCampus
|   |   |   |   |   |   |   |   `-- ConfigureCampusCommand.cs
|   |   |   |   |   |   |   `-- GetOrganizationHierarchy
|   |   |   |   |   |   |       `-- GetOrganizationHierarchyQuery.cs
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- MultiCampus.Application.csproj
|   |   |   |   |   |-- MultiCampus.Contracts
|   |   |   |   |   |   `-- MultiCampus.Contracts.csproj
|   |   |   |   |   |-- MultiCampus.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Campus.cs
|   |   |   |   |   |   `-- MultiCampus.Domain.csproj
|   |   |   |   |   |-- MultiCampus.Infrastructure
|   |   |   |   |   |   `-- MultiCampus.Infrastructure.csproj
|   |   |   |   |   `-- MultiCampus.Presentation
|   |   |   |   |       |-- Endpoints
|   |   |   |   |       |   |-- ConfigureCampusEndpoint.cs
|   |   |   |   |       |   `-- OrganizationEndpoint.cs
|   |   |   |   |       `-- MultiCampus.Presentation.csproj
|   |   |   |   `-- Notification
|   |   |   |       |-- Notification.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |   `-- INotificationRepository.cs
|   |   |   |       |   |-- Consumers
|   |   |   |       |   |   `-- WaitlistPromotedIntegrationEventConsumer.cs
|   |   |   |       |   |-- Features
|   |   |   |       |   |   `-- SendNotification
|   |   |   |       |   |       `-- SendNotificationCommand.cs
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- Notification.Application.csproj
|   |   |   |       |-- Notification.Contracts
|   |   |   |       |   `-- Notification.Contracts.csproj
|   |   |   |       |-- Notification.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- NotificationMessage.cs
|   |   |   |       |   `-- Notification.Domain.csproj
|   |   |   |       |-- Notification.Infrastructure
|   |   |   |       |   `-- Notification.Infrastructure.csproj
|   |   |   |       `-- Notification.Presentation
|   |   |   |           |-- Endpoints
|   |   |   |           |   `-- SendNotificationEndpoint.cs
|   |   |   |           `-- Notification.Presentation.csproj
|   |   |   `-- StudentLifecycle
|   |   |       |-- Admissions
|   |   |       |   |-- Admissions.Application
|   |   |       |   |   |-- Abstractions
|   |   |       |   |   |   |-- IAdmissionApplicationRepository.cs
|   |   |       |   |   |   `-- IProgramOfferingRepository.cs
|   |   |       |   |   |-- Admissions.Application.csproj
|   |   |       |   |   |-- Class1.cs
|   |   |       |   |   |-- Consumers
|   |   |       |   |   |   `-- PaymentVerifiedIntegrationEventConsumer.cs
|   |   |       |   |   |-- EventHandlers
|   |   |       |   |   |   `-- DomainEventHandlers
|   |   |       |   |   |       `-- StudentEnrolledDomainEventHandler.cs
|   |   |       |   |   |-- Features
|   |   |       |   |   |   |-- ActivateEnrollment
|   |   |       |   |   |   |   `-- ActivateEnrollmentCommand.cs
|   |   |       |   |   |   |-- ApproveApplication
|   |   |       |   |   |   |   `-- ApproveApplicationCommand.cs
|   |   |       |   |   |   |-- CheckEligibility
|   |   |       |   |   |   |   `-- CheckEligibilityQuery.cs
|   |   |       |   |   |   |-- CompleteInterview
|   |   |       |   |   |   |   `-- CompleteInterviewCommand.cs
|   |   |       |   |   |   |-- EndorseApplication
|   |   |       |   |   |   |   `-- EndorseApplicationCommand.cs
|   |   |       |   |   |   |-- EvaluateApplication
|   |   |       |   |   |   |   `-- EvaluateApplicationCommand.cs
|   |   |       |   |   |   |-- GetApplicantJourney
|   |   |       |   |   |   |   `-- GetApplicantJourneyQuery.cs
|   |   |       |   |   |   |-- GetApplicationStatus
|   |   |       |   |   |   |   `-- GetApplicationStatusQuery.cs
|   |   |       |   |   |   |-- GetPendingApplications
|   |   |       |   |   |   |   `-- GetPendingApplicationsQuery.cs
|   |   |       |   |   |   |-- GetProgramCatalog
|   |   |       |   |   |   |   `-- GetProgramCatalogQuery.cs
|   |   |       |   |   |   |-- PayApplicationFee
|   |   |       |   |   |   |   `-- PayApplicationFeeCommand.cs
|   |   |       |   |   |   |-- RecommendAdmission
|   |   |       |   |   |   |   `-- RecommendAdmissionCommand.cs
|   |   |       |   |   |   |-- ScheduleInterview
|   |   |       |   |   |   |   `-- ScheduleInterviewCommand.cs
|   |   |       |   |   |   |-- SubmitApplication
|   |   |       |   |   |   |   `-- SubmitApplicationCommand.cs
|   |   |       |   |   |   |-- UploadDocument
|   |   |       |   |   |   |   `-- UploadDocumentCommand.cs
|   |   |       |   |   |   `-- VerifyDocuments
|   |   |       |   |   |       `-- VerifyDocumentsCommand.cs
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- Admissions.Contracts
|   |   |       |   |   `-- Admissions.Contracts.csproj
|   |   |       |   |-- Admissions.Domain
|   |   |       |   |   |-- Admissions.Domain.csproj
|   |   |       |   |   |-- Aggregates
|   |   |       |   |   |   |-- AdmissionApplication.cs
|   |   |       |   |   |   `-- ProgramOffering.cs
|   |   |       |   |   |-- Entities
|   |   |       |   |   |   |-- AdmissionDocument.cs
|   |   |       |   |   |   `-- ApplicationTimelineEvent.cs
|   |   |       |   |   `-- Events
|   |   |       |   |       `-- StudentEnrolledDomainEvent.cs
|   |   |       |   |-- Admissions.Infrastructure
|   |   |       |   |   |-- Admissions.Infrastructure.csproj
|   |   |       |   |   |-- AdmissionsModuleRegistration.cs
|   |   |       |   |   |-- Migrations
|   |   |       |   |   |   |-- 20260810164412_AddFeePaymentFields.Designer.cs
|   |   |       |   |   |   |-- 20260810164412_AddFeePaymentFields.cs
|   |   |       |   |   |   |-- 20260811000000_AddDocumentFilePath.Designer.cs
|   |   |       |   |   |   |-- 20260811000000_AddDocumentFilePath.cs
|   |   |       |   |   |   `-- AdmissionsDbContextModelSnapshot.cs
|   |   |       |   |   |-- Persistence
|   |   |       |   |   |   |-- AdmissionsDbContext.cs
|   |   |       |   |   |   `-- AdmissionsDbContextDesignTimeFactory.cs  C#
|   |   |       |   |   `-- Repositories
|   |   |       |   |       |-- AdmissionApplicationRepository.cs
|   |   |       |   |       `-- ProgramOfferingRepository.cs
|   |   |       |   `-- Admissions.Presentation
|   |   |       |       |-- Admissions.Presentation.csproj
|   |   |       |       `-- Endpoints
|   |   |       |           |-- AdmissionsWorkflowEndpoint.cs
|   |   |       |           |-- ApplicationsEndpoint.cs
|   |   |       |           |-- DocumentsEndpoint.cs
|   |   |       |           |-- EligibilityEndpoint.cs
|   |   |       |           |-- FacultyAdmissionsEndpoint.cs
|   |   |       |           |-- GetApplicationStatusEndpoint.cs
|   |   |       |           `-- ProgramsEndpoint.cs
|   |   |       |-- Alumni
|   |   |       |   |-- Alumni.Application
|   |   |       |   |   |-- Alumni.Application.csproj
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetAlumniStatus
|   |   |       |   |   |       `-- GetAlumniStatusQuery.cs
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- Alumni.Contracts
|   |   |       |   |   `-- Alumni.Contracts.csproj
|   |   |       |   |-- Alumni.Domain
|   |   |       |   |   `-- Alumni.Domain.csproj
|   |   |       |   |-- Alumni.Infrastructure
|   |   |       |   |   `-- Alumni.Infrastructure.csproj
|   |   |       |   `-- Alumni.Presentation
|   |   |       |       |-- Alumni.Presentation.csproj
|   |   |       |       `-- Endpoints
|   |   |       |           `-- GetAlumniStatusEndpoint.cs
|   |   |       |-- GuidanceCounseling
|   |   |       |   |-- GuidanceCounseling.Application
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetGuidanceSessions
|   |   |       |   |   |       `-- GetGuidanceSessionsQuery.cs
|   |   |       |   |   |-- GuidanceCounseling.Application.csproj
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- GuidanceCounseling.Contracts
|   |   |       |   |   `-- GuidanceCounseling.Contracts.csproj
|   |   |       |   |-- GuidanceCounseling.Domain
|   |   |       |   |   `-- GuidanceCounseling.Domain.csproj
|   |   |       |   |-- GuidanceCounseling.Infrastructure
|   |   |       |   |   `-- GuidanceCounseling.Infrastructure.csproj
|   |   |       |   `-- GuidanceCounseling.Presentation
|   |   |       |       |-- Endpoints
|   |   |       |       |   `-- GetGuidanceSessionsEndpoint.cs
|   |   |       |       `-- GuidanceCounseling.Presentation.csproj
|   |   |       |-- HealthCenter
|   |   |       |   |-- HealthCenter.Application
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetHealthAppointments
|   |   |       |   |   |       `-- GetHealthAppointmentsQuery.cs
|   |   |       |   |   |-- HealthCenter.Application.csproj
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- HealthCenter.Contracts
|   |   |       |   |   `-- HealthCenter.Contracts.csproj
|   |   |       |   |-- HealthCenter.Domain
|   |   |       |   |   `-- HealthCenter.Domain.csproj
|   |   |       |   |-- HealthCenter.Infrastructure
|   |   |       |   |   `-- HealthCenter.Infrastructure.csproj
|   |   |       |   `-- HealthCenter.Presentation
|   |   |       |       |-- Endpoints
|   |   |       |       |   `-- GetHealthAppointmentsEndpoint.cs
|   |   |       |       `-- HealthCenter.Presentation.csproj
|   |   |       |-- Hostel
|   |   |       |   |-- Hostel.Application
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetRoomAllocation
|   |   |       |   |   |       `-- GetRoomAllocationQuery.cs
|   |   |       |   |   |-- Hostel.Application.csproj
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- Hostel.Contracts
|   |   |       |   |   `-- Hostel.Contracts.csproj
|   |   |       |   |-- Hostel.Domain
|   |   |       |   |   `-- Hostel.Domain.csproj
|   |   |       |   |-- Hostel.Infrastructure
|   |   |       |   |   `-- Hostel.Infrastructure.csproj
|   |   |       |   `-- Hostel.Presentation
|   |   |       |       |-- Endpoints
|   |   |       |       |   `-- GetRoomAllocationEndpoint.cs
|   |   |       |       `-- Hostel.Presentation.csproj
|   |   |       `-- PlacementCareer
|   |   |           |-- PlacementCareer.Application
|   |   |           |   |-- Features
|   |   |           |   |   `-- GetJobPostings
|   |   |           |   |       `-- GetJobPostingsQuery.cs
|   |   |           |   |-- ModuleRegistration.cs
|   |   |           |   `-- PlacementCareer.Application.csproj
|   |   |           |-- PlacementCareer.Contracts
|   |   |           |   `-- PlacementCareer.Contracts.csproj
|   |   |           |-- PlacementCareer.Domain
|   |   |           |   `-- PlacementCareer.Domain.csproj
|   |   |           |-- PlacementCareer.Infrastructure
|   |   |           |   `-- PlacementCareer.Infrastructure.csproj
|   |   |           `-- PlacementCareer.Presentation
|   |   |               |-- Endpoints
|   |   |               |   `-- GetJobPostingsEndpoint.cs
|   |   |               `-- PlacementCareer.Presentation.csproj
|   |   |-- Platform
|   |   `-- SharedKernel
|   |       |-- SharedKernel.Application
|   |       |   |-- Abstractions
|   |       |   |-- Behaviors
|   |       |   |-- Pagination
|   |       |   |-- Results
|   |       |   `-- SharedKernel.Application.csproj
|   |       |-- SharedKernel.Domain
|   |       |   |-- Audit
|   |       |   |-- Identifiers
|   |       |   |-- Primitives
|   |       |   |   |-- AggregateRoot.cs
|   |       |   |   |-- Entity.cs
|   |       |   |   |-- IDomainEvent.cs
|   |       |   |   |-- Result.cs
|   |       |   |   `-- ValueObject.cs
|   |       |   |-- SharedKernel.Domain.csproj
|   |       |   `-- ValueObjects
|   |       |-- SharedKernel.Infrastructure
|   |       |   |-- Inbox
|   |       |   |-- Messaging
|   |       |   |-- Outbox
|   |       |   |-- Persistence
|   |       |   `-- SharedKernel.Infrastructure.csproj
|   |       `-- SharedKernel.Observability
|   |           |-- HealthChecks
|   |           |-- Logging
|   |           |-- Metrics
|   |           |-- SharedKernel.Observability.csproj
|   |           `-- Tracing
|   |-- structure.md
|   `-- tests
|       |-- ArchitectureTests
|       |   |-- ContractOnlyDependencyTests.cs
|       |   |-- ModuleRegistrationConventionTests.cs
|       |   |-- NoCrossModuleDomainReferenceTests.cs
|       |   `-- SharedKernelPurityTests.cs
|       |-- DomainTests
|       |   |-- Finance
|       |   |   `-- InvoiceBalancingTests.cs
|       |   |-- GrievanceManagement
|       |   |   `-- EscalationChainTests.cs
|       |   |-- Hostel
|       |   |   `-- RoomCapacityInvariantTests.cs
|       |   `-- StudentInformation
|       |       `-- EnrollmentInvariantTests.cs
|       |-- EndToEndTests
|       |   |-- AdmissionToEnrollmentFlow.cs
|       |   |-- GrievanceToFacilitiesFlow.cs
|       |   `-- HostelAllocationToBillingFlow.cs
|       |-- PerformanceTests
|       |   |-- InvoiceIssuanceThroughput.cs
|       |   |-- PayrollBatchCalculation.cs
|       |   `-- RegistrationPeakLoad.cs
|       `-- SecurityTests
|           |-- AuthorizationPolicyTests.cs
|           `-- DataClassificationLeakTests.cs
|-- University-ERP-Frontend
|   |-- Dockerfile.build-all
|   |-- University-ERP-Frontend.md
|   |-- apps
|   |   |-- admin-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-CmnkJuXB.css
|   |   |   |   |   `-- index-fa44ciig.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- AcademicConfiguration
|   |   |   |   |   |   |-- AcademicConfiguration.api.ts
|   |   |   |   |   |   |-- AcademicConfiguration.hooks.ts
|   |   |   |   |   |   |-- AcademicConfiguration.page.tsx
|   |   |   |   |   |   |-- AcademicConfiguration.test.tsx
|   |   |   |   |   |   `-- AcademicConfiguration.types.ts
|   |   |   |   |   |-- AdmissionsProcessing
|   |   |   |   |   |   |-- AdmissionsProcessing.hooks.ts
|   |   |   |   |   |   |-- AdmissionsWorkspace.page.tsx
|   |   |   |   |   |   `-- components
|   |   |   |   |   |       |-- ChairpersonEvaluationView.tsx
|   |   |   |   |   |       |-- DeanEndorsementView.tsx
|   |   |   |   |   |       |-- RegistrarEnrollmentView.tsx
|   |   |   |   |   |       `-- SecretaryIntakeView.tsx
|   |   |   |   |   |-- AssetRegistry
|   |   |   |   |   |   |-- AssetRegistry.api.ts
|   |   |   |   |   |   |-- AssetRegistry.hooks.ts
|   |   |   |   |   |   |-- AssetRegistry.page.tsx
|   |   |   |   |   |   |-- AssetRegistry.test.tsx
|   |   |   |   |   |   `-- AssetRegistry.types.ts
|   |   |   |   |   |-- AuditCompliance
|   |   |   |   |   |   |-- AuditCompliance.api.ts
|   |   |   |   |   |   |-- AuditCompliance.hooks.ts
|   |   |   |   |   |   |-- AuditCompliance.page.tsx
|   |   |   |   |   |   |-- AuditCompliance.test.tsx
|   |   |   |   |   |   `-- AuditCompliance.types.ts
|   |   |   |   |   |-- CanteenOrders
|   |   |   |   |   |   |-- CanteenOrders.api.ts
|   |   |   |   |   |   |-- CanteenOrders.hooks.ts
|   |   |   |   |   |   |-- CanteenOrders.page.tsx
|   |   |   |   |   |   |-- CanteenOrders.test.tsx
|   |   |   |   |   |   `-- CanteenOrders.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- EmployeeManagement
|   |   |   |   |   |   |-- EmployeeManagement.api.ts
|   |   |   |   |   |   |-- EmployeeManagement.hooks.ts
|   |   |   |   |   |   |-- EmployeeManagement.page.tsx
|   |   |   |   |   |   |-- EmployeeManagement.test.tsx
|   |   |   |   |   |   `-- EmployeeManagement.types.ts
|   |   |   |   |   |-- FacilityBooking
|   |   |   |   |   |   |-- FacilityBooking.api.ts
|   |   |   |   |   |   |-- FacilityBooking.hooks.ts
|   |   |   |   |   |   |-- FacilityBooking.page.tsx
|   |   |   |   |   |   |-- FacilityBooking.test.tsx
|   |   |   |   |   |   `-- FacilityBooking.types.ts
|   |   |   |   |   |-- FleetManagement
|   |   |   |   |   |   |-- FleetManagement.api.ts
|   |   |   |   |   |   |-- FleetManagement.hooks.ts
|   |   |   |   |   |   |-- FleetManagement.page.tsx
|   |   |   |   |   |   |-- FleetManagement.test.tsx
|   |   |   |   |   |   `-- FleetManagement.types.ts
|   |   |   |   |   |-- IdentitySecurity
|   |   |   |   |   |   |-- IdentitySecurity.api.ts
|   |   |   |   |   |   |-- IdentitySecurity.hooks.ts
|   |   |   |   |   |   |-- IdentitySecurity.page.tsx
|   |   |   |   |   |   |-- IdentitySecurity.test.tsx
|   |   |   |   |   |   `-- IdentitySecurity.types.ts
|   |   |   |   |   |-- IntegrationManagement
|   |   |   |   |   |   |-- IntegrationManagement.api.ts
|   |   |   |   |   |   |-- IntegrationManagement.hooks.ts
|   |   |   |   |   |   |-- IntegrationManagement.page.tsx
|   |   |   |   |   |   |-- IntegrationManagement.test.tsx
|   |   |   |   |   |   `-- IntegrationManagement.types.ts
|   |   |   |   |   |-- OrganizationManagement
|   |   |   |   |   |   |-- OrganizationManagement.api.ts
|   |   |   |   |   |   |-- OrganizationManagement.hooks.ts
|   |   |   |   |   |   |-- OrganizationManagement.page.tsx
|   |   |   |   |   |   |-- OrganizationManagement.test.tsx
|   |   |   |   |   |   `-- OrganizationManagement.types.ts
|   |   |   |   |   |-- PlatformMonitoring
|   |   |   |   |   |   |-- PlatformMonitoring.api.ts
|   |   |   |   |   |   |-- PlatformMonitoring.hooks.ts
|   |   |   |   |   |   |-- PlatformMonitoring.page.tsx
|   |   |   |   |   |   |-- PlatformMonitoring.test.tsx
|   |   |   |   |   |   `-- PlatformMonitoring.types.ts
|   |   |   |   |   |-- PurchaseOrders
|   |   |   |   |   |   |-- PurchaseOrders.api.ts
|   |   |   |   |   |   |-- PurchaseOrders.hooks.ts
|   |   |   |   |   |   |-- PurchaseOrders.page.tsx
|   |   |   |   |   |   |-- PurchaseOrders.test.tsx
|   |   |   |   |   |   `-- PurchaseOrders.types.ts
|   |   |   |   |   |-- RegistrarWorkspace
|   |   |   |   |   |   |-- RegistrarWorkspace.page.tsx
|   |   |   |   |   |   `-- components
|   |   |   |   |   |       |-- GraduationClearanceView.tsx
|   |   |   |   |   |       `-- TranscriptRequestsView.tsx
|   |   |   |   |   |-- Reports
|   |   |   |   |   |   |-- Reports.api.ts
|   |   |   |   |   |   |-- Reports.hooks.ts
|   |   |   |   |   |   |-- Reports.page.tsx
|   |   |   |   |   |   |-- Reports.test.tsx
|   |   |   |   |   |   `-- Reports.types.ts
|   |   |   |   |   |-- RoleAdministration
|   |   |   |   |   |   |-- RoleAdministration.api.ts
|   |   |   |   |   |   |-- RoleAdministration.hooks.ts
|   |   |   |   |   |   |-- RoleAdministration.page.tsx
|   |   |   |   |   |   |-- RoleAdministration.test.tsx
|   |   |   |   |   |   `-- RoleAdministration.types.ts
|   |   |   |   |   |-- StockManagement
|   |   |   |   |   |   |-- StockManagement.api.ts
|   |   |   |   |   |   |-- StockManagement.hooks.ts
|   |   |   |   |   |   |-- StockManagement.page.tsx
|   |   |   |   |   |   |-- StockManagement.test.tsx
|   |   |   |   |   |   `-- StockManagement.types.ts
|   |   |   |   |   |-- SystemAdministration
|   |   |   |   |   |   |-- SystemAdministration.api.ts
|   |   |   |   |   |   |-- SystemAdministration.hooks.ts
|   |   |   |   |   |   |-- SystemAdministration.page.tsx
|   |   |   |   |   |   |-- SystemAdministration.test.tsx
|   |   |   |   |   |   `-- SystemAdministration.types.ts
|   |   |   |   |   |-- UserAdministration
|   |   |   |   |   |   |-- UserAdministration.api.ts
|   |   |   |   |   |   |-- UserAdministration.hooks.ts
|   |   |   |   |   |   |-- UserAdministration.page.tsx
|   |   |   |   |   |   |-- UserAdministration.test.tsx
|   |   |   |   |   |   `-- UserAdministration.types.ts
|   |   |   |   |   `-- WorkflowManagement
|   |   |   |   |       |-- WorkflowManagement.api.ts
|   |   |   |   |       |-- WorkflowManagement.hooks.ts
|   |   |   |   |       |-- WorkflowManagement.page.tsx
|   |   |   |   |       |-- WorkflowManagement.test.tsx
|   |   |   |   |       `-- WorkflowManagement.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- admissions-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-CmnkJuXB.css
|   |   |   |   |   `-- index-DimZ4ETb.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- App.tsx
|   |   |   |   |-- features
|   |   |   |   |   |-- AdmissionCases
|   |   |   |   |   |   |-- AdmissionCases.api.ts
|   |   |   |   |   |   |-- AdmissionCases.hooks.ts
|   |   |   |   |   |   |-- AdmissionCases.page.tsx
|   |   |   |   |   |   |-- AdmissionCases.page.tsx.bak
|   |   |   |   |   |   |-- AdmissionCases.test.tsx
|   |   |   |   |   |   `-- AdmissionCases.types.ts
|   |   |   |   |   |-- AdmissionsDecision
|   |   |   |   |   |   |-- AdmissionsDecision.api.ts
|   |   |   |   |   |   |-- AdmissionsDecision.hooks.ts
|   |   |   |   |   |   |-- AdmissionsDecision.page.tsx
|   |   |   |   |   |   |-- AdmissionsDecision.test.tsx
|   |   |   |   |   |   `-- AdmissionsDecision.types.ts
|   |   |   |   |   |-- AdmissionsProcessing
|   |   |   |   |   |   `-- components
|   |   |   |   |   |       `-- SecretaryIntakeView.tsx
|   |   |   |   |   |-- Applications
|   |   |   |   |   |   |-- AdmissionCase.page.tsx
|   |   |   |   |   |   `-- Applications.page.tsx
|   |   |   |   |   |-- Communication
|   |   |   |   |   |   `-- ApplicantCommunication.page.tsx
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   `-- Dashboard.page.tsx
|   |   |   |   |   |-- EnrollmentHandoff
|   |   |   |   |   |   |-- EnrollmentHandoff.api.ts
|   |   |   |   |   |   |-- EnrollmentHandoff.hooks.ts
|   |   |   |   |   |   |-- EnrollmentHandoff.page.tsx
|   |   |   |   |   |   |-- EnrollmentHandoff.test.tsx
|   |   |   |   |   |   `-- EnrollmentHandoff.types.ts
|   |   |   |   |   |-- Examination
|   |   |   |   |   |   `-- EntranceExamination.page.tsx
|   |   |   |   |   |-- Fees
|   |   |   |   |   |   `-- AdmissionFees.page.tsx
|   |   |   |   |   |-- Intake
|   |   |   |   |   |   |-- ApplicationIntake.page.tsx
|   |   |   |   |   |   `-- ApplicationIntake.page.tsx.bak
|   |   |   |   |   |-- Interviews
|   |   |   |   |   |   |-- Interviews.api.ts
|   |   |   |   |   |   |-- Interviews.hooks.ts
|   |   |   |   |   |   |-- Interviews.page.tsx
|   |   |   |   |   |   |-- Interviews.test.tsx
|   |   |   |   |   |   `-- Interviews.types.ts
|   |   |   |   |   |-- Queue
|   |   |   |   |   |   `-- AdmissionQueue.page.tsx
|   |   |   |   |   |-- Reports
|   |   |   |   |   |   `-- AdmissionsReports.page.tsx
|   |   |   |   |   |-- RequirementManagement
|   |   |   |   |   |   |-- RequirementManagement.api.ts
|   |   |   |   |   |   |-- RequirementManagement.hooks.ts
|   |   |   |   |   |   |-- RequirementManagement.page.tsx
|   |   |   |   |   |   |-- RequirementManagement.test.tsx
|   |   |   |   |   |   `-- RequirementManagement.types.ts
|   |   |   |   |   |-- Review
|   |   |   |   |   |   `-- ApplicationReview.page.tsx
|   |   |   |   |   `-- Verification
|   |   |   |   |       `-- ApplicationVerification.page.tsx
|   |   |   |   |-- index.css
|   |   |   |   |-- main.tsx
|   |   |   |   `-- shell
|   |   |   |       |-- AppShell.tsx
|   |   |   |       `-- Routing.tsx
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- applicant-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-7TJ7Ms84.js
|   |   |   |   |   `-- index-CmnkJuXB.css
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- AdmissionStatus
|   |   |   |   |   |   |-- AdmissionStatus.api.ts
|   |   |   |   |   |   |-- AdmissionStatus.hooks.ts
|   |   |   |   |   |   |-- AdmissionStatus.page.tsx
|   |   |   |   |   |   |-- AdmissionStatus.test.tsx
|   |   |   |   |   |   `-- AdmissionStatus.types.ts
|   |   |   |   |   |-- ApplicantJourney.hooks.ts
|   |   |   |   |   |-- ApplicationForm
|   |   |   |   |   |   |-- ApplicationForm.api.ts
|   |   |   |   |   |   |-- ApplicationForm.hooks.ts
|   |   |   |   |   |   |-- ApplicationForm.page.tsx
|   |   |   |   |   |   |-- ApplicationForm.test.tsx
|   |   |   |   |   |   `-- ApplicationForm.types.ts
|   |   |   |   |   |-- ApplicationStatus
|   |   |   |   |   |   |-- ApplicationStatus.api.ts
|   |   |   |   |   |   |-- ApplicationStatus.hooks.ts
|   |   |   |   |   |   |-- ApplicationStatus.page.tsx
|   |   |   |   |   |   |-- ApplicationStatus.test.tsx
|   |   |   |   |   |   `-- ApplicationStatus.types.ts
|   |   |   |   |   |-- ApplicationTimeline
|   |   |   |   |   |   |-- ApplicationTimeline.api.ts
|   |   |   |   |   |   |-- ApplicationTimeline.hooks.ts
|   |   |   |   |   |   |-- ApplicationTimeline.page.tsx
|   |   |   |   |   |   |-- ApplicationTimeline.test.tsx
|   |   |   |   |   |   `-- ApplicationTimeline.types.ts
|   |   |   |   |   |-- ApplicationWizard
|   |   |   |   |   |   |-- ApplicationWizard.api.ts
|   |   |   |   |   |   |-- ApplicationWizard.hooks.ts
|   |   |   |   |   |   |-- ApplicationWizard.page.tsx
|   |   |   |   |   |   |-- ApplicationWizard.test.tsx
|   |   |   |   |   |   `-- ApplicationWizard.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- DocumentSubmission
|   |   |   |   |   |   |-- DocumentSubmission.api.ts
|   |   |   |   |   |   |-- DocumentSubmission.hooks.ts
|   |   |   |   |   |   |-- DocumentSubmission.page.tsx
|   |   |   |   |   |   |-- DocumentSubmission.test.tsx
|   |   |   |   |   |   `-- DocumentSubmission.types.ts
|   |   |   |   |   |-- DocumentUpload
|   |   |   |   |   |   |-- DocumentUpload.api.ts
|   |   |   |   |   |   |-- DocumentUpload.hooks.ts
|   |   |   |   |   |   |-- DocumentUpload.page.tsx
|   |   |   |   |   |   |-- DocumentUpload.test.tsx
|   |   |   |   |   |   `-- DocumentUpload.types.ts
|   |   |   |   |   |-- EligibilityChecker
|   |   |   |   |   |   |-- EligibilityChecker.api.ts
|   |   |   |   |   |   |-- EligibilityChecker.hooks.ts
|   |   |   |   |   |   |-- EligibilityChecker.page.tsx
|   |   |   |   |   |   |-- EligibilityChecker.test.tsx
|   |   |   |   |   |   `-- EligibilityChecker.types.ts
|   |   |   |   |   |-- EnrollmentPayment
|   |   |   |   |   |   |-- ApplicationFeePayment.page.tsx
|   |   |   |   |   |   |-- EnrollmentPayment.api.ts
|   |   |   |   |   |   |-- EnrollmentPayment.hooks.ts
|   |   |   |   |   |   |-- EnrollmentPayment.page.tsx
|   |   |   |   |   |   |-- EnrollmentPayment.test.tsx
|   |   |   |   |   |   `-- EnrollmentPayment.types.ts
|   |   |   |   |   |-- InterviewScheduling
|   |   |   |   |   |   |-- InterviewScheduling.api.ts
|   |   |   |   |   |   |-- InterviewScheduling.hooks.ts
|   |   |   |   |   |   |-- InterviewScheduling.page.tsx
|   |   |   |   |   |   |-- InterviewScheduling.test.tsx
|   |   |   |   |   |   `-- InterviewScheduling.types.ts
|   |   |   |   |   |-- Offers
|   |   |   |   |   |   |-- Offers.api.ts
|   |   |   |   |   |   |-- Offers.hooks.ts
|   |   |   |   |   |   |-- Offers.page.tsx
|   |   |   |   |   |   |-- Offers.test.tsx
|   |   |   |   |   |   `-- Offers.types.ts
|   |   |   |   |   `-- ProgramExplorer
|   |   |   |   |       |-- ProgramExplorer.api.ts
|   |   |   |   |       |-- ProgramExplorer.hooks.ts
|   |   |   |   |       |-- ProgramExplorer.page.tsx
|   |   |   |   |       |-- ProgramExplorer.test.tsx
|   |   |   |   |       `-- ProgramExplorer.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- ErrorBoundary.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |-- theme.css
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- structure.md
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- faculty-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-Dgt8zfi3.js
|   |   |   |   |   `-- index-cJBQpNUN.css
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- Advising
|   |   |   |   |   |   |-- Advising.api.ts
|   |   |   |   |   |   |-- Advising.hooks.ts
|   |   |   |   |   |   |-- Advising.page.tsx
|   |   |   |   |   |   |-- Advising.test.tsx
|   |   |   |   |   |   `-- Advising.types.ts
|   |   |   |   |   |-- Analytics
|   |   |   |   |   |   |-- Analytics.api.ts
|   |   |   |   |   |   |-- Analytics.hooks.ts
|   |   |   |   |   |   |-- Analytics.page.tsx
|   |   |   |   |   |   |-- Analytics.test.tsx
|   |   |   |   |   |   `-- Analytics.types.ts
|   |   |   |   |   |-- Assessments
|   |   |   |   |   |   |-- Assessments.api.ts
|   |   |   |   |   |   |-- Assessments.hooks.ts
|   |   |   |   |   |   |-- Assessments.page.tsx
|   |   |   |   |   |   |-- Assessments.test.tsx
|   |   |   |   |   |   `-- Assessments.types.ts
|   |   |   |   |   |-- ChairpersonWorkspace
|   |   |   |   |   |   |-- AcademicEvaluation.page.tsx
|   |   |   |   |   |   |-- CurriculumMatching.page.tsx
|   |   |   |   |   |   |-- EvaluationQueue.page.tsx
|   |   |   |   |   |   `-- Recommendation.page.tsx
|   |   |   |   |   |-- Communication
|   |   |   |   |   |   |-- Communication.api.ts
|   |   |   |   |   |   |-- Communication.hooks.ts
|   |   |   |   |   |   |-- Communication.page.tsx
|   |   |   |   |   |   |-- Communication.test.tsx
|   |   |   |   |   |   `-- Communication.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- DeanWorkspace
|   |   |   |   |   |   |-- CollegeApproval.page.tsx
|   |   |   |   |   |   |-- Endorsement.page.tsx
|   |   |   |   |   |   `-- RecommendationQueue.page.tsx
|   |   |   |   |   |-- Documents
|   |   |   |   |   |   |-- Documents.api.ts
|   |   |   |   |   |   |-- Documents.hooks.ts
|   |   |   |   |   |   |-- Documents.page.tsx
|   |   |   |   |   |   |-- Documents.test.tsx
|   |   |   |   |   |   `-- Documents.types.ts
|   |   |   |   |   |-- FacultySecurity
|   |   |   |   |   |   |-- ApplicantAccess.page.tsx
|   |   |   |   |   |   |-- ConfidentialDocuments.page.tsx
|   |   |   |   |   |   `-- RecommendationAudit.page.tsx
|   |   |   |   |   |-- LMSManager
|   |   |   |   |   |   |-- LMSManager.hooks.ts
|   |   |   |   |   |   `-- LMSManager.page.tsx
|   |   |   |   |   |-- Research
|   |   |   |   |   |   |-- Research.api.ts
|   |   |   |   |   |   |-- Research.hooks.ts
|   |   |   |   |   |   |-- Research.page.tsx
|   |   |   |   |   |   |-- Research.test.tsx
|   |   |   |   |   |   `-- Research.types.ts
|   |   |   |   |   |-- Schedule
|   |   |   |   |   |   |-- Schedule.api.ts
|   |   |   |   |   |   |-- Schedule.hooks.ts
|   |   |   |   |   |   |-- Schedule.page.tsx
|   |   |   |   |   |   |-- Schedule.test.tsx
|   |   |   |   |   |   `-- Schedule.types.ts
|   |   |   |   |   |-- SecretaryWorkspace
|   |   |   |   |   |   |-- AdmissionQueue.page.tsx
|   |   |   |   |   |   |-- DocumentVerification.page.tsx
|   |   |   |   |   |   |-- InterviewScheduling.page.tsx
|   |   |   |   |   |   `-- MissingRequirements.page.tsx
|   |   |   |   |   |-- Settings
|   |   |   |   |   |   |-- Settings.api.ts
|   |   |   |   |   |   |-- Settings.hooks.ts
|   |   |   |   |   |   |-- Settings.page.tsx
|   |   |   |   |   |   |-- Settings.test.tsx
|   |   |   |   |   |   `-- Settings.types.ts
|   |   |   |   |   |-- Students
|   |   |   |   |   |   |-- Students.api.ts
|   |   |   |   |   |   |-- Students.hooks.ts
|   |   |   |   |   |   |-- Students.page.tsx
|   |   |   |   |   |   |-- Students.test.tsx
|   |   |   |   |   |   |-- Students.types.ts
|   |   |   |   |   |   `-- StudentsDashboard.page.tsx
|   |   |   |   |   `-- Teaching
|   |   |   |   |       |-- SectionRoster.page.tsx
|   |   |   |   |       |-- SectionRoster.test.tsx
|   |   |   |   |       |-- Teaching.api.ts
|   |   |   |   |       |-- Teaching.hooks.ts
|   |   |   |   |       |-- Teaching.page.tsx
|   |   |   |   |       |-- Teaching.test.tsx
|   |   |   |   |       |-- Teaching.types.ts
|   |   |   |   |       `-- TeachingDashboard.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |-- theme.css
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- finance-console
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-D4VupJRD.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- Budgeting
|   |   |   |   |   |   |-- Budgeting.api.ts
|   |   |   |   |   |   |-- Budgeting.hooks.ts
|   |   |   |   |   |   |-- Budgeting.page.tsx
|   |   |   |   |   |   |-- Budgeting.test.tsx
|   |   |   |   |   |   `-- Budgeting.types.ts
|   |   |   |   |   |-- Cashier
|   |   |   |   |   |   |-- ClearanceApproval.page.tsx
|   |   |   |   |   |   `-- PaymentGateway.page.tsx
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- EnrollmentFinance
|   |   |   |   |   |   |-- AdmissionAssessment
|   |   |   |   |   |   |   |-- AdmissionAssessment.api.ts
|   |   |   |   |   |   |   |-- AdmissionAssessment.hooks.ts
|   |   |   |   |   |   |   |-- AdmissionAssessment.page.tsx
|   |   |   |   |   |   |   |-- AdmissionAssessment.test.tsx
|   |   |   |   |   |   |   `-- AdmissionAssessment.types.ts
|   |   |   |   |   |   |-- Downpayment
|   |   |   |   |   |   |   |-- Downpayment.api.ts
|   |   |   |   |   |   |   |-- Downpayment.hooks.ts
|   |   |   |   |   |   |   |-- Downpayment.page.tsx
|   |   |   |   |   |   |   |-- Downpayment.test.tsx
|   |   |   |   |   |   |   `-- Downpayment.types.ts
|   |   |   |   |   |   `-- FinancialClearance
|   |   |   |   |   |       |-- FinancialClearance.api.ts
|   |   |   |   |   |       |-- FinancialClearance.hooks.ts
|   |   |   |   |   |       |-- FinancialClearance.page.tsx
|   |   |   |   |   |       |-- FinancialClearance.test.tsx
|   |   |   |   |   |       `-- FinancialClearance.types.ts
|   |   |   |   |   |-- FinancialReports
|   |   |   |   |   |   |-- FinancialReports.api.ts
|   |   |   |   |   |   |-- FinancialReports.hooks.ts
|   |   |   |   |   |   |-- FinancialReports.page.tsx
|   |   |   |   |   |   |-- FinancialReports.test.tsx
|   |   |   |   |   |   `-- FinancialReports.types.ts
|   |   |   |   |   |-- Invoicing
|   |   |   |   |   |   |-- Invoicing.api.ts
|   |   |   |   |   |   |-- Invoicing.hooks.ts
|   |   |   |   |   |   |-- Invoicing.page.tsx
|   |   |   |   |   |   |-- Invoicing.test.tsx
|   |   |   |   |   |   `-- Invoicing.types.ts
|   |   |   |   |   |-- PaymentGateway
|   |   |   |   |   |   |-- PaymentGateway.api.ts
|   |   |   |   |   |   |-- PaymentGateway.hooks.ts
|   |   |   |   |   |   |-- PaymentGateway.page.tsx
|   |   |   |   |   |   |-- PaymentGateway.test.tsx
|   |   |   |   |   |   `-- PaymentGateway.types.ts
|   |   |   |   |   |-- Payroll
|   |   |   |   |   |   |-- Payroll.api.ts
|   |   |   |   |   |   |-- Payroll.hooks.ts
|   |   |   |   |   |   |-- Payroll.page.tsx
|   |   |   |   |   |   |-- Payroll.test.tsx
|   |   |   |   |   |   `-- Payroll.types.ts
|   |   |   |   |   |-- PayrollProcessing
|   |   |   |   |   |   |-- PayrollProcessing.hooks.ts
|   |   |   |   |   |   `-- PayrollProcessing.page.tsx
|   |   |   |   |   |-- SemesterBilling
|   |   |   |   |   |   |-- SemesterBilling.api.ts
|   |   |   |   |   |   |-- SemesterBilling.hooks.ts
|   |   |   |   |   |   |-- SemesterBilling.page.tsx
|   |   |   |   |   |   |-- SemesterBilling.test.tsx
|   |   |   |   |   |   `-- SemesterBilling.types.ts
|   |   |   |   |   |-- StudentBilling
|   |   |   |   |   |   |-- ScholarshipGrants.page.tsx
|   |   |   |   |   |   |-- StatementOfAccount.page.tsx
|   |   |   |   |   |   |-- StudentBilling.api.ts
|   |   |   |   |   |   |-- StudentBilling.hooks.ts
|   |   |   |   |   |   |-- StudentBilling.page.tsx
|   |   |   |   |   |   |-- StudentBilling.test.tsx
|   |   |   |   |   |   `-- StudentBilling.types.ts
|   |   |   |   |   `-- TuitionAssessment
|   |   |   |   |       `-- TuitionAssessment.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- governance-console
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-MesTFSc4.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- Accreditation
|   |   |   |   |   |   |-- Accreditation.api.ts
|   |   |   |   |   |   |-- Accreditation.hooks.ts
|   |   |   |   |   |   |-- Accreditation.page.tsx
|   |   |   |   |   |   |-- Accreditation.test.tsx
|   |   |   |   |   |   `-- Accreditation.types.ts
|   |   |   |   |   |-- Audits
|   |   |   |   |   |   |-- Audits.api.ts
|   |   |   |   |   |   |-- Audits.hooks.ts
|   |   |   |   |   |   |-- Audits.page.tsx
|   |   |   |   |   |   |-- Audits.test.tsx
|   |   |   |   |   |   `-- Audits.types.ts
|   |   |   |   |   |-- Committees
|   |   |   |   |   |   |-- Committees.api.ts
|   |   |   |   |   |   |-- Committees.hooks.ts
|   |   |   |   |   |   |-- Committees.page.tsx
|   |   |   |   |   |   |-- Committees.test.tsx
|   |   |   |   |   |   `-- Committees.types.ts
|   |   |   |   |   |-- Compliance
|   |   |   |   |   |   |-- Compliance.api.ts
|   |   |   |   |   |   |-- Compliance.hooks.ts
|   |   |   |   |   |   |-- Compliance.page.tsx
|   |   |   |   |   |   |-- Compliance.test.tsx
|   |   |   |   |   |   `-- Compliance.types.ts
|   |   |   |   |   |-- Events
|   |   |   |   |   |   `-- Events.page.tsx
|   |   |   |   |   |-- Grievances
|   |   |   |   |   |   `-- Grievances.page.tsx
|   |   |   |   |   |-- Helpdesk
|   |   |   |   |   |   `-- Helpdesk.page.tsx
|   |   |   |   |   |-- Policies
|   |   |   |   |   |   |-- Policies.api.ts
|   |   |   |   |   |   |-- Policies.hooks.ts
|   |   |   |   |   |   |-- Policies.page.tsx
|   |   |   |   |   |   |-- Policies.test.tsx
|   |   |   |   |   |   `-- Policies.types.ts
|   |   |   |   |   |-- QualityAccreditation
|   |   |   |   |   |   `-- QualityAccreditation.page.tsx
|   |   |   |   |   |-- RiskManagement
|   |   |   |   |   |   |-- RiskManagement.api.ts
|   |   |   |   |   |   |-- RiskManagement.hooks.ts
|   |   |   |   |   |   |-- RiskManagement.page.tsx
|   |   |   |   |   |   |-- RiskManagement.test.tsx
|   |   |   |   |   |   `-- RiskManagement.types.ts
|   |   |   |   |   `-- Visitors
|   |   |   |   |       `-- Visitors.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- identity-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-BapRoB-Z.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- Email
|   |   |   |   |   |   `-- EmailProvisioning.page.tsx
|   |   |   |   |   |-- MFA
|   |   |   |   |   |   |-- AccessRevocation.page.tsx
|   |   |   |   |   |   `-- MFASetup.page.tsx
|   |   |   |   |   |-- MfaVerification
|   |   |   |   |   |   |-- MfaVerification.api.ts
|   |   |   |   |   |   |-- MfaVerification.hooks.ts
|   |   |   |   |   |   |-- MfaVerification.page.tsx
|   |   |   |   |   |   |-- MfaVerification.test.tsx
|   |   |   |   |   |   `-- MfaVerification.types.ts
|   |   |   |   |   |-- MultiFactorAuth
|   |   |   |   |   |   |-- MultiFactorAuth.api.ts
|   |   |   |   |   |   |-- MultiFactorAuth.hooks.ts
|   |   |   |   |   |   |-- MultiFactorAuth.page.tsx
|   |   |   |   |   |   |-- MultiFactorAuth.test.tsx
|   |   |   |   |   |   `-- MultiFactorAuth.types.ts
|   |   |   |   |   |-- PasswordRecovery
|   |   |   |   |   |   |-- PasswordRecovery.api.ts
|   |   |   |   |   |   |-- PasswordRecovery.hooks.ts
|   |   |   |   |   |   |-- PasswordRecovery.page.tsx
|   |   |   |   |   |   |-- PasswordRecovery.test.tsx
|   |   |   |   |   |   `-- PasswordRecovery.types.ts
|   |   |   |   |   |-- PasswordReset
|   |   |   |   |   |   |-- PasswordReset.api.ts
|   |   |   |   |   |   |-- PasswordReset.hooks.ts
|   |   |   |   |   |   |-- PasswordReset.page.tsx
|   |   |   |   |   |   |-- PasswordReset.test.tsx
|   |   |   |   |   |   `-- PasswordReset.types.ts
|   |   |   |   |   |-- SecuritySettings
|   |   |   |   |   |   |-- SecuritySettings.api.ts
|   |   |   |   |   |   |-- SecuritySettings.hooks.ts
|   |   |   |   |   |   |-- SecuritySettings.page.tsx
|   |   |   |   |   |   |-- SecuritySettings.test.tsx
|   |   |   |   |   |   `-- SecuritySettings.types.ts
|   |   |   |   |   |-- SessionManagement
|   |   |   |   |   |   |-- SessionManagement.api.ts
|   |   |   |   |   |   |-- SessionManagement.hooks.ts
|   |   |   |   |   |   |-- SessionManagement.page.tsx
|   |   |   |   |   |   |-- SessionManagement.test.tsx
|   |   |   |   |   |   `-- SessionManagement.types.ts
|   |   |   |   |   |-- UniversityAccount
|   |   |   |   |   |   |-- AccountProvisioning.page.tsx
|   |   |   |   |   |   `-- DirectorySearch.page.tsx
|   |   |   |   |   |-- UserLogin
|   |   |   |   |   |   |-- UserLogin.api.ts
|   |   |   |   |   |   |-- UserLogin.hooks.ts
|   |   |   |   |   |   |-- UserLogin.page.tsx
|   |   |   |   |   |   |-- UserLogin.test.tsx
|   |   |   |   |   |   `-- UserLogin.types.ts
|   |   |   |   |   `-- UserRegistration
|   |   |   |   |       |-- UserRegistration.api.ts
|   |   |   |   |       |-- UserRegistration.hooks.ts
|   |   |   |   |       |-- UserRegistration.page.tsx
|   |   |   |   |       |-- UserRegistration.test.tsx
|   |   |   |   |       `-- UserRegistration.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- library-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-Cg4XXSgl.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- CatalogSearch
|   |   |   |   |   |   |-- CatalogSearch.api.ts
|   |   |   |   |   |   |-- CatalogSearch.hooks.ts
|   |   |   |   |   |   |-- CatalogSearch.page.tsx
|   |   |   |   |   |   |-- CatalogSearch.test.tsx
|   |   |   |   |   |   `-- CatalogSearch.types.ts
|   |   |   |   |   |-- Circulation
|   |   |   |   |   |   `-- Circulation.page.tsx
|   |   |   |   |   |-- DigitalResources
|   |   |   |   |   |   |-- DigitalResources.api.ts
|   |   |   |   |   |   |-- DigitalResources.hooks.ts
|   |   |   |   |   |   |-- DigitalResources.page.tsx
|   |   |   |   |   |   |-- DigitalResources.test.tsx
|   |   |   |   |   |   `-- DigitalResources.types.ts
|   |   |   |   |   |-- Fines
|   |   |   |   |   |   |-- Fines.api.ts
|   |   |   |   |   |   |-- Fines.hooks.ts
|   |   |   |   |   |   |-- Fines.page.tsx
|   |   |   |   |   |   |-- Fines.test.tsx
|   |   |   |   |   |   `-- Fines.types.ts
|   |   |   |   |   |-- MyLoans
|   |   |   |   |   |   |-- MyLoans.api.ts
|   |   |   |   |   |   |-- MyLoans.hooks.ts
|   |   |   |   |   |   |-- MyLoans.page.tsx
|   |   |   |   |   |   |-- MyLoans.test.tsx
|   |   |   |   |   |   `-- MyLoans.types.ts
|   |   |   |   |   `-- Reservations
|   |   |   |   |       |-- Reservations.api.ts
|   |   |   |   |       |-- Reservations.hooks.ts
|   |   |   |   |       |-- Reservations.page.tsx
|   |   |   |   |       |-- Reservations.test.tsx
|   |   |   |   |       `-- Reservations.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- lms-web
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-B27XvGfG.js
|   |   |   |   |-- index.html
|   |   |   |   |-- manifest.webmanifest
|   |   |   |   `-- service-worker.ts
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |   |-- manifest.webmanifest
|   |   |   |   `-- service-worker.ts
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- AssignmentDraftEditor
|   |   |   |   |   |-- Assignments
|   |   |   |   |   |   |-- Assignments.api.ts
|   |   |   |   |   |   |-- Assignments.hooks.ts
|   |   |   |   |   |   |-- Assignments.page.tsx
|   |   |   |   |   |   |-- Assignments.test.tsx
|   |   |   |   |   |   `-- Assignments.types.ts
|   |   |   |   |   |-- Calendar
|   |   |   |   |   |   |-- Calendar.api.ts
|   |   |   |   |   |   |-- Calendar.hooks.ts
|   |   |   |   |   |   |-- Calendar.page.tsx
|   |   |   |   |   |   |-- Calendar.test.tsx
|   |   |   |   |   |   `-- Calendar.types.ts
|   |   |   |   |   |-- CourseAdministration
|   |   |   |   |   |   `-- CoursePackaging.page.tsx
|   |   |   |   |   |-- CourseContent
|   |   |   |   |   |   |-- CourseContent.api.ts
|   |   |   |   |   |   |-- CourseContent.hooks.ts
|   |   |   |   |   |   |-- CourseContent.page.tsx
|   |   |   |   |   |   |-- CourseContent.test.tsx
|   |   |   |   |   |   `-- CourseContent.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- Discussions
|   |   |   |   |   |   |-- Discussions.api.ts
|   |   |   |   |   |   |-- Discussions.hooks.ts
|   |   |   |   |   |   |-- Discussions.page.tsx
|   |   |   |   |   |   |-- Discussions.test.tsx
|   |   |   |   |   |   `-- Discussions.types.ts
|   |   |   |   |   |-- GradebookOrchestration
|   |   |   |   |   |   `-- GradebookSync.page.tsx
|   |   |   |   |   |-- Grades
|   |   |   |   |   |   |-- Grades.api.ts
|   |   |   |   |   |   |-- Grades.hooks.ts
|   |   |   |   |   |   |-- Grades.page.tsx
|   |   |   |   |   |   |-- Grades.test.tsx
|   |   |   |   |   |   `-- Grades.types.ts
|   |   |   |   |   |-- ModuleTimeline
|   |   |   |   |   |   `-- ModuleTimeline.page.tsx
|   |   |   |   |   |-- OfflineSubmissionReview
|   |   |   |   |   |   `-- SubmissionReview.page.tsx
|   |   |   |   |   |-- QuizWindowGuard
|   |   |   |   |   `-- Quizzes
|   |   |   |   |       |-- Quizzes.api.ts
|   |   |   |   |       |-- Quizzes.hooks.ts
|   |   |   |   |       |-- Quizzes.page.tsx
|   |   |   |   |       |-- Quizzes.test.tsx
|   |   |   |   |       `-- Quizzes.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   |-- offline
|   |   |   |   |   |-- indexedDbSchema.ts
|   |   |   |   |   |-- serviceWorkerRegistration.ts
|   |   |   |   |   `-- syncQueue.ts
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- payment-gateway
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-DnpdxvTm.js
|   |   |   |   |   `-- index-cJBQpNUN.css
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- App.tsx
|   |   |   |   `-- main.tsx
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- platform-console
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-CDXWAHcf.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- features
|   |   |   |   |   |-- APIKeys
|   |   |   |   |   |   |-- APIKeys.api.ts
|   |   |   |   |   |   |-- APIKeys.hooks.ts
|   |   |   |   |   |   |-- APIKeys.page.tsx
|   |   |   |   |   |   |-- APIKeys.test.tsx
|   |   |   |   |   |   `-- APIKeys.types.ts
|   |   |   |   |   |-- AnalyticsBI
|   |   |   |   |   |   `-- AnalyticsBI.page.tsx
|   |   |   |   |   |-- CRM
|   |   |   |   |   |   `-- CRM.page.tsx
|   |   |   |   |   |-- Communication
|   |   |   |   |   |   `-- Communication.page.tsx
|   |   |   |   |   |-- DatabaseManagement
|   |   |   |   |   |   |-- DatabaseManagement.api.ts
|   |   |   |   |   |   |-- DatabaseManagement.hooks.ts
|   |   |   |   |   |   |-- DatabaseManagement.page.tsx
|   |   |   |   |   |   |-- DatabaseManagement.test.tsx
|   |   |   |   |   |   `-- DatabaseManagement.types.ts
|   |   |   |   |   |-- DocumentManagement
|   |   |   |   |   |   `-- DocumentManagement.page.tsx
|   |   |   |   |   |-- GlobalSettings
|   |   |   |   |   |   |-- GlobalSettings.api.ts
|   |   |   |   |   |   |-- GlobalSettings.hooks.ts
|   |   |   |   |   |   |-- GlobalSettings.page.tsx
|   |   |   |   |   |   |-- GlobalSettings.test.tsx
|   |   |   |   |   |   `-- GlobalSettings.types.ts
|   |   |   |   |   |-- MultiCampus
|   |   |   |   |   |   `-- MultiCampus.page.tsx
|   |   |   |   |   |-- Notification
|   |   |   |   |   |   `-- Notification.page.tsx
|   |   |   |   |   |-- SecurityAudits
|   |   |   |   |   |   |-- SecurityAudits.api.ts
|   |   |   |   |   |   |-- SecurityAudits.hooks.ts
|   |   |   |   |   |   |-- SecurityAudits.page.tsx
|   |   |   |   |   |   |-- SecurityAudits.test.tsx
|   |   |   |   |   |   `-- SecurityAudits.types.ts
|   |   |   |   |   |-- SystemLogs
|   |   |   |   |   |   |-- SystemLogs.api.ts
|   |   |   |   |   |   |-- SystemLogs.hooks.ts
|   |   |   |   |   |   |-- SystemLogs.page.tsx
|   |   |   |   |   |   |-- SystemLogs.test.tsx
|   |   |   |   |   |   `-- SystemLogs.types.ts
|   |   |   |   |   `-- TenantManagement
|   |   |   |   |       |-- TenantManagement.api.ts
|   |   |   |   |       |-- TenantManagement.hooks.ts
|   |   |   |   |       |-- TenantManagement.page.tsx
|   |   |   |   |       |-- TenantManagement.test.tsx
|   |   |   |   |       `-- TenantManagement.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- registrar-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-CmnkJuXB.css
|   |   |   |   |   `-- index-qmryzBB_.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- App.tsx
|   |   |   |   |-- features
|   |   |   |   |   |-- AcademicComplianceDivision
|   |   |   |   |   |   |-- CHEDCompliance.page.tsx
|   |   |   |   |   |   |-- Compliance.api.ts
|   |   |   |   |   |   |-- Compliance.hooks.ts
|   |   |   |   |   |   |-- Compliance.types.ts
|   |   |   |   |   |   `-- ResidencyRules.page.tsx
|   |   |   |   |   |-- AcademicRecordsDivision
|   |   |   |   |   |   |-- AcademicRecordInitialization.page.tsx
|   |   |   |   |   |   |-- AcademicRecordInitialization.test.tsx
|   |   |   |   |   |   |-- AcademicStanding.page.tsx
|   |   |   |   |   |   |-- AcademicStanding.test.tsx
|   |   |   |   |   |   |-- OfficialGrades.page.tsx
|   |   |   |   |   |   |-- OfficialGrades.test.tsx
|   |   |   |   |   |   |-- Records.api.ts
|   |   |   |   |   |   |-- Records.hooks.ts
|   |   |   |   |   |   `-- Records.types.ts
|   |   |   |   |   |-- AcademicSchedulingDivision
|   |   |   |   |   |   |-- AcademicSchedulingDivision.api.ts
|   |   |   |   |   |   |-- AcademicSchedulingDivision.hooks.ts
|   |   |   |   |   |   |-- AcademicSchedulingDivision.page.tsx
|   |   |   |   |   |   |-- AcademicSchedulingDivision.test.tsx
|   |   |   |   |   |   `-- AcademicSchedulingDivision.types.ts
|   |   |   |   |   |-- Admissions
|   |   |   |   |   |   `-- EnrollmentActivation.page.tsx
|   |   |   |   |   |-- AdmissionsDivision
|   |   |   |   |   |   |-- Admissions.api.ts
|   |   |   |   |   |   |-- Admissions.hooks.ts
|   |   |   |   |   |   |-- Admissions.types.ts
|   |   |   |   |   |   |-- AdmissionsQueue.page.tsx
|   |   |   |   |   |   `-- FacultyEndorsements.page.tsx
|   |   |   |   |   |-- CertificationDivision
|   |   |   |   |   |   |-- Certification.api.ts
|   |   |   |   |   |   |-- Certification.hooks.ts
|   |   |   |   |   |   |-- Certification.types.ts
|   |   |   |   |   |   |-- DiplomaVerification.page.tsx
|   |   |   |   |   |   `-- TranscriptRequests.page.tsx
|   |   |   |   |   |-- CrossEnrollmentDivision
|   |   |   |   |   |   |-- CrossEnrollmentDivision.api.ts
|   |   |   |   |   |   |-- CrossEnrollmentDivision.hooks.ts
|   |   |   |   |   |   |-- CrossEnrollmentDivision.page.tsx
|   |   |   |   |   |   |-- CrossEnrollmentDivision.test.tsx
|   |   |   |   |   |   `-- CrossEnrollmentDivision.types.ts
|   |   |   |   |   |-- CurriculumDivision
|   |   |   |   |   |   |-- CourseOfferings.page.tsx
|   |   |   |   |   |   |-- CourseOfferings.test.tsx
|   |   |   |   |   |   |-- Curriculum.api.ts
|   |   |   |   |   |   |-- Curriculum.hooks.ts
|   |   |   |   |   |   |-- Curriculum.types.ts
|   |   |   |   |   |   |-- Prerequisites.page.tsx
|   |   |   |   |   |   |-- Prerequisites.test.tsx
|   |   |   |   |   |   |-- SubjectCatalog.page.tsx
|   |   |   |   |   |   `-- SubjectCatalog.test.tsx
|   |   |   |   |   |-- EnrollmentDivision
|   |   |   |   |   |   |-- AddDropOversight.page.tsx
|   |   |   |   |   |   |-- AddDropOversight.test.tsx
|   |   |   |   |   |   |-- Enrollment.api.ts
|   |   |   |   |   |   |-- Enrollment.hooks.ts
|   |   |   |   |   |   |-- Enrollment.types.ts
|   |   |   |   |   |   |-- EnrollmentValidation.page.tsx
|   |   |   |   |   |   |-- EnrollmentValidation.test.tsx
|   |   |   |   |   |   |-- RegistrationExceptions.page.tsx
|   |   |   |   |   |   |-- RegistrationExceptions.test.tsx
|   |   |   |   |   |   |-- RegistrationRequests.page.tsx
|   |   |   |   |   |   |-- RegistrationRequests.test.tsx
|   |   |   |   |   |   |-- RegistrationWindows.page.tsx
|   |   |   |   |   |   |-- RegistrationWindows.test.tsx
|   |   |   |   |   |   |-- SubjectLoading.page.tsx
|   |   |   |   |   |   |-- SubjectLoading.test.tsx
|   |   |   |   |   |   |-- Waitlists.page.tsx
|   |   |   |   |   |   `-- Waitlists.test.tsx
|   |   |   |   |   |-- GraduationDivision
|   |   |   |   |   |   |-- Graduation.api.ts
|   |   |   |   |   |   |-- Graduation.hooks.ts
|   |   |   |   |   |   |-- Graduation.types.ts
|   |   |   |   |   |   |-- GraduationCandidates.page.tsx
|   |   |   |   |   |   `-- LatinHonors.page.tsx
|   |   |   |   |   |-- RegistrarDashboard
|   |   |   |   |   |   |-- RegistrarDashboard.api.ts
|   |   |   |   |   |   |-- RegistrarDashboard.hooks.ts
|   |   |   |   |   |   |-- RegistrarDashboard.page.tsx
|   |   |   |   |   |   |-- RegistrarDashboard.test.tsx
|   |   |   |   |   |   `-- RegistrarDashboard.types.ts
|   |   |   |   |   |-- RegistrarSecurity
|   |   |   |   |   |   |-- RecordAccessAudit.page.tsx
|   |   |   |   |   |   |-- Security.api.ts
|   |   |   |   |   |   |-- Security.hooks.ts
|   |   |   |   |   |   |-- Security.types.ts
|   |   |   |   |   |   `-- SensitiveVault.page.tsx
|   |   |   |   |   |-- StudentRegistryDivision
|   |   |   |   |   |   |-- LeaveOfAbsence.page.tsx
|   |   |   |   |   |   |-- MasterStudentList.page.tsx
|   |   |   |   |   |   |-- Registry.api.ts
|   |   |   |   |   |   |-- Registry.hooks.ts
|   |   |   |   |   |   |-- Registry.types.ts
|   |   |   |   |   |   |-- StudentNumberAssignment.page.tsx
|   |   |   |   |   |   `-- StudentProfile.page.tsx
|   |   |   |   |   |-- StudentServicesDivision
|   |   |   |   |   |   |-- DataCorrections.page.tsx
|   |   |   |   |   |   |-- Services.api.ts
|   |   |   |   |   |   |-- Services.hooks.ts
|   |   |   |   |   |   |-- Services.types.ts
|   |   |   |   |   |   `-- StudentInquiries.page.tsx
|   |   |   |   |   `-- TransferDivision
|   |   |   |   |       |-- TransferDivision.api.ts
|   |   |   |   |       |-- TransferDivision.hooks.ts
|   |   |   |   |       |-- TransferDivision.page.tsx
|   |   |   |   |       |-- TransferDivision.test.tsx
|   |   |   |   |       `-- TransferDivision.types.ts
|   |   |   |   |-- main.tsx
|   |   |   |   `-- shell
|   |   |   |       |-- AppShell.tsx
|   |   |   |       |-- GlobalSearchModal.tsx
|   |   |   |       `-- Routing.tsx
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- security-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   |-- index-Dfxy4O-t.js
|   |   |   |   |   `-- index-cJBQpNUN.css
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- App.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   `-- shell
|   |   |   |       |-- AppShell.tsx
|   |   |   |       `-- Routing.tsx
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- structuring.md
|   |   `-- student-portal
|   |       |-- dist
|   |       |   |-- assets
|   |       |   |   |-- index-CT34Fv1n.js
|   |       |   |   `-- index-cJBQpNUN.css
|   |       |   `-- index.html
|   |       |-- index.html
|   |       |-- package.json
|   |       |-- public
|   |       |-- src
|   |       |   |-- config
|   |       |   |   `-- env.ts
|   |       |   |-- features
|   |       |   |   |-- AcademicRecord
|   |       |   |   |   |-- AcademicRecord.api.ts
|   |       |   |   |   |-- AcademicRecord.hooks.ts
|   |       |   |   |   |-- AcademicRecord.page.tsx
|   |       |   |   |   |-- AcademicRecord.test.tsx
|   |       |   |   |   `-- AcademicRecord.types.ts
|   |       |   |   |-- AlumniNetwork
|   |       |   |   |   |-- AlumniNetwork.api.ts
|   |       |   |   |   |-- AlumniNetwork.hooks.ts
|   |       |   |   |   |-- AlumniNetwork.page.tsx
|   |       |   |   |   |-- AlumniNetwork.test.tsx
|   |       |   |   |   `-- AlumniNetwork.types.ts
|   |       |   |   |-- CareerDashboard
|   |       |   |   |   |-- CareerDashboard.api.ts
|   |       |   |   |   |-- CareerDashboard.hooks.ts
|   |       |   |   |   |-- CareerDashboard.page.tsx
|   |       |   |   |   |-- CareerDashboard.test.tsx
|   |       |   |   |   `-- CareerDashboard.types.ts
|   |       |   |   |-- Clearance
|   |       |   |   |   |-- Clearance.api.ts
|   |       |   |   |   |-- Clearance.hooks.ts
|   |       |   |   |   |-- Clearance.page.tsx
|   |       |   |   |   |-- Clearance.test.tsx
|   |       |   |   |   `-- Clearance.types.ts
|   |       |   |   |-- CrossEnrollment
|   |       |   |   |   |-- CrossEnrollment.api.ts
|   |       |   |   |   |-- CrossEnrollment.hooks.ts
|   |       |   |   |   |-- CrossEnrollment.page.tsx
|   |       |   |   |   |-- CrossEnrollment.test.tsx
|   |       |   |   |   `-- CrossEnrollment.types.ts
|   |       |   |   |-- CurriculumProgress
|   |       |   |   |   |-- CurriculumProgress.api.ts
|   |       |   |   |   |-- CurriculumProgress.hooks.ts
|   |       |   |   |   |-- CurriculumProgress.page.tsx
|   |       |   |   |   |-- CurriculumProgress.test.tsx
|   |       |   |   |   `-- CurriculumProgress.types.ts
|   |       |   |   |-- Dashboard
|   |       |   |   |   |-- Dashboard.api.ts
|   |       |   |   |   |-- Dashboard.hooks.ts
|   |       |   |   |   |-- Dashboard.page.tsx
|   |       |   |   |   |-- Dashboard.test.tsx
|   |       |   |   |   `-- Dashboard.types.ts
|   |       |   |   |-- Enrollment
|   |       |   |   |   |-- Enrollment.api.ts
|   |       |   |   |   |-- Enrollment.hooks.ts
|   |       |   |   |   |-- Enrollment.page.tsx
|   |       |   |   |   |-- Enrollment.test.tsx
|   |       |   |   |   `-- Enrollment.types.ts
|   |       |   |   |-- EnrollmentHistory
|   |       |   |   |   |-- EnrollmentHistory.api.ts
|   |       |   |   |   |-- EnrollmentHistory.hooks.ts
|   |       |   |   |   |-- EnrollmentHistory.page.tsx
|   |       |   |   |   |-- EnrollmentHistory.test.tsx
|   |       |   |   |   `-- EnrollmentHistory.types.ts
|   |       |   |   |-- Extracurriculars
|   |       |   |   |   |-- Extracurriculars.api.ts
|   |       |   |   |   |-- Extracurriculars.hooks.ts
|   |       |   |   |   |-- Extracurriculars.page.tsx
|   |       |   |   |   |-- Extracurriculars.test.tsx
|   |       |   |   |   `-- Extracurriculars.types.ts
|   |       |   |   |-- Financials
|   |       |   |   |   |-- Financials.api.ts
|   |       |   |   |   |-- Financials.hooks.ts
|   |       |   |   |   |-- Financials.page.tsx
|   |       |   |   |   |-- Financials.test.tsx
|   |       |   |   |   `-- Financials.types.ts
|   |       |   |   |-- Graduation
|   |       |   |   |   |-- Graduation.api.ts
|   |       |   |   |   |-- Graduation.hooks.ts
|   |       |   |   |   |-- Graduation.page.tsx
|   |       |   |   |   |-- Graduation.test.tsx
|   |       |   |   |   `-- Graduation.types.ts
|   |       |   |   |-- GuidanceSessions
|   |       |   |   |   |-- GuidanceSessions.api.ts
|   |       |   |   |   |-- GuidanceSessions.hooks.ts
|   |       |   |   |   |-- GuidanceSessions.page.tsx
|   |       |   |   |   |-- GuidanceSessions.test.tsx
|   |       |   |   |   `-- GuidanceSessions.types.ts
|   |       |   |   |-- HealthRecords
|   |       |   |   |   |-- HealthRecords.api.ts
|   |       |   |   |   |-- HealthRecords.hooks.ts
|   |       |   |   |   |-- HealthRecords.page.tsx
|   |       |   |   |   |-- HealthRecords.test.tsx
|   |       |   |   |   `-- HealthRecords.types.ts
|   |       |   |   |-- HostelAllocation
|   |       |   |   |   |-- HostelAllocation.api.ts
|   |       |   |   |   |-- HostelAllocation.hooks.ts
|   |       |   |   |   |-- HostelAllocation.page.tsx
|   |       |   |   |   |-- HostelAllocation.test.tsx
|   |       |   |   |   `-- HostelAllocation.types.ts
|   |       |   |   |-- LearningManagement
|   |       |   |   |   |-- LearningManagement.hooks.ts
|   |       |   |   |   |-- LearningManagement.page.tsx
|   |       |   |   |   `-- LearningManagement.styles.css
|   |       |   |   |-- MyEnrollments
|   |       |   |   |   |-- MyEnrollments.api.ts
|   |       |   |   |   |-- MyEnrollments.hooks.ts
|   |       |   |   |   |-- MyEnrollments.page.tsx
|   |       |   |   |   |-- MyEnrollments.styles.css
|   |       |   |   |   |-- MyEnrollments.test.tsx
|   |       |   |   |   `-- MyEnrollments.types.ts
|   |       |   |   |-- Registration
|   |       |   |   |   |-- BrowseCourses.page.tsx
|   |       |   |   |   |-- BrowseCourses.test.tsx
|   |       |   |   |   |-- MyRegistration.page.tsx
|   |       |   |   |   |-- MyRegistration.test.tsx
|   |       |   |   |   |-- Registration.api.ts
|   |       |   |   |   |-- Registration.hooks.ts
|   |       |   |   |   |-- Registration.page.tsx
|   |       |   |   |   |-- Registration.test.tsx
|   |       |   |   |   |-- Registration.types.ts
|   |       |   |   |   |-- Waitlist.page.tsx
|   |       |   |   |   `-- Waitlist.test.tsx
|   |       |   |   |-- Schedule
|   |       |   |   |   |-- Schedule.api.ts
|   |       |   |   |   |-- Schedule.hooks.ts
|   |       |   |   |   |-- Schedule.page.tsx
|   |       |   |   |   |-- Schedule.test.tsx
|   |       |   |   |   `-- Schedule.types.ts
|   |       |   |   |-- StudentProfile
|   |       |   |   |   |-- StudentProfile.api.ts
|   |       |   |   |   |-- StudentProfile.hooks.ts
|   |       |   |   |   |-- StudentProfile.page.tsx
|   |       |   |   |   |-- StudentProfile.test.tsx
|   |       |   |   |   `-- StudentProfile.types.ts
|   |       |   |   `-- Timetable
|   |       |   |       |-- Timetable.api.ts
|   |       |   |       |-- Timetable.hooks.ts
|   |       |   |       |-- Timetable.page.tsx
|   |       |   |       |-- Timetable.test.tsx
|   |       |   |       `-- Timetable.types.ts
|   |       |   |-- main.tsx
|   |       |   |-- shell
|   |       |   |   |-- AppShell.tsx
|   |       |   |   |-- ErrorBoundary.tsx
|   |       |   |   |-- NavigationLogger.tsx
|   |       |   |   `-- Routing.tsx
|   |       |   |-- state
|   |       |   |-- theme.css
|   |       |   `-- vite-env.d.ts
|   |       |-- structure.md
|   |       |-- tsconfig.json
|   |       |-- tsconfig.node.json
|   |       `-- vite.config.ts
|   |-- bootstrap.sh
|   |-- clients
|   |   |-- lms-offline-avalonia
|   |   |   |-- ApplyDynamicResources.ps1
|   |   |   |-- FixSpacing.ps1
|   |   |   |-- LmsOffline.Application
|   |   |   |   |-- Features
|   |   |   |   |   |-- Analytics
|   |   |   |   |   |   `-- LogxApiEventCommand.cs
|   |   |   |   |   |-- Auth
|   |   |   |   |   |   `-- AuthenticateStudentCommandHandler.cs
|   |   |   |   |   |-- AuthenticateStudent
|   |   |   |   |   |   |-- AuthenticateStudentCommand.cs
|   |   |   |   |   |   |-- AuthenticateStudentCommandHandler.cs
|   |   |   |   |   |   `-- AuthenticateStudentResult.cs
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- GetStudentDashboardStatsQuery.cs
|   |   |   |   |   |   `-- GetStudentDashboardStatsQueryHandler.cs
|   |   |   |   |   |-- Diagnostics
|   |   |   |   |   |   `-- GetSystemHealthQuery.cs
|   |   |   |   |   |-- DownloadModulePackage
|   |   |   |   |   |   |-- DownloadModulePackageCommand.cs
|   |   |   |   |   |   `-- DownloadModulePackageCommandHandler.cs
|   |   |   |   |   |-- Grades
|   |   |   |   |   |   |-- GetLocalGradesQuery.cs
|   |   |   |   |   |   `-- SyncGradesFromBackendCommand.cs
|   |   |   |   |   |-- PackageManager
|   |   |   |   |   |   |-- GetInstalledPackagesQuery.cs
|   |   |   |   |   |   |-- VerifyPackageCommand.cs
|   |   |   |   |   |   `-- VerifyPackageIntegrityCommand.cs
|   |   |   |   |   |-- StartOfflineAssessment
|   |   |   |   |   |   |-- StartOfflineAssessmentCommand.cs
|   |   |   |   |   |   `-- StartOfflineAssessmentCommandHandler.cs
|   |   |   |   |   |-- SubmitOfflineAssessment
|   |   |   |   |   |   |-- SubmitOfflineAssessmentCommand.cs
|   |   |   |   |   |   `-- SubmitOfflineAssessmentCommandHandler.cs
|   |   |   |   |   |-- SubmitOfflineAssignment
|   |   |   |   |   |   |-- SubmitOfflineAssignmentCommand.cs
|   |   |   |   |   |   `-- SubmitOfflineAssignmentCommandHandler.cs
|   |   |   |   |   `-- SyncPendingSubmissions
|   |   |   |   |       |-- SyncPendingSubmissionsCommand.cs
|   |   |   |   |       `-- SyncPendingSubmissionsCommandHandler.cs
|   |   |   |   |-- Interfaces
|   |   |   |   |   |-- IDashboardRepository.cs
|   |   |   |   |   |-- IExamIntegrityService.cs
|   |   |   |   |   |-- IExternalIdentityService.cs
|   |   |   |   |   |-- ILocalGradeRepository.cs
|   |   |   |   |   |-- ILocalLearningRecordStore.cs
|   |   |   |   |   |-- ILocalPackageRepository.cs
|   |   |   |   |   |-- ILocalStorageDiagnostics.cs
|   |   |   |   |   |-- IOfflineAssessmentRepository.cs
|   |   |   |   |   |-- IOfflineAssignmentRepository.cs
|   |   |   |   |   |-- IOfflineIdentityRepository.cs
|   |   |   |   |   |-- IOfflineModuleRepository.cs
|   |   |   |   |   |-- IPackageSecurityService.cs
|   |   |   |   |   |-- IPackageVerifier.cs
|   |   |   |   |   `-- IPasswordHasher.cs
|   |   |   |   |-- LmsOffline.Application.csproj
|   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   `-- Validators
|   |   |   |       `-- StartOfflineAssessmentCommandValidator.cs
|   |   |   |-- LmsOffline.Contracts
|   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- LearningAnalyticsBatchReadyEvent.cs
|   |   |   |   |   |-- OfflineAssessmentSubmitted.cs
|   |   |   |   |   |-- OfflineAssignmentSubmitted.cs
|   |   |   |   |   `-- PackageVerifiedEvent.cs
|   |   |   |   `-- LmsOffline.Contracts.csproj
|   |   |   |-- LmsOffline.Domain
|   |   |   |   |-- Aggregates
|   |   |   |   |   |-- CoursePackage.cs
|   |   |   |   |   |-- GradeRecord.cs
|   |   |   |   |   |-- LearningEvent.cs
|   |   |   |   |   |-- OfflineAssessment.cs
|   |   |   |   |   |-- OfflineAssignment.cs
|   |   |   |   |   |-- OfflineModule.cs
|   |   |   |   |   `-- StudentUser.cs
|   |   |   |   |-- Entities
|   |   |   |   |   `-- StudentUser.cs
|   |   |   |   |-- Exceptions
|   |   |   |   |   `-- AssessmentWindowClosedException.cs
|   |   |   |   |-- LmsOffline.Domain.csproj
|   |   |   |   |-- Policies
|   |   |   |   |   `-- WindowEnforcementPolicy.cs
|   |   |   |   `-- ValueObjects
|   |   |   |       |-- AttemptToken.cs
|   |   |   |       |-- AvailabilityWindow.cs
|   |   |   |       `-- SyncStatus.cs
|   |   |   |-- LmsOffline.Infrastructure
|   |   |   |   |-- Auth
|   |   |   |   |   |-- ExternalIdentityService.cs
|   |   |   |   |   `-- OfflineTokenCache.cs
|   |   |   |   |-- Data
|   |   |   |   |   |-- EncryptedSqliteContext.cs
|   |   |   |   |   `-- SqliteStorageDiagnostics.cs
|   |   |   |   |-- LmsOffline.Infrastructure.csproj
|   |   |   |   |-- Persistence
|   |   |   |   |   |-- EncryptedSqliteContext.cs
|   |   |   |   |   |-- Migrations
|   |   |   |   |   `-- Repositories
|   |   |   |   |       |-- DashboardRepository.cs
|   |   |   |   |       `-- OfflineIdentityRepository.cs
|   |   |   |   |-- Repositories
|   |   |   |   |   |-- GradeRepository.cs
|   |   |   |   |   |-- LocalPackageRepository.cs
|   |   |   |   |   |-- OfflineAssessmentRepository.cs
|   |   |   |   |   |-- OfflineAssignmentRepository.cs
|   |   |   |   |   |-- OfflineIdentityRepository.cs
|   |   |   |   |   `-- OfflineModuleRepository.cs
|   |   |   |   |-- Security
|   |   |   |   |   |-- EcdsaPackageSecurityService.cs
|   |   |   |   |   |-- EcdsaPackageVerifier.cs
|   |   |   |   |   `-- Pbkdf2PasswordHasher.cs
|   |   |   |   `-- Sync
|   |   |   |       |-- OutboxBackgroundService.cs
|   |   |   |       |-- OutboxSyncProcessor.cs
|   |   |   |       `-- ScheduleTokenVerifier.cs
|   |   |   |-- LmsOffline.Presentation
|   |   |   |   |-- App.axaml
|   |   |   |   |-- App.axaml.cs
|   |   |   |   |-- DesignSystem
|   |   |   |   |   |-- Foundations
|   |   |   |   |   |   |-- Borders.axaml
|   |   |   |   |   |   |-- Colors.axaml
|   |   |   |   |   |   |-- Elevation.axaml
|   |   |   |   |   |   |-- Motion.axaml
|   |   |   |   |   |   |-- Radius.axaml
|   |   |   |   |   |   |-- Spacing.axaml
|   |   |   |   |   |   |-- Typography.axaml
|   |   |   |   |   |   `-- ZIndex.axaml
|   |   |   |   |   |-- Themes
|   |   |   |   |   |   |-- Dark.axaml
|   |   |   |   |   |   `-- Light.axaml
|   |   |   |   |   `-- Tokens
|   |   |   |   |       |-- BadgeTokens.axaml
|   |   |   |   |       |-- ButtonTokens.axaml
|   |   |   |   |       |-- CardTokens.axaml
|   |   |   |   |       `-- InputTokens.axaml
|   |   |   |   |-- Features
|   |   |   |   |   |-- Assessments
|   |   |   |   |   |   |-- AssessmentView.axaml
|   |   |   |   |   |   |-- AssessmentView.axaml.cs
|   |   |   |   |   |   |-- AssessmentViewModel.cs
|   |   |   |   |   |   |-- AssignmentSubmissionView.axaml
|   |   |   |   |   |   |-- AssignmentSubmissionView.axaml.cs
|   |   |   |   |   |   |-- AssignmentSubmissionViewModel.cs
|   |   |   |   |   |   |-- LogicQuizView.axaml
|   |   |   |   |   |   |-- LogicQuizView.axaml.cs
|   |   |   |   |   |   `-- LogicQuizViewModel.cs
|   |   |   |   |   |-- Auth
|   |   |   |   |   |   |-- LoginView.axaml
|   |   |   |   |   |   |-- LoginView.axaml.cs
|   |   |   |   |   |   `-- LoginViewModel.cs
|   |   |   |   |   |-- Calendar
|   |   |   |   |   |   |-- TimelineScheduleView.axaml
|   |   |   |   |   |   |-- TimelineScheduleView.axaml.cs
|   |   |   |   |   |   `-- TimelineScheduleViewModel.cs
|   |   |   |   |   |-- Courses
|   |   |   |   |   |   |-- ActivityHubView.axaml
|   |   |   |   |   |   |-- ActivityHubView.axaml.cs
|   |   |   |   |   |   |-- ActivityHubViewModel.cs
|   |   |   |   |   |   |-- CourseContentView.axaml
|   |   |   |   |   |   |-- CourseContentView.axaml.cs
|   |   |   |   |   |   |-- CourseContentViewModel.cs
|   |   |   |   |   |   |-- CourseViewerView.axaml
|   |   |   |   |   |   |-- CourseViewerView.axaml.cs
|   |   |   |   |   |   |-- CourseViewerViewModel.cs
|   |   |   |   |   |   |-- ModuleTimelineView.axaml
|   |   |   |   |   |   |-- ModuleTimelineView.axaml.cs
|   |   |   |   |   |   |-- ModuleTimelineViewModel.cs
|   |   |   |   |   |   |-- ResourcesView.axaml
|   |   |   |   |   |   |-- ResourcesView.axaml.cs
|   |   |   |   |   |   `-- ResourcesViewModel.cs
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- StudentDashboardView.axaml
|   |   |   |   |   |   |-- StudentDashboardView.axaml.cs
|   |   |   |   |   |   `-- StudentDashboardViewModel.cs
|   |   |   |   |   |-- Diagnostics
|   |   |   |   |   |   |-- DiagnosticsView.axaml
|   |   |   |   |   |   |-- DiagnosticsView.axaml.cs
|   |   |   |   |   |   `-- DiagnosticsViewModel.cs
|   |   |   |   |   |-- Grades
|   |   |   |   |   |   |-- GradesView.axaml
|   |   |   |   |   |   |-- GradesView.axaml.cs
|   |   |   |   |   |   `-- GradesViewModel.cs
|   |   |   |   |   |-- LearningTimeline
|   |   |   |   |   |   |-- LearningTimelineView.axaml
|   |   |   |   |   |   |-- LearningTimelineView.axaml.cs
|   |   |   |   |   |   `-- LearningTimelineViewModel.cs
|   |   |   |   |   |-- PackageManager
|   |   |   |   |   |   |-- PackageManagerView.axaml
|   |   |   |   |   |   |-- PackageManagerView.axaml.cs
|   |   |   |   |   |   `-- PackageManagerViewModel.cs
|   |   |   |   |   `-- SyncHub
|   |   |   |   |       |-- SyncHubView.axaml
|   |   |   |   |       |-- SyncHubView.axaml.cs
|   |   |   |   |       `-- SyncHubViewModel.cs
|   |   |   |   |-- LmsOffline.Presentation.csproj
|   |   |   |   |-- MainWindow.axaml
|   |   |   |   |-- MainWindow.axaml.cs
|   |   |   |   |-- Program.cs
|   |   |   |   |-- Services
|   |   |   |   |   |-- AvaloniaExamIntegrityService.cs
|   |   |   |   |   `-- FileLogger.cs
|   |   |   |   |-- Shared
|   |   |   |   |   `-- Controls
|   |   |   |   |       |-- AppCard.axaml
|   |   |   |   |       |-- AppCard.axaml.cs
|   |   |   |   |       |-- NavigationItem.axaml
|   |   |   |   |       |-- NavigationItem.axaml.cs
|   |   |   |   |       |-- StatusBadge.axaml
|   |   |   |   |       `-- StatusBadge.axaml.cs
|   |   |   |   |-- Shell
|   |   |   |   |   |-- AppSidebar.axaml
|   |   |   |   |   |-- AppSidebar.axaml.cs
|   |   |   |   |   |-- AppStatusBar.axaml
|   |   |   |   |   `-- AppStatusBar.axaml.cs
|   |   |   |   |-- ViewLocator.cs
|   |   |   |   |-- ViewModels
|   |   |   |   |   |-- AssessmentViewModel.cs
|   |   |   |   |   |-- AssignmentSubmissionViewModel.cs
|   |   |   |   |   |-- LogicQuizViewModel.cs
|   |   |   |   |   `-- MainWindowViewModel.cs
|   |   |   |   |-- Views
|   |   |   |   |   |-- AssessmentView.axaml
|   |   |   |   |   |-- AssessmentView.axaml.cs
|   |   |   |   |   |-- AssignmentSubmissionView.axaml
|   |   |   |   |   |-- AssignmentSubmissionView.axaml.cs
|   |   |   |   |   |-- CustomControls
|   |   |   |   |   |   |-- CustomTitleBar.axaml
|   |   |   |   |   |   `-- CustomTitleBar.axaml.cs
|   |   |   |   |   |-- LogicQuizView.axaml
|   |   |   |   |   `-- LogicQuizView.axaml.cs
|   |   |   |   `-- app.manifest
|   |   |   |-- LmsOffline.Tests
|   |   |   |   |-- LmsOffline.Tests.csproj
|   |   |   |   |-- OfflineTokenCacheTests.cs
|   |   |   |   |-- SyncConflictResolutionTests.cs
|   |   |   |   |-- UnitTest1.cs
|   |   |   |   `-- WindowEnforcementPolicyTests.cs
|   |   |   |-- LmsOfflineClient.slnx
|   |   |   |-- MigrateOpticalSystem.ps1
|   |   |   |-- UpdateTokens.ps1
|   |   |   |-- app.log
|   |   |   |-- build-and-publish.bat
|   |   |   |-- crash.log
|   |   |   `-- lms_offline.db
|   |   `-- main.txt
|   |-- domain
|   |   |-- adr
|   |   |   |-- ADR-F01-avalonia-for-offline-lms-client.md
|   |   |   |-- ADR-F02-react-ts-for-subdomain-web-portals.md
|   |   |   |-- ADR-F03-shared-auth-sdk-across-react-and-dotnet.md
|   |   |   `-- ADR-F04-indexeddb-vs-sqlite-offline-strategy-split.md
|   |   |-- model
|   |   `-- runbooks
|   |       |-- cdn-cache-poisoning.md
|   |       `-- offline-sync-conflict-storm.md
|   |-- libs
|   |   |-- api-clients
|   |   |   |-- academic
|   |   |   |   |-- advisingApi.ts
|   |   |   |   |-- analyticsApi.ts
|   |   |   |   |-- assessmentApi.ts
|   |   |   |   |-- communicationApi.ts
|   |   |   |   |-- documentsApi.ts
|   |   |   |   |-- examinationResultApi.ts
|   |   |   |   |-- facultyStudentsApi.ts
|   |   |   |   |-- libraryCatalogApi.ts
|   |   |   |   |-- lmsApi.ts
|   |   |   |   |-- registrarApi.ts
|   |   |   |   |-- registrarCurriculumApi.ts
|   |   |   |   |-- researchApi.ts
|   |   |   |   |-- scheduleApi.ts
|   |   |   |   |-- studentInformationApi.ts
|   |   |   |   `-- teachingApi.ts
|   |   |   |-- administration
|   |   |   |   |-- assetManagementApi.ts
|   |   |   |   |-- financeApi.ts
|   |   |   |   |-- financeBillingApi.ts
|   |   |   |   |-- hrApi.ts
|   |   |   |   |-- inventoryApi.ts
|   |   |   |   `-- procurementApi.ts
|   |   |   |-- apiClient.ts
|   |   |   |-- campus-life
|   |   |   |   |-- canteenApi.ts
|   |   |   |   `-- transportApi.ts
|   |   |   |-- governance
|   |   |   |   |-- facilitiesApi.ts
|   |   |   |   |-- facilitiesAvailabilityApi.ts
|   |   |   |   `-- governanceApi.ts
|   |   |   |-- index.ts
|   |   |   |-- package.json
|   |   |   |-- platform
|   |   |   |   |-- facultySettingsApi.ts
|   |   |   |   |-- identityAccessAuthorizationApi.ts
|   |   |   |   `-- identityApi.ts
|   |   |   `-- student-lifecycle
|   |   |       |-- admissionsApi.ts
|   |   |       |-- alumniApi.ts
|   |   |       |-- careerApi.ts
|   |   |       |-- facultyAdmissionsApi.ts
|   |   |       |-- guidanceApi.ts
|   |   |       |-- healthCenterApi.ts
|   |   |       |-- hostelApi.ts
|   |   |       |-- interviewsApi.ts
|   |   |       |-- studentInformationApi.ts
|   |   |       `-- studentInformationReadModel.ts
|   |   |-- auth-sdk
|   |   |   |-- dotnet
|   |   |   |   `-- OidcClient.cs
|   |   |   |-- index.ts
|   |   |   |-- package.json
|   |   |   |-- react
|   |   |   |   |-- AuthContext.ts
|   |   |   |   |-- AuthProvider.tsx
|   |   |   |   |-- silentRefresh.ts
|   |   |   |   `-- useAuth.ts
|   |   |   `-- src
|   |   |       `-- guards
|   |   |           |-- FacultyGuard.tsx
|   |   |           |-- FinanceGuard.tsx
|   |   |           |-- IdentityGuard.tsx
|   |   |           |-- LMSGuard.tsx
|   |   |           `-- RegistrarGuard.tsx
|   |   |-- core-logger
|   |   |   |-- index.ts
|   |   |   `-- package.json
|   |   |-- domain-viewmodels
|   |   |   |-- AdministrationViewModels.ts
|   |   |   |-- CampusLifeViewModels.ts
|   |   |   |-- FinanceViewModels.ts
|   |   |   |-- GovernanceViewModels.ts
|   |   |   |-- GrievanceCaseViewModel.ts
|   |   |   |-- IdentityViewModels.ts
|   |   |   |-- InvoiceSummaryViewModel.ts
|   |   |   |-- LibraryViewModels.ts
|   |   |   |-- StudentLifecycleViewModels.ts
|   |   |   |-- StudentProfileViewModel.ts
|   |   |   |-- index.ts
|   |   |   `-- package.json
|   |   |-- offline-sync
|   |   |   |-- conflictResolutionRules.md
|   |   |   `-- syncEngineContracts.ts
|   |   |-- shell-kit
|   |   |   |-- AuthGuard.tsx
|   |   |   |-- authConfig.ts
|   |   |   |-- bootstrap.tsx
|   |   |   |-- index.ts
|   |   |   |-- package.json
|   |   |   `-- queryClient.ts
|   |   |-- ui-kit
|   |   |   |-- components
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- components
|   |   |   |   |   |-- Badge.tsx
|   |   |   |   |   |-- Button.tsx
|   |   |   |   |   |-- Card.tsx
|   |   |   |   |   |-- DocumentPreviewModal.tsx
|   |   |   |   |   |-- FormInput.tsx
|   |   |   |   |   |-- Modal.tsx
|   |   |   |   |   |-- PageHeader.tsx
|   |   |   |   |   `-- Table.tsx
|   |   |   |   |-- index.ts
|   |   |   |   `-- styles.css
|   |   |   |-- theming
|   |   |   `-- tokens
|   |   |-- vite-config
|   |   |   |-- index.ts
|   |   |   `-- package.json
|   |   `-- workflow-sdk
|   |       |-- index.ts
|   |       |-- package.json
|   |       |-- src
|   |       |   |-- AcademicRecordWorkflow.ts
|   |       |   |-- AdmissionWorkflow.ts
|   |       |   |-- AuditWorkflow.ts
|   |       |   |-- CertificationWorkflow.ts
|   |       |   |-- EnrollmentWorkflow.ts
|   |       |   |-- FinanceWorkflow.ts
|   |       |   |-- GraduationWorkflow.ts
|   |       |   |-- IdentityWorkflow.ts
|   |       |   |-- LMSWorkflow.ts
|   |       |   |-- LibraryWorkflow.ts
|   |       |   |-- NotificationWorkflow.ts
|   |       |   |-- StudentLifecycleWorkflow.ts
|   |       |   `-- index.ts
|   |       `-- tsconfig.json
|   |-- package-lock.json
|   |-- package.json
|   |-- repair-npm.sh
|   |-- scaffold_features.ps1
|   |-- tests
|   |   |-- AccessibilityTests
|   |   |   `-- wcag-audit.spec.ts
|   |   |-- ArchitectureTests
|   |   |-- ComponentTests
|   |   |   |-- admin-portal
|   |   |   |-- faculty-portal
|   |   |   |-- finance-console
|   |   |   |-- governance-console
|   |   |   |-- identity-portal
|   |   |   |-- library-portal
|   |   |   |-- lms-web
|   |   |   `-- student-portal
|   |   |-- E2ETests
|   |   |   |-- HostelBillingFlow.spec.ts
|   |   |   |-- OfflineQuizWindowFlow.spec.ts
|   |   |   `-- StudentEnrollmentFlow.spec.ts
|   |   |-- PerformanceTests
|   |   |   `-- lighthouse-budgets.json
|   |   `-- SecurityTests
|   |       |-- cspComplianceTests.ts
|   |       `-- tokenStorageAuditTests.ts
|   |-- tsconfig.app.base.json
|   |-- tsconfig.json
|   `-- tsconfig.node.base.json
|-- UniversityErp.slnx
|-- docker-compose.yml
|-- fix-encodings.js
|-- health-logger.sh
|-- isolated_release.sh
|-- logs.md
|-- newupdate.md
|-- package-lock.json
|-- package.json
|-- release_all.sh
|-- result.log
|-- scaffold-frontend-cloudflare-nginx.sh
|-- scaffold_features.ps1
|-- setup_structure.ps1
|-- setup_structure.sh
|-- structure.md
|-- universal-semantic-versioning-prompt.md
|-- university-erp-cloudflare-tunnel-zero-trust-security-addendum.md
|-- university-erp-docker-compose-orchestration-prompt.md
|-- university-erp-domain-based-modular-architecture (2).md
|-- university-erp-frontend-dbma-architecture.md
|-- university-erp-frontend-features-ddd-dbma-prompt.md
`-- university-erp-scaffolding-script-review.md

1018 directories, 2003 files
