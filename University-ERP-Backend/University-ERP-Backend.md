.
|-- Directory.Build.props
|-- Rebuild_Dependencies.ps1
|-- University-ERP-Backend.md
|-- UniversityErp.slnx
|-- domain
|   |-- adr
|   |   |-- ADR-001-modular-monolith-over-microservices.md
|   |   |-- ADR-002-shared-kernel-scope-restriction.md
|   |   |-- ADR-003-anti-corruption-layer-health-guidance.md
|   |   |-- ADR-004-event-driven-cross-module-integration.md
|   |   `-- ADR-NNN-template.md
|   |-- model
|   |   |-- aggregate-catalog.md
|   |   |-- bounded-context-catalog.md
|   |   |-- business-capability-map.md
|   |   |-- business-rules-catalog.md
|   |   |-- context-map.md
|   |   |-- domain-event-catalog.md
|   |   |-- entity-catalog.md
|   |   |-- ubiquitous-language-glossary.md
|   |   `-- value-object-catalog.md
|   `-- runbooks
|       |-- data-recovery
|       |   `-- student-enrollment-rollback.md
|       |-- incident-response
|       |   |-- finance-invoice-outbox-stuck.md
|       |   |-- grievance-sla-breach-storm.md
|       |   `-- identityaccess-outage.md
|       `-- module-onboarding
|           `-- new-bounded-context-checklist.md
|-- ops
|   |-- cloudflare
|   |   |-- dns
|   |   |   `-- university-erp-zone.tf
|   |   |-- page-rules
|   |   |   |-- bypass-cache-api.json
|   |   |   `-- cache-static-assets.json
|   |   |-- waf-rules
|   |   |   |-- bot-fight-mode.json
|   |   |   |-- owasp-managed-ruleset.json
|   |   |   `-- rate-limiting.json
|   |   `-- workers
|   |       `-- security-headers-worker.js
|   |-- db-migrations
|   |   |-- AcademicScheduling
|   |   |-- Admissions
|   |   |-- Alumni
|   |   |-- AnalyticsBI
|   |   |-- AssetManagement
|   |   |-- CRM
|   |   |-- Communication
|   |   |-- DocumentManagement
|   |   |-- EventManagement
|   |   |-- Examination
|   |   |-- Facilities
|   |   |-- Finance
|   |   |-- GrievanceManagement
|   |   |-- GuidanceCounseling
|   |   |-- HealthCenter
|   |   |-- Helpdesk
|   |   |-- Hostel
|   |   |-- HumanResources
|   |   |-- IdentityAccess
|   |   |-- Inventory
|   |   |-- LearningManagement
|   |   |-- Library
|   |   |-- MessCanteen
|   |   |-- MultiCampus
|   |   |-- Notification
|   |   |-- Payroll
|   |   |-- PlacementCareer
|   |   |-- Procurement
|   |   |-- QualityAccreditation
|   |   |-- Registrar
|   |   |-- StudentInformation
|   |   |   |-- 20260731000000_Initial_StudentInformation.Designer.cs
|   |   |   |-- 20260731000000_Initial_StudentInformation.cs
|   |   |   `-- StudentInformationDbContextModelSnapshot.cs
|   |   |-- Transport
|   |   `-- VisitorManagement
|   |-- nginx
|   |   |-- sites-available
|   |   |   |-- admin.university.edu.conf
|   |   |   |-- api.university.edu.conf
|   |   |   |-- auth.university.edu.conf
|   |   |   |-- faculty.university.edu.conf
|   |   |   |-- finance.university.edu.conf
|   |   |   |-- governance.university.edu.conf
|   |   |   |-- library.university.edu.conf
|   |   |   |-- lms.university.edu.conf
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
|   `-- pipelines
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
|   |   |   |-- UniversityErp.Api.csproj.user
|   |   |   |-- UniversityErp.Api.http
|   |   |   |-- appsettings
|   |   |   |   `-- appsettings.Production.json
|   |   |   |-- appsettings.Development.json
|   |   |   `-- appsettings.json
|   |   |-- UniversityErp.Migrator
|   |   |   |-- MigrationRunners
|   |   |   |   `-- PerModuleMigrationRunner.cs
|   |   |   |-- Program.cs
|   |   |   `-- UniversityErp.Migrator.csproj
|   |   `-- UniversityErp.Worker
|   |       |-- Consumers
|   |       |   |-- AcademicEventConsumers.cs
|   |       |   |-- FinanceEventConsumers.cs
|   |       |   `-- GovernanceEventConsumers.cs
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
|   |       |-- appsettings.Development.json
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
|   |   |   `-- StudentLifecycle
|   |   |       |-- ApplicantAcceptedIntegrationEvent.cs
|   |   |       `-- RoomAllocatedIntegrationEvent.cs
|   |   `-- PublicApiContracts
|   |       |-- Academic
|   |       |   |-- Examination.ResultQueryApi.cs
|   |       |   `-- Registrar.CurriculumApi.cs
|   |       |-- Administration
|   |       |   `-- Finance.BillingApi.cs
|   |       |-- Governance
|   |       |   `-- Facilities.SpaceAvailabilityApi.cs
|   |       |-- Platform
|   |       |   `-- IdentityAccess.AuthorizationApi.cs
|   |       `-- StudentLifecycle
|   |           `-- StudentInformation.StudentReadModel.cs
|   |-- Modules
|   |   |-- Academic
|   |   |   |-- AcademicScheduling
|   |   |   |   |-- AcademicScheduling.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- AcademicScheduling.Application.csproj
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- AcademicScheduling.Contracts
|   |   |   |   |   |-- AcademicScheduling.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- AcademicScheduling.Domain
|   |   |   |   |   |-- AcademicScheduling.Domain.csproj
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- AcademicScheduling.Infrastructure
|   |   |   |   |   |-- AcademicScheduling.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- AcademicScheduling.Presentation
|   |   |   |   |   |-- AcademicScheduling.Presentation.csproj
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- AcademicScheduling.Tests.Architecture
|   |   |   |   |-- AcademicScheduling.Tests.Integration
|   |   |   |   `-- AcademicScheduling.Tests.Unit
|   |   |   |-- Examination
|   |   |   |   |-- Examination.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Examination.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Examination.Contracts
|   |   |   |   |   |-- Examination.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Examination.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Examination.Domain.csproj
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Examination.Infrastructure
|   |   |   |   |   |-- Examination.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Examination.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Examination.Presentation.csproj
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Examination.Tests.Architecture
|   |   |   |   |-- Examination.Tests.Integration
|   |   |   |   `-- Examination.Tests.Unit
|   |   |   |-- LearningManagement
|   |   |   |   |-- LearningManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |-- IOfflineSubmissionRepository.cs
|   |   |   |   |   |   `-- IScheduleTokenVerifier.cs
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmission
|   |   |   |   |   |   |   |-- ProcessOfflineAssessmentSubmissionCommand.cs
|   |   |   |   |   |   |   `-- ProcessOfflineAssessmentSubmissionCommandHandler.cs
|   |   |   |   |   |   `-- ProcessOfflineAssignmentSubmission
|   |   |   |   |   |       |-- ProcessOfflineAssignmentSubmissionCommand.cs
|   |   |   |   |   |       `-- ProcessOfflineAssignmentSubmissionCommandHandler.cs
|   |   |   |   |   |-- LearningManagement.Application.csproj
|   |   |   |   |   |-- LearningManagementApplicationRegistration.cs
|   |   |   |   |   |-- Mappings
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
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- LearningManagement.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- LearningManagement.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- LearningManagement.Infrastructure.csproj
|   |   |   |   |   |-- LearningManagementModuleRegistration.cs
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |   `-- LearningManagementDbContext.cs
|   |   |   |   |   |-- Repositories
|   |   |   |   |   |   `-- OfflineSubmissionRepository.cs
|   |   |   |   |   `-- Security
|   |   |   |   |       `-- ScheduleTokenVerifier.cs
|   |   |   |   |-- LearningManagement.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |-- SyncOfflineAssessmentsEndpoint.cs
|   |   |   |   |   |   `-- SyncOfflineAssignmentsEndpoint.cs
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- LearningManagement.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- LearningManagement.Tests.Architecture
|   |   |   |   |-- LearningManagement.Tests.Integration
|   |   |   |   `-- LearningManagement.Tests.Unit
|   |   |   |-- Registrar
|   |   |   |   |-- Registrar.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- Registrar.Application.csproj
|   |   |   |   |-- Registrar.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- PublicApi
|   |   |   |   |   `-- Registrar.Contracts.csproj
|   |   |   |   |-- Registrar.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   |-- Registrar.Domain.csproj
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Registrar.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |-- Registrar.Infrastructure.csproj
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Registrar.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- OpenApi
|   |   |   |   |   `-- Registrar.Presentation.csproj
|   |   |   |   |-- Registrar.Tests.Architecture
|   |   |   |   |-- Registrar.Tests.Integration
|   |   |   |   `-- Registrar.Tests.Unit
|   |   |   `-- StudentInformation
|   |   |       |-- StudentInformation.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |   `-- IStudentRepository.cs
|   |   |       |   |-- EventHandlers
|   |   |       |   |   |-- DomainEventHandlers
|   |   |       |   |   `-- IntegrationEventHandlers
|   |   |       |   |-- Features
|   |   |       |   |   `-- EnrollStudent
|   |   |       |   |       |-- EnrollStudentCommand.cs
|   |   |       |   |       |-- EnrollStudentCommandHandler.cs
|   |   |       |   |       `-- EnrollStudentCommandValidator.cs
|   |   |       |   |-- Mappings
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- StudentInformation.Application.csproj
|   |   |       |-- StudentInformation.Contracts
|   |   |       |   |-- IntegrationEvents
|   |   |       |   `-- PublicApi
|   |   |       |-- StudentInformation.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |   `-- Student.cs
|   |   |       |   |-- DomainEvents
|   |   |       |   |   `-- StudentEnrolledDomainEvent.cs
|   |   |       |   |-- DomainServices
|   |   |       |   |-- Entities
|   |   |       |   |-- Exceptions
|   |   |       |   |-- Policies
|   |   |       |   |-- StudentInformation.Domain.csproj
|   |   |       |   `-- ValueObjects
|   |   |       |       |-- EnrollmentStatus.cs
|   |   |       |       `-- StudentId.cs
|   |   |       |-- StudentInformation.Infrastructure
|   |   |       |   |-- ExternalAdapters
|   |   |       |   |-- Inbox
|   |   |       |   |-- Observability
|   |   |       |   |-- Outbox
|   |   |       |   |-- Persistence
|   |   |       |   |   |-- StudentConfiguration.cs
|   |   |       |   |   `-- StudentInformationDbContext.cs
|   |   |       |   |-- Repositories
|   |   |       |   |   `-- StudentRepository.cs
|   |   |       |   |-- StudentInformation.Infrastructure.csproj
|   |   |       |   `-- StudentInformationModuleRegistration.cs
|   |   |       |-- StudentInformation.Presentation
|   |   |       |   |-- Contracts
|   |   |       |   |   `-- EnrollStudentRequest.cs
|   |   |       |   |-- Controllers
|   |   |       |   |   `-- StudentsController.cs
|   |   |       |   |-- Endpoints
|   |   |       |   |-- Filters
|   |   |       |   |-- OpenApi
|   |   |       |   `-- StudentInformation.Presentation.csproj
|   |   |       |-- StudentInformation.Tests.Architecture
|   |   |       |-- StudentInformation.Tests.Integration
|   |   |       `-- StudentInformation.Tests.Unit
|   |   |-- Administration
|   |   |   |-- AssetManagement
|   |   |   |   |-- AssetManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- AssetManagement.Application.csproj
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- AssetManagement.Contracts
|   |   |   |   |   |-- AssetManagement.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- AssetManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- AssetManagement.Domain.csproj
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- AssetManagement.Infrastructure
|   |   |   |   |   |-- AssetManagement.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- AssetManagement.Presentation
|   |   |   |   |   |-- AssetManagement.Presentation.csproj
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- AssetManagement.Tests.Architecture
|   |   |   |   |-- AssetManagement.Tests.Integration
|   |   |   |   `-- AssetManagement.Tests.Unit
|   |   |   |-- Facilities
|   |   |   |   |-- Facilities.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Facilities.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Facilities.Contracts
|   |   |   |   |   |-- Facilities.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Facilities.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Facilities.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Facilities.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Facilities.Infrastructure.csproj
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Facilities.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Facilities.Presentation.csproj
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Facilities.Tests.Architecture
|   |   |   |   |-- Facilities.Tests.Integration
|   |   |   |   `-- Facilities.Tests.Unit
|   |   |   |-- Finance
|   |   |   |   |-- Finance.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Finance.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Finance.Contracts
|   |   |   |   |   |-- Finance.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Finance.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Finance.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Finance.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Finance.Infrastructure.csproj
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Finance.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- Finance.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Finance.Tests.Architecture
|   |   |   |   |-- Finance.Tests.Integration
|   |   |   |   `-- Finance.Tests.Unit
|   |   |   |-- HumanResources
|   |   |   |   |-- HumanResources.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- HumanResources.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- HumanResources.Contracts
|   |   |   |   |   |-- HumanResources.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- HumanResources.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- HumanResources.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- HumanResources.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- HumanResources.Infrastructure.csproj
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- HumanResources.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- HumanResources.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- HumanResources.Tests.Architecture
|   |   |   |   |-- HumanResources.Tests.Integration
|   |   |   |   `-- HumanResources.Tests.Unit
|   |   |   |-- Inventory
|   |   |   |   |-- Inventory.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Inventory.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Inventory.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- Inventory.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Inventory.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Inventory.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Inventory.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Inventory.Infrastructure.csproj
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Inventory.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- Inventory.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Inventory.Tests.Architecture
|   |   |   |   |-- Inventory.Tests.Integration
|   |   |   |   `-- Inventory.Tests.Unit
|   |   |   |-- Library
|   |   |   |   |-- Library.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Library.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Library.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- Library.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Library.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Library.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Library.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Library.Infrastructure.csproj
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Library.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- Library.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Library.Tests.Architecture
|   |   |   |   |-- Library.Tests.Integration
|   |   |   |   `-- Library.Tests.Unit
|   |   |   |-- MessCanteen
|   |   |   |   |-- MessCanteen.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   |-- MessCanteen.Application.csproj
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- MessCanteen.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- MessCanteen.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- MessCanteen.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- MessCanteen.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- MessCanteen.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- MessCanteen.Infrastructure.csproj
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- MessCanteen.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- MessCanteen.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- MessCanteen.Tests.Architecture
|   |   |   |   |-- MessCanteen.Tests.Integration
|   |   |   |   `-- MessCanteen.Tests.Unit
|   |   |   |-- Payroll
|   |   |   |   |-- Payroll.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- Payroll.Application.csproj
|   |   |   |   |-- Payroll.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- Payroll.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Payroll.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Payroll.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Payroll.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Payroll.Infrastructure.csproj
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Payroll.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- OpenApi
|   |   |   |   |   `-- Payroll.Presentation.csproj
|   |   |   |   |-- Payroll.Tests.Architecture
|   |   |   |   |-- Payroll.Tests.Integration
|   |   |   |   `-- Payroll.Tests.Unit
|   |   |   |-- Procurement
|   |   |   |   |-- Procurement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- Procurement.Application.csproj
|   |   |   |   |-- Procurement.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- Procurement.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Procurement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   |-- Procurement.Domain.csproj
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Procurement.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |-- Procurement.Infrastructure.csproj
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Procurement.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- OpenApi
|   |   |   |   |   `-- Procurement.Presentation.csproj
|   |   |   |   |-- Procurement.Tests.Architecture
|   |   |   |   |-- Procurement.Tests.Integration
|   |   |   |   `-- Procurement.Tests.Unit
|   |   |   `-- Transport
|   |   |       |-- Transport.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |-- EventHandlers
|   |   |       |   |   |-- DomainEventHandlers
|   |   |       |   |   `-- IntegrationEventHandlers
|   |   |       |   |-- Features
|   |   |       |   |-- Mappings
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- Transport.Application.csproj
|   |   |       |-- Transport.Contracts
|   |   |       |   |-- IntegrationEvents
|   |   |       |   |-- PublicApi
|   |   |       |   `-- Transport.Contracts.csproj
|   |   |       |-- Transport.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |-- DomainEvents
|   |   |       |   |-- DomainServices
|   |   |       |   |-- Entities
|   |   |       |   |-- Exceptions
|   |   |       |   |-- Policies
|   |   |       |   |-- Transport.Domain.csproj
|   |   |       |   `-- ValueObjects
|   |   |       |-- Transport.Infrastructure
|   |   |       |   |-- ExternalAdapters
|   |   |       |   |-- Inbox
|   |   |       |   |-- Observability
|   |   |       |   |-- Outbox
|   |   |       |   |-- Persistence
|   |   |       |   |-- Repositories
|   |   |       |   `-- Transport.Infrastructure.csproj
|   |   |       |-- Transport.Presentation
|   |   |       |   |-- Contracts
|   |   |       |   |-- Endpoints
|   |   |       |   |-- Filters
|   |   |       |   |-- OpenApi
|   |   |       |   `-- Transport.Presentation.csproj
|   |   |       |-- Transport.Tests.Architecture
|   |   |       |-- Transport.Tests.Integration
|   |   |       `-- Transport.Tests.Unit
|   |   |-- Governance
|   |   |   |-- EventManagement
|   |   |   |   |-- EventManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- EventManagement.Application.csproj
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- EventManagement.Contracts
|   |   |   |   |   |-- EventManagement.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- EventManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- EventManagement.Domain.csproj
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- EventManagement.Infrastructure
|   |   |   |   |   |-- EventManagement.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- EventManagement.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- EventManagement.Presentation.csproj
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- EventManagement.Tests.Architecture
|   |   |   |   |-- EventManagement.Tests.Integration
|   |   |   |   `-- EventManagement.Tests.Unit
|   |   |   |-- GrievanceManagement
|   |   |   |   |-- GrievanceManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- GrievanceManagement.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- GrievanceManagement.Contracts
|   |   |   |   |   |-- GrievanceManagement.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- GrievanceManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- GrievanceManagement.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- GrievanceManagement.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- GrievanceManagement.Infrastructure.csproj
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- GrievanceManagement.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- GrievanceManagement.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- GrievanceManagement.Tests.Architecture
|   |   |   |   |-- GrievanceManagement.Tests.Integration
|   |   |   |   `-- GrievanceManagement.Tests.Unit
|   |   |   |-- Helpdesk
|   |   |   |   |-- Helpdesk.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Helpdesk.Application.csproj
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Helpdesk.Contracts
|   |   |   |   |   |-- Helpdesk.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Helpdesk.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Helpdesk.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Helpdesk.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Helpdesk.Infrastructure.csproj
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Helpdesk.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- Helpdesk.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Helpdesk.Tests.Architecture
|   |   |   |   |-- Helpdesk.Tests.Integration
|   |   |   |   `-- Helpdesk.Tests.Unit
|   |   |   |-- QualityAccreditation
|   |   |   |   |-- QualityAccreditation.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- Class1.cs
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- QualityAccreditation.Application.csproj
|   |   |   |   |-- QualityAccreditation.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- PublicApi
|   |   |   |   |   `-- QualityAccreditation.Contracts.csproj
|   |   |   |   |-- QualityAccreditation.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   |-- QualityAccreditation.Domain.csproj
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- QualityAccreditation.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   |-- QualityAccreditation.Infrastructure.csproj
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- QualityAccreditation.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- OpenApi
|   |   |   |   |   `-- QualityAccreditation.Presentation.csproj
|   |   |   |   |-- QualityAccreditation.Tests.Architecture
|   |   |   |   |-- QualityAccreditation.Tests.Integration
|   |   |   |   `-- QualityAccreditation.Tests.Unit
|   |   |   `-- VisitorManagement
|   |   |       |-- VisitorManagement.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |-- EventHandlers
|   |   |       |   |   |-- DomainEventHandlers
|   |   |       |   |   `-- IntegrationEventHandlers
|   |   |       |   |-- Features
|   |   |       |   |-- Mappings
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- VisitorManagement.Application.csproj
|   |   |       |-- VisitorManagement.Contracts
|   |   |       |   |-- IntegrationEvents
|   |   |       |   |-- PublicApi
|   |   |       |   `-- VisitorManagement.Contracts.csproj
|   |   |       |-- VisitorManagement.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |-- DomainEvents
|   |   |       |   |-- DomainServices
|   |   |       |   |-- Entities
|   |   |       |   |-- Exceptions
|   |   |       |   |-- Policies
|   |   |       |   |-- ValueObjects
|   |   |       |   `-- VisitorManagement.Domain.csproj
|   |   |       |-- VisitorManagement.Infrastructure
|   |   |       |   |-- ExternalAdapters
|   |   |       |   |-- Inbox
|   |   |       |   |-- Observability
|   |   |       |   |-- Outbox
|   |   |       |   |-- Persistence
|   |   |       |   |-- Repositories
|   |   |       |   `-- VisitorManagement.Infrastructure.csproj
|   |   |       |-- VisitorManagement.Presentation
|   |   |       |   |-- Contracts
|   |   |       |   |-- Endpoints
|   |   |       |   |-- Filters
|   |   |       |   |-- OpenApi
|   |   |       |   `-- VisitorManagement.Presentation.csproj
|   |   |       |-- VisitorManagement.Tests.Architecture
|   |   |       |-- VisitorManagement.Tests.Integration
|   |   |       `-- VisitorManagement.Tests.Unit
|   |   |-- Platform
|   |   |   |-- AnalyticsBI
|   |   |   |   |-- AnalyticsBI.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- AnalyticsBI.Application.csproj
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- AnalyticsBI.Contracts
|   |   |   |   |   |-- AnalyticsBI.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- AnalyticsBI.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- AnalyticsBI.Domain.csproj
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- AnalyticsBI.Infrastructure
|   |   |   |   |   |-- AnalyticsBI.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- AnalyticsBI.Presentation
|   |   |   |   |   |-- AnalyticsBI.Presentation.csproj
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- AnalyticsBI.Tests.Architecture
|   |   |   |   |-- AnalyticsBI.Tests.Integration
|   |   |   |   `-- AnalyticsBI.Tests.Unit
|   |   |   |-- CRM
|   |   |   |   |-- CRM.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- CRM.Application.csproj
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- CRM.Contracts
|   |   |   |   |   |-- CRM.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- CRM.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- CRM.Domain.csproj
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- CRM.Infrastructure
|   |   |   |   |   |-- CRM.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- CRM.Presentation
|   |   |   |   |   |-- CRM.Presentation.csproj
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- CRM.Tests.Architecture
|   |   |   |   |-- CRM.Tests.Integration
|   |   |   |   `-- CRM.Tests.Unit
|   |   |   |-- Communication
|   |   |   |   |-- Communication.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- Communication.Application.csproj
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- Communication.Contracts
|   |   |   |   |   |-- Communication.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- Communication.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- Communication.Domain.csproj
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- Communication.Infrastructure
|   |   |   |   |   |-- Communication.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- Communication.Presentation
|   |   |   |   |   |-- Communication.Presentation.csproj
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- Communication.Tests.Architecture
|   |   |   |   |-- Communication.Tests.Integration
|   |   |   |   `-- Communication.Tests.Unit
|   |   |   |-- DocumentManagement
|   |   |   |   |-- DocumentManagement.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |-- DocumentManagement.Application.csproj
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   `-- ModuleRegistration.cs
|   |   |   |   |-- DocumentManagement.Contracts
|   |   |   |   |   |-- DocumentManagement.Contracts.csproj
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- DocumentManagement.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DocumentManagement.Domain.csproj
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- DocumentManagement.Infrastructure
|   |   |   |   |   |-- DocumentManagement.Infrastructure.csproj
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- DocumentManagement.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- DocumentManagement.Presentation.csproj
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- DocumentManagement.Tests.Architecture
|   |   |   |   |-- DocumentManagement.Tests.Integration
|   |   |   |   `-- DocumentManagement.Tests.Unit
|   |   |   |-- IdentityAccess
|   |   |   |   |-- IdentityAccess.Application
|   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   `-- IUserRepository.cs
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
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
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- IdentityAccess.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
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
|   |   |   |   |   |-- EventHandlers
|   |   |   |   |   |   |-- DomainEventHandlers
|   |   |   |   |   |   `-- IntegrationEventHandlers
|   |   |   |   |   |-- Features
|   |   |   |   |   |-- Mappings
|   |   |   |   |   |-- ModuleRegistration.cs
|   |   |   |   |   `-- MultiCampus.Application.csproj
|   |   |   |   |-- MultiCampus.Contracts
|   |   |   |   |   |-- IntegrationEvents
|   |   |   |   |   |-- MultiCampus.Contracts.csproj
|   |   |   |   |   `-- PublicApi
|   |   |   |   |-- MultiCampus.Domain
|   |   |   |   |   |-- Aggregates
|   |   |   |   |   |-- DomainEvents
|   |   |   |   |   |-- DomainServices
|   |   |   |   |   |-- Entities
|   |   |   |   |   |-- Exceptions
|   |   |   |   |   |-- MultiCampus.Domain.csproj
|   |   |   |   |   |-- Policies
|   |   |   |   |   `-- ValueObjects
|   |   |   |   |-- MultiCampus.Infrastructure
|   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |-- Inbox
|   |   |   |   |   |-- MultiCampus.Infrastructure.csproj
|   |   |   |   |   |-- Observability
|   |   |   |   |   |-- Outbox
|   |   |   |   |   |-- Persistence
|   |   |   |   |   `-- Repositories
|   |   |   |   |-- MultiCampus.Presentation
|   |   |   |   |   |-- Contracts
|   |   |   |   |   |-- Endpoints
|   |   |   |   |   |-- Filters
|   |   |   |   |   |-- MultiCampus.Presentation.csproj
|   |   |   |   |   `-- OpenApi
|   |   |   |   |-- MultiCampus.Tests.Architecture
|   |   |   |   |-- MultiCampus.Tests.Integration
|   |   |   |   `-- MultiCampus.Tests.Unit
|   |   |   `-- Notification
|   |   |       |-- Notification.Application
|   |   |       |   |-- Abstractions
|   |   |       |   |-- EventHandlers
|   |   |       |   |   |-- DomainEventHandlers
|   |   |       |   |   `-- IntegrationEventHandlers
|   |   |       |   |-- Features
|   |   |       |   |-- Mappings
|   |   |       |   |-- ModuleRegistration.cs
|   |   |       |   `-- Notification.Application.csproj
|   |   |       |-- Notification.Contracts
|   |   |       |   |-- IntegrationEvents
|   |   |       |   |-- Notification.Contracts.csproj
|   |   |       |   `-- PublicApi
|   |   |       |-- Notification.Domain
|   |   |       |   |-- Aggregates
|   |   |       |   |-- DomainEvents
|   |   |       |   |-- DomainServices
|   |   |       |   |-- Entities
|   |   |       |   |-- Exceptions
|   |   |       |   |-- Notification.Domain.csproj
|   |   |       |   |-- Policies
|   |   |       |   `-- ValueObjects
|   |   |       |-- Notification.Infrastructure
|   |   |       |   |-- ExternalAdapters
|   |   |       |   |-- Inbox
|   |   |       |   |-- Notification.Infrastructure.csproj
|   |   |       |   |-- Observability
|   |   |       |   |-- Outbox
|   |   |       |   |-- Persistence
|   |   |       |   `-- Repositories
|   |   |       |-- Notification.Presentation
|   |   |       |   |-- Contracts
|   |   |       |   |-- Endpoints
|   |   |       |   |-- Filters
|   |   |       |   |-- Notification.Presentation.csproj
|   |   |       |   `-- OpenApi
|   |   |       |-- Notification.Tests.Architecture
|   |   |       |-- Notification.Tests.Integration
|   |   |       `-- Notification.Tests.Unit
|   |   `-- StudentLifecycle
|   |       |-- Admissions
|   |       |   |-- Admissions.Application
|   |       |   |   |-- Abstractions
|   |       |   |   |-- Admissions.Application.csproj
|   |       |   |   |-- Class1.cs
|   |       |   |   |-- EventHandlers
|   |       |   |   |   |-- DomainEventHandlers
|   |       |   |   |   `-- IntegrationEventHandlers
|   |       |   |   |-- Features
|   |       |   |   |-- Mappings
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- Admissions.Contracts
|   |       |   |   |-- Admissions.Contracts.csproj
|   |       |   |   |-- IntegrationEvents
|   |       |   |   `-- PublicApi
|   |       |   |-- Admissions.Domain
|   |       |   |   |-- Admissions.Domain.csproj
|   |       |   |   |-- Aggregates
|   |       |   |   |-- DomainEvents
|   |       |   |   |-- DomainServices
|   |       |   |   |-- Entities
|   |       |   |   |-- Exceptions
|   |       |   |   |-- Policies
|   |       |   |   `-- ValueObjects
|   |       |   |-- Admissions.Infrastructure
|   |       |   |   |-- Admissions.Infrastructure.csproj
|   |       |   |   |-- ExternalAdapters
|   |       |   |   |-- Inbox
|   |       |   |   |-- Observability
|   |       |   |   |-- Outbox
|   |       |   |   |-- Persistence
|   |       |   |   `-- Repositories
|   |       |   |-- Admissions.Presentation
|   |       |   |   |-- Admissions.Presentation.csproj
|   |       |   |   |-- Contracts
|   |       |   |   |-- Endpoints
|   |       |   |   |-- Filters
|   |       |   |   `-- OpenApi
|   |       |   |-- Admissions.Tests.Architecture
|   |       |   |-- Admissions.Tests.Integration
|   |       |   `-- Admissions.Tests.Unit
|   |       |-- Alumni
|   |       |   |-- Alumni.Application
|   |       |   |   |-- Abstractions
|   |       |   |   |-- Alumni.Application.csproj
|   |       |   |   |-- EventHandlers
|   |       |   |   |   |-- DomainEventHandlers
|   |       |   |   |   `-- IntegrationEventHandlers
|   |       |   |   |-- Features
|   |       |   |   |-- Mappings
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- Alumni.Contracts
|   |       |   |   |-- Alumni.Contracts.csproj
|   |       |   |   |-- IntegrationEvents
|   |       |   |   `-- PublicApi
|   |       |   |-- Alumni.Domain
|   |       |   |   |-- Aggregates
|   |       |   |   |-- Alumni.Domain.csproj
|   |       |   |   |-- DomainEvents
|   |       |   |   |-- DomainServices
|   |       |   |   |-- Entities
|   |       |   |   |-- Exceptions
|   |       |   |   |-- Policies
|   |       |   |   `-- ValueObjects
|   |       |   |-- Alumni.Infrastructure
|   |       |   |   |-- Alumni.Infrastructure.csproj
|   |       |   |   |-- ExternalAdapters
|   |       |   |   |-- Inbox
|   |       |   |   |-- Observability
|   |       |   |   |-- Outbox
|   |       |   |   |-- Persistence
|   |       |   |   `-- Repositories
|   |       |   |-- Alumni.Presentation
|   |       |   |   |-- Alumni.Presentation.csproj
|   |       |   |   |-- Contracts
|   |       |   |   |-- Endpoints
|   |       |   |   |-- Filters
|   |       |   |   `-- OpenApi
|   |       |   |-- Alumni.Tests.Architecture
|   |       |   |-- Alumni.Tests.Integration
|   |       |   `-- Alumni.Tests.Unit
|   |       |-- GuidanceCounseling
|   |       |   |-- GuidanceCounseling.Application
|   |       |   |   |-- Abstractions
|   |       |   |   |-- EventHandlers
|   |       |   |   |   |-- DomainEventHandlers
|   |       |   |   |   `-- IntegrationEventHandlers
|   |       |   |   |-- Features
|   |       |   |   |-- GuidanceCounseling.Application.csproj
|   |       |   |   |-- Mappings
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- GuidanceCounseling.Contracts
|   |       |   |   |-- GuidanceCounseling.Contracts.csproj
|   |       |   |   |-- IntegrationEvents
|   |       |   |   `-- PublicApi
|   |       |   |-- GuidanceCounseling.Domain
|   |       |   |   |-- Aggregates
|   |       |   |   |-- DomainEvents
|   |       |   |   |-- DomainServices
|   |       |   |   |-- Entities
|   |       |   |   |-- Exceptions
|   |       |   |   |-- GuidanceCounseling.Domain.csproj
|   |       |   |   |-- Policies
|   |       |   |   `-- ValueObjects
|   |       |   |-- GuidanceCounseling.Infrastructure
|   |       |   |   |-- ExternalAdapters
|   |       |   |   |-- GuidanceCounseling.Infrastructure.csproj
|   |       |   |   |-- Inbox
|   |       |   |   |-- Observability
|   |       |   |   |-- Outbox
|   |       |   |   |-- Persistence
|   |       |   |   `-- Repositories
|   |       |   |-- GuidanceCounseling.Presentation
|   |       |   |   |-- Contracts
|   |       |   |   |-- Endpoints
|   |       |   |   |-- Filters
|   |       |   |   |-- GuidanceCounseling.Presentation.csproj
|   |       |   |   `-- OpenApi
|   |       |   |-- GuidanceCounseling.Tests.Architecture
|   |       |   |-- GuidanceCounseling.Tests.Integration
|   |       |   `-- GuidanceCounseling.Tests.Unit
|   |       |-- HealthCenter
|   |       |   |-- HealthCenter.Application
|   |       |   |   |-- Abstractions
|   |       |   |   |-- EventHandlers
|   |       |   |   |   |-- DomainEventHandlers
|   |       |   |   |   `-- IntegrationEventHandlers
|   |       |   |   |-- Features
|   |       |   |   |-- HealthCenter.Application.csproj
|   |       |   |   |-- Mappings
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- HealthCenter.Contracts
|   |       |   |   |-- HealthCenter.Contracts.csproj
|   |       |   |   |-- IntegrationEvents
|   |       |   |   `-- PublicApi
|   |       |   |-- HealthCenter.Domain
|   |       |   |   |-- Aggregates
|   |       |   |   |-- DomainEvents
|   |       |   |   |-- DomainServices
|   |       |   |   |-- Entities
|   |       |   |   |-- Exceptions
|   |       |   |   |-- HealthCenter.Domain.csproj
|   |       |   |   |-- Policies
|   |       |   |   `-- ValueObjects
|   |       |   |-- HealthCenter.Infrastructure
|   |       |   |   |-- ExternalAdapters
|   |       |   |   |-- HealthCenter.Infrastructure.csproj
|   |       |   |   |-- Inbox
|   |       |   |   |-- Observability
|   |       |   |   |-- Outbox
|   |       |   |   |-- Persistence
|   |       |   |   `-- Repositories
|   |       |   |-- HealthCenter.Presentation
|   |       |   |   |-- Contracts
|   |       |   |   |-- Endpoints
|   |       |   |   |-- Filters
|   |       |   |   |-- HealthCenter.Presentation.csproj
|   |       |   |   `-- OpenApi
|   |       |   |-- HealthCenter.Tests.Architecture
|   |       |   |-- HealthCenter.Tests.Integration
|   |       |   `-- HealthCenter.Tests.Unit
|   |       |-- Hostel
|   |       |   |-- Hostel.Application
|   |       |   |   |-- Abstractions
|   |       |   |   |-- EventHandlers
|   |       |   |   |   |-- DomainEventHandlers
|   |       |   |   |   `-- IntegrationEventHandlers
|   |       |   |   |-- Features
|   |       |   |   |-- Hostel.Application.csproj
|   |       |   |   |-- Mappings
|   |       |   |   `-- ModuleRegistration.cs
|   |       |   |-- Hostel.Contracts
|   |       |   |   |-- Hostel.Contracts.csproj
|   |       |   |   |-- IntegrationEvents
|   |       |   |   `-- PublicApi
|   |       |   |-- Hostel.Domain
|   |       |   |   |-- Aggregates
|   |       |   |   |-- DomainEvents
|   |       |   |   |-- DomainServices
|   |       |   |   |-- Entities
|   |       |   |   |-- Exceptions
|   |       |   |   |-- Hostel.Domain.csproj
|   |       |   |   |-- Policies
|   |       |   |   `-- ValueObjects
|   |       |   |-- Hostel.Infrastructure
|   |       |   |   |-- ExternalAdapters
|   |       |   |   |-- Hostel.Infrastructure.csproj
|   |       |   |   |-- Inbox
|   |       |   |   |-- Observability
|   |       |   |   |-- Outbox
|   |       |   |   |-- Persistence
|   |       |   |   `-- Repositories
|   |       |   |-- Hostel.Presentation
|   |       |   |   |-- Contracts
|   |       |   |   |-- Endpoints
|   |       |   |   |-- Filters
|   |       |   |   |-- Hostel.Presentation.csproj
|   |       |   |   `-- OpenApi
|   |       |   |-- Hostel.Tests.Architecture
|   |       |   |-- Hostel.Tests.Integration
|   |       |   `-- Hostel.Tests.Unit
|   |       `-- PlacementCareer
|   |           |-- PlacementCareer.Application
|   |           |   |-- Abstractions
|   |           |   |-- EventHandlers
|   |           |   |   |-- DomainEventHandlers
|   |           |   |   `-- IntegrationEventHandlers
|   |           |   |-- Features
|   |           |   |-- Mappings
|   |           |   |-- ModuleRegistration.cs
|   |           |   `-- PlacementCareer.Application.csproj
|   |           |-- PlacementCareer.Contracts
|   |           |   |-- IntegrationEvents
|   |           |   |-- PlacementCareer.Contracts.csproj
|   |           |   `-- PublicApi
|   |           |-- PlacementCareer.Domain
|   |           |   |-- Aggregates
|   |           |   |-- DomainEvents
|   |           |   |-- DomainServices
|   |           |   |-- Entities
|   |           |   |-- Exceptions
|   |           |   |-- PlacementCareer.Domain.csproj
|   |           |   |-- Policies
|   |           |   `-- ValueObjects
|   |           |-- PlacementCareer.Infrastructure
|   |           |   |-- ExternalAdapters
|   |           |   |-- Inbox
|   |           |   |-- Observability
|   |           |   |-- Outbox
|   |           |   |-- Persistence
|   |           |   |-- PlacementCareer.Infrastructure.csproj
|   |           |   `-- Repositories
|   |           |-- PlacementCareer.Presentation
|   |           |   |-- Contracts
|   |           |   |-- Endpoints
|   |           |   |-- Filters
|   |           |   |-- OpenApi
|   |           |   `-- PlacementCareer.Presentation.csproj
|   |           |-- PlacementCareer.Tests.Architecture
|   |           |-- PlacementCareer.Tests.Integration
|   |           `-- PlacementCareer.Tests.Unit
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
    |-- ContractTests
    |   |-- IntegrationEvents
    |   `-- PublicApiContracts
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
    |-- IntegrationTests
    |-- PerformanceTests
    |   |-- InvoiceIssuanceThroughput.cs
    |   |-- PayrollBatchCalculation.cs
    |   `-- RegistrationPeakLoad.cs
    `-- SecurityTests
        |-- AuthorizationPolicyTests.cs
        `-- DataClassificationLeakTests.cs

1258 directories, 378 files
