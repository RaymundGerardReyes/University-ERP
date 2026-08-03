.
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
|   |   |   |   |   |-- ExamResultPublishedIntegrationEvent.cs
|   |   |   |   |   `-- StudentEnrolledIntegrationEvent.cs
|   |   |   |   |-- Administration
|   |   |   |   |   |-- InvoiceIssuedIntegrationEvent.cs
|   |   |   |   |   `-- PayrollCalculatedIntegrationEvent.cs
|   |   |   |   |-- Governance
|   |   |   |   |   |-- GrievanceSubmittedIntegrationEvent.cs
|   |   |   |   |   `-- SupportTicketRequestedIntegrationEvent.cs
|   |   |   |   |-- Platform
|   |   |   |   |   `-- AccountProvisionedIntegrationEvent.cs
|   |   |   |   `-- StudentLifecycle
|   |   |   |       |-- ApplicantAcceptedIntegrationEvent.cs
|   |   |   |       `-- RoomAllocatedIntegrationEvent.cs
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
|   |   |   |   |   |   |-- AcademicScheduling.Application.csproj
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- AllocateRoom
|   |   |   |   |   |   |   |   `-- AllocateRoomCommand.cs
|   |   |   |   |   |   |   `-- GetStudentTimetable
|   |   |   |   |   |   |       `-- GetStudentTimetableQuery.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- AcademicScheduling.Contracts
|   |   |   |   |   |   |-- AcademicScheduling.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- AcademicScheduling.Domain
|   |   |   |   |   |   |-- AcademicScheduling.Domain.csproj
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- ClassSession.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- AcademicScheduling.Infrastructure
|   |   |   |   |   |   |-- AcademicScheduling.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- AcademicScheduling.Presentation
|   |   |   |   |   |   |-- AcademicScheduling.Presentation.csproj
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- AllocateRoomEndpoint.cs
|   |   |   |   |   |   |   `-- GetStudentTimetableEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- AcademicScheduling.Tests.Architecture
|   |   |   |   |   |-- AcademicScheduling.Tests.Integration
|   |   |   |   |   `-- AcademicScheduling.Tests.Unit
|   |   |   |   |-- Examination
|   |   |   |   |   |-- Examination.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IExamSessionRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Examination.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- CreateQuestion
|   |   |   |   |   |   |   |   `-- CreateQuestionCommand.cs
|   |   |   |   |   |   |   |-- LogProctoringIncident
|   |   |   |   |   |   |   |   `-- LogProctoringIncidentCommand.cs
|   |   |   |   |   |   |   `-- PublishExamResult
|   |   |   |   |   |   |       `-- PublishExamResultCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Examination.Contracts
|   |   |   |   |   |   |-- Examination.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Examination.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- ExamResult.cs
|   |   |   |   |   |   |   |-- ExamSession.cs
|   |   |   |   |   |   |   `-- QuestionItem.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Examination.Domain.csproj
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Examination.Infrastructure
|   |   |   |   |   |   |-- Examination.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Examination.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- CreateQuestionEndpoint.cs
|   |   |   |   |   |   |   |-- LogProctoringIncidentEndpoint.cs
|   |   |   |   |   |   |   `-- PublishExamResultEndpoint.cs
|   |   |   |   |   |   |-- Examination.Presentation.csproj
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Examination.Tests.Architecture
|   |   |   |   |   |-- Examination.Tests.Integration
|   |   |   |   |   `-- Examination.Tests.Unit
|   |   |   |   |-- LearningManagement
|   |   |   |   |   |-- LearningManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- IOfflineSubmissionRepository.cs
|   |   |   |   |   |   |   `-- IScheduleTokenVerifier.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- GetOfflineModulePackage
|   |   |   |   |   |   |   |   `-- GetOfflineModulePackageQuery.cs
|   |   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmission
|   |   |   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmissionCommand.cs
|   |   |   |   |   |   |   |   `-- ProcessOfflineAssessmentSubmissionCommandHandler.cs
|   |   |   |   |   |   |   `-- ProcessOfflineAssignmentSubmission
|   |   |   |   |   |   |       |-- ProcessOfflineAssignmentSubmissionCommand.cs
|   |   |   |   |   |   |       `-- ProcessOfflineAssignmentSubmissionCommandHandler.cs
|   |   |   |   |   |   |-- LearningManagement.Application.csproj
|   |   |   |   |   |   |-- LearningManagementApplicationRegistration.cs
|   |   |   |   |   |   |-- Mappings
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
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- LearningManagement.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- LearningManagement.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- LearningManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- LearningManagementModuleRegistration.cs
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |   `-- LearningManagementDbContext.cs
|   |   |   |   |   |   |-- Repositories
|   |   |   |   |   |   |   `-- OfflineSubmissionRepository.cs
|   |   |   |   |   |   `-- Security
|   |   |   |   |   |       `-- ScheduleTokenVerifier.cs
|   |   |   |   |   |-- LearningManagement.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- DownloadModulePackageEndpoint.cs
|   |   |   |   |   |   |   |-- SyncOfflineAssessmentsEndpoint.cs
|   |   |   |   |   |   |   `-- SyncOfflineAssignmentsEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- LearningManagement.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- LearningManagement.Tests.Architecture
|   |   |   |   |   |-- LearningManagement.Tests.Integration
|   |   |   |   |   `-- LearningManagement.Tests.Unit
|   |   |   |   |-- Registrar
|   |   |   |   |   |-- Registrar.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- EvaluateGraduationClearance
|   |   |   |   |   |   |   |   `-- EvaluateGraduationClearanceCommand.cs
|   |   |   |   |   |   |   |-- RegisterCourse
|   |   |   |   |   |   |   |   `-- RegisterCourseCommand.cs
|   |   |   |   |   |   |   `-- RequestTranscript
|   |   |   |   |   |   |       `-- RequestTranscriptCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- Registrar.Application.csproj
|   |   |   |   |   |-- Registrar.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- PublicApi
|   |   |   |   |   |   `-- Registrar.Contracts.csproj
|   |   |   |   |   |-- Registrar.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   |-- CourseRegistration.cs
|   |   |   |   |   |   |   |-- GraduationClearance.cs
|   |   |   |   |   |   |   `-- TranscriptRequest.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   |-- Registrar.Domain.csproj
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Registrar.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |-- Registrar.Infrastructure.csproj
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Registrar.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- EvaluateGraduationClearanceEndpoint.cs
|   |   |   |   |   |   |   |-- RegisterCourseEndpoint.cs
|   |   |   |   |   |   |   `-- RequestTranscriptEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- OpenApi
|   |   |   |   |   |   `-- Registrar.Presentation.csproj
|   |   |   |   |   |-- Registrar.Tests.Architecture
|   |   |   |   |   |-- Registrar.Tests.Integration
|   |   |   |   |   `-- Registrar.Tests.Unit
|   |   |   |   `-- StudentInformation
|   |   |   |       |-- StudentInformation.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |   `-- IStudentRepository.cs
|   |   |   |       |   |-- EventHandlers
|   |   |   |       |   |   |-- DomainEventHandlers
|   |   |   |       |   |   `-- IntegrationEventHandlers
|   |   |   |       |   |-- Features
|   |   |   |       |   |   |-- EnrollStudent
|   |   |   |       |   |   |   |-- EnrollStudentCommand.cs
|   |   |   |       |   |   |   |-- EnrollStudentCommandHandler.cs
|   |   |   |       |   |   |   `-- EnrollStudentCommandValidator.cs
|   |   |   |       |   |   |-- GetStudentInformation
|   |   |   |       |   |   |   `-- GetStudentInformationQuery.cs
|   |   |   |       |   |   `-- UpdateContactInfo
|   |   |   |       |   |       `-- UpdateContactInfoCommand.cs
|   |   |   |       |   |-- Mappings
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- StudentInformation.Application.csproj
|   |   |   |       |-- StudentInformation.Contracts
|   |   |   |       |   |-- IntegrationEvents
|   |   |   |       |   `-- PublicApi
|   |   |   |       |-- StudentInformation.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- Student.cs
|   |   |   |       |   |-- DomainEvents
|   |   |   |       |   |   `-- StudentEnrolledDomainEvent.cs
|   |   |   |       |   |-- DomainServices
|   |   |   |       |   |-- Entities
|   |   |   |       |   |-- Exceptions
|   |   |   |       |   |-- Policies
|   |   |   |       |   |-- StudentInformation.Domain.csproj
|   |   |   |       |   `-- ValueObjects
|   |   |   |       |       |-- EnrollmentStatus.cs
|   |   |   |       |       `-- StudentId.cs
|   |   |   |       |-- StudentInformation.Infrastructure
|   |   |   |       |   |-- ExternalAdapters
|   |   |   |       |   |-- Inbox
|   |   |   |       |   |-- Observability
|   |   |   |       |   |-- Outbox
|   |   |   |       |   |-- Persistence
|   |   |   |       |   |   |-- StudentConfiguration.cs
|   |   |   |       |   |   `-- StudentInformationDbContext.cs
|   |   |   |       |   |-- Repositories
|   |   |   |       |   |   `-- StudentRepository.cs
|   |   |   |       |   |-- StudentInformation.Infrastructure.csproj
|   |   |   |       |   `-- StudentInformationModuleRegistration.cs
|   |   |   |       |-- StudentInformation.Presentation
|   |   |   |       |   |-- Contracts
|   |   |   |       |   |   `-- EnrollStudentRequest.cs
|   |   |   |       |   |-- Controllers
|   |   |   |       |   |   `-- StudentsController.cs
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- GetStudentInformationEndpoints.cs
|   |   |   |       |   |-- Filters
|   |   |   |       |   |-- OpenApi
|   |   |   |       |   `-- StudentInformation.Presentation.csproj
|   |   |   |       |-- StudentInformation.Tests.Architecture
|   |   |   |       |-- StudentInformation.Tests.Integration
|   |   |   |       `-- StudentInformation.Tests.Unit
|   |   |   |-- Administration
|   |   |   |   |-- AssetManagement
|   |   |   |   |   |-- AssetManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- AssetManagement.Application.csproj
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- RegisterAsset
|   |   |   |   |   |   |       `-- RegisterAssetCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- AssetManagement.Contracts
|   |   |   |   |   |   |-- AssetManagement.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- AssetManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Asset.cs
|   |   |   |   |   |   |-- AssetManagement.Domain.csproj
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- AssetManagement.Infrastructure
|   |   |   |   |   |   |-- AssetManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- AssetManagement.Presentation
|   |   |   |   |   |   |-- AssetManagement.Presentation.csproj
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- RegisterAssetEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- AssetManagement.Tests.Architecture
|   |   |   |   |   |-- AssetManagement.Tests.Integration
|   |   |   |   |   `-- AssetManagement.Tests.Unit
|   |   |   |   |-- Facilities
|   |   |   |   |   |-- Facilities.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Facilities.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- BookFacility
|   |   |   |   |   |   |       `-- BookFacilityCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Facilities.Contracts
|   |   |   |   |   |   |-- Facilities.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Facilities.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- FacilityReservation.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Facilities.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Facilities.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Facilities.Infrastructure.csproj
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Facilities.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- BookFacilityEndpoint.cs
|   |   |   |   |   |   |-- Facilities.Presentation.csproj
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Facilities.Tests.Architecture
|   |   |   |   |   |-- Facilities.Tests.Integration
|   |   |   |   |   `-- Facilities.Tests.Unit
|   |   |   |   |-- Finance
|   |   |   |   |   |-- Finance.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IStudentBillingRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- IssueInvoice
|   |   |   |   |   |   |       `-- IssueInvoiceCommand.cs
|   |   |   |   |   |   |-- Finance.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Finance.Contracts
|   |   |   |   |   |   |-- Finance.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Finance.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- StudentBilling.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Finance.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Finance.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Finance.Infrastructure.csproj
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Finance.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- IssueInvoiceEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- Finance.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Finance.Tests.Architecture
|   |   |   |   |   |-- Finance.Tests.Integration
|   |   |   |   |   `-- Finance.Tests.Unit
|   |   |   |   |-- HumanResources
|   |   |   |   |   |-- HumanResources.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- OnboardEmployee
|   |   |   |   |   |   |       `-- OnboardEmployeeCommand.cs
|   |   |   |   |   |   |-- HumanResources.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- HumanResources.Contracts
|   |   |   |   |   |   |-- HumanResources.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- HumanResources.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Employee.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- HumanResources.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- HumanResources.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- HumanResources.Infrastructure.csproj
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- HumanResources.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- OnboardEmployeeEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- HumanResources.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- HumanResources.Tests.Architecture
|   |   |   |   |   |-- HumanResources.Tests.Integration
|   |   |   |   |   `-- HumanResources.Tests.Unit
|   |   |   |   |-- Inventory
|   |   |   |   |   |-- Inventory.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- AdjustStock
|   |   |   |   |   |   |       `-- AdjustStockCommand.cs
|   |   |   |   |   |   |-- Inventory.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Inventory.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- Inventory.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Inventory.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- StockItem.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Inventory.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Inventory.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Inventory.Infrastructure.csproj
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Inventory.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- AdjustStockEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- Inventory.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Inventory.Tests.Architecture
|   |   |   |   |   |-- Inventory.Tests.Integration
|   |   |   |   |   `-- Inventory.Tests.Unit
|   |   |   |   |-- Library
|   |   |   |   |   |-- Library.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- CheckoutItem
|   |   |   |   |   |   |       `-- CheckoutItemCommand.cs
|   |   |   |   |   |   |-- Library.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Library.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- Library.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Library.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- CatalogItem.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Library.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Library.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Library.Infrastructure.csproj
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Library.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- CheckoutItemEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- Library.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Library.Tests.Architecture
|   |   |   |   |   |-- Library.Tests.Integration
|   |   |   |   |   `-- Library.Tests.Unit
|   |   |   |   |-- MessCanteen
|   |   |   |   |   |-- MessCanteen.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- ReserveMeal
|   |   |   |   |   |   |       `-- ReserveMealCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   |-- MessCanteen.Application.csproj
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- MessCanteen.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- MessCanteen.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- MessCanteen.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- MealPlan.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- MessCanteen.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- MessCanteen.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- MessCanteen.Infrastructure.csproj
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- MessCanteen.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- ReserveMealEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- MessCanteen.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- MessCanteen.Tests.Architecture
|   |   |   |   |   |-- MessCanteen.Tests.Integration
|   |   |   |   |   `-- MessCanteen.Tests.Unit
|   |   |   |   |-- Payroll
|   |   |   |   |   |-- Payroll.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- GeneratePayslip
|   |   |   |   |   |   |       `-- GeneratePayslipCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- Payroll.Application.csproj
|   |   |   |   |   |-- Payroll.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- Payroll.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Payroll.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Payslip.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Payroll.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Payroll.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Payroll.Infrastructure.csproj
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Payroll.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- GeneratePayslipEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- OpenApi
|   |   |   |   |   |   `-- Payroll.Presentation.csproj
|   |   |   |   |   |-- Payroll.Tests.Architecture
|   |   |   |   |   |-- Payroll.Tests.Integration
|   |   |   |   |   `-- Payroll.Tests.Unit
|   |   |   |   |-- Procurement
|   |   |   |   |   |-- Procurement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- CreatePurchaseOrder
|   |   |   |   |   |   |       `-- CreatePurchaseOrderCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- Procurement.Application.csproj
|   |   |   |   |   |-- Procurement.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- Procurement.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Procurement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- PurchaseOrder.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   |-- Procurement.Domain.csproj
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Procurement.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |-- Procurement.Infrastructure.csproj
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Procurement.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- CreatePurchaseOrderEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- OpenApi
|   |   |   |   |   |   `-- Procurement.Presentation.csproj
|   |   |   |   |   |-- Procurement.Tests.Architecture
|   |   |   |   |   |-- Procurement.Tests.Integration
|   |   |   |   |   `-- Procurement.Tests.Unit
|   |   |   |   `-- Transport
|   |   |   |       |-- Transport.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |-- EventHandlers
|   |   |   |       |   |   |-- DomainEventHandlers
|   |   |   |       |   |   `-- IntegrationEventHandlers
|   |   |   |       |   |-- Features
|   |   |   |       |   |   `-- AssignRoute
|   |   |   |       |   |       `-- AssignRouteCommand.cs
|   |   |   |       |   |-- Mappings
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- Transport.Application.csproj
|   |   |   |       |-- Transport.Contracts
|   |   |   |       |   |-- IntegrationEvents
|   |   |   |       |   |-- PublicApi
|   |   |   |       |   `-- Transport.Contracts.csproj
|   |   |   |       |-- Transport.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- BusRoute.cs
|   |   |   |       |   |-- DomainEvents
|   |   |   |       |   |-- DomainServices
|   |   |   |       |   |-- Entities
|   |   |   |       |   |-- Exceptions
|   |   |   |       |   |-- Policies
|   |   |   |       |   |-- Transport.Domain.csproj
|   |   |   |       |   `-- ValueObjects
|   |   |   |       |-- Transport.Infrastructure
|   |   |   |       |   |-- ExternalAdapters
|   |   |   |       |   |-- Inbox
|   |   |   |       |   |-- Observability
|   |   |   |       |   |-- Outbox
|   |   |   |       |   |-- Persistence
|   |   |   |       |   |-- Repositories
|   |   |   |       |   `-- Transport.Infrastructure.csproj
|   |   |   |       |-- Transport.Presentation
|   |   |   |       |   |-- Contracts
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- AssignRouteEndpoint.cs
|   |   |   |       |   |-- Filters
|   |   |   |       |   |-- OpenApi
|   |   |   |       |   `-- Transport.Presentation.csproj
|   |   |   |       |-- Transport.Tests.Architecture
|   |   |   |       |-- Transport.Tests.Integration
|   |   |   |       `-- Transport.Tests.Unit
|   |   |   |-- Governance
|   |   |   |   |-- EventManagement
|   |   |   |   |   |-- EventManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IEventRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- EventManagement.Application.csproj
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- PlanEvent
|   |   |   |   |   |   |       `-- PlanEventCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- EventManagement.Contracts
|   |   |   |   |   |   |-- EventManagement.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- EventManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- CampusEvent.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- EventManagement.Domain.csproj
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- EventManagement.Infrastructure
|   |   |   |   |   |   |-- EventManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- EventManagement.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- PlanEventEndpoint.cs
|   |   |   |   |   |   |-- EventManagement.Presentation.csproj
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- EventManagement.Tests.Architecture
|   |   |   |   |   |-- EventManagement.Tests.Integration
|   |   |   |   |   `-- EventManagement.Tests.Unit
|   |   |   |   |-- GrievanceManagement
|   |   |   |   |   |-- GrievanceManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IGrievanceRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- SubmitComplaint
|   |   |   |   |   |   |       `-- SubmitComplaintCommand.cs
|   |   |   |   |   |   |-- GrievanceManagement.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- GrievanceManagement.Contracts
|   |   |   |   |   |   |-- GrievanceManagement.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- GrievanceManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Complaint.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- GrievanceManagement.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- GrievanceManagement.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- GrievanceManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- GrievanceManagement.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- SubmitComplaintEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- GrievanceManagement.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- GrievanceManagement.Tests.Architecture
|   |   |   |   |   |-- GrievanceManagement.Tests.Integration
|   |   |   |   |   `-- GrievanceManagement.Tests.Unit
|   |   |   |   |-- Helpdesk
|   |   |   |   |   |-- Helpdesk.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IHelpdeskRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- CreateTicket
|   |   |   |   |   |   |       `-- CreateTicketCommand.cs
|   |   |   |   |   |   |-- Helpdesk.Application.csproj
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Helpdesk.Contracts
|   |   |   |   |   |   |-- Helpdesk.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Helpdesk.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- ServiceTicket.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Helpdesk.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Helpdesk.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Helpdesk.Infrastructure.csproj
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Helpdesk.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- CreateTicketEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- Helpdesk.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Helpdesk.Tests.Architecture
|   |   |   |   |   |-- Helpdesk.Tests.Integration
|   |   |   |   |   `-- Helpdesk.Tests.Unit
|   |   |   |   |-- QualityAccreditation
|   |   |   |   |   |-- QualityAccreditation.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IAccreditationRepository.cs
|   |   |   |   |   |   |-- Class1.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- SubmitEvidence
|   |   |   |   |   |   |       `-- SubmitEvidenceCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- QualityAccreditation.Application.csproj
|   |   |   |   |   |-- QualityAccreditation.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- PublicApi
|   |   |   |   |   |   `-- QualityAccreditation.Contracts.csproj
|   |   |   |   |   |-- QualityAccreditation.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- AccreditationEvidence.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   |-- QualityAccreditation.Domain.csproj
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- QualityAccreditation.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   |-- QualityAccreditation.Infrastructure.csproj
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- QualityAccreditation.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- SubmitEvidenceEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- OpenApi
|   |   |   |   |   |   `-- QualityAccreditation.Presentation.csproj
|   |   |   |   |   |-- QualityAccreditation.Tests.Architecture
|   |   |   |   |   |-- QualityAccreditation.Tests.Integration
|   |   |   |   |   `-- QualityAccreditation.Tests.Unit
|   |   |   |   `-- VisitorManagement
|   |   |   |       |-- VisitorManagement.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |   `-- IVisitorRepository.cs
|   |   |   |       |   |-- EventHandlers
|   |   |   |       |   |   |-- DomainEventHandlers
|   |   |   |       |   |   `-- IntegrationEventHandlers
|   |   |   |       |   |-- Features
|   |   |   |       |   |   `-- RegisterVisitor
|   |   |   |       |   |       `-- RegisterVisitorCommand.cs
|   |   |   |       |   |-- Mappings
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- VisitorManagement.Application.csproj
|   |   |   |       |-- VisitorManagement.Contracts
|   |   |   |       |   |-- IntegrationEvents
|   |   |   |       |   |-- PublicApi
|   |   |   |       |   `-- VisitorManagement.Contracts.csproj
|   |   |   |       |-- VisitorManagement.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- VisitorLog.cs
|   |   |   |       |   |-- DomainEvents
|   |   |   |       |   |-- DomainServices
|   |   |   |       |   |-- Entities
|   |   |   |       |   |-- Exceptions
|   |   |   |       |   |-- Policies
|   |   |   |       |   |-- ValueObjects
|   |   |   |       |   `-- VisitorManagement.Domain.csproj
|   |   |   |       |-- VisitorManagement.Infrastructure
|   |   |   |       |   |-- ExternalAdapters
|   |   |   |       |   |-- Inbox
|   |   |   |       |   |-- Observability
|   |   |   |       |   |-- Outbox
|   |   |   |       |   |-- Persistence
|   |   |   |       |   |-- Repositories
|   |   |   |       |   `-- VisitorManagement.Infrastructure.csproj
|   |   |   |       |-- VisitorManagement.Presentation
|   |   |   |       |   |-- Contracts
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- RegisterVisitorEndpoint.cs
|   |   |   |       |   |-- Filters
|   |   |   |       |   |-- OpenApi
|   |   |   |       |   `-- VisitorManagement.Presentation.csproj
|   |   |   |       |-- VisitorManagement.Tests.Architecture
|   |   |   |       |-- VisitorManagement.Tests.Integration
|   |   |   |       `-- VisitorManagement.Tests.Unit
|   |   |   |-- Platform
|   |   |   |   |-- AnalyticsBI
|   |   |   |   |   |-- AnalyticsBI.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IAnalyticsRepository.cs
|   |   |   |   |   |   |-- AnalyticsBI.Application.csproj
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- GenerateReport
|   |   |   |   |   |   |       `-- GenerateReportCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- AnalyticsBI.Contracts
|   |   |   |   |   |   |-- AnalyticsBI.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- AnalyticsBI.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- DashboardReport.cs
|   |   |   |   |   |   |-- AnalyticsBI.Domain.csproj
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- AnalyticsBI.Infrastructure
|   |   |   |   |   |   |-- AnalyticsBI.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- AnalyticsBI.Presentation
|   |   |   |   |   |   |-- AnalyticsBI.Presentation.csproj
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- GenerateReportEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- AnalyticsBI.Tests.Architecture
|   |   |   |   |   |-- AnalyticsBI.Tests.Integration
|   |   |   |   |   `-- AnalyticsBI.Tests.Unit
|   |   |   |   |-- CRM
|   |   |   |   |   |-- CRM.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- ICRMRepository.cs
|   |   |   |   |   |   |-- CRM.Application.csproj
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- RegisterProspect
|   |   |   |   |   |   |       `-- RegisterProspectCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- CRM.Contracts
|   |   |   |   |   |   |-- CRM.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- CRM.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Prospect.cs
|   |   |   |   |   |   |-- CRM.Domain.csproj
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- CRM.Infrastructure
|   |   |   |   |   |   |-- CRM.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- CRM.Presentation
|   |   |   |   |   |   |-- CRM.Presentation.csproj
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- RegisterProspectEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- CRM.Tests.Architecture
|   |   |   |   |   |-- CRM.Tests.Integration
|   |   |   |   |   `-- CRM.Tests.Unit
|   |   |   |   |-- Communication
|   |   |   |   |   |-- Communication.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- ICommunicationRepository.cs
|   |   |   |   |   |   |-- Communication.Application.csproj
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- SendMessage
|   |   |   |   |   |   |       `-- SendMessageCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- Communication.Contracts
|   |   |   |   |   |   |-- Communication.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- Communication.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- DirectMessage.cs
|   |   |   |   |   |   |-- Communication.Domain.csproj
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- Communication.Infrastructure
|   |   |   |   |   |   |-- Communication.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- Communication.Presentation
|   |   |   |   |   |   |-- Communication.Presentation.csproj
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- SendMessageEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- Communication.Tests.Architecture
|   |   |   |   |   |-- Communication.Tests.Integration
|   |   |   |   |   `-- Communication.Tests.Unit
|   |   |   |   |-- DocumentManagement
|   |   |   |   |   |-- DocumentManagement.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IDocumentRepository.cs
|   |   |   |   |   |   |-- DocumentManagement.Application.csproj
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- UploadDocument
|   |   |   |   |   |   |       `-- UploadDocumentCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |   |-- DocumentManagement.Contracts
|   |   |   |   |   |   |-- DocumentManagement.Contracts.csproj
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- DocumentManagement.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- CorporateDocument.cs
|   |   |   |   |   |   |-- DocumentManagement.Domain.csproj
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- DocumentManagement.Infrastructure
|   |   |   |   |   |   |-- DocumentManagement.Infrastructure.csproj
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- DocumentManagement.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- DocumentManagement.Presentation.csproj
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- UploadDocumentEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- DocumentManagement.Tests.Architecture
|   |   |   |   |   |-- DocumentManagement.Tests.Integration
|   |   |   |   |   `-- DocumentManagement.Tests.Unit
|   |   |   |   |-- IdentityAccess
|   |   |   |   |   |-- IdentityAccess.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IUserRepository.cs
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- AuthenticateUser
|   |   |   |   |   |   |   |   |-- AuthenticateUserQuery.cs
|   |   |   |   |   |   |   |   `-- AuthenticateUserQueryHandler.cs
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
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- IdentityAccess.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- LoginEndpoint.cs
|   |   |   |   |   |   |   `-- RegisterUserEndpoint.cs
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
|   |   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   `-- ConfigureCampus
|   |   |   |   |   |   |       `-- ConfigureCampusCommand.cs
|   |   |   |   |   |   |-- Mappings
|   |   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   |   `-- MultiCampus.Application.csproj
|   |   |   |   |   |-- MultiCampus.Contracts
|   |   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |   |-- MultiCampus.Contracts.csproj
|   |   |   |   |   |   `-- PublicApi
|   |   |   |   |   |-- MultiCampus.Domain
|   |   |   |   |   |   |-- Aggregates
|   |   |   |   |   |   |   `-- Campus.cs
|   |   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |   |-- DomainServices
|   |   |   |   |   |   |-- Entities
|   |   |   |   |   |   |-- Exceptions
|   |   |   |   |   |   |-- MultiCampus.Domain.csproj
|   |   |   |   |   |   |-- Policies
|   |   |   |   |   |   `-- ValueObjects
|   |   |   |   |   |-- MultiCampus.Infrastructure
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |-- Inbox
|   |   |   |   |   |   |-- MultiCampus.Infrastructure.csproj
|   |   |   |   |   |   |-- Observability
|   |   |   |   |   |   |-- Outbox
|   |   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- Repositories
|   |   |   |   |   |-- MultiCampus.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- ConfigureCampusEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- MultiCampus.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- MultiCampus.Tests.Architecture
|   |   |   |   |   |-- MultiCampus.Tests.Integration
|   |   |   |   |   `-- MultiCampus.Tests.Unit
|   |   |   |   `-- Notification
|   |   |   |       |-- Notification.Application
|   |   |   |       |   |-- Abstractions
|   |   |   |       |   |   `-- INotificationRepository.cs
|   |   |   |       |   |-- EventHandlers
|   |   |   |       |   |   |-- DomainEventHandlers
|   |   |   |       |   |   `-- IntegrationEventHandlers
|   |   |   |       |   |-- Features
|   |   |   |       |   |   `-- SendNotification
|   |   |   |       |   |       `-- SendNotificationCommand.cs
|   |   |   |       |   |-- Mappings
|   |   |   |       |   |-- ModuleRegistration.cs
|   |   |   |       |   `-- Notification.Application.csproj
|   |   |   |       |-- Notification.Contracts
|   |   |   |       |   |-- IntegrationEvents
|   |   |   |       |   |-- Notification.Contracts.csproj
|   |   |   |       |   `-- PublicApi
|   |   |   |       |-- Notification.Domain
|   |   |   |       |   |-- Aggregates
|   |   |   |       |   |   `-- NotificationMessage.cs
|   |   |   |       |   |-- DomainEvents
|   |   |   |       |   |-- DomainServices
|   |   |   |       |   |-- Entities
|   |   |   |       |   |-- Exceptions
|   |   |   |       |   |-- Notification.Domain.csproj
|   |   |   |       |   |-- Policies
|   |   |   |       |   `-- ValueObjects
|   |   |   |       |-- Notification.Infrastructure
|   |   |   |       |   |-- ExternalAdapters
|   |   |   |       |   |-- Inbox
|   |   |   |       |   |-- Notification.Infrastructure.csproj
|   |   |   |       |   |-- Observability
|   |   |   |       |   |-- Outbox
|   |   |   |       |   |-- Persistence
|   |   |   |       |   `-- Repositories
|   |   |   |       |-- Notification.Presentation
|   |   |   |       |   |-- Contracts
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- SendNotificationEndpoint.cs
|   |   |   |       |   |-- Filters
|   |   |   |       |   |-- Notification.Presentation.csproj
|   |   |   |       |   `-- OpenApi
|   |   |   |       |-- Notification.Tests.Architecture
|   |   |   |       |-- Notification.Tests.Integration
|   |   |   |       `-- Notification.Tests.Unit
|   |   |   `-- StudentLifecycle
|   |   |       |-- Admissions
|   |   |       |   |-- Admissions.Application
|   |   |       |   |   |-- Abstractions
|   |   |       |   |   |-- Admissions.Application.csproj
|   |   |       |   |   |-- Class1.cs
|   |   |       |   |   |-- EventHandlers
|   |   |       |   |   |   |-- DomainEventHandlers
|   |   |       |   |   |   `-- IntegrationEventHandlers
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetApplicationStatus
|   |   |       |   |   |       `-- GetApplicationStatusQuery.cs
|   |   |       |   |   |-- Mappings
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- Admissions.Contracts
|   |   |       |   |   |-- Admissions.Contracts.csproj
|   |   |       |   |   |-- IntegrationEvents
|   |   |       |   |   `-- PublicApi
|   |   |       |   |-- Admissions.Domain
|   |   |       |   |   |-- Admissions.Domain.csproj
|   |   |       |   |   |-- Aggregates
|   |   |       |   |   |-- DomainEvents
|   |   |       |   |   |-- DomainServices
|   |   |       |   |   |-- Entities
|   |   |       |   |   |-- Exceptions
|   |   |       |   |   |-- Policies
|   |   |       |   |   `-- ValueObjects
|   |   |       |   |-- Admissions.Infrastructure
|   |   |       |   |   |-- Admissions.Infrastructure.csproj
|   |   |       |   |   |-- ExternalAdapters
|   |   |       |   |   |-- Inbox
|   |   |       |   |   |-- Observability
|   |   |       |   |   |-- Outbox
|   |   |       |   |   |-- Persistence
|   |   |       |   |   `-- Repositories
|   |   |       |   |-- Admissions.Presentation
|   |   |       |   |   |-- Admissions.Presentation.csproj
|   |   |       |   |   |-- Contracts
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetApplicationStatusEndpoint.cs
|   |   |       |   |   |-- Filters
|   |   |       |   |   `-- OpenApi
|   |   |       |   |-- Admissions.Tests.Architecture
|   |   |       |   |-- Admissions.Tests.Integration
|   |   |       |   `-- Admissions.Tests.Unit
|   |   |       |-- Alumni
|   |   |       |   |-- Alumni.Application
|   |   |       |   |   |-- Abstractions
|   |   |       |   |   |-- Alumni.Application.csproj
|   |   |       |   |   |-- EventHandlers
|   |   |       |   |   |   |-- DomainEventHandlers
|   |   |       |   |   |   `-- IntegrationEventHandlers
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetAlumniStatus
|   |   |       |   |   |       `-- GetAlumniStatusQuery.cs
|   |   |       |   |   |-- Mappings
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- Alumni.Contracts
|   |   |       |   |   |-- Alumni.Contracts.csproj
|   |   |       |   |   |-- IntegrationEvents
|   |   |       |   |   `-- PublicApi
|   |   |       |   |-- Alumni.Domain
|   |   |       |   |   |-- Aggregates
|   |   |       |   |   |-- Alumni.Domain.csproj
|   |   |       |   |   |-- DomainEvents
|   |   |       |   |   |-- DomainServices
|   |   |       |   |   |-- Entities
|   |   |       |   |   |-- Exceptions
|   |   |       |   |   |-- Policies
|   |   |       |   |   `-- ValueObjects
|   |   |       |   |-- Alumni.Infrastructure
|   |   |       |   |   |-- Alumni.Infrastructure.csproj
|   |   |       |   |   |-- ExternalAdapters
|   |   |       |   |   |-- Inbox
|   |   |       |   |   |-- Observability
|   |   |       |   |   |-- Outbox
|   |   |       |   |   |-- Persistence
|   |   |       |   |   `-- Repositories
|   |   |       |   |-- Alumni.Presentation
|   |   |       |   |   |-- Alumni.Presentation.csproj
|   |   |       |   |   |-- Contracts
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetAlumniStatusEndpoint.cs
|   |   |       |   |   |-- Filters
|   |   |       |   |   `-- OpenApi
|   |   |       |   |-- Alumni.Tests.Architecture
|   |   |       |   |-- Alumni.Tests.Integration
|   |   |       |   `-- Alumni.Tests.Unit
|   |   |       |-- GuidanceCounseling
|   |   |       |   |-- GuidanceCounseling.Application
|   |   |       |   |   |-- Abstractions
|   |   |       |   |   |-- EventHandlers
|   |   |       |   |   |   |-- DomainEventHandlers
|   |   |       |   |   |   `-- IntegrationEventHandlers
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetGuidanceSessions
|   |   |       |   |   |       `-- GetGuidanceSessionsQuery.cs
|   |   |       |   |   |-- GuidanceCounseling.Application.csproj
|   |   |       |   |   |-- Mappings
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- GuidanceCounseling.Contracts
|   |   |       |   |   |-- GuidanceCounseling.Contracts.csproj
|   |   |       |   |   |-- IntegrationEvents
|   |   |       |   |   `-- PublicApi
|   |   |       |   |-- GuidanceCounseling.Domain
|   |   |       |   |   |-- Aggregates
|   |   |       |   |   |-- DomainEvents
|   |   |       |   |   |-- DomainServices
|   |   |       |   |   |-- Entities
|   |   |       |   |   |-- Exceptions
|   |   |       |   |   |-- GuidanceCounseling.Domain.csproj
|   |   |       |   |   |-- Policies
|   |   |       |   |   `-- ValueObjects
|   |   |       |   |-- GuidanceCounseling.Infrastructure
|   |   |       |   |   |-- ExternalAdapters
|   |   |       |   |   |-- GuidanceCounseling.Infrastructure.csproj
|   |   |       |   |   |-- Inbox
|   |   |       |   |   |-- Observability
|   |   |       |   |   |-- Outbox
|   |   |       |   |   |-- Persistence
|   |   |       |   |   `-- Repositories
|   |   |       |   |-- GuidanceCounseling.Presentation
|   |   |       |   |   |-- Contracts
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetGuidanceSessionsEndpoint.cs
|   |   |       |   |   |-- Filters
|   |   |       |   |   |-- GuidanceCounseling.Presentation.csproj
|   |   |       |   |   `-- OpenApi
|   |   |       |   |-- GuidanceCounseling.Tests.Architecture
|   |   |       |   |-- GuidanceCounseling.Tests.Integration
|   |   |       |   `-- GuidanceCounseling.Tests.Unit
|   |   |       |-- HealthCenter
|   |   |       |   |-- HealthCenter.Application
|   |   |       |   |   |-- Abstractions
|   |   |       |   |   |-- EventHandlers
|   |   |       |   |   |   |-- DomainEventHandlers
|   |   |       |   |   |   `-- IntegrationEventHandlers
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetHealthAppointments
|   |   |       |   |   |       `-- GetHealthAppointmentsQuery.cs
|   |   |       |   |   |-- HealthCenter.Application.csproj
|   |   |       |   |   |-- Mappings
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- HealthCenter.Contracts
|   |   |       |   |   |-- HealthCenter.Contracts.csproj
|   |   |       |   |   |-- IntegrationEvents
|   |   |       |   |   `-- PublicApi
|   |   |       |   |-- HealthCenter.Domain
|   |   |       |   |   |-- Aggregates
|   |   |       |   |   |-- DomainEvents
|   |   |       |   |   |-- DomainServices
|   |   |       |   |   |-- Entities
|   |   |       |   |   |-- Exceptions
|   |   |       |   |   |-- HealthCenter.Domain.csproj
|   |   |       |   |   |-- Policies
|   |   |       |   |   `-- ValueObjects
|   |   |       |   |-- HealthCenter.Infrastructure
|   |   |       |   |   |-- ExternalAdapters
|   |   |       |   |   |-- HealthCenter.Infrastructure.csproj
|   |   |       |   |   |-- Inbox
|   |   |       |   |   |-- Observability
|   |   |       |   |   |-- Outbox
|   |   |       |   |   |-- Persistence
|   |   |       |   |   `-- Repositories
|   |   |       |   |-- HealthCenter.Presentation
|   |   |       |   |   |-- Contracts
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetHealthAppointmentsEndpoint.cs
|   |   |       |   |   |-- Filters
|   |   |       |   |   |-- HealthCenter.Presentation.csproj
|   |   |       |   |   `-- OpenApi
|   |   |       |   |-- HealthCenter.Tests.Architecture
|   |   |       |   |-- HealthCenter.Tests.Integration
|   |   |       |   `-- HealthCenter.Tests.Unit
|   |   |       |-- Hostel
|   |   |       |   |-- Hostel.Application
|   |   |       |   |   |-- Abstractions
|   |   |       |   |   |-- EventHandlers
|   |   |       |   |   |   |-- DomainEventHandlers
|   |   |       |   |   |   `-- IntegrationEventHandlers
|   |   |       |   |   |-- Features
|   |   |       |   |   |   `-- GetRoomAllocation
|   |   |       |   |   |       `-- GetRoomAllocationQuery.cs
|   |   |       |   |   |-- Hostel.Application.csproj
|   |   |       |   |   |-- Mappings
|   |   |       |   |   `-- ModuleRegistration.cs
|   |   |       |   |-- Hostel.Contracts
|   |   |       |   |   |-- Hostel.Contracts.csproj
|   |   |       |   |   |-- IntegrationEvents
|   |   |       |   |   `-- PublicApi
|   |   |       |   |-- Hostel.Domain
|   |   |       |   |   |-- Aggregates
|   |   |       |   |   |-- DomainEvents
|   |   |       |   |   |-- DomainServices
|   |   |       |   |   |-- Entities
|   |   |       |   |   |-- Exceptions
|   |   |       |   |   |-- Hostel.Domain.csproj
|   |   |       |   |   |-- Policies
|   |   |       |   |   `-- ValueObjects
|   |   |       |   |-- Hostel.Infrastructure
|   |   |       |   |   |-- ExternalAdapters
|   |   |       |   |   |-- Hostel.Infrastructure.csproj
|   |   |       |   |   |-- Inbox
|   |   |       |   |   |-- Observability
|   |   |       |   |   |-- Outbox
|   |   |       |   |   |-- Persistence
|   |   |       |   |   `-- Repositories
|   |   |       |   |-- Hostel.Presentation
|   |   |       |   |   |-- Contracts
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetRoomAllocationEndpoint.cs
|   |   |       |   |   |-- Filters
|   |   |       |   |   |-- Hostel.Presentation.csproj
|   |   |       |   |   `-- OpenApi
|   |   |       |   |-- Hostel.Tests.Architecture
|   |   |       |   |-- Hostel.Tests.Integration
|   |   |       |   `-- Hostel.Tests.Unit
|   |   |       `-- PlacementCareer
|   |   |           |-- PlacementCareer.Application
|   |   |           |   |-- Abstractions
|   |   |           |   |-- EventHandlers
|   |   |           |   |   |-- DomainEventHandlers
|   |   |           |   |   `-- IntegrationEventHandlers
|   |   |           |   |-- Features
|   |   |           |   |   `-- GetJobPostings
|   |   |           |   |       `-- GetJobPostingsQuery.cs
|   |   |           |   |-- Mappings
|   |   |           |   |-- ModuleRegistration.cs
|   |   |           |   `-- PlacementCareer.Application.csproj
|   |   |           |-- PlacementCareer.Contracts
|   |   |           |   |-- IntegrationEvents
|   |   |           |   |-- PlacementCareer.Contracts.csproj
|   |   |           |   `-- PublicApi
|   |   |           |-- PlacementCareer.Domain
|   |   |           |   |-- Aggregates
|   |   |           |   |-- DomainEvents
|   |   |           |   |-- DomainServices
|   |   |           |   |-- Entities
|   |   |           |   |-- Exceptions
|   |   |           |   |-- PlacementCareer.Domain.csproj
|   |   |           |   |-- Policies
|   |   |           |   `-- ValueObjects
|   |   |           |-- PlacementCareer.Infrastructure
|   |   |           |   |-- ExternalAdapters
|   |   |           |   |-- Inbox
|   |   |           |   |-- Observability
|   |   |           |   |-- Outbox
|   |   |           |   |-- Persistence
|   |   |           |   |-- PlacementCareer.Infrastructure.csproj
|   |   |           |   `-- Repositories
|   |   |           |-- PlacementCareer.Presentation
|   |   |           |   |-- Contracts
|   |   |           |   |-- Endpoints
|   |   |           |   |   `-- GetJobPostingsEndpoint.cs
|   |   |           |   |-- Filters
|   |   |           |   |-- OpenApi
|   |   |           |   `-- PlacementCareer.Presentation.csproj
|   |   |           |-- PlacementCareer.Tests.Architecture
|   |   |           |-- PlacementCareer.Tests.Integration
|   |   |           `-- PlacementCareer.Tests.Unit
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
|   `-- tests
|       |-- ArchitectureTests
|       |   |-- ContractOnlyDependencyTests.cs
|       |   |-- ModuleRegistrationConventionTests.cs
|       |   |-- NoCrossModuleDomainReferenceTests.cs
|       |   `-- SharedKernelPurityTests.cs
|       |-- ContractTests
|       |   |-- IntegrationEvents
|       |   `-- PublicApiContracts
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
|       |-- IntegrationTests
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
|   |   |   |   |   `-- index-Cg-3ewtp.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- AssetRegistry
|   |   |   |   |   |   `-- AssetRegistry.page.tsx
|   |   |   |   |   |-- CanteenOrders
|   |   |   |   |   |   `-- CanteenOrders.page.tsx
|   |   |   |   |   |-- EmployeeManagement
|   |   |   |   |   |   `-- EmployeeManagement.page.tsx
|   |   |   |   |   |-- FacilityBooking
|   |   |   |   |   |   `-- FacilityBooking.page.tsx
|   |   |   |   |   |-- FleetManagement
|   |   |   |   |   |   `-- FleetManagement.page.tsx
|   |   |   |   |   |-- PurchaseOrders
|   |   |   |   |   |   `-- PurchaseOrders.page.tsx
|   |   |   |   |   `-- StockManagement
|   |   |   |   |       `-- StockManagement.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- applicant-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-wCb-WWtM.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- AdmissionStatus
|   |   |   |   |   |   |-- AdmissionStatus.api.ts
|   |   |   |   |   |   |-- AdmissionStatus.hooks.ts
|   |   |   |   |   |   |-- AdmissionStatus.page.tsx
|   |   |   |   |   |   |-- AdmissionStatus.test.tsx
|   |   |   |   |   |   `-- AdmissionStatus.types.ts
|   |   |   |   |   |-- ApplicantJourney.hooks.ts
|   |   |   |   |   |-- ApplicationTimeline
|   |   |   |   |   |   `-- ApplicationTimeline.page.tsx
|   |   |   |   |   |-- ApplicationWizard
|   |   |   |   |   |   `-- ApplicationWizard.page.tsx
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   `-- Dashboard.page.tsx
|   |   |   |   |   |-- DocumentSubmission
|   |   |   |   |   |   `-- DocumentSubmission.page.tsx
|   |   |   |   |   |-- EligibilityChecker
|   |   |   |   |   |   `-- EligibilityChecker.page.tsx
|   |   |   |   |   `-- ProgramExplorer
|   |   |   |   |       `-- ProgramExplorer.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   |-- ErrorBoundary.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   |-- theme.css
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- structure.md
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- faculty-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-CLe2hVpi.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- finance-console
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-BJwHwZfL.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- PayrollProcessing
|   |   |   |   |   |   |-- PayrollProcessing.hooks.ts
|   |   |   |   |   |   `-- PayrollProcessing.page.tsx
|   |   |   |   |   `-- StudentBilling
|   |   |   |   |       |-- StudentBilling.hooks.ts
|   |   |   |   |       `-- StudentBilling.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- governance-console
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-RvJAtYj5.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- Events
|   |   |   |   |   |   `-- Events.page.tsx
|   |   |   |   |   |-- Grievances
|   |   |   |   |   |   `-- Grievances.page.tsx
|   |   |   |   |   |-- Helpdesk
|   |   |   |   |   |   `-- Helpdesk.page.tsx
|   |   |   |   |   |-- QualityAccreditation
|   |   |   |   |   |   `-- QualityAccreditation.page.tsx
|   |   |   |   |   `-- Visitors
|   |   |   |   |       `-- Visitors.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- identity-portal
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- MfaVerification
|   |   |   |   |   |   |-- MfaVerification.api.ts
|   |   |   |   |   |   |-- MfaVerification.hooks.ts
|   |   |   |   |   |   |-- MfaVerification.page.tsx
|   |   |   |   |   |   |-- MfaVerification.test.tsx
|   |   |   |   |   |   `-- MfaVerification.types.ts
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
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   `-- vite.config.ts
|   |   |-- library-portal
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-B6lpmVFj.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- public
|   |   |   |-- src
|   |   |   |   |-- config
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   `-- Circulation
|   |   |   |   |       `-- Circulation.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- lms-web
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-DujJIt0B.js
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
|   |   |   |   |   |-- authConfig.ts
|   |   |   |   |   `-- env.ts
|   |   |   |   |-- features
|   |   |   |   |   |-- AssignmentDraftEditor
|   |   |   |   |   |-- ModuleTimeline
|   |   |   |   |   `-- QuizWindowGuard
|   |   |   |   |-- main.tsx
|   |   |   |   |-- offline
|   |   |   |   |   |-- indexedDbSchema.ts
|   |   |   |   |   |-- serviceWorkerRegistration.ts
|   |   |   |   |   `-- syncQueue.ts
|   |   |   |   |-- shell
|   |   |   |   |   |-- AppShell.tsx
|   |   |   |   |   |-- AuthGuard.tsx
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   |-- state
|   |   |   |   |   `-- queryClient.ts
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   |-- platform-console
|   |   |   |-- dist
|   |   |   |   |-- assets
|   |   |   |   |   `-- index-Cqiz8EhI.js
|   |   |   |   `-- index.html
|   |   |   |-- index.html
|   |   |   |-- package.json
|   |   |   |-- src
|   |   |   |   |-- features
|   |   |   |   |   |-- AnalyticsBI
|   |   |   |   |   |   `-- AnalyticsBI.page.tsx
|   |   |   |   |   |-- CRM
|   |   |   |   |   |   `-- CRM.page.tsx
|   |   |   |   |   |-- Communication
|   |   |   |   |   |   `-- Communication.page.tsx
|   |   |   |   |   |-- DocumentManagement
|   |   |   |   |   |   `-- DocumentManagement.page.tsx
|   |   |   |   |   |-- MultiCampus
|   |   |   |   |   |   `-- MultiCampus.page.tsx
|   |   |   |   |   `-- Notification
|   |   |   |   |       `-- Notification.page.tsx
|   |   |   |   |-- main.tsx
|   |   |   |   |-- shell
|   |   |   |   |   `-- Routing.tsx
|   |   |   |   `-- vite-env.d.ts
|   |   |   |-- tsconfig.json
|   |   |   |-- tsconfig.node.json
|   |   |   `-- vite.config.ts
|   |   `-- student-portal
|   |       |-- dist
|   |       |   |-- assets
|   |       |   |   `-- index-wCb-WWtM.js
|   |       |   `-- index.html
|   |       |-- index.html
|   |       |-- package.json
|   |       |-- public
|   |       |-- src
|   |       |   |-- config
|   |       |   |   |-- authConfig.ts
|   |       |   |   `-- env.ts
|   |       |   |-- features
|   |       |   |   |-- AcademicTranscript
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
|   |       |   |   |   |-- LearningManagement.page.tsx
|   |       |   |   |   `-- LearningManagement.styles.css
|   |       |   |   |-- MyEnrollments
|   |       |   |   |   |-- MyEnrollments.api.ts
|   |       |   |   |   |-- MyEnrollments.hooks.ts
|   |       |   |   |   |-- MyEnrollments.page.tsx
|   |       |   |   |   |-- MyEnrollments.styles.css
|   |       |   |   |   |-- MyEnrollments.test.tsx
|   |       |   |   |   `-- MyEnrollments.types.ts
|   |       |   |   `-- StudentProfile
|   |       |   |       |-- StudentProfile.api.ts
|   |       |   |       |-- StudentProfile.hooks.ts
|   |       |   |       |-- StudentProfile.page.tsx
|   |       |   |       |-- StudentProfile.test.tsx
|   |       |   |       `-- StudentProfile.types.ts
|   |       |   |-- main.tsx
|   |       |   |-- shell
|   |       |   |   |-- AppShell.tsx
|   |       |   |   |-- AuthGuard.tsx
|   |       |   |   |-- ErrorBoundary.tsx
|   |       |   |   `-- Routing.tsx
|   |       |   |-- state
|   |       |   |   `-- queryClient.ts
|   |       |   |-- theme.css
|   |       |   `-- vite-env.d.ts
|   |       |-- structure.md
|   |       |-- tsconfig.json
|   |       |-- tsconfig.node.json
|   |       `-- vite.config.ts
|   |-- bootstrap.sh
|   |-- clients
|   |   |-- lms-offline-avalonia
|   |   |   |-- LmsOffline.Application
|   |   |   |   |-- Commands
|   |   |   |   |   |-- StartOfflineAssessmentCommand.cs
|   |   |   |   |   `-- StartOfflineAssessmentCommandHandler.cs
|   |   |   |   |-- Features
|   |   |   |   |   |-- DownloadModulePackage
|   |   |   |   |   |   |-- DownloadModulePackageCommand.cs
|   |   |   |   |   |   `-- DownloadModulePackageCommandHandler.cs
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
|   |   |   |   |   |-- IOfflineAssessmentRepository.cs
|   |   |   |   |   |-- IOfflineAssignmentRepository.cs
|   |   |   |   |   `-- IOfflineModuleRepository.cs
|   |   |   |   |-- LmsOffline.Application.csproj
|   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   `-- Validators
|   |   |   |       `-- StartOfflineAssessmentCommandValidator.cs
|   |   |   |-- LmsOffline.Contracts
|   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- OfflineAssessmentSubmitted.cs
|   |   |   |   |   `-- OfflineAssignmentSubmitted.cs
|   |   |   |   `-- LmsOffline.Contracts.csproj
|   |   |   |-- LmsOffline.Domain
|   |   |   |   |-- Aggregates
|   |   |   |   |   |-- OfflineAssessment.cs
|   |   |   |   |   |-- OfflineAssignment.cs
|   |   |   |   |   `-- OfflineModule.cs
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
|   |   |   |   |   `-- OfflineTokenCache.cs
|   |   |   |   |-- Data
|   |   |   |   |   `-- EncryptedSqliteContext.cs
|   |   |   |   |-- LmsOffline.Infrastructure.csproj
|   |   |   |   |-- Persistence
|   |   |   |   |   |-- EncryptedSqliteContext.cs
|   |   |   |   |   `-- Migrations
|   |   |   |   |-- Repositories
|   |   |   |   |   |-- OfflineAssessmentRepository.cs
|   |   |   |   |   |-- OfflineAssignmentRepository.cs
|   |   |   |   |   `-- OfflineModuleRepository.cs
|   |   |   |   `-- Sync
|   |   |   |       |-- OutboxSyncProcessor.cs
|   |   |   |       `-- ScheduleTokenVerifier.cs
|   |   |   |-- LmsOffline.Presentation
|   |   |   |   |-- App.axaml
|   |   |   |   |-- App.axaml.cs
|   |   |   |   |-- LmsOffline.Presentation.csproj
|   |   |   |   |-- MainWindow.axaml
|   |   |   |   |-- MainWindow.axaml.cs
|   |   |   |   |-- Program.cs
|   |   |   |   |-- ViewModels
|   |   |   |   |   |-- AssessmentViewModel.cs
|   |   |   |   |   |-- AssignmentSubmissionViewModel.cs
|   |   |   |   |   |-- CourseContentViewModel.cs
|   |   |   |   |   `-- ModuleTimelineViewModel.cs
|   |   |   |   |-- Views
|   |   |   |   |   |-- AssessmentView.axaml
|   |   |   |   |   |-- AssessmentView.axaml.cs
|   |   |   |   |   |-- AssignmentSubmissionView.axaml
|   |   |   |   |   |-- AssignmentSubmissionView.axaml.cs
|   |   |   |   |   |-- CourseContentView.axaml
|   |   |   |   |   |-- ModuleTimelineView.axaml
|   |   |   |   |   `-- ModuleTimelineView.axaml.cs
|   |   |   |   `-- app.manifest
|   |   |   |-- LmsOffline.Tests
|   |   |   |   |-- LmsOffline.Tests.csproj
|   |   |   |   |-- OfflineTokenCacheTests.cs
|   |   |   |   |-- SyncConflictResolutionTests.cs
|   |   |   |   |-- UnitTest1.cs
|   |   |   |   `-- WindowEnforcementPolicyTests.cs
|   |   |   `-- LmsOfflineClient.slnx
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
|   |-- fix_api_urls.js
|   |-- fix_everything.js
|   |-- fix_tsconfigs.js
|   |-- libs
|   |   |-- api-clients
|   |   |   |-- academic
|   |   |   |   |-- examinationResultApi.ts
|   |   |   |   |-- libraryCatalogApi.ts
|   |   |   |   |-- registrarCurriculumApi.ts
|   |   |   |   `-- studentInformationApi.ts
|   |   |   |-- administration
|   |   |   |   |-- assetManagementApi.ts
|   |   |   |   |-- financeApi.ts
|   |   |   |   |-- financeBillingApi.ts
|   |   |   |   |-- hrApi.ts
|   |   |   |   |-- inventoryApi.ts
|   |   |   |   `-- procurementApi.ts
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
|   |   |   |   |-- identityAccessAuthorizationApi.ts
|   |   |   |   `-- identityApi.ts
|   |   |   `-- student-lifecycle
|   |   |       |-- admissionsApi.ts
|   |   |       |-- alumniApi.ts
|   |   |       |-- careerApi.ts
|   |   |       |-- guidanceApi.ts
|   |   |       |-- healthCenterApi.ts
|   |   |       |-- hostelApi.ts
|   |   |       |-- studentInformationApi.ts
|   |   |       `-- studentInformationReadModel.ts
|   |   |-- auth-sdk
|   |   |   |-- dotnet
|   |   |   |   `-- OidcClient.cs
|   |   |   |-- index.ts
|   |   |   |-- package.json
|   |   |   `-- react
|   |   |       |-- AuthContext.ts
|   |   |       |-- AuthProvider.tsx
|   |   |       |-- silentRefresh.ts
|   |   |       `-- useAuth.ts
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
|   |   `-- ui-kit
|   |       |-- components
|   |       |-- package.json
|   |       |-- src
|   |       |   |-- components
|   |       |   |   |-- Badge.tsx
|   |       |   |   |-- Button.tsx
|   |       |   |   |-- Card.tsx
|   |       |   |   `-- PageHeader.tsx
|   |       |   `-- index.ts
|   |       |-- theming
|   |       `-- tokens
|   |-- package-lock.json
|   |-- package.json
|   |-- repair-npm.sh
|   |-- tests
|   |   |-- AccessibilityTests
|   |   |   `-- wcag-audit.spec.ts
|   |   |-- ArchitectureTests
|   |   |   `-- dependency-cruiser.config.js
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
|   |-- tools
|   |   |-- migration
|   |   |   |-- fix-vite-esm.js
|   |   |   |-- migrate-admissions.js
|   |   |   |-- migrate-all.js
|   |   |   |-- migrate-auth.js
|   |   |   |-- migrate-css-exports.js
|   |   |   |-- migrate-domain-models.js
|   |   |   `-- migrate-ui-kit.js
|   |   `-- repair
|   |       |-- migrate.js
|   |       |-- repair_packages.js
|   |       `-- repair_vite.js
|   |-- tsconfig.json
|   `-- update_deps.js
|-- UniversityErp.slnx
|-- docker-compose.yml
|-- scaffold-frontend-cloudflare-nginx.sh
|-- setup_structure.ps1
|-- setup_structure.sh
|-- universal-semantic-versioning-prompt.md
|-- university-erp-cloudflare-tunnel-zero-trust-security-addendum.md
|-- university-erp-docker-compose-orchestration-prompt.md
|-- university-erp-domain-based-modular-architecture (2).md
|-- university-erp-frontend-dbma-architecture.md
|-- university-erp-frontend-features-ddd-dbma-prompt.md
`-- university-erp-scaffolding-script-review.md

1473 directories, 934 files
