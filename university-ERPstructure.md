.
|-- ERPstructure.md
|-- PORT_REGISTRY.md
|-- README.md
|-- SEMANTIC_VERSIONING_PROMPT.md
|-- University-ERP-Backend
|   |-- Directory.Build.props
|   |-- Rebuild_Dependencies.ps1
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
|   |   |-- db
|   |   |   |-- Dockerfile.backup
|   |   |   |-- backup.sh
|   |   |   `-- restore.sh
|   |   |-- db-migrations
|   |   |   `-- StudentInformation
|   |   |       |-- 20260731000000_Initial_StudentInformation.Designer.cs
|   |   |       |-- 20260731000000_Initial_StudentInformation.cs
|   |   |       `-- StudentInformationDbContextModelSnapshot.cs
|   |   |-- nginx
|   |   |   |-- nginx.conf
|   |   |   |-- sites-available
|   |   |   |   |-- admin.university.edu.conf
|   |   |   |   |-- admissions.university.edu.conf
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
|   |   |   |   |-- payment.university.edu.conf
|   |   |   |   |-- platform.university.edu.conf
|   |   |   |   |-- portal.university.edu.conf
|   |   |   |   |-- registrar.university.edu.conf
|   |   |   |   |-- security.university.edu.conf
|   |   |   |   `-- student.university.edu.conf
|   |   |   |-- sites-enabled
|   |   |   |-- snippets
|   |   |   |   |-- auth-request.conf
|   |   |   |   |-- proxy-common.conf
|   |   |   |   |-- rate-limit.conf
|   |   |   |   `-- security-headers.conf
|   |   |   `-- ssl
|   |   |-- observability
|   |   |   |-- alert-rules
|   |   |   |   |-- finance-invoice-failure-rate.yaml
|   |   |   |   |-- grievance-sla-breach.yaml
|   |   |   |   `-- identityaccess-auth-latency.yaml
|   |   |   |-- alloy
|   |   |   |   `-- config.alloy
|   |   |   |-- dashboards
|   |   |   |   |-- academic-cluster-dashboard.json
|   |   |   |   |-- finance-cluster-dashboard.json
|   |   |   |   `-- governance-cluster-dashboard.json
|   |   |   `-- loki
|   |   |       `-- local-config.yaml
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
|   |   |   |   |   |-- GlobalExceptionMiddleware.cs
|   |   |   |   |   `-- ModuleAuthorizationConvention.cs
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
|   |   |   |   |   |-- AcademicScheduling.Presentation
|   |   |   |   |   |   |-- AcademicScheduling.Presentation.csproj
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       |-- AllocateRoomEndpoint.cs
|   |   |   |   |   |       |-- GetStudentTimetableEndpoint.cs
|   |   |   |   |   |       `-- TeachingEndpoint.cs
|   |   |   |   |   `-- AcademicScheduling.Tests
|   |   |   |   |       |-- AcademicScheduling.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- AllocateRoomCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- AllocateRoomCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- AttendanceRecordEndToEndTests.cs
|   |   |   |   |       |   |   |-- ClassSessionEndToEndTests.cs
|   |   |   |   |       |   |   |-- CourseSectionEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetFacultyCoursesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetFacultyCoursesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetStudentTimetableQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetStudentTimetableQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- RoomAllocationEndToEndTests.cs
|   |   |   |   |       |   |   |-- SubmitAttendanceCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- SubmitAttendanceCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- AttendanceRecordIntegrationTests.cs
|   |   |   |   |       |       |-- ClassSessionIntegrationTests.cs
|   |   |   |   |       |       |-- CourseSectionIntegrationTests.cs
|   |   |   |   |       |       `-- RoomAllocationIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- AllocateRoomCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- AttendanceRecordRegressionTests.cs
|   |   |   |   |       |   |-- ClassSessionRegressionTests.cs
|   |   |   |   |       |   |-- CourseSectionRegressionTests.cs
|   |   |   |   |       |   |-- GetFacultyCoursesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetStudentTimetableQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- RoomAllocationRegressionTests.cs
|   |   |   |   |       |   `-- SubmitAttendanceCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- AllocateRoomCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- AttendanceRecordSecurityTests.cs
|   |   |   |   |       |   |-- ClassSessionSecurityTests.cs
|   |   |   |   |       |   |-- CourseSectionSecurityTests.cs
|   |   |   |   |       |   |-- GetFacultyCoursesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetStudentTimetableQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- RoomAllocationSecurityTests.cs
|   |   |   |   |       |   `-- SubmitAttendanceCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- AllocateRoomCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetFacultyCoursesQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetStudentTimetableQueryHandlerTests.cs
|   |   |   |   |           |   `-- SubmitAttendanceCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   |-- AttendanceRecordTests.cs
|   |   |   |   |                   |-- ClassSessionTests.cs
|   |   |   |   |                   |-- CourseSectionTests.cs
|   |   |   |   |                   `-- RoomAllocationTests.cs
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
|   |   |   |   |   |-- Assessments.Presentation
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       `-- AssessmentsEndpoint.cs
|   |   |   |   |   `-- Assessments.Tests
|   |   |   |   |       |-- Assessments.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- GradebookEndToEndTests.cs
|   |   |   |   |       |   |   |-- SectionGradesPostedDomainEventEndToEndTests.cs
|   |   |   |   |       |   |   |-- SubmitGradesCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- SubmitGradesCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- GradebookIntegrationTests.cs
|   |   |   |   |       |       `-- SectionGradesPostedDomainEventIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- GradebookRegressionTests.cs
|   |   |   |   |       |   |-- SectionGradesPostedDomainEventRegressionTests.cs
|   |   |   |   |       |   `-- SubmitGradesCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- GradebookSecurityTests.cs
|   |   |   |   |       |   |-- SectionGradesPostedDomainEventSecurityTests.cs
|   |   |   |   |       |   `-- SubmitGradesCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- SubmitGradesCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               |-- Aggregates
|   |   |   |   |               |   `-- GradebookTests.cs
|   |   |   |   |               `-- Events
|   |   |   |   |                   `-- SectionGradesPostedDomainEventTests.cs
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
|   |   |   |   |   |-- Curriculum.Presentation
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       `-- CurriculumEndpoint.cs
|   |   |   |   |   `-- Curriculum.Tests
|   |   |   |   |       |-- Curriculum.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- BrowseCoursesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- BrowseCoursesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- CourseDefinitionEndToEndTests.cs
|   |   |   |   |       |   |   |-- CurriculumPipelineIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetAllCoursesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetAllCoursesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- UpdateCourseMasterDataCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- UpdateCourseMasterDataCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- UpdatePrerequisiteEnforcementCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- UpdatePrerequisiteEnforcementCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- CourseDefinitionIntegrationTests.cs
|   |   |   |   |       |       `-- CourseDefinitionRepositoryIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- BrowseCoursesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- CourseDefinitionRegressionTests.cs
|   |   |   |   |       |   |-- GetAllCoursesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- UpdateCourseMasterDataCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- UpdatePrerequisiteEnforcementCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- BrowseCoursesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- CourseDefinitionSecurityTests.cs
|   |   |   |   |       |   |-- GetAllCoursesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- UpdateCourseMasterDataCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- UpdatePrerequisiteEnforcementCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- BrowseCoursesQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetAllCoursesQueryHandlerTests.cs
|   |   |   |   |           |   |-- UpdateCourseMasterDataCommandHandlerTests.cs
|   |   |   |   |           |   `-- UpdatePrerequisiteEnforcementCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- CourseDefinitionTests.cs
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
|   |   |   |   |   |-- Enrollment.Presentation
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       |-- RegistrarEndpoint.cs
|   |   |   |   |   |       `-- RegistrationEndpoint.cs
|   |   |   |   |   `-- Enrollment.Tests
|   |   |   |   |       |-- Enrollment.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CourseDroppedDomainEventEndToEndTests.cs
|   |   |   |   |       |   |   |-- DropCourseCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- DropCourseCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetEnrollmentValidationQueueQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetEnrollmentValidationQueueQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- PromoteWaitlistCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- PromoteWaitlistCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- TermRegistrationEndToEndTests.cs
|   |   |   |   |       |   |   |-- WaitlistEntryEndToEndTests.cs
|   |   |   |   |       |   |   `-- WaitlistPromotedDomainEventEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- CourseDroppedDomainEventIntegrationTests.cs
|   |   |   |   |       |       |-- TermRegistrationIntegrationTests.cs
|   |   |   |   |       |       |-- WaitlistEntryIntegrationTests.cs
|   |   |   |   |       |       `-- WaitlistPromotedDomainEventIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CourseDroppedDomainEventRegressionTests.cs
|   |   |   |   |       |   |-- DropCourseCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetEnrollmentValidationQueueQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- PromoteWaitlistCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- TermRegistrationRegressionTests.cs
|   |   |   |   |       |   |-- WaitlistEntryRegressionTests.cs
|   |   |   |   |       |   `-- WaitlistPromotedDomainEventRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CourseDroppedDomainEventSecurityTests.cs
|   |   |   |   |       |   |-- DropCourseCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetEnrollmentValidationQueueQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- PromoteWaitlistCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- TermRegistrationSecurityTests.cs
|   |   |   |   |       |   |-- WaitlistEntrySecurityTests.cs
|   |   |   |   |       |   `-- WaitlistPromotedDomainEventSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- DropCourseCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetEnrollmentValidationQueueQueryHandlerTests.cs
|   |   |   |   |           |   `-- PromoteWaitlistCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               |-- Aggregates
|   |   |   |   |               |   |-- TermRegistrationTests.cs
|   |   |   |   |               |   `-- WaitlistEntryTests.cs
|   |   |   |   |               `-- Events
|   |   |   |   |                   |-- CourseDroppedDomainEventTests.cs
|   |   |   |   |                   `-- WaitlistPromotedDomainEventTests.cs
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
|   |   |   |   |   |-- Examination.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- CreateQuestionEndpoint.cs
|   |   |   |   |   |   |   |-- GradebookEndpoint.cs
|   |   |   |   |   |   |   |-- LogProctoringIncidentEndpoint.cs
|   |   |   |   |   |   |   |-- PublishExamResultEndpoint.cs
|   |   |   |   |   |   |   `-- SessionsEndpoint.cs
|   |   |   |   |   |   `-- Examination.Presentation.csproj
|   |   |   |   |   `-- Examination.Tests
|   |   |   |   |       |-- Examination.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CreateQuestionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CreateQuestionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ExamResultEndToEndTests.cs
|   |   |   |   |       |   |   |-- ExamSessionEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetExamSessionsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetExamSessionsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetGradebookQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetGradebookQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GradebookRecordEndToEndTests.cs
|   |   |   |   |       |   |   |-- LogProctoringIncidentCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- LogProctoringIncidentCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- PublishExamResultCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- PublishExamResultCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- QuestionItemEndToEndTests.cs
|   |   |   |   |       |   |   |-- SubmitGradesCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- SubmitGradesCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- ExamResultIntegrationTests.cs
|   |   |   |   |       |       |-- ExamSessionIntegrationTests.cs
|   |   |   |   |       |       |-- GradebookRecordIntegrationTests.cs
|   |   |   |   |       |       `-- QuestionItemIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CreateQuestionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ExamResultRegressionTests.cs
|   |   |   |   |       |   |-- ExamSessionRegressionTests.cs
|   |   |   |   |       |   |-- GetExamSessionsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetGradebookQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GradebookRecordRegressionTests.cs
|   |   |   |   |       |   |-- LogProctoringIncidentCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- PublishExamResultCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- QuestionItemRegressionTests.cs
|   |   |   |   |       |   `-- SubmitGradesCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CreateQuestionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ExamResultSecurityTests.cs
|   |   |   |   |       |   |-- ExamSessionSecurityTests.cs
|   |   |   |   |       |   |-- GetExamSessionsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetGradebookQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GradebookRecordSecurityTests.cs
|   |   |   |   |       |   |-- LogProctoringIncidentCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- PublishExamResultCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- QuestionItemSecurityTests.cs
|   |   |   |   |       |   `-- SubmitGradesCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- CreateQuestionCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetExamSessionsQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetGradebookQueryHandlerTests.cs
|   |   |   |   |           |   |-- LogProctoringIncidentCommandHandlerTests.cs
|   |   |   |   |           |   |-- PublishExamResultCommandHandlerTests.cs
|   |   |   |   |           |   `-- SubmitGradesCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   |-- ExamResultTests.cs
|   |   |   |   |                   |-- ExamSessionTests.cs
|   |   |   |   |                   |-- GradebookRecordTests.cs
|   |   |   |   |                   `-- QuestionItemTests.cs
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
|   |   |   |   |   |-- LearningManagement.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- AnalyticsEndpoint.cs
|   |   |   |   |   |   |   |-- AssessmentsEndpoint.cs
|   |   |   |   |   |   |   |-- DownloadGradesPackageEndpoint.cs
|   |   |   |   |   |   |   |-- DownloadModulePackageEndpoint.cs
|   |   |   |   |   |   |   |-- LmsEndpoint.cs
|   |   |   |   |   |   |   |-- SyncOfflineAssessmentsEndpoint.cs
|   |   |   |   |   |   |   `-- SyncOfflineAssignmentsEndpoint.cs
|   |   |   |   |   |   `-- LearningManagement.Presentation.csproj
|   |   |   |   |   `-- LearningManagement.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- AddContentItemCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- AddContentItemCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- AddLearningModuleCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- AddLearningModuleCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- AssessmentEndToEndTests.cs
|   |   |   |   |       |   |   |-- ClassPerformanceEndToEndTests.cs
|   |   |   |   |       |   |   |-- CourseSyllabusEndToEndTests.cs
|   |   |   |   |       |   |   |-- CreateSyllabusCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CreateSyllabusCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetAssessmentsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetAssessmentsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetClassPerformanceQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetClassPerformanceQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetCourseContentQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetCourseContentQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetOfflineDeltaPackageQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetOfflineDeltaPackageQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetOfflineGradesPackageQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetOfflineGradesPackageQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetOfflineModulePackageQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetOfflineModulePackageQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ProcessOfflineAssessmentSubmissionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ProcessOfflineAssessmentSubmissionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ProcessOfflineAssignmentSubmissionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ProcessOfflineAssignmentSubmissionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   `-- StudentGradeRecordEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- AssessmentIntegrationTests.cs
|   |   |   |   |       |       |-- ClassPerformanceIntegrationTests.cs
|   |   |   |   |       |       |-- CourseSyllabusIntegrationTests.cs
|   |   |   |   |       |       `-- StudentGradeRecordIntegrationTests.cs
|   |   |   |   |       |-- LearningManagement.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- AddContentItemCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- AddLearningModuleCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- AssessmentRegressionTests.cs
|   |   |   |   |       |   |-- ClassPerformanceRegressionTests.cs
|   |   |   |   |       |   |-- CourseSyllabusRegressionTests.cs
|   |   |   |   |       |   |-- CreateSyllabusCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetAssessmentsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetClassPerformanceQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetCourseContentQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetOfflineDeltaPackageQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetOfflineGradesPackageQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetOfflineModulePackageQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ProcessOfflineAssessmentSubmissionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ProcessOfflineAssignmentSubmissionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- StudentGradeRecordRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- AddContentItemCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- AddLearningModuleCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- AssessmentSecurityTests.cs
|   |   |   |   |       |   |-- ClassPerformanceSecurityTests.cs
|   |   |   |   |       |   |-- CourseSyllabusSecurityTests.cs
|   |   |   |   |       |   |-- CreateSyllabusCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetAssessmentsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetClassPerformanceQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetCourseContentQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetOfflineDeltaPackageQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetOfflineGradesPackageQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetOfflineModulePackageQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ProcessOfflineAssessmentSubmissionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ProcessOfflineAssignmentSubmissionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- StudentGradeRecordSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- AddContentItemCommandHandlerTests.cs
|   |   |   |   |           |   |-- AddLearningModuleCommandHandlerTests.cs
|   |   |   |   |           |   |-- CreateSyllabusCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetAssessmentsQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetClassPerformanceQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetCourseContentQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetOfflineDeltaPackageQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetOfflineGradesPackageQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetOfflineModulePackageQueryHandlerTests.cs
|   |   |   |   |           |   |-- ProcessOfflineAssessmentSubmissionCommandHandlerTests.cs
|   |   |   |   |           |   `-- ProcessOfflineAssignmentSubmissionCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   |-- AssessmentTests.cs
|   |   |   |   |                   |-- ClassPerformanceTests.cs
|   |   |   |   |                   |-- CourseSyllabusTests.cs
|   |   |   |   |                   `-- StudentGradeRecordTests.cs
|   |   |   |   |-- Registrar
|   |   |   |   |   |-- Registrar.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   `-- IRegistrarRepository.cs
|   |   |   |   |   |   |-- Features
|   |   |   |   |   |   |   |-- EvaluateCandidate
|   |   |   |   |   |   |   |   `-- EvaluateCandidateCommand.cs
|   |   |   |   |   |   |   |-- EvaluateGraduationClearance
|   |   |   |   |   |   |   |   `-- EvaluateGraduationClearanceCommand.cs
|   |   |   |   |   |   |   |-- GetPendingClearances
|   |   |   |   |   |   |   |   `-- GetPendingClearancesQuery.cs
|   |   |   |   |   |   |   |-- GetValidationQueue
|   |   |   |   |   |   |   |   `-- GetEnrollmentValidationQueueQuery.cs
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
|   |   |   |   |   |-- Registrar.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- EvaluateGraduationClearanceEndpoint.cs
|   |   |   |   |   |   |   |-- RegisterCourseEndpoint.cs
|   |   |   |   |   |   |   |-- RegistrarController.cs
|   |   |   |   |   |   |   |-- RequestTranscriptEndpoint.cs
|   |   |   |   |   |   |   `-- ScheduleEndpoint.cs
|   |   |   |   |   |   `-- Registrar.Presentation.csproj
|   |   |   |   |   `-- Registrar.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CourseRegistrationEndToEndTests.cs
|   |   |   |   |       |   |   |-- CourseSectionEndToEndTests.cs
|   |   |   |   |       |   |   |-- EvaluateCandidateCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- EvaluateCandidateCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- EvaluateGraduationClearanceCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- EvaluateGraduationClearanceCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetEnrollmentValidationQueueQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetEnrollmentValidationQueueQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetFacultyScheduleQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetFacultyScheduleQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetPendingClearancesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetPendingClearancesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GraduationClearanceEndToEndTests.cs
|   |   |   |   |       |   |   |-- LockSectionGradesCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- LockSectionGradesCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ProcessTranscriptRequestCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ProcessTranscriptRequestCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- RegisterCourseCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- RegisterCourseCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- RequestTranscriptCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- RequestTranscriptCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- TranscriptRequestEndToEndTests.cs
|   |   |   |   |       |   |   |-- ValidateEnrollmentCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- ValidateEnrollmentCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- CourseRegistrationIntegrationTests.cs
|   |   |   |   |       |       |-- CourseSectionIntegrationTests.cs
|   |   |   |   |       |       |-- GraduationClearanceIntegrationTests.cs
|   |   |   |   |       |       `-- TranscriptRequestIntegrationTests.cs
|   |   |   |   |       |-- Registrar.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CourseRegistrationRegressionTests.cs
|   |   |   |   |       |   |-- CourseSectionRegressionTests.cs
|   |   |   |   |       |   |-- EvaluateCandidateCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- EvaluateGraduationClearanceCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetEnrollmentValidationQueueQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetFacultyScheduleQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetPendingClearancesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GraduationClearanceRegressionTests.cs
|   |   |   |   |       |   |-- LockSectionGradesCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ProcessTranscriptRequestCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- RegisterCourseCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- RequestTranscriptCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- TranscriptRequestRegressionTests.cs
|   |   |   |   |       |   `-- ValidateEnrollmentCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CourseRegistrationSecurityTests.cs
|   |   |   |   |       |   |-- CourseSectionSecurityTests.cs
|   |   |   |   |       |   |-- EvaluateCandidateCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- EvaluateGraduationClearanceCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetEnrollmentValidationQueueQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetFacultyScheduleQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetPendingClearancesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GraduationClearanceSecurityTests.cs
|   |   |   |   |       |   |-- LockSectionGradesCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ProcessTranscriptRequestCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- RegisterCourseCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- RequestTranscriptCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- TranscriptRequestSecurityTests.cs
|   |   |   |   |       |   `-- ValidateEnrollmentCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- EvaluateCandidateCommandHandlerTests.cs
|   |   |   |   |           |   |-- EvaluateGraduationClearanceCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetEnrollmentValidationQueueQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetFacultyScheduleQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetPendingClearancesQueryHandlerTests.cs
|   |   |   |   |           |   |-- LockSectionGradesCommandHandlerTests.cs
|   |   |   |   |           |   |-- ProcessTranscriptRequestCommandHandlerTests.cs
|   |   |   |   |           |   |-- RegisterCourseCommandHandlerTests.cs
|   |   |   |   |           |   |-- RequestTranscriptCommandHandlerTests.cs
|   |   |   |   |           |   `-- ValidateEnrollmentCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   |-- CourseRegistrationTests.cs
|   |   |   |   |                   |-- CourseSectionTests.cs
|   |   |   |   |                   |-- GraduationClearanceTests.cs
|   |   |   |   |                   `-- TranscriptRequestTests.cs
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
|   |   |   |   |   |-- StudentInformation.Presentation
|   |   |   |   |   |   |-- Contracts
|   |   |   |   |   |   |   `-- EnrollStudentRequest.cs
|   |   |   |   |   |   |-- Controllers
|   |   |   |   |   |   |   `-- StudentsController.cs
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- AdvisingEndpoint.cs
|   |   |   |   |   |   |   |-- FacultyStudentsEndpoint.cs
|   |   |   |   |   |   |   `-- GetStudentInformationEndpoints.cs
|   |   |   |   |   |   `-- StudentInformation.Presentation.csproj
|   |   |   |   |   `-- StudentInformation.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- ApproveGraduationCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ApproveGraduationCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- EnrollStudentCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- EnrollStudentCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- EnrollStudentCommandValidatorEndToEndTests.cs
|   |   |   |   |       |   |   |-- EnrollStudentCommandValidatorIntegrationTests.cs
|   |   |   |   |       |   |   |-- FacultyAdviseeEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetAdviseesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetAdviseesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetMyStudentsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetMyStudentsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetPendingClearancesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetPendingClearancesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetStudentProfileQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetStudentProfileQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ReviewClearanceCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ReviewClearanceCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- StudentAcademicRecordEndToEndTests.cs
|   |   |   |   |       |   |   |-- StudentEndToEndTests.cs
|   |   |   |   |       |   |   |-- StudentIdEndToEndTests.cs
|   |   |   |   |       |   |   |-- StudentInformationPipelineIntegrationTests.cs
|   |   |   |   |       |   |   |-- UpdateContactInfoCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- UpdateContactInfoCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- FacultyAdviseeIntegrationTests.cs
|   |   |   |   |       |       |-- StudentAcademicRecordIntegrationTests.cs
|   |   |   |   |       |       |-- StudentIdIntegrationTests.cs
|   |   |   |   |       |       |-- StudentInformationIntegrationTests.cs
|   |   |   |   |       |       `-- StudentIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- ApproveGraduationCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- EnrollStudentCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- EnrollStudentCommandValidatorRegressionTests.cs
|   |   |   |   |       |   |-- FacultyAdviseeRegressionTests.cs
|   |   |   |   |       |   |-- GetAdviseesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetMyStudentsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetPendingClearancesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetStudentProfileQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ReviewClearanceCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- StudentAcademicRecordRegressionTests.cs
|   |   |   |   |       |   |-- StudentIdRegressionTests.cs
|   |   |   |   |       |   |-- StudentRegressionTests.cs
|   |   |   |   |       |   `-- UpdateContactInfoCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- ApproveGraduationCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- EnrollStudentCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- EnrollStudentCommandValidatorSecurityTests.cs
|   |   |   |   |       |   |-- FacultyAdviseeSecurityTests.cs
|   |   |   |   |       |   |-- GetAdviseesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetMyStudentsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetPendingClearancesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetStudentProfileQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ReviewClearanceCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- StudentAcademicRecordSecurityTests.cs
|   |   |   |   |       |   |-- StudentIdSecurityTests.cs
|   |   |   |   |       |   |-- StudentSecurityTests.cs
|   |   |   |   |       |   `-- UpdateContactInfoCommandHandlerSecurityTests.cs
|   |   |   |   |       |-- StudentInformation.Tests.csproj
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- ApplicationHandlerTests.cs
|   |   |   |   |           |   |-- ApproveGraduationCommandHandlerTests.cs
|   |   |   |   |           |   |-- EnrollStudentCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetAdviseesQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetMyStudentsQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetPendingClearancesQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetStudentProfileQueryHandlerTests.cs
|   |   |   |   |           |   |-- ReviewClearanceCommandHandlerTests.cs
|   |   |   |   |           |   `-- UpdateContactInfoCommandHandlerTests.cs
|   |   |   |   |           |-- Domain
|   |   |   |   |           |   |-- Aggregates
|   |   |   |   |           |   |   |-- FacultyAdviseeTests.cs
|   |   |   |   |           |   |   |-- StudentAcademicRecordTests.cs
|   |   |   |   |           |   |   `-- StudentTests.cs
|   |   |   |   |           |   |-- StudentInformationDomainTests.cs
|   |   |   |   |           |   `-- ValueObjects
|   |   |   |   |           |       `-- StudentIdTests.cs
|   |   |   |   |           `-- Validators
|   |   |   |   |               `-- EnrollStudentCommandValidatorTests.cs
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
|   |   |   |       |-- Teaching.Presentation
|   |   |   |       |   `-- Endpoints
|   |   |   |       |       `-- TeachingEndpoint.cs
|   |   |   |       `-- Teaching.Tests
|   |   |   |           |-- Integration
|   |   |   |           |   |-- Endpoints
|   |   |   |           |   |   |-- CourseSectionEndToEndTests.cs
|   |   |   |           |   |   |-- GetMyCoursesQueryHandlerEndToEndTests.cs
|   |   |   |           |   |   `-- GetMyCoursesQueryHandlerIntegrationTests.cs
|   |   |   |           |   `-- Persistence
|   |   |   |           |       `-- CourseSectionIntegrationTests.cs
|   |   |   |           |-- Regression
|   |   |   |           |   |-- CourseSectionRegressionTests.cs
|   |   |   |           |   `-- GetMyCoursesQueryHandlerRegressionTests.cs
|   |   |   |           |-- Security
|   |   |   |           |   |-- CourseSectionSecurityTests.cs
|   |   |   |           |   `-- GetMyCoursesQueryHandlerSecurityTests.cs
|   |   |   |           |-- Teaching.Tests.csproj
|   |   |   |           `-- Unit
|   |   |   |               |-- Application
|   |   |   |               |   `-- GetMyCoursesQueryHandlerTests.cs
|   |   |   |               `-- Domain
|   |   |   |                   `-- Aggregates
|   |   |   |                       `-- CourseSectionTests.cs
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
|   |   |   |   |   |-- AssetManagement.Presentation
|   |   |   |   |   |   |-- AssetManagement.Presentation.csproj
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       `-- RegisterAssetEndpoint.cs
|   |   |   |   |   `-- AssetManagement.Tests
|   |   |   |   |       |-- AssetManagement.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- AssetEndToEndTests.cs
|   |   |   |   |       |   |   |-- RegisterAssetCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- RegisterAssetCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- AssetIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- AssetRegressionTests.cs
|   |   |   |   |       |   `-- RegisterAssetCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- AssetSecurityTests.cs
|   |   |   |   |       |   `-- RegisterAssetCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- RegisterAssetCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- AssetTests.cs
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
|   |   |   |   |   |-- Facilities.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- BookFacilityEndpoint.cs
|   |   |   |   |   |   `-- Facilities.Presentation.csproj
|   |   |   |   |   `-- Facilities.Tests
|   |   |   |   |       |-- Facilities.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- BookFacilityCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- BookFacilityCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   `-- FacilityReservationEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- FacilityReservationIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- BookFacilityCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- FacilityReservationRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- BookFacilityCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- FacilityReservationSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- BookFacilityCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- FacilityReservationTests.cs
|   |   |   |   |-- Finance
|   |   |   |   |   |-- Finance.Application
|   |   |   |   |   |   |-- Abstractions
|   |   |   |   |   |   |   |-- ICashTransactionRepository.cs
|   |   |   |   |   |   |   |-- IPaymentGatewayService.cs
|   |   |   |   |   |   |   |-- IPaymentSessionRepository.cs
|   |   |   |   |   |   |   |-- IStudentBillingRepository.cs
|   |   |   |   |   |   |   `-- PaymentGatewayOptions.cs
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
|   |   |   |   |   |   |-- ExternalAdapters
|   |   |   |   |   |   |   `-- PaymentGatewayService.cs
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
|   |   |   |   |   |-- Finance.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- BankingCallbackEndpoint.cs
|   |   |   |   |   |   |   |-- CashTransactionsEndpoint.cs
|   |   |   |   |   |   |   |-- InvoicesEndpoint.cs
|   |   |   |   |   |   |   |-- IssueInvoiceEndpoint.cs
|   |   |   |   |   |   |   |-- PaymentSessionEndpoint.cs
|   |   |   |   |   |   |   |-- PaymentWebhookEndpoint.cs
|   |   |   |   |   |   |   |-- StudentBillingEndpoint.cs
|   |   |   |   |   |   |   `-- StudentFinancialsEndpoint.cs
|   |   |   |   |   |   `-- Finance.Presentation.csproj
|   |   |   |   |   `-- Finance.Tests
|   |   |   |   |       |-- Finance.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- AdjustTuitionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- AdjustTuitionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ApplyScholarshipCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ApplyScholarshipCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- AssessTuitionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- AssessTuitionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- CashTransactionEndToEndTests.cs
|   |   |   |   |       |   |   |-- ClearBalanceCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ClearBalanceCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- CompleteCashTransactionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CompleteCashTransactionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- CompletePaymentSessionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CompletePaymentSessionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- CreatePaymentSessionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CreatePaymentSessionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- FinancePipelineIntegrationTests.cs
|   |   |   |   |       |   |   |-- GenerateCashTokenCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GenerateCashTokenCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GenerateDynamicQRCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GenerateDynamicQRCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetAllPaymentSessionsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetAllPaymentSessionsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetAllStudentBillingsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetAllStudentBillingsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetInvoicesQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetInvoicesQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetPendingCashTransactionQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetPendingCashTransactionQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- IssueInvoiceCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- IssueInvoiceCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- PaymentSessionEndToEndTests.cs
|   |   |   |   |       |   |   |-- ProcessBankingCallbackCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ProcessBankingCallbackCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ProcessPaymentCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ProcessPaymentCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- ReconcilePaymentSessionCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ReconcilePaymentSessionCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- StudentBillingEndToEndTests.cs
|   |   |   |   |       |   |   |-- ValidatePaymentSessionQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- ValidatePaymentSessionQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |-- IntegrationTestBase.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       |-- CashTransactionIntegrationTests.cs
|   |   |   |   |       |       |-- FinanceRepositoriesIntegrationTests.cs
|   |   |   |   |       |       |-- PaymentSessionIntegrationTests.cs
|   |   |   |   |       |       `-- StudentBillingIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- AdjustTuitionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ApplyScholarshipCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- AssessTuitionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- CashTransactionRegressionTests.cs
|   |   |   |   |       |   |-- ClearBalanceCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- CompleteCashTransactionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- CompletePaymentSessionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- CreatePaymentSessionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GenerateCashTokenCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GenerateDynamicQRCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetAllPaymentSessionsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetAllStudentBillingsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetInvoicesQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetPendingCashTransactionQueryHandlerRegressionTests.cs
|   |   |   |   |       |   |-- IssueInvoiceCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- PaymentSessionRegressionTests.cs
|   |   |   |   |       |   |-- ProcessBankingCallbackCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ProcessPaymentCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- ReconcilePaymentSessionCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- StudentBillingRegressionTests.cs
|   |   |   |   |       |   `-- ValidatePaymentSessionQueryHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- AdjustTuitionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ApplyScholarshipCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- AssessTuitionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- CashTransactionSecurityTests.cs
|   |   |   |   |       |   |-- ClearBalanceCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- CompleteCashTransactionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- CompletePaymentSessionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- CreatePaymentSessionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GenerateCashTokenCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GenerateDynamicQRCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetAllPaymentSessionsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetAllStudentBillingsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetInvoicesQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetPendingCashTransactionQueryHandlerSecurityTests.cs
|   |   |   |   |       |   |-- IssueInvoiceCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- PaymentSessionSecurityTests.cs
|   |   |   |   |       |   |-- ProcessBankingCallbackCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ProcessPaymentCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- ReconcilePaymentSessionCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- StudentBillingSecurityTests.cs
|   |   |   |   |       |   `-- ValidatePaymentSessionQueryHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- AdjustTuitionCommandHandlerTests.cs
|   |   |   |   |           |   |-- ApplyScholarshipCommandHandlerTests.cs
|   |   |   |   |           |   |-- AssessTuitionCommandHandlerTests.cs
|   |   |   |   |           |   |-- ClearBalanceCommandHandlerTests.cs
|   |   |   |   |           |   |-- CompleteCashTransactionCommandHandlerTests.cs
|   |   |   |   |           |   |-- CompletePaymentSessionCommandHandlerTests.cs
|   |   |   |   |           |   |-- CreatePaymentSessionCommandHandlerTests.cs
|   |   |   |   |           |   |-- GenerateCashTokenCommandHandlerTests.cs
|   |   |   |   |           |   |-- GenerateDynamicQRCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetAllPaymentSessionsQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetAllStudentBillingsQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetInvoicesQueryHandlerTests.cs
|   |   |   |   |           |   |-- GetPendingCashTransactionQueryHandlerTests.cs
|   |   |   |   |           |   |-- IssueInvoiceCommandHandlerTests.cs
|   |   |   |   |           |   |-- ProcessBankingCallbackCommandHandlerTests.cs
|   |   |   |   |           |   |-- ProcessPaymentCommandHandlerTests.cs
|   |   |   |   |           |   |-- ReconcilePaymentSessionCommandHandlerTests.cs
|   |   |   |   |           |   `-- ValidatePaymentSessionQueryHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   |-- CashTransactionTests.cs
|   |   |   |   |                   |-- PaymentSessionTests.cs
|   |   |   |   |                   `-- StudentBillingTests.cs
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
|   |   |   |   |   |-- HumanResources.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- OnboardEmployeeEndpoint.cs
|   |   |   |   |   |   `-- HumanResources.Presentation.csproj
|   |   |   |   |   `-- HumanResources.Tests
|   |   |   |   |       |-- HumanResources.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- EmployeeEndToEndTests.cs
|   |   |   |   |       |   |   |-- OnboardEmployeeCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- OnboardEmployeeCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- EmployeeIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- EmployeeRegressionTests.cs
|   |   |   |   |       |   `-- OnboardEmployeeCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- EmployeeSecurityTests.cs
|   |   |   |   |       |   `-- OnboardEmployeeCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- OnboardEmployeeCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- EmployeeTests.cs
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
|   |   |   |   |   |-- Inventory.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- AdjustStockEndpoint.cs
|   |   |   |   |   |   `-- Inventory.Presentation.csproj
|   |   |   |   |   `-- Inventory.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- AdjustStockCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- AdjustStockCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   `-- StockItemEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- StockItemIntegrationTests.cs
|   |   |   |   |       |-- Inventory.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- AdjustStockCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- StockItemRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- AdjustStockCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- StockItemSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- AdjustStockCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- StockItemTests.cs
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
|   |   |   |   |   |-- Library.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- CheckoutItemEndpoint.cs
|   |   |   |   |   |   `-- Library.Presentation.csproj
|   |   |   |   |   `-- Library.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CatalogItemEndToEndTests.cs
|   |   |   |   |       |   |   |-- CheckoutItemCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- CheckoutItemCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- CatalogItemIntegrationTests.cs
|   |   |   |   |       |-- Library.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CatalogItemRegressionTests.cs
|   |   |   |   |       |   `-- CheckoutItemCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CatalogItemSecurityTests.cs
|   |   |   |   |       |   `-- CheckoutItemCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- CheckoutItemCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- CatalogItemTests.cs
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
|   |   |   |   |   |-- MessCanteen.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- ReserveMealEndpoint.cs
|   |   |   |   |   |   `-- MessCanteen.Presentation.csproj
|   |   |   |   |   `-- MessCanteen.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- MealPlanEndToEndTests.cs
|   |   |   |   |       |   |   |-- ReserveMealCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- ReserveMealCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- MealPlanIntegrationTests.cs
|   |   |   |   |       |-- MessCanteen.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- MealPlanRegressionTests.cs
|   |   |   |   |       |   `-- ReserveMealCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- MealPlanSecurityTests.cs
|   |   |   |   |       |   `-- ReserveMealCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- ReserveMealCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- MealPlanTests.cs
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
|   |   |   |   |   |-- Payroll.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- GeneratePayslipEndpoint.cs
|   |   |   |   |   |   `-- Payroll.Presentation.csproj
|   |   |   |   |   `-- Payroll.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- GeneratePayslipCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GeneratePayslipCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GeneratePayslipEndpointTests.cs
|   |   |   |   |       |   |   |-- PayrollPipelineIntegrationTests.cs
|   |   |   |   |       |   |   `-- PayslipEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- PayslipIntegrationTests.cs
|   |   |   |   |       |-- Payroll.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- GeneratePayslipCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- PayslipRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- GeneratePayslipCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- PayslipSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- GeneratePayslipCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- PayslipTests.cs
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
|   |   |   |   |   |-- Procurement.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- CreatePurchaseOrderEndpoint.cs
|   |   |   |   |   |   `-- Procurement.Presentation.csproj
|   |   |   |   |   `-- Procurement.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CreatePurchaseOrderCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CreatePurchaseOrderCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   `-- PurchaseOrderEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- PurchaseOrderIntegrationTests.cs
|   |   |   |   |       |-- Procurement.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CreatePurchaseOrderCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- PurchaseOrderRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CreatePurchaseOrderCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- PurchaseOrderSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- CreatePurchaseOrderCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- PurchaseOrderTests.cs
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
|   |   |   |       |-- Transport.Presentation
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- AssignRouteEndpoint.cs
|   |   |   |       |   `-- Transport.Presentation.csproj
|   |   |   |       `-- Transport.Tests
|   |   |   |           |-- Integration
|   |   |   |           |   |-- Endpoints
|   |   |   |           |   |   |-- AssignRouteCommandHandlerEndToEndTests.cs
|   |   |   |           |   |   |-- AssignRouteCommandHandlerIntegrationTests.cs
|   |   |   |           |   |   `-- BusRouteEndToEndTests.cs
|   |   |   |           |   `-- Persistence
|   |   |   |           |       `-- BusRouteIntegrationTests.cs
|   |   |   |           |-- Regression
|   |   |   |           |   |-- AssignRouteCommandHandlerRegressionTests.cs
|   |   |   |           |   `-- BusRouteRegressionTests.cs
|   |   |   |           |-- Security
|   |   |   |           |   |-- AssignRouteCommandHandlerSecurityTests.cs
|   |   |   |           |   `-- BusRouteSecurityTests.cs
|   |   |   |           |-- Transport.Tests.csproj
|   |   |   |           `-- Unit
|   |   |   |               |-- Application
|   |   |   |               |   `-- AssignRouteCommandHandlerTests.cs
|   |   |   |               `-- Domain
|   |   |   |                   `-- Aggregates
|   |   |   |                       `-- BusRouteTests.cs
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
|   |   |   |   |   |-- EventManagement.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- PlanEventEndpoint.cs
|   |   |   |   |   |   `-- EventManagement.Presentation.csproj
|   |   |   |   |   `-- EventManagement.Tests
|   |   |   |   |       |-- EventManagement.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CampusEventEndToEndTests.cs
|   |   |   |   |       |   |   |-- PlanEventCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- PlanEventCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- CampusEventIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CampusEventRegressionTests.cs
|   |   |   |   |       |   `-- PlanEventCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CampusEventSecurityTests.cs
|   |   |   |   |       |   `-- PlanEventCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- PlanEventCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- CampusEventTests.cs
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
|   |   |   |   |   |-- GrievanceManagement.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- SubmitComplaintEndpoint.cs
|   |   |   |   |   |   `-- GrievanceManagement.Presentation.csproj
|   |   |   |   |   `-- GrievanceManagement.Tests
|   |   |   |   |       |-- GrievanceManagement.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- ComplaintEndToEndTests.cs
|   |   |   |   |       |   |   |-- SubmitComplaintCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- SubmitComplaintCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- ComplaintIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- ComplaintRegressionTests.cs
|   |   |   |   |       |   `-- SubmitComplaintCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- ComplaintSecurityTests.cs
|   |   |   |   |       |   `-- SubmitComplaintCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- SubmitComplaintCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- ComplaintTests.cs
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
|   |   |   |   |   |-- Helpdesk.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   `-- CreateTicketEndpoint.cs
|   |   |   |   |   |   `-- Helpdesk.Presentation.csproj
|   |   |   |   |   `-- Helpdesk.Tests
|   |   |   |   |       |-- Helpdesk.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CreateTicketCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- CreateTicketCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   `-- ServiceTicketEndToEndTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- ServiceTicketIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CreateTicketCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- ServiceTicketRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CreateTicketCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- ServiceTicketSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- CreateTicketCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- ServiceTicketTests.cs
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
|   |   |   |   |   |-- QualityAccreditation.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- SubmitEvidenceEndpoint.cs
|   |   |   |   |   |   |   `-- WorkflowEndpoint.cs
|   |   |   |   |   |   `-- QualityAccreditation.Presentation.csproj
|   |   |   |   |   `-- QualityAccreditation.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- AccreditationEvidenceEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetActiveWorkflowsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetActiveWorkflowsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- SubmitEvidenceCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- SubmitEvidenceCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- AccreditationEvidenceIntegrationTests.cs
|   |   |   |   |       |-- QualityAccreditation.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- AccreditationEvidenceRegressionTests.cs
|   |   |   |   |       |   |-- GetActiveWorkflowsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   `-- SubmitEvidenceCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- AccreditationEvidenceSecurityTests.cs
|   |   |   |   |       |   |-- GetActiveWorkflowsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   `-- SubmitEvidenceCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- GetActiveWorkflowsQueryHandlerTests.cs
|   |   |   |   |           |   `-- SubmitEvidenceCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- AccreditationEvidenceTests.cs
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
|   |   |   |       |-- VisitorManagement.Presentation
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- RegisterVisitorEndpoint.cs
|   |   |   |       |   `-- VisitorManagement.Presentation.csproj
|   |   |   |       `-- VisitorManagement.Tests
|   |   |   |           |-- Integration
|   |   |   |           |   |-- Endpoints
|   |   |   |           |   |   |-- RegisterVisitorCommandHandlerEndToEndTests.cs
|   |   |   |           |   |   |-- RegisterVisitorCommandHandlerIntegrationTests.cs
|   |   |   |           |   |   `-- VisitorLogEndToEndTests.cs
|   |   |   |           |   `-- Persistence
|   |   |   |           |       `-- VisitorLogIntegrationTests.cs
|   |   |   |           |-- Regression
|   |   |   |           |   |-- RegisterVisitorCommandHandlerRegressionTests.cs
|   |   |   |           |   `-- VisitorLogRegressionTests.cs
|   |   |   |           |-- Security
|   |   |   |           |   |-- RegisterVisitorCommandHandlerSecurityTests.cs
|   |   |   |           |   `-- VisitorLogSecurityTests.cs
|   |   |   |           |-- Unit
|   |   |   |           |   |-- Application
|   |   |   |           |   |   `-- RegisterVisitorCommandHandlerTests.cs
|   |   |   |           |   `-- Domain
|   |   |   |           |       `-- Aggregates
|   |   |   |           |           `-- VisitorLogTests.cs
|   |   |   |           `-- VisitorManagement.Tests.csproj
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
|   |   |   |   |   |-- AnalyticsBI.Presentation
|   |   |   |   |   |   |-- AnalyticsBI.Presentation.csproj
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       |-- AcademicAnalyticsEndpoint.cs
|   |   |   |   |   |       |-- GenerateReportEndpoint.cs
|   |   |   |   |   |       `-- IntegrationHealthEndpoint.cs
|   |   |   |   |   `-- AnalyticsBI.Tests
|   |   |   |   |       |-- AnalyticsBI.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- DashboardReportEndToEndTests.cs
|   |   |   |   |       |   |   |-- GenerateReportCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GenerateReportCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetClassPerformanceQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetClassPerformanceQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetSystemHealthQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- GetSystemHealthQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- DashboardReportIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- DashboardReportRegressionTests.cs
|   |   |   |   |       |   |-- GenerateReportCommandHandlerRegressionTests.cs
|   |   |   |   |       |   |-- GetClassPerformanceQueryHandlerRegressionTests.cs
|   |   |   |   |       |   `-- GetSystemHealthQueryHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- DashboardReportSecurityTests.cs
|   |   |   |   |       |   |-- GenerateReportCommandHandlerSecurityTests.cs
|   |   |   |   |       |   |-- GetClassPerformanceQueryHandlerSecurityTests.cs
|   |   |   |   |       |   `-- GetSystemHealthQueryHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- GenerateReportCommandHandlerTests.cs
|   |   |   |   |           |   |-- GetClassPerformanceQueryHandlerTests.cs
|   |   |   |   |           |   `-- GetSystemHealthQueryHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- DashboardReportTests.cs
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
|   |   |   |   |   |-- CRM.Presentation
|   |   |   |   |   |   |-- CRM.Presentation.csproj
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       `-- RegisterProspectEndpoint.cs
|   |   |   |   |   `-- CRM.Tests
|   |   |   |   |       |-- CRM.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- ProspectEndToEndTests.cs
|   |   |   |   |       |   |   |-- RegisterProspectCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- RegisterProspectCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- ProspectIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- ProspectRegressionTests.cs
|   |   |   |   |       |   `-- RegisterProspectCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- ProspectSecurityTests.cs
|   |   |   |   |       |   `-- RegisterProspectCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   `-- RegisterProspectCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- ProspectTests.cs
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
|   |   |   |   |   |-- Communication.Presentation
|   |   |   |   |   |   |-- Communication.Presentation.csproj
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       |-- AcademicInboxEndpoint.cs
|   |   |   |   |   |       |-- GetInboxEndpoint.cs
|   |   |   |   |   |       `-- SendMessageEndpoint.cs
|   |   |   |   |   `-- Communication.Tests
|   |   |   |   |       |-- Communication.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- DirectMessageEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetInboxQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetInboxQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- SendMessageCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- SendMessageCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- DirectMessageIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- DirectMessageRegressionTests.cs
|   |   |   |   |       |   |-- GetInboxQueryHandlerRegressionTests.cs
|   |   |   |   |       |   `-- SendMessageCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- DirectMessageSecurityTests.cs
|   |   |   |   |       |   |-- GetInboxQueryHandlerSecurityTests.cs
|   |   |   |   |       |   `-- SendMessageCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- GetInboxQueryHandlerTests.cs
|   |   |   |   |           |   `-- SendMessageCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- DirectMessageTests.cs
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
|   |   |   |   |   |-- DocumentManagement.Presentation
|   |   |   |   |   |   |-- DocumentManagement.Presentation.csproj
|   |   |   |   |   |   `-- Endpoints
|   |   |   |   |   |       |-- AcademicDocumentsEndpoint.cs
|   |   |   |   |   |       `-- UploadDocumentEndpoint.cs
|   |   |   |   |   `-- DocumentManagement.Tests
|   |   |   |   |       |-- DocumentManagement.Tests.csproj
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CorporateDocumentEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetFacultyDocumentsQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- GetFacultyDocumentsQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- UploadDocumentCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- UploadDocumentCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- CorporateDocumentIntegrationTests.cs
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CorporateDocumentRegressionTests.cs
|   |   |   |   |       |   |-- GetFacultyDocumentsQueryHandlerRegressionTests.cs
|   |   |   |   |       |   `-- UploadDocumentCommandHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CorporateDocumentSecurityTests.cs
|   |   |   |   |       |   |-- GetFacultyDocumentsQueryHandlerSecurityTests.cs
|   |   |   |   |       |   `-- UploadDocumentCommandHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- GetFacultyDocumentsQueryHandlerTests.cs
|   |   |   |   |           |   `-- UploadDocumentCommandHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- CorporateDocumentTests.cs
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
|   |   |   |   |   |   |   |-- SecurityAdministrationEndpoint.cs
|   |   |   |   |   |   |   `-- ValidateSessionEndpoint.cs
|   |   |   |   |   |   |-- Filters
|   |   |   |   |   |   |-- IdentityAccess.Presentation.csproj
|   |   |   |   |   |   `-- OpenApi
|   |   |   |   |   |-- IdentityAccess.Tests
|   |   |   |   |   |   |-- IdentityAccess.Tests.csproj
|   |   |   |   |   |   |-- Integration
|   |   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |   |-- AuthenticateUserQueryHandlerEndToEndTests.cs
|   |   |   |   |   |   |   |   |-- AuthenticateUserQueryHandlerIntegrationTests.cs
|   |   |   |   |   |   |   |   |-- EmailEndToEndTests.cs
|   |   |   |   |   |   |   |   |-- GetRolesQueryHandlerEndToEndTests.cs
|   |   |   |   |   |   |   |   |-- GetRolesQueryHandlerIntegrationTests.cs
|   |   |   |   |   |   |   |   |-- PersonNameEndToEndTests.cs
|   |   |   |   |   |   |   |   |-- RegisterUserCommandHandlerEndToEndTests.cs
|   |   |   |   |   |   |   |   |-- RegisterUserCommandHandlerIntegrationTests.cs
|   |   |   |   |   |   |   |   |-- RegisterUserCommandValidatorEndToEndTests.cs
|   |   |   |   |   |   |   |   |-- RegisterUserCommandValidatorIntegrationTests.cs
|   |   |   |   |   |   |   |   |-- UserEndToEndTests.cs
|   |   |   |   |   |   |   |   `-- UserIdEndToEndTests.cs
|   |   |   |   |   |   |   `-- Persistence
|   |   |   |   |   |   |       |-- EmailIntegrationTests.cs
|   |   |   |   |   |   |       |-- PersonNameIntegrationTests.cs
|   |   |   |   |   |   |       |-- UserIdIntegrationTests.cs
|   |   |   |   |   |   |       `-- UserIntegrationTests.cs
|   |   |   |   |   |   |-- Regression
|   |   |   |   |   |   |   |-- AuthenticateUserQueryHandlerRegressionTests.cs
|   |   |   |   |   |   |   |-- EmailRegressionTests.cs
|   |   |   |   |   |   |   |-- GetRolesQueryHandlerRegressionTests.cs
|   |   |   |   |   |   |   |-- PersonNameRegressionTests.cs
|   |   |   |   |   |   |   |-- RegisterUserCommandHandlerRegressionTests.cs
|   |   |   |   |   |   |   |-- RegisterUserCommandValidatorRegressionTests.cs
|   |   |   |   |   |   |   |-- UserIdRegressionTests.cs
|   |   |   |   |   |   |   `-- UserRegressionTests.cs
|   |   |   |   |   |   |-- Security
|   |   |   |   |   |   |   |-- AuthenticateUserQueryHandlerSecurityTests.cs
|   |   |   |   |   |   |   |-- EmailSecurityTests.cs
|   |   |   |   |   |   |   |-- GetRolesQueryHandlerSecurityTests.cs
|   |   |   |   |   |   |   |-- PersonNameSecurityTests.cs
|   |   |   |   |   |   |   |-- RegisterUserCommandHandlerSecurityTests.cs
|   |   |   |   |   |   |   |-- RegisterUserCommandValidatorSecurityTests.cs
|   |   |   |   |   |   |   |-- UserIdSecurityTests.cs
|   |   |   |   |   |   |   `-- UserSecurityTests.cs
|   |   |   |   |   |   `-- Unit
|   |   |   |   |   |       |-- Application
|   |   |   |   |   |       |   |-- AuthenticateUserQueryHandlerTests.cs
|   |   |   |   |   |       |   |-- GetRolesQueryHandlerTests.cs
|   |   |   |   |   |       |   `-- RegisterUserCommandHandlerTests.cs
|   |   |   |   |   |       |-- Domain
|   |   |   |   |   |       |   |-- Aggregates
|   |   |   |   |   |       |   |   `-- UserTests.cs
|   |   |   |   |   |       |   `-- ValueObjects
|   |   |   |   |   |       |       |-- EmailTests.cs
|   |   |   |   |   |       |       |-- PersonNameTests.cs
|   |   |   |   |   |       |       `-- UserIdTests.cs
|   |   |   |   |   |       `-- Validators
|   |   |   |   |   |           `-- RegisterUserCommandValidatorTests.cs
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
|   |   |   |   |   |-- MultiCampus.Presentation
|   |   |   |   |   |   |-- Endpoints
|   |   |   |   |   |   |   |-- ConfigureCampusEndpoint.cs
|   |   |   |   |   |   |   `-- OrganizationEndpoint.cs
|   |   |   |   |   |   `-- MultiCampus.Presentation.csproj
|   |   |   |   |   `-- MultiCampus.Tests
|   |   |   |   |       |-- Integration
|   |   |   |   |       |   |-- Endpoints
|   |   |   |   |       |   |   |-- CampusEndToEndTests.cs
|   |   |   |   |       |   |   |-- ConfigureCampusCommandHandlerEndToEndTests.cs
|   |   |   |   |       |   |   |-- ConfigureCampusCommandHandlerIntegrationTests.cs
|   |   |   |   |       |   |   |-- GetOrganizationHierarchyQueryHandlerEndToEndTests.cs
|   |   |   |   |       |   |   `-- GetOrganizationHierarchyQueryHandlerIntegrationTests.cs
|   |   |   |   |       |   `-- Persistence
|   |   |   |   |       |       `-- CampusIntegrationTests.cs
|   |   |   |   |       |-- MultiCampus.Tests.csproj
|   |   |   |   |       |-- Regression
|   |   |   |   |       |   |-- CampusRegressionTests.cs
|   |   |   |   |       |   |-- ConfigureCampusCommandHandlerRegressionTests.cs
|   |   |   |   |       |   `-- GetOrganizationHierarchyQueryHandlerRegressionTests.cs
|   |   |   |   |       |-- Security
|   |   |   |   |       |   |-- CampusSecurityTests.cs
|   |   |   |   |       |   |-- ConfigureCampusCommandHandlerSecurityTests.cs
|   |   |   |   |       |   `-- GetOrganizationHierarchyQueryHandlerSecurityTests.cs
|   |   |   |   |       `-- Unit
|   |   |   |   |           |-- Application
|   |   |   |   |           |   |-- ConfigureCampusCommandHandlerTests.cs
|   |   |   |   |           |   `-- GetOrganizationHierarchyQueryHandlerTests.cs
|   |   |   |   |           `-- Domain
|   |   |   |   |               `-- Aggregates
|   |   |   |   |                   `-- CampusTests.cs
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
|   |   |   |       |-- Notification.Presentation
|   |   |   |       |   |-- Endpoints
|   |   |   |       |   |   `-- SendNotificationEndpoint.cs
|   |   |   |       |   `-- Notification.Presentation.csproj
|   |   |   |       `-- Notification.Tests
|   |   |   |           |-- Integration
|   |   |   |           |   |-- Endpoints
|   |   |   |           |   |   |-- NotificationMessageEndToEndTests.cs
|   |   |   |           |   |   |-- SendNotificationCommandHandlerEndToEndTests.cs
|   |   |   |           |   |   `-- SendNotificationCommandHandlerIntegrationTests.cs
|   |   |   |           |   `-- Persistence
|   |   |   |           |       `-- NotificationMessageIntegrationTests.cs
|   |   |   |           |-- Notification.Tests.csproj
|   |   |   |           |-- Regression
|   |   |   |           |   |-- NotificationMessageRegressionTests.cs
|   |   |   |           |   `-- SendNotificationCommandHandlerRegressionTests.cs
|   |   |   |           |-- Security
|   |   |   |           |   |-- NotificationMessageSecurityTests.cs
|   |   |   |           |   `-- SendNotificationCommandHandlerSecurityTests.cs
|   |   |   |           `-- Unit
|   |   |   |               |-- Application
|   |   |   |               |   `-- SendNotificationCommandHandlerTests.cs
|   |   |   |               `-- Domain
|   |   |   |                   `-- Aggregates
|   |   |   |                       `-- NotificationMessageTests.cs
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
|   |   |       |   |-- Admissions.Presentation
|   |   |       |   |   |-- Admissions.Presentation.csproj
|   |   |       |   |   `-- Endpoints
|   |   |       |   |       |-- AdmissionsWorkflowEndpoint.cs
|   |   |       |   |       |-- ApplicationsEndpoint.cs
|   |   |       |   |       |-- DocumentsEndpoint.cs
|   |   |       |   |       |-- EligibilityEndpoint.cs
|   |   |       |   |       |-- FacultyAdmissionsEndpoint.cs
|   |   |       |   |       |-- GetApplicationStatusEndpoint.cs
|   |   |       |   |       `-- ProgramsEndpoint.cs
|   |   |       |   `-- Admissions.Tests
|   |   |       |       |-- Admissions.Tests.csproj
|   |   |       |       |-- Integration
|   |   |       |       |   |-- AdmissionsIntegrationTests.cs
|   |   |       |       |   |-- Endpoints
|   |   |       |       |   |   |-- ActivateEnrollmentCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- ActivateEnrollmentCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- AdmissionApplicationEndToEndTests.cs
|   |   |       |       |   |   |-- AdmissionDocumentEndToEndTests.cs
|   |   |       |       |   |   |-- AdmissionsPipelineIntegrationTests.cs
|   |   |       |       |   |   |-- ApplicationTimelineEventEndToEndTests.cs
|   |   |       |       |   |   |-- ApproveApplicationCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- ApproveApplicationCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- CheckEligibilityQueryHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- CheckEligibilityQueryHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- CompleteInterviewCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- CompleteInterviewCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- EndorseApplicationCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- EndorseApplicationCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- EvaluateApplicationCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- EvaluateApplicationCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- GetApplicantJourneyQueryHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- GetApplicantJourneyQueryHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- GetApplicationStatusQueryHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- GetApplicationStatusQueryHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- GetPendingApplicationsQueryHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- GetPendingApplicationsQueryHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- GetProgramCatalogQueryHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- GetProgramCatalogQueryHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- PayApplicationFeeCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- PayApplicationFeeCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- ProgramOfferingEndToEndTests.cs
|   |   |       |       |   |   |-- RecommendAdmissionCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- RecommendAdmissionCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- ScheduleInterviewCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- ScheduleInterviewCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- StudentEnrolledDomainEventEndToEndTests.cs
|   |   |       |       |   |   |-- SubmitApplicationCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- SubmitApplicationCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- UploadDocumentCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   |-- UploadDocumentCommandHandlerIntegrationTests.cs
|   |   |       |       |   |   |-- VerifyDocumentsCommandHandlerEndToEndTests.cs
|   |   |       |       |   |   `-- VerifyDocumentsCommandHandlerIntegrationTests.cs
|   |   |       |       |   `-- Persistence
|   |   |       |       |       |-- AdmissionApplicationIntegrationTests.cs
|   |   |       |       |       |-- AdmissionDocumentIntegrationTests.cs
|   |   |       |       |       |-- ApplicationTimelineEventIntegrationTests.cs
|   |   |       |       |       |-- ProgramOfferingIntegrationTests.cs
|   |   |       |       |       `-- StudentEnrolledDomainEventIntegrationTests.cs
|   |   |       |       |-- Regression
|   |   |       |       |   |-- ActivateEnrollmentCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- AdmissionApplicationRegressionTests.cs
|   |   |       |       |   |-- AdmissionDocumentRegressionTests.cs
|   |   |       |       |   |-- ApplicationTimelineEventRegressionTests.cs
|   |   |       |       |   |-- ApproveApplicationCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- CheckEligibilityQueryHandlerRegressionTests.cs
|   |   |       |       |   |-- CompleteInterviewCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- EndorseApplicationCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- EvaluateApplicationCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- GetApplicantJourneyQueryHandlerRegressionTests.cs
|   |   |       |       |   |-- GetApplicationStatusQueryHandlerRegressionTests.cs
|   |   |       |       |   |-- GetPendingApplicationsQueryHandlerRegressionTests.cs
|   |   |       |       |   |-- GetProgramCatalogQueryHandlerRegressionTests.cs
|   |   |       |       |   |-- PayApplicationFeeCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- ProgramOfferingRegressionTests.cs
|   |   |       |       |   |-- RecommendAdmissionCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- ScheduleInterviewCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- StudentEnrolledDomainEventRegressionTests.cs
|   |   |       |       |   |-- SubmitApplicationCommandHandlerRegressionTests.cs
|   |   |       |       |   |-- UploadDocumentCommandHandlerRegressionTests.cs
|   |   |       |       |   `-- VerifyDocumentsCommandHandlerRegressionTests.cs
|   |   |       |       |-- Security
|   |   |       |       |   |-- ActivateEnrollmentCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- AdmissionApplicationSecurityTests.cs
|   |   |       |       |   |-- AdmissionDocumentSecurityTests.cs
|   |   |       |       |   |-- ApplicationTimelineEventSecurityTests.cs
|   |   |       |       |   |-- ApproveApplicationCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- CheckEligibilityQueryHandlerSecurityTests.cs
|   |   |       |       |   |-- CompleteInterviewCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- EndorseApplicationCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- EvaluateApplicationCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- GetApplicantJourneyQueryHandlerSecurityTests.cs
|   |   |       |       |   |-- GetApplicationStatusQueryHandlerSecurityTests.cs
|   |   |       |       |   |-- GetPendingApplicationsQueryHandlerSecurityTests.cs
|   |   |       |       |   |-- GetProgramCatalogQueryHandlerSecurityTests.cs
|   |   |       |       |   |-- PayApplicationFeeCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- ProgramOfferingSecurityTests.cs
|   |   |       |       |   |-- RecommendAdmissionCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- ScheduleInterviewCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- StudentEnrolledDomainEventSecurityTests.cs
|   |   |       |       |   |-- SubmitApplicationCommandHandlerSecurityTests.cs
|   |   |       |       |   |-- UploadDocumentCommandHandlerSecurityTests.cs
|   |   |       |       |   `-- VerifyDocumentsCommandHandlerSecurityTests.cs
|   |   |       |       `-- Unit
|   |   |       |           |-- Application
|   |   |       |           |   |-- ActivateEnrollmentCommandHandlerTests.cs
|   |   |       |           |   |-- AdmissionsUnitTests.cs
|   |   |       |           |   |-- ApproveApplicationCommandHandlerTests.cs
|   |   |       |           |   |-- CheckEligibilityQueryHandlerTests.cs
|   |   |       |           |   |-- CompleteInterviewCommandHandlerTests.cs
|   |   |       |           |   |-- EndorseApplicationCommandHandlerTests.cs
|   |   |       |           |   |-- EvaluateApplicationCommandHandlerTests.cs
|   |   |       |           |   |-- GetApplicantJourneyQueryHandlerTests.cs
|   |   |       |           |   |-- GetApplicationStatusQueryHandlerTests.cs
|   |   |       |           |   |-- GetPendingApplicationsQueryHandlerTests.cs
|   |   |       |           |   |-- GetProgramCatalogQueryHandlerTests.cs
|   |   |       |           |   |-- PayApplicationFeeCommandHandlerTests.cs
|   |   |       |           |   |-- RecommendAdmissionCommandHandlerTests.cs
|   |   |       |           |   |-- ScheduleInterviewCommandHandlerTests.cs
|   |   |       |           |   |-- SubmitApplicationCommandHandlerTests.cs
|   |   |       |           |   |-- UploadDocumentCommandHandlerTests.cs
|   |   |       |           |   `-- VerifyDocumentsCommandHandlerTests.cs
|   |   |       |           `-- Domain
|   |   |       |               |-- Aggregates
|   |   |       |               |   |-- AdmissionApplicationTests.cs
|   |   |       |               |   |-- AdmissionDomainTests.cs
|   |   |       |               |   `-- ProgramOfferingTests.cs
|   |   |       |               |-- Entities
|   |   |       |               |   |-- AdmissionDocumentTests.cs
|   |   |       |               |   `-- ApplicationTimelineEventTests.cs
|   |   |       |               `-- Events
|   |   |       |                   `-- StudentEnrolledDomainEventTests.cs
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
|   |   |       |   |-- Alumni.Presentation
|   |   |       |   |   |-- Alumni.Presentation.csproj
|   |   |       |   |   `-- Endpoints
|   |   |       |   |       `-- GetAlumniStatusEndpoint.cs
|   |   |       |   `-- Alumni.Tests
|   |   |       |       |-- Alumni.Tests.csproj
|   |   |       |       |-- Integration
|   |   |       |       |   `-- Endpoints
|   |   |       |       |       |-- GetAlumniStatusQueryHandlerEndToEndTests.cs
|   |   |       |       |       `-- GetAlumniStatusQueryHandlerIntegrationTests.cs
|   |   |       |       |-- Regression
|   |   |       |       |   `-- GetAlumniStatusQueryHandlerRegressionTests.cs
|   |   |       |       |-- Security
|   |   |       |       |   `-- GetAlumniStatusQueryHandlerSecurityTests.cs
|   |   |       |       `-- Unit
|   |   |       |           `-- Application
|   |   |       |               `-- GetAlumniStatusQueryHandlerTests.cs
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
|   |   |       |   |-- GuidanceCounseling.Presentation
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetGuidanceSessionsEndpoint.cs
|   |   |       |   |   `-- GuidanceCounseling.Presentation.csproj
|   |   |       |   `-- GuidanceCounseling.Tests
|   |   |       |       |-- GuidanceCounseling.Tests.csproj
|   |   |       |       |-- Integration
|   |   |       |       |   `-- Endpoints
|   |   |       |       |       |-- GetGuidanceSessionsQueryHandlerEndToEndTests.cs
|   |   |       |       |       `-- GetGuidanceSessionsQueryHandlerIntegrationTests.cs
|   |   |       |       |-- Regression
|   |   |       |       |   `-- GetGuidanceSessionsQueryHandlerRegressionTests.cs
|   |   |       |       |-- Security
|   |   |       |       |   `-- GetGuidanceSessionsQueryHandlerSecurityTests.cs
|   |   |       |       `-- Unit
|   |   |       |           `-- Application
|   |   |       |               `-- GetGuidanceSessionsQueryHandlerTests.cs
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
|   |   |       |   |-- HealthCenter.Presentation
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetHealthAppointmentsEndpoint.cs
|   |   |       |   |   `-- HealthCenter.Presentation.csproj
|   |   |       |   `-- HealthCenter.Tests
|   |   |       |       |-- HealthCenter.Tests.csproj
|   |   |       |       |-- Integration
|   |   |       |       |   `-- Endpoints
|   |   |       |       |       |-- GetHealthAppointmentsQueryHandlerEndToEndTests.cs
|   |   |       |       |       `-- GetHealthAppointmentsQueryHandlerIntegrationTests.cs
|   |   |       |       |-- Regression
|   |   |       |       |   `-- GetHealthAppointmentsQueryHandlerRegressionTests.cs
|   |   |       |       |-- Security
|   |   |       |       |   `-- GetHealthAppointmentsQueryHandlerSecurityTests.cs
|   |   |       |       `-- Unit
|   |   |       |           `-- Application
|   |   |       |               `-- GetHealthAppointmentsQueryHandlerTests.cs
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
|   |   |       |   |-- Hostel.Presentation
|   |   |       |   |   |-- Endpoints
|   |   |       |   |   |   `-- GetRoomAllocationEndpoint.cs
|   |   |       |   |   `-- Hostel.Presentation.csproj
|   |   |       |   `-- Hostel.Tests
|   |   |       |       |-- Hostel.Tests.csproj
|   |   |       |       |-- Integration
|   |   |       |       |   `-- Endpoints
|   |   |       |       |       |-- GetRoomAllocationQueryHandlerEndToEndTests.cs
|   |   |       |       |       `-- GetRoomAllocationQueryHandlerIntegrationTests.cs
|   |   |       |       |-- Regression
|   |   |       |       |   `-- GetRoomAllocationQueryHandlerRegressionTests.cs
|   |   |       |       |-- Security
|   |   |       |       |   `-- GetRoomAllocationQueryHandlerSecurityTests.cs
|   |   |       |       `-- Unit
|   |   |       |           `-- Application
|   |   |       |               `-- GetRoomAllocationQueryHandlerTests.cs
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
|   |   |           |-- PlacementCareer.Presentation
|   |   |           |   |-- Endpoints
|   |   |           |   |   `-- GetJobPostingsEndpoint.cs
|   |   |           |   `-- PlacementCareer.Presentation.csproj
|   |   |           `-- PlacementCareer.Tests
|   |   |               |-- Integration
|   |   |               |   `-- Endpoints
|   |   |               |       |-- GetJobPostingsQueryHandlerEndToEndTests.cs
|   |   |               |       `-- GetJobPostingsQueryHandlerIntegrationTests.cs
|   |   |               |-- PlacementCareer.Tests.csproj
|   |   |               |-- Regression
|   |   |               |   `-- GetJobPostingsQueryHandlerRegressionTests.cs
|   |   |               |-- Security
|   |   |               |   `-- GetJobPostingsQueryHandlerSecurityTests.cs
|   |   |               `-- Unit
|   |   |                   `-- Application
|   |   |                       `-- GetJobPostingsQueryHandlerTests.cs
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
|   `-- tests
|       |-- ArchitectureTests
|       |   |-- ContractOnlyDependencyTests.cs
|       |   |-- ModuleRegistrationConventionTests.cs
|       |   |-- NoCrossModuleDomainReferenceTests.cs
|       |   `-- SharedKernelPurityTests.cs
|       |-- DomainTests
|       |   |-- Academic
|       |   |   |-- ClassSessionRoomTests.cs
|       |   |   |-- ExamResultEventTests.cs
|       |   |   `-- GraduationClearanceTests.cs
|       |   |-- EventManagement
|       |   |   `-- CampusEventCapacityTests.cs
|       |   |-- Finance
|       |   |   `-- InvoiceBalancingTests.cs
|       |   |-- GrievanceManagement
|       |   |   `-- EscalationChainTests.cs
|       |   |-- Hostel
|       |   |   `-- RoomCapacityInvariantTests.cs
|       |   |-- IdentityAccess
|       |   |   `-- UserRegistrationTests.cs
|       |   |-- Inventory
|       |   |   `-- InventoryStockInvariantTests.cs
|       |   |-- Payroll
|       |   |   `-- PayrollCalculationTests.cs
|       |   `-- StudentInformation
|       |       `-- EnrollmentInvariantTests.cs
|       |-- EndToEndTests
|       |   |-- AdmissionToEnrollmentFlow.cs
|       |   |-- AdmissionsIntegrationTests.cs
|       |   |-- GrievanceToFacilitiesFlow.cs
|       |   `-- HostelAllocationToBillingFlow.cs
|       |-- Generated
|       |   |-- EndToEnd
|       |   |   |-- AnalyticsBI
|       |   |   |   |-- DashboardReportEndToEndTests.cs
|       |   |   |   |-- GenerateReportCommandHandlerEndToEndTests.cs
|       |   |   |   |-- GetClassPerformanceQueryHandlerEndToEndTests.cs
|       |   |   |   `-- GetSystemHealthQueryHandlerEndToEndTests.cs
|       |   |   |-- CRM
|       |   |   |   |-- ProspectEndToEndTests.cs
|       |   |   |   `-- RegisterProspectCommandHandlerEndToEndTests.cs
|       |   |   |-- Communication
|       |   |   |   |-- DirectMessageEndToEndTests.cs
|       |   |   |   |-- GetInboxQueryHandlerEndToEndTests.cs
|       |   |   |   `-- SendMessageCommandHandlerEndToEndTests.cs
|       |   |   |-- DocumentManagement
|       |   |   |   |-- CorporateDocumentEndToEndTests.cs
|       |   |   |   |-- GetFacultyDocumentsQueryHandlerEndToEndTests.cs
|       |   |   |   `-- UploadDocumentCommandHandlerEndToEndTests.cs
|       |   |   `-- IdentityAccess
|       |   |       |-- AuthenticateUserQueryHandlerEndToEndTests.cs
|       |   |       |-- EmailEndToEndTests.cs
|       |   |       |-- PersonNameEndToEndTests.cs
|       |   |       |-- RegisterUserCommandHandlerEndToEndTests.cs
|       |   |       |-- UserEndToEndTests.cs
|       |   |       `-- UserIdEndToEndTests.cs
|       |   |-- Integration
|       |   |   |-- AnalyticsBI
|       |   |   |   |-- DashboardReportIntegrationTests.cs
|       |   |   |   |-- GenerateReportCommandHandlerIntegrationTests.cs
|       |   |   |   |-- GetClassPerformanceQueryHandlerIntegrationTests.cs
|       |   |   |   `-- GetSystemHealthQueryHandlerIntegrationTests.cs
|       |   |   |-- CRM
|       |   |   |   |-- ProspectIntegrationTests.cs
|       |   |   |   `-- RegisterProspectCommandHandlerIntegrationTests.cs
|       |   |   |-- Communication
|       |   |   |   |-- DirectMessageIntegrationTests.cs
|       |   |   |   |-- GetInboxQueryHandlerIntegrationTests.cs
|       |   |   |   `-- SendMessageCommandHandlerIntegrationTests.cs
|       |   |   |-- DocumentManagement
|       |   |   |   |-- CorporateDocumentIntegrationTests.cs
|       |   |   |   |-- GetFacultyDocumentsQueryHandlerIntegrationTests.cs
|       |   |   |   `-- UploadDocumentCommandHandlerIntegrationTests.cs
|       |   |   `-- IdentityAccess
|       |   |       |-- AuthenticateUserQueryHandlerIntegrationTests.cs
|       |   |       |-- EmailIntegrationTests.cs
|       |   |       |-- PersonNameIntegrationTests.cs
|       |   |       |-- RegisterUserCommandHandlerIntegrationTests.cs
|       |   |       |-- UserIdIntegrationTests.cs
|       |   |       `-- UserIntegrationTests.cs
|       |   |-- Regression
|       |   |   |-- AnalyticsBI
|       |   |   |   |-- DashboardReportRegressionTests.cs
|       |   |   |   |-- GenerateReportCommandHandlerRegressionTests.cs
|       |   |   |   |-- GetClassPerformanceQueryHandlerRegressionTests.cs
|       |   |   |   `-- GetSystemHealthQueryHandlerRegressionTests.cs
|       |   |   |-- CRM
|       |   |   |   |-- ProspectRegressionTests.cs
|       |   |   |   `-- RegisterProspectCommandHandlerRegressionTests.cs
|       |   |   |-- Communication
|       |   |   |   |-- DirectMessageRegressionTests.cs
|       |   |   |   |-- GetInboxQueryHandlerRegressionTests.cs
|       |   |   |   `-- SendMessageCommandHandlerRegressionTests.cs
|       |   |   |-- DocumentManagement
|       |   |   |   |-- CorporateDocumentRegressionTests.cs
|       |   |   |   |-- GetFacultyDocumentsQueryHandlerRegressionTests.cs
|       |   |   |   `-- UploadDocumentCommandHandlerRegressionTests.cs
|       |   |   `-- IdentityAccess
|       |   |       |-- AuthenticateUserQueryHandlerRegressionTests.cs
|       |   |       |-- EmailRegressionTests.cs
|       |   |       |-- PersonNameRegressionTests.cs
|       |   |       |-- RegisterUserCommandHandlerRegressionTests.cs
|       |   |       |-- UserIdRegressionTests.cs
|       |   |       `-- UserRegressionTests.cs
|       |   |-- Security
|       |   |   |-- AnalyticsBI
|       |   |   |   |-- DashboardReportSecurityTests.cs
|       |   |   |   |-- GenerateReportCommandHandlerSecurityTests.cs
|       |   |   |   |-- GetClassPerformanceQueryHandlerSecurityTests.cs
|       |   |   |   `-- GetSystemHealthQueryHandlerSecurityTests.cs
|       |   |   |-- CRM
|       |   |   |   |-- ProspectSecurityTests.cs
|       |   |   |   `-- RegisterProspectCommandHandlerSecurityTests.cs
|       |   |   |-- Communication
|       |   |   |   |-- DirectMessageSecurityTests.cs
|       |   |   |   |-- GetInboxQueryHandlerSecurityTests.cs
|       |   |   |   `-- SendMessageCommandHandlerSecurityTests.cs
|       |   |   |-- DocumentManagement
|       |   |   |   |-- CorporateDocumentSecurityTests.cs
|       |   |   |   |-- GetFacultyDocumentsQueryHandlerSecurityTests.cs
|       |   |   |   `-- UploadDocumentCommandHandlerSecurityTests.cs
|       |   |   `-- IdentityAccess
|       |   |       |-- AuthenticateUserQueryHandlerSecurityTests.cs
|       |   |       |-- EmailSecurityTests.cs
|       |   |       |-- PersonNameSecurityTests.cs
|       |   |       |-- RegisterUserCommandHandlerSecurityTests.cs
|       |   |       |-- UserIdSecurityTests.cs
|       |   |       `-- UserSecurityTests.cs
|       |   |-- Unit
|       |   |   |-- AnalyticsBI
|       |   |   |   |-- DashboardReportTests.cs
|       |   |   |   |-- GenerateReportCommandHandlerTests.cs
|       |   |   |   |-- GetClassPerformanceQueryHandlerTests.cs
|       |   |   |   `-- GetSystemHealthQueryHandlerTests.cs
|       |   |   |-- CRM
|       |   |   |   |-- ProspectTests.cs
|       |   |   |   `-- RegisterProspectCommandHandlerTests.cs
|       |   |   |-- Communication
|       |   |   |   |-- DirectMessageTests.cs
|       |   |   |   |-- GetInboxQueryHandlerTests.cs
|       |   |   |   `-- SendMessageCommandHandlerTests.cs
|       |   |   |-- DocumentManagement
|       |   |   |   |-- CorporateDocumentTests.cs
|       |   |   |   |-- GetFacultyDocumentsQueryHandlerTests.cs
|       |   |   |   `-- UploadDocumentCommandHandlerTests.cs
|       |   |   `-- IdentityAccess
|       |   |       |-- AuthenticateUserQueryHandlerTests.cs
|       |   |       |-- EmailTests.cs
|       |   |       |-- PersonNameTests.cs
|       |   |       |-- RegisterUserCommandHandlerTests.cs
|       |   |       |-- UserIdTests.cs
|       |   |       `-- UserTests.cs
|       |   `-- UniversityErp.TestTemplates.csproj
|       |-- PerformanceTests
|       |   |-- InvoiceIssuanceThroughput.cs
|       |   |-- PayrollBatchCalculation.cs
|       |   `-- RegistrationPeakLoad.cs
|       `-- SecurityTests
|           |-- AuthorizationPolicyTests.cs
|           `-- DataClassificationLeakTests.cs
|-- University-ERP-Frontend
|   |-- Dockerfile.applicant
|   |-- Dockerfile.build-all
|   |-- Dockerfile.portal
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
|   |   |   |   |   |   `-- AssetRegistry.types.ts
|   |   |   |   |   |-- AuditCompliance
|   |   |   |   |   |   |-- AuditCompliance.api.ts
|   |   |   |   |   |   |-- AuditCompliance.hooks.ts
|   |   |   |   |   |   |-- AuditCompliance.page.tsx
|   |   |   |   |   |   `-- AuditCompliance.types.ts
|   |   |   |   |   |-- CanteenOrders
|   |   |   |   |   |   |-- CanteenOrders.api.ts
|   |   |   |   |   |   |-- CanteenOrders.hooks.ts
|   |   |   |   |   |   |-- CanteenOrders.page.tsx
|   |   |   |   |   |   `-- CanteenOrders.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- EmployeeManagement
|   |   |   |   |   |   |-- EmployeeManagement.api.ts
|   |   |   |   |   |   |-- EmployeeManagement.hooks.ts
|   |   |   |   |   |   |-- EmployeeManagement.page.tsx
|   |   |   |   |   |   `-- EmployeeManagement.types.ts
|   |   |   |   |   |-- FacilityBooking
|   |   |   |   |   |   |-- FacilityBooking.api.ts
|   |   |   |   |   |   |-- FacilityBooking.hooks.ts
|   |   |   |   |   |   |-- FacilityBooking.page.tsx
|   |   |   |   |   |   `-- FacilityBooking.types.ts
|   |   |   |   |   |-- FleetManagement
|   |   |   |   |   |   |-- FleetManagement.api.ts
|   |   |   |   |   |   |-- FleetManagement.hooks.ts
|   |   |   |   |   |   |-- FleetManagement.page.tsx
|   |   |   |   |   |   `-- FleetManagement.types.ts
|   |   |   |   |   |-- IdentitySecurity
|   |   |   |   |   |   |-- IdentitySecurity.api.ts
|   |   |   |   |   |   |-- IdentitySecurity.hooks.ts
|   |   |   |   |   |   |-- IdentitySecurity.page.tsx
|   |   |   |   |   |   `-- IdentitySecurity.types.ts
|   |   |   |   |   |-- IntegrationManagement
|   |   |   |   |   |   |-- IntegrationManagement.api.ts
|   |   |   |   |   |   |-- IntegrationManagement.hooks.ts
|   |   |   |   |   |   |-- IntegrationManagement.page.tsx
|   |   |   |   |   |   `-- IntegrationManagement.types.ts
|   |   |   |   |   |-- OrganizationManagement
|   |   |   |   |   |   |-- OrganizationManagement.api.ts
|   |   |   |   |   |   |-- OrganizationManagement.hooks.ts
|   |   |   |   |   |   |-- OrganizationManagement.page.tsx
|   |   |   |   |   |   `-- OrganizationManagement.types.ts
|   |   |   |   |   |-- PlatformMonitoring
|   |   |   |   |   |   |-- PlatformMonitoring.api.ts
|   |   |   |   |   |   |-- PlatformMonitoring.hooks.ts
|   |   |   |   |   |   |-- PlatformMonitoring.page.tsx
|   |   |   |   |   |   `-- PlatformMonitoring.types.ts
|   |   |   |   |   |-- PurchaseOrders
|   |   |   |   |   |   |-- PurchaseOrders.api.ts
|   |   |   |   |   |   |-- PurchaseOrders.hooks.ts
|   |   |   |   |   |   |-- PurchaseOrders.page.tsx
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
|   |   |   |   |   |   `-- Reports.types.ts
|   |   |   |   |   |-- RoleAdministration
|   |   |   |   |   |   |-- RoleAdministration.api.ts
|   |   |   |   |   |   |-- RoleAdministration.hooks.ts
|   |   |   |   |   |   |-- RoleAdministration.page.tsx
|   |   |   |   |   |   `-- RoleAdministration.types.ts
|   |   |   |   |   |-- StockManagement
|   |   |   |   |   |   |-- StockManagement.api.ts
|   |   |   |   |   |   |-- StockManagement.hooks.ts
|   |   |   |   |   |   |-- StockManagement.page.tsx
|   |   |   |   |   |   `-- StockManagement.types.ts
|   |   |   |   |   |-- SystemAdministration
|   |   |   |   |   |   |-- SystemAdministration.api.ts
|   |   |   |   |   |   |-- SystemAdministration.hooks.ts
|   |   |   |   |   |   |-- SystemAdministration.page.tsx
|   |   |   |   |   |   `-- SystemAdministration.types.ts
|   |   |   |   |   |-- UserAdministration
|   |   |   |   |   |   |-- UserAdministration.api.ts
|   |   |   |   |   |   |-- UserAdministration.hooks.ts
|   |   |   |   |   |   |-- UserAdministration.page.tsx
|   |   |   |   |   |   `-- UserAdministration.types.ts
|   |   |   |   |   `-- WorkflowManagement
|   |   |   |   |       |-- WorkflowManagement.api.ts
|   |   |   |   |       |-- WorkflowManagement.hooks.ts
|   |   |   |   |       |-- WorkflowManagement.page.tsx
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
|   |   |   |   |   |   `-- AdmissionCases.types.ts
|   |   |   |   |   |-- AdmissionsDecision
|   |   |   |   |   |   |-- AdmissionsDecision.api.ts
|   |   |   |   |   |   |-- AdmissionsDecision.hooks.ts
|   |   |   |   |   |   |-- AdmissionsDecision.page.tsx
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
|   |   |   |   |   |   `-- Interviews.types.ts
|   |   |   |   |   |-- Queue
|   |   |   |   |   |   `-- AdmissionQueue.page.tsx
|   |   |   |   |   |-- Reports
|   |   |   |   |   |   `-- AdmissionsReports.page.tsx
|   |   |   |   |   |-- RequirementManagement
|   |   |   |   |   |   |-- RequirementManagement.api.ts
|   |   |   |   |   |   |-- RequirementManagement.hooks.ts
|   |   |   |   |   |   |-- RequirementManagement.page.tsx
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
|   |   |   |   |   |   `-- AdmissionStatus.types.ts
|   |   |   |   |   |-- ApplicantJourney.hooks.ts
|   |   |   |   |   |-- ApplicationForm
|   |   |   |   |   |   |-- ApplicationForm.api.ts
|   |   |   |   |   |   |-- ApplicationForm.hooks.ts
|   |   |   |   |   |   |-- ApplicationForm.page.tsx
|   |   |   |   |   |   `-- ApplicationForm.types.ts
|   |   |   |   |   |-- ApplicationStatus
|   |   |   |   |   |   |-- ApplicationStatus.api.ts
|   |   |   |   |   |   |-- ApplicationStatus.hooks.ts
|   |   |   |   |   |   |-- ApplicationStatus.page.tsx
|   |   |   |   |   |   `-- ApplicationStatus.types.ts
|   |   |   |   |   |-- ApplicationTimeline
|   |   |   |   |   |   |-- ApplicationTimeline.api.ts
|   |   |   |   |   |   |-- ApplicationTimeline.hooks.ts
|   |   |   |   |   |   |-- ApplicationTimeline.page.tsx
|   |   |   |   |   |   `-- ApplicationTimeline.types.ts
|   |   |   |   |   |-- ApplicationWizard
|   |   |   |   |   |   |-- ApplicationWizard.api.ts
|   |   |   |   |   |   |-- ApplicationWizard.hooks.ts
|   |   |   |   |   |   |-- ApplicationWizard.page.tsx
|   |   |   |   |   |   `-- ApplicationWizard.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- DocumentSubmission
|   |   |   |   |   |   |-- DocumentSubmission.api.ts
|   |   |   |   |   |   |-- DocumentSubmission.hooks.ts
|   |   |   |   |   |   |-- DocumentSubmission.page.tsx
|   |   |   |   |   |   `-- DocumentSubmission.types.ts
|   |   |   |   |   |-- DocumentUpload
|   |   |   |   |   |   |-- DocumentUpload.api.ts
|   |   |   |   |   |   |-- DocumentUpload.hooks.ts
|   |   |   |   |   |   |-- DocumentUpload.page.tsx
|   |   |   |   |   |   `-- DocumentUpload.types.ts
|   |   |   |   |   |-- EligibilityChecker
|   |   |   |   |   |   |-- EligibilityChecker.api.ts
|   |   |   |   |   |   |-- EligibilityChecker.hooks.ts
|   |   |   |   |   |   |-- EligibilityChecker.page.tsx
|   |   |   |   |   |   `-- EligibilityChecker.types.ts
|   |   |   |   |   |-- EnrollmentPayment
|   |   |   |   |   |   |-- ApplicationFeePayment.page.tsx
|   |   |   |   |   |   |-- EnrollmentPayment.api.ts
|   |   |   |   |   |   |-- EnrollmentPayment.hooks.ts
|   |   |   |   |   |   |-- EnrollmentPayment.page.tsx
|   |   |   |   |   |   `-- EnrollmentPayment.types.ts
|   |   |   |   |   |-- InterviewScheduling
|   |   |   |   |   |   |-- InterviewScheduling.api.ts
|   |   |   |   |   |   |-- InterviewScheduling.hooks.ts
|   |   |   |   |   |   |-- InterviewScheduling.page.tsx
|   |   |   |   |   |   `-- InterviewScheduling.types.ts
|   |   |   |   |   |-- Offers
|   |   |   |   |   |   |-- Offers.api.ts
|   |   |   |   |   |   |-- Offers.hooks.ts
|   |   |   |   |   |   |-- Offers.page.tsx
|   |   |   |   |   |   `-- Offers.types.ts
|   |   |   |   |   `-- ProgramExplorer
|   |   |   |   |       |-- ProgramExplorer.api.ts
|   |   |   |   |       |-- ProgramExplorer.hooks.ts
|   |   |   |   |       |-- ProgramExplorer.page.tsx
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
|   |   |   |   |   |   `-- Advising.types.ts
|   |   |   |   |   |-- Analytics
|   |   |   |   |   |   |-- Analytics.api.ts
|   |   |   |   |   |   |-- Analytics.hooks.ts
|   |   |   |   |   |   |-- Analytics.page.tsx
|   |   |   |   |   |   `-- Analytics.types.ts
|   |   |   |   |   |-- Assessments
|   |   |   |   |   |   |-- Assessments.api.ts
|   |   |   |   |   |   |-- Assessments.hooks.ts
|   |   |   |   |   |   |-- Assessments.page.tsx
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
|   |   |   |   |   |   `-- Communication.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- DeanWorkspace
|   |   |   |   |   |   |-- CollegeApproval.page.tsx
|   |   |   |   |   |   |-- Endorsement.page.tsx
|   |   |   |   |   |   `-- RecommendationQueue.page.tsx
|   |   |   |   |   |-- Documents
|   |   |   |   |   |   |-- Documents.api.ts
|   |   |   |   |   |   |-- Documents.hooks.ts
|   |   |   |   |   |   |-- Documents.page.tsx
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
|   |   |   |   |   |   `-- Research.types.ts
|   |   |   |   |   |-- Schedule
|   |   |   |   |   |   |-- Schedule.api.ts
|   |   |   |   |   |   |-- Schedule.hooks.ts
|   |   |   |   |   |   |-- Schedule.page.tsx
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
|   |   |   |   |   |   `-- Settings.types.ts
|   |   |   |   |   |-- Students
|   |   |   |   |   |   |-- Students.api.ts
|   |   |   |   |   |   |-- Students.hooks.ts
|   |   |   |   |   |   |-- Students.page.tsx
|   |   |   |   |   |   |-- Students.types.ts
|   |   |   |   |   |   `-- StudentsDashboard.page.tsx
|   |   |   |   |   `-- Teaching
|   |   |   |   |       |-- SectionRoster.page.tsx
|   |   |   |   |       |-- Teaching.api.ts
|   |   |   |   |       |-- Teaching.hooks.ts
|   |   |   |   |       |-- Teaching.page.tsx
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
|   |   |   |   |   |   `-- Budgeting.types.ts
|   |   |   |   |   |-- Cashier
|   |   |   |   |   |   |-- ClearanceApproval.page.tsx
|   |   |   |   |   |   `-- PaymentGateway.page.tsx
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- EnrollmentFinance
|   |   |   |   |   |   |-- AdmissionAssessment
|   |   |   |   |   |   |   |-- AdmissionAssessment.api.ts
|   |   |   |   |   |   |   |-- AdmissionAssessment.hooks.ts
|   |   |   |   |   |   |   |-- AdmissionAssessment.page.tsx
|   |   |   |   |   |   |   `-- AdmissionAssessment.types.ts
|   |   |   |   |   |   |-- Downpayment
|   |   |   |   |   |   |   |-- Downpayment.api.ts
|   |   |   |   |   |   |   |-- Downpayment.hooks.ts
|   |   |   |   |   |   |   |-- Downpayment.page.tsx
|   |   |   |   |   |   |   `-- Downpayment.types.ts
|   |   |   |   |   |   `-- FinancialClearance
|   |   |   |   |   |       |-- FinancialClearance.api.ts
|   |   |   |   |   |       |-- FinancialClearance.hooks.ts
|   |   |   |   |   |       |-- FinancialClearance.page.tsx
|   |   |   |   |   |       `-- FinancialClearance.types.ts
|   |   |   |   |   |-- FinancialReports
|   |   |   |   |   |   |-- FinancialReports.api.ts
|   |   |   |   |   |   |-- FinancialReports.hooks.ts
|   |   |   |   |   |   |-- FinancialReports.page.tsx
|   |   |   |   |   |   `-- FinancialReports.types.ts
|   |   |   |   |   |-- Invoicing
|   |   |   |   |   |   |-- Invoicing.api.ts
|   |   |   |   |   |   |-- Invoicing.hooks.ts
|   |   |   |   |   |   |-- Invoicing.page.tsx
|   |   |   |   |   |   `-- Invoicing.types.ts
|   |   |   |   |   |-- PaymentGateway
|   |   |   |   |   |   |-- PaymentGateway.api.ts
|   |   |   |   |   |   |-- PaymentGateway.hooks.ts
|   |   |   |   |   |   |-- PaymentGateway.page.tsx
|   |   |   |   |   |   `-- PaymentGateway.types.ts
|   |   |   |   |   |-- Payroll
|   |   |   |   |   |   |-- Payroll.api.ts
|   |   |   |   |   |   |-- Payroll.hooks.ts
|   |   |   |   |   |   |-- Payroll.page.tsx
|   |   |   |   |   |   `-- Payroll.types.ts
|   |   |   |   |   |-- PayrollProcessing
|   |   |   |   |   |   |-- PayrollProcessing.hooks.ts
|   |   |   |   |   |   `-- PayrollProcessing.page.tsx
|   |   |   |   |   |-- SemesterBilling
|   |   |   |   |   |   |-- SemesterBilling.api.ts
|   |   |   |   |   |   |-- SemesterBilling.hooks.ts
|   |   |   |   |   |   |-- SemesterBilling.page.tsx
|   |   |   |   |   |   `-- SemesterBilling.types.ts
|   |   |   |   |   |-- StudentBilling
|   |   |   |   |   |   |-- ScholarshipGrants.page.tsx
|   |   |   |   |   |   |-- StatementOfAccount.page.tsx
|   |   |   |   |   |   |-- StudentBilling.api.ts
|   |   |   |   |   |   |-- StudentBilling.hooks.ts
|   |   |   |   |   |   |-- StudentBilling.page.tsx
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
|   |   |   |   |   |   `-- Accreditation.types.ts
|   |   |   |   |   |-- Audits
|   |   |   |   |   |   |-- Audits.api.ts
|   |   |   |   |   |   |-- Audits.hooks.ts
|   |   |   |   |   |   |-- Audits.page.tsx
|   |   |   |   |   |   `-- Audits.types.ts
|   |   |   |   |   |-- Committees
|   |   |   |   |   |   |-- Committees.api.ts
|   |   |   |   |   |   |-- Committees.hooks.ts
|   |   |   |   |   |   |-- Committees.page.tsx
|   |   |   |   |   |   `-- Committees.types.ts
|   |   |   |   |   |-- Compliance
|   |   |   |   |   |   |-- Compliance.api.ts
|   |   |   |   |   |   |-- Compliance.hooks.ts
|   |   |   |   |   |   |-- Compliance.page.tsx
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
|   |   |   |   |   |   `-- Policies.types.ts
|   |   |   |   |   |-- QualityAccreditation
|   |   |   |   |   |   `-- QualityAccreditation.page.tsx
|   |   |   |   |   |-- RiskManagement
|   |   |   |   |   |   |-- RiskManagement.api.ts
|   |   |   |   |   |   |-- RiskManagement.hooks.ts
|   |   |   |   |   |   |-- RiskManagement.page.tsx
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
|   |   |   |   |   |   `-- MfaVerification.types.ts
|   |   |   |   |   |-- MultiFactorAuth
|   |   |   |   |   |   |-- MultiFactorAuth.api.ts
|   |   |   |   |   |   |-- MultiFactorAuth.hooks.ts
|   |   |   |   |   |   |-- MultiFactorAuth.page.tsx
|   |   |   |   |   |   `-- MultiFactorAuth.types.ts
|   |   |   |   |   |-- PasswordRecovery
|   |   |   |   |   |   |-- PasswordRecovery.api.ts
|   |   |   |   |   |   |-- PasswordRecovery.hooks.ts
|   |   |   |   |   |   |-- PasswordRecovery.page.tsx
|   |   |   |   |   |   `-- PasswordRecovery.types.ts
|   |   |   |   |   |-- PasswordReset
|   |   |   |   |   |   |-- PasswordReset.api.ts
|   |   |   |   |   |   |-- PasswordReset.hooks.ts
|   |   |   |   |   |   |-- PasswordReset.page.tsx
|   |   |   |   |   |   `-- PasswordReset.types.ts
|   |   |   |   |   |-- SecuritySettings
|   |   |   |   |   |   |-- SecuritySettings.api.ts
|   |   |   |   |   |   |-- SecuritySettings.hooks.ts
|   |   |   |   |   |   |-- SecuritySettings.page.tsx
|   |   |   |   |   |   `-- SecuritySettings.types.ts
|   |   |   |   |   |-- SessionManagement
|   |   |   |   |   |   |-- SessionManagement.api.ts
|   |   |   |   |   |   |-- SessionManagement.hooks.ts
|   |   |   |   |   |   |-- SessionManagement.page.tsx
|   |   |   |   |   |   `-- SessionManagement.types.ts
|   |   |   |   |   |-- UniversityAccount
|   |   |   |   |   |   |-- AccountProvisioning.page.tsx
|   |   |   |   |   |   `-- DirectorySearch.page.tsx
|   |   |   |   |   |-- UserLogin
|   |   |   |   |   |   |-- UserLogin.api.ts
|   |   |   |   |   |   |-- UserLogin.hooks.ts
|   |   |   |   |   |   |-- UserLogin.page.tsx
|   |   |   |   |   |   `-- UserLogin.types.ts
|   |   |   |   |   `-- UserRegistration
|   |   |   |   |       |-- UserRegistration.api.ts
|   |   |   |   |       |-- UserRegistration.hooks.ts
|   |   |   |   |       |-- UserRegistration.page.tsx
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
|   |   |   |   |   |   `-- CatalogSearch.types.ts
|   |   |   |   |   |-- Circulation
|   |   |   |   |   |   `-- Circulation.page.tsx
|   |   |   |   |   |-- DigitalResources
|   |   |   |   |   |   |-- DigitalResources.api.ts
|   |   |   |   |   |   |-- DigitalResources.hooks.ts
|   |   |   |   |   |   |-- DigitalResources.page.tsx
|   |   |   |   |   |   `-- DigitalResources.types.ts
|   |   |   |   |   |-- Fines
|   |   |   |   |   |   |-- Fines.api.ts
|   |   |   |   |   |   |-- Fines.hooks.ts
|   |   |   |   |   |   |-- Fines.page.tsx
|   |   |   |   |   |   `-- Fines.types.ts
|   |   |   |   |   |-- MyLoans
|   |   |   |   |   |   |-- MyLoans.api.ts
|   |   |   |   |   |   |-- MyLoans.hooks.ts
|   |   |   |   |   |   |-- MyLoans.page.tsx
|   |   |   |   |   |   `-- MyLoans.types.ts
|   |   |   |   |   `-- Reservations
|   |   |   |   |       |-- Reservations.api.ts
|   |   |   |   |       |-- Reservations.hooks.ts
|   |   |   |   |       |-- Reservations.page.tsx
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
|   |   |   |   |   |   `-- Assignments.types.ts
|   |   |   |   |   |-- Calendar
|   |   |   |   |   |   |-- Calendar.api.ts
|   |   |   |   |   |   |-- Calendar.hooks.ts
|   |   |   |   |   |   |-- Calendar.page.tsx
|   |   |   |   |   |   `-- Calendar.types.ts
|   |   |   |   |   |-- CourseAdministration
|   |   |   |   |   |   `-- CoursePackaging.page.tsx
|   |   |   |   |   |-- CourseContent
|   |   |   |   |   |   |-- CourseContent.api.ts
|   |   |   |   |   |   |-- CourseContent.hooks.ts
|   |   |   |   |   |   |-- CourseContent.page.tsx
|   |   |   |   |   |   `-- CourseContent.types.ts
|   |   |   |   |   |-- Dashboard
|   |   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |   |-- Discussions
|   |   |   |   |   |   |-- Discussions.api.ts
|   |   |   |   |   |   |-- Discussions.hooks.ts
|   |   |   |   |   |   |-- Discussions.page.tsx
|   |   |   |   |   |   `-- Discussions.types.ts
|   |   |   |   |   |-- GradebookOrchestration
|   |   |   |   |   |   `-- GradebookSync.page.tsx
|   |   |   |   |   |-- Grades
|   |   |   |   |   |   |-- Grades.api.ts
|   |   |   |   |   |   |-- Grades.hooks.ts
|   |   |   |   |   |   |-- Grades.page.tsx
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
|   |   |   |   |   |   `-- DatabaseManagement.types.ts
|   |   |   |   |   |-- DocumentManagement
|   |   |   |   |   |   `-- DocumentManagement.page.tsx
|   |   |   |   |   |-- GlobalSettings
|   |   |   |   |   |   |-- GlobalSettings.api.ts
|   |   |   |   |   |   |-- GlobalSettings.hooks.ts
|   |   |   |   |   |   |-- GlobalSettings.page.tsx
|   |   |   |   |   |   `-- GlobalSettings.types.ts
|   |   |   |   |   |-- MultiCampus
|   |   |   |   |   |   `-- MultiCampus.page.tsx
|   |   |   |   |   |-- Notification
|   |   |   |   |   |   `-- Notification.page.tsx
|   |   |   |   |   |-- SecurityAudits
|   |   |   |   |   |   |-- SecurityAudits.api.ts
|   |   |   |   |   |   |-- SecurityAudits.hooks.ts
|   |   |   |   |   |   |-- SecurityAudits.page.tsx
|   |   |   |   |   |   `-- SecurityAudits.types.ts
|   |   |   |   |   |-- SystemLogs
|   |   |   |   |   |   |-- SystemLogs.api.ts
|   |   |   |   |   |   |-- SystemLogs.hooks.ts
|   |   |   |   |   |   |-- SystemLogs.page.tsx
|   |   |   |   |   |   `-- SystemLogs.types.ts
|   |   |   |   |   `-- TenantManagement
|   |   |   |   |       |-- TenantManagement.api.ts
|   |   |   |   |       |-- TenantManagement.hooks.ts
|   |   |   |   |       |-- TenantManagement.page.tsx
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
|   |   |   |   |   |   |-- AcademicStanding.page.tsx
|   |   |   |   |   |   |-- OfficialGrades.page.tsx
|   |   |   |   |   |   |-- Records.api.ts
|   |   |   |   |   |   |-- Records.hooks.ts
|   |   |   |   |   |   `-- Records.types.ts
|   |   |   |   |   |-- AcademicSchedulingDivision
|   |   |   |   |   |   |-- AcademicSchedulingDivision.api.ts
|   |   |   |   |   |   |-- AcademicSchedulingDivision.hooks.ts
|   |   |   |   |   |   |-- AcademicSchedulingDivision.page.tsx
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
|   |   |   |   |   |-- ClearanceProcessing
|   |   |   |   |   |   `-- PendingClearancesView.tsx
|   |   |   |   |   |-- CrossEnrollmentDivision
|   |   |   |   |   |   |-- CrossEnrollmentDivision.api.ts
|   |   |   |   |   |   |-- CrossEnrollmentDivision.hooks.ts
|   |   |   |   |   |   |-- CrossEnrollmentDivision.page.tsx
|   |   |   |   |   |   `-- CrossEnrollmentDivision.types.ts
|   |   |   |   |   |-- CurriculumDivision
|   |   |   |   |   |   |-- CourseOfferings.page.tsx
|   |   |   |   |   |   |-- Curriculum.api.ts
|   |   |   |   |   |   |-- Curriculum.hooks.ts
|   |   |   |   |   |   |-- Curriculum.types.ts
|   |   |   |   |   |   |-- Prerequisites.page.tsx
|   |   |   |   |   |   `-- SubjectCatalog.page.tsx
|   |   |   |   |   |-- EnrollmentDivision
|   |   |   |   |   |   |-- AddDropOversight.page.tsx
|   |   |   |   |   |   |-- Enrollment.api.ts
|   |   |   |   |   |   |-- Enrollment.hooks.ts
|   |   |   |   |   |   |-- Enrollment.types.ts
|   |   |   |   |   |   |-- EnrollmentValidation.page.tsx
|   |   |   |   |   |   |-- RegistrationExceptions.page.tsx
|   |   |   |   |   |   |-- RegistrationRequests.page.tsx
|   |   |   |   |   |   |-- RegistrationWindows.page.tsx
|   |   |   |   |   |   |-- SubjectLoading.page.tsx
|   |   |   |   |   |   `-- Waitlists.page.tsx
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
|   |       |   |   |   `-- AcademicRecord.types.ts
|   |       |   |   |-- AlumniNetwork
|   |       |   |   |   |-- AlumniNetwork.api.ts
|   |       |   |   |   |-- AlumniNetwork.hooks.ts
|   |       |   |   |   |-- AlumniNetwork.page.tsx
|   |       |   |   |   `-- AlumniNetwork.types.ts
|   |       |   |   |-- CareerDashboard
|   |       |   |   |   |-- CareerDashboard.api.ts
|   |       |   |   |   |-- CareerDashboard.hooks.ts
|   |       |   |   |   |-- CareerDashboard.page.tsx
|   |       |   |   |   `-- CareerDashboard.types.ts
|   |       |   |   |-- Clearance
|   |       |   |   |   |-- Clearance.api.ts
|   |       |   |   |   |-- Clearance.hooks.ts
|   |       |   |   |   |-- Clearance.page.tsx
|   |       |   |   |   `-- Clearance.types.ts
|   |       |   |   |-- CrossEnrollment
|   |       |   |   |   |-- CrossEnrollment.api.ts
|   |       |   |   |   |-- CrossEnrollment.hooks.ts
|   |       |   |   |   |-- CrossEnrollment.page.tsx
|   |       |   |   |   `-- CrossEnrollment.types.ts
|   |       |   |   |-- CurriculumProgress
|   |       |   |   |   |-- CurriculumProgress.api.ts
|   |       |   |   |   |-- CurriculumProgress.hooks.ts
|   |       |   |   |   |-- CurriculumProgress.page.tsx
|   |       |   |   |   `-- CurriculumProgress.types.ts
|   |       |   |   |-- Dashboard
|   |       |   |   |   |-- Dashboard.api.ts
|   |       |   |   |   |-- Dashboard.hooks.ts
|   |       |   |   |   |-- Dashboard.page.tsx
|   |       |   |   |   `-- Dashboard.types.ts
|   |       |   |   |-- Enrollment
|   |       |   |   |   |-- Enrollment.api.ts
|   |       |   |   |   |-- Enrollment.hooks.ts
|   |       |   |   |   |-- Enrollment.page.tsx
|   |       |   |   |   `-- Enrollment.types.ts
|   |       |   |   |-- EnrollmentHistory
|   |       |   |   |   |-- EnrollmentHistory.api.ts
|   |       |   |   |   |-- EnrollmentHistory.hooks.ts
|   |       |   |   |   |-- EnrollmentHistory.page.tsx
|   |       |   |   |   `-- EnrollmentHistory.types.ts
|   |       |   |   |-- Extracurriculars
|   |       |   |   |   |-- Extracurriculars.api.ts
|   |       |   |   |   |-- Extracurriculars.hooks.ts
|   |       |   |   |   |-- Extracurriculars.page.tsx
|   |       |   |   |   `-- Extracurriculars.types.ts
|   |       |   |   |-- Financials
|   |       |   |   |   |-- Financials.api.ts
|   |       |   |   |   |-- Financials.hooks.ts
|   |       |   |   |   |-- Financials.page.tsx
|   |       |   |   |   `-- Financials.types.ts
|   |       |   |   |-- Graduation
|   |       |   |   |   |-- Graduation.api.ts
|   |       |   |   |   |-- Graduation.hooks.ts
|   |       |   |   |   |-- Graduation.page.tsx
|   |       |   |   |   `-- Graduation.types.ts
|   |       |   |   |-- GuidanceSessions
|   |       |   |   |   |-- GuidanceSessions.api.ts
|   |       |   |   |   |-- GuidanceSessions.hooks.ts
|   |       |   |   |   |-- GuidanceSessions.page.tsx
|   |       |   |   |   `-- GuidanceSessions.types.ts
|   |       |   |   |-- HealthRecords
|   |       |   |   |   |-- HealthRecords.api.ts
|   |       |   |   |   |-- HealthRecords.hooks.ts
|   |       |   |   |   |-- HealthRecords.page.tsx
|   |       |   |   |   `-- HealthRecords.types.ts
|   |       |   |   |-- HostelAllocation
|   |       |   |   |   |-- HostelAllocation.api.ts
|   |       |   |   |   |-- HostelAllocation.hooks.ts
|   |       |   |   |   |-- HostelAllocation.page.tsx
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
|   |       |   |   |   `-- MyEnrollments.types.ts
|   |       |   |   |-- Registration
|   |       |   |   |   |-- BrowseCourses.page.tsx
|   |       |   |   |   |-- MyRegistration.page.tsx
|   |       |   |   |   |-- Registration.api.ts
|   |       |   |   |   |-- Registration.hooks.ts
|   |       |   |   |   |-- Registration.page.tsx
|   |       |   |   |   |-- Registration.types.ts
|   |       |   |   |   `-- Waitlist.page.tsx
|   |       |   |   |-- Schedule
|   |       |   |   |   |-- Schedule.api.ts
|   |       |   |   |   |-- Schedule.hooks.ts
|   |       |   |   |   |-- Schedule.page.tsx
|   |       |   |   |   `-- Schedule.types.ts
|   |       |   |   |-- StudentProfile
|   |       |   |   |   |-- StudentProfile.api.ts
|   |       |   |   |   |-- StudentProfile.hooks.ts
|   |       |   |   |   |-- StudentProfile.page.tsx
|   |       |   |   |   `-- StudentProfile.types.ts
|   |       |   |   `-- Timetable
|   |       |   |       |-- Timetable.api.ts
|   |       |   |       |-- Timetable.hooks.ts
|   |       |   |       |-- Timetable.page.tsx
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
|   |   |   |-- asdasd.txt
|   |   |   |-- authConfig.ts
|   |   |   |-- bootstrap.tsx
|   |   |   |-- index.ts
|   |   |   |-- package.json
|   |   |   |-- portalRegistry.ts
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
|   |   |   |   |   |-- EmptyState.tsx
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
|   |-- logs.md
|   |-- package-lock.json
|   |-- package.json
|   |-- repair-npm.sh
|   |-- scaffold_features.ps1
|   |-- tests
|   |   |-- EndToEnd
|   |   |   |-- admin-portal
|   |   |   |   |-- AcademicConfiguration.e2e.spec.ts
|   |   |   |   |-- AdmissionsProcessing.e2e.spec.ts
|   |   |   |   |-- AssetRegistry.e2e.spec.ts
|   |   |   |   |-- AuditCompliance.e2e.spec.ts
|   |   |   |   |-- CanteenOrders.e2e.spec.ts
|   |   |   |   |-- Dashboard.e2e.spec.ts
|   |   |   |   |-- EmployeeManagement.e2e.spec.ts
|   |   |   |   |-- FacilityBooking.e2e.spec.ts
|   |   |   |   |-- FleetManagement.e2e.spec.ts
|   |   |   |   |-- IdentitySecurity.e2e.spec.ts
|   |   |   |   |-- IntegrationManagement.e2e.spec.ts
|   |   |   |   |-- OrganizationManagement.e2e.spec.ts
|   |   |   |   |-- PlatformMonitoring.e2e.spec.ts
|   |   |   |   |-- PurchaseOrders.e2e.spec.ts
|   |   |   |   |-- RegistrarWorkspace.e2e.spec.ts
|   |   |   |   |-- Reports.e2e.spec.ts
|   |   |   |   |-- RoleAdministration.e2e.spec.ts
|   |   |   |   |-- StockManagement.e2e.spec.ts
|   |   |   |   |-- SystemAdministration.e2e.spec.ts
|   |   |   |   |-- UserAdministration.e2e.spec.ts
|   |   |   |   `-- WorkflowManagement.e2e.spec.ts
|   |   |   |-- admissions-portal
|   |   |   |   |-- AdmissionCases.e2e.spec.ts
|   |   |   |   |-- AdmissionsDecision.e2e.spec.ts
|   |   |   |   |-- AdmissionsProcessing.e2e.spec.ts
|   |   |   |   |-- Applications.e2e.spec.ts
|   |   |   |   |-- Communication.e2e.spec.ts
|   |   |   |   |-- Dashboard.e2e.spec.ts
|   |   |   |   |-- EnrollmentHandoff.e2e.spec.ts
|   |   |   |   |-- Examination.e2e.spec.ts
|   |   |   |   |-- Fees.e2e.spec.ts
|   |   |   |   |-- Intake.e2e.spec.ts
|   |   |   |   |-- Interviews.e2e.spec.ts
|   |   |   |   |-- Queue.e2e.spec.ts
|   |   |   |   |-- Reports.e2e.spec.ts
|   |   |   |   |-- RequirementManagement.e2e.spec.ts
|   |   |   |   |-- Review.e2e.spec.ts
|   |   |   |   `-- Verification.e2e.spec.ts
|   |   |   |-- applicant-portal
|   |   |   |   |-- AdmissionStatus.e2e.spec.ts
|   |   |   |   |-- ApplicationForm.e2e.spec.ts
|   |   |   |   |-- ApplicationStatus.e2e.spec.ts
|   |   |   |   |-- ApplicationTimeline.e2e.spec.ts
|   |   |   |   |-- ApplicationWizard.e2e.spec.ts
|   |   |   |   |-- Dashboard.e2e.spec.ts
|   |   |   |   |-- DocumentSubmission.e2e.spec.ts
|   |   |   |   |-- DocumentUpload.e2e.spec.ts
|   |   |   |   |-- EligibilityChecker.e2e.spec.ts
|   |   |   |   |-- EnrollmentPayment.e2e.spec.ts
|   |   |   |   |-- InterviewScheduling.e2e.spec.ts
|   |   |   |   |-- Offers.e2e.spec.ts
|   |   |   |   `-- ProgramExplorer.e2e.spec.ts
|   |   |   |-- faculty-portal
|   |   |   |   |-- Advising.e2e.spec.ts
|   |   |   |   |-- Analytics.e2e.spec.ts
|   |   |   |   |-- Assessments.e2e.spec.ts
|   |   |   |   |-- ChairpersonWorkspace.e2e.spec.ts
|   |   |   |   |-- Communication.e2e.spec.ts
|   |   |   |   |-- Dashboard.e2e.spec.ts
|   |   |   |   |-- DeanWorkspace.e2e.spec.ts
|   |   |   |   |-- Documents.e2e.spec.ts
|   |   |   |   |-- FacultySecurity.e2e.spec.ts
|   |   |   |   |-- LMSManager.e2e.spec.ts
|   |   |   |   |-- Research.e2e.spec.ts
|   |   |   |   |-- Schedule.e2e.spec.ts
|   |   |   |   |-- SecretaryWorkspace.e2e.spec.ts
|   |   |   |   |-- Settings.e2e.spec.ts
|   |   |   |   |-- Students.e2e.spec.ts
|   |   |   |   `-- Teaching.e2e.spec.ts
|   |   |   |-- finance-console
|   |   |   |   |-- Budgeting.e2e.spec.ts
|   |   |   |   |-- Cashier.e2e.spec.ts
|   |   |   |   |-- Dashboard.e2e.spec.ts
|   |   |   |   |-- FinancialReports.e2e.spec.ts
|   |   |   |   |-- Invoicing.e2e.spec.ts
|   |   |   |   |-- PaymentGateway.e2e.spec.ts
|   |   |   |   |-- Payroll.e2e.spec.ts
|   |   |   |   |-- PayrollProcessing.e2e.spec.ts
|   |   |   |   |-- SemesterBilling.e2e.spec.ts
|   |   |   |   |-- StudentBilling.e2e.spec.ts
|   |   |   |   `-- TuitionAssessment.e2e.spec.ts
|   |   |   |-- governance-console
|   |   |   |   |-- Accreditation.e2e.spec.ts
|   |   |   |   |-- Audits.e2e.spec.ts
|   |   |   |   |-- Committees.e2e.spec.ts
|   |   |   |   |-- Compliance.e2e.spec.ts
|   |   |   |   |-- Events.e2e.spec.ts
|   |   |   |   |-- Grievances.e2e.spec.ts
|   |   |   |   |-- Helpdesk.e2e.spec.ts
|   |   |   |   |-- Policies.e2e.spec.ts
|   |   |   |   |-- QualityAccreditation.e2e.spec.ts
|   |   |   |   |-- RiskManagement.e2e.spec.ts
|   |   |   |   `-- Visitors.e2e.spec.ts
|   |   |   |-- identity-portal
|   |   |   |   |-- Email.e2e.spec.ts
|   |   |   |   |-- MFA.e2e.spec.ts
|   |   |   |   |-- MfaVerification.e2e.spec.ts
|   |   |   |   |-- MultiFactorAuth.e2e.spec.ts
|   |   |   |   |-- PasswordRecovery.e2e.spec.ts
|   |   |   |   |-- PasswordReset.e2e.spec.ts
|   |   |   |   |-- SecuritySettings.e2e.spec.ts
|   |   |   |   |-- SessionManagement.e2e.spec.ts
|   |   |   |   |-- UniversityAccount.e2e.spec.ts
|   |   |   |   |-- UserLogin.e2e.spec.ts
|   |   |   |   `-- UserRegistration.e2e.spec.ts
|   |   |   |-- library-portal
|   |   |   |   |-- CatalogSearch.e2e.spec.ts
|   |   |   |   |-- Circulation.e2e.spec.ts
|   |   |   |   |-- DigitalResources.e2e.spec.ts
|   |   |   |   |-- Fines.e2e.spec.ts
|   |   |   |   |-- MyLoans.e2e.spec.ts
|   |   |   |   `-- Reservations.e2e.spec.ts
|   |   |   |-- lighthouse-budgets.json
|   |   |   |-- lms-web
|   |   |   |   |-- Assignments.e2e.spec.ts
|   |   |   |   |-- Calendar.e2e.spec.ts
|   |   |   |   |-- CourseAdministration.e2e.spec.ts
|   |   |   |   |-- CourseContent.e2e.spec.ts
|   |   |   |   |-- Dashboard.e2e.spec.ts
|   |   |   |   |-- Discussions.e2e.spec.ts
|   |   |   |   |-- GradebookOrchestration.e2e.spec.ts
|   |   |   |   |-- Grades.e2e.spec.ts
|   |   |   |   |-- ModuleTimeline.e2e.spec.ts
|   |   |   |   |-- OfflineSubmissionReview.e2e.spec.ts
|   |   |   |   `-- Quizzes.e2e.spec.ts
|   |   |   |-- platform-console
|   |   |   |   |-- APIKeys.e2e.spec.ts
|   |   |   |   |-- AnalyticsBI.e2e.spec.ts
|   |   |   |   |-- CRM.e2e.spec.ts
|   |   |   |   |-- Communication.e2e.spec.ts
|   |   |   |   |-- DatabaseManagement.e2e.spec.ts
|   |   |   |   |-- DocumentManagement.e2e.spec.ts
|   |   |   |   |-- GlobalSettings.e2e.spec.ts
|   |   |   |   |-- MultiCampus.e2e.spec.ts
|   |   |   |   |-- Notification.e2e.spec.ts
|   |   |   |   |-- SecurityAudits.e2e.spec.ts
|   |   |   |   |-- SystemLogs.e2e.spec.ts
|   |   |   |   `-- TenantManagement.e2e.spec.ts
|   |   |   |-- registrar-portal
|   |   |   |   |-- AcademicComplianceDivision.e2e.spec.ts
|   |   |   |   |-- AcademicRecordsDivision.e2e.spec.ts
|   |   |   |   |-- AcademicSchedulingDivision.e2e.spec.ts
|   |   |   |   |-- Admissions.e2e.spec.ts
|   |   |   |   |-- AdmissionsDivision.e2e.spec.ts
|   |   |   |   |-- CertificationDivision.e2e.spec.ts
|   |   |   |   |-- CrossEnrollmentDivision.e2e.spec.ts
|   |   |   |   |-- CurriculumDivision.e2e.spec.ts
|   |   |   |   |-- EnrollmentDivision.e2e.spec.ts
|   |   |   |   |-- GraduationDivision.e2e.spec.ts
|   |   |   |   |-- RegistrarDashboard.e2e.spec.ts
|   |   |   |   |-- RegistrarSecurity.e2e.spec.ts
|   |   |   |   |-- StudentRegistryDivision.e2e.spec.ts
|   |   |   |   |-- StudentServicesDivision.e2e.spec.ts
|   |   |   |   `-- TransferDivision.e2e.spec.ts
|   |   |   `-- student-portal
|   |   |       |-- AcademicRecord.e2e.spec.ts
|   |   |       |-- AlumniNetwork.e2e.spec.ts
|   |   |       |-- CareerDashboard.e2e.spec.ts
|   |   |       |-- Clearance.e2e.spec.ts
|   |   |       |-- CrossEnrollment.e2e.spec.ts
|   |   |       |-- CurriculumProgress.e2e.spec.ts
|   |   |       |-- Dashboard.e2e.spec.ts
|   |   |       |-- Enrollment.e2e.spec.ts
|   |   |       |-- EnrollmentHistory.e2e.spec.ts
|   |   |       |-- Extracurriculars.e2e.spec.ts
|   |   |       |-- Financials.e2e.spec.ts
|   |   |       |-- Graduation.e2e.spec.ts
|   |   |       |-- GuidanceSessions.e2e.spec.ts
|   |   |       |-- HealthRecords.e2e.spec.ts
|   |   |       |-- HostelAllocation.e2e.spec.ts
|   |   |       |-- LearningManagement.e2e.spec.ts
|   |   |       |-- MyEnrollments.e2e.spec.ts
|   |   |       |-- Registration.e2e.spec.ts
|   |   |       |-- Schedule.e2e.spec.ts
|   |   |       |-- StudentProfile.e2e.spec.ts
|   |   |       `-- Timetable.e2e.spec.ts
|   |   |-- Integration
|   |   |   |-- admin-portal
|   |   |   |   |-- AcademicConfiguration.integration.test.tsx
|   |   |   |   |-- AdmissionsProcessing.integration.test.tsx
|   |   |   |   |-- AssetRegistry.integration.test.tsx
|   |   |   |   |-- AuditCompliance.integration.test.tsx
|   |   |   |   |-- CanteenOrders.integration.test.tsx
|   |   |   |   |-- Dashboard.integration.test.tsx
|   |   |   |   |-- EmployeeManagement.integration.test.tsx
|   |   |   |   |-- FacilityBooking.integration.test.tsx
|   |   |   |   |-- FleetManagement.integration.test.tsx
|   |   |   |   |-- IdentitySecurity.integration.test.tsx
|   |   |   |   |-- IntegrationManagement.integration.test.tsx
|   |   |   |   |-- OrganizationManagement.integration.test.tsx
|   |   |   |   |-- PlatformMonitoring.integration.test.tsx
|   |   |   |   |-- PurchaseOrders.integration.test.tsx
|   |   |   |   |-- RegistrarWorkspace.integration.test.tsx
|   |   |   |   |-- Reports.integration.test.tsx
|   |   |   |   |-- RoleAdministration.integration.test.tsx
|   |   |   |   |-- StockManagement.integration.test.tsx
|   |   |   |   |-- SystemAdministration.integration.test.tsx
|   |   |   |   |-- UserAdministration.integration.test.tsx
|   |   |   |   `-- WorkflowManagement.integration.test.tsx
|   |   |   |-- admissions-portal
|   |   |   |   |-- AdmissionCases.integration.test.tsx
|   |   |   |   |-- AdmissionsDecision.integration.test.tsx
|   |   |   |   |-- AdmissionsProcessing.integration.test.tsx
|   |   |   |   |-- Applications.integration.test.tsx
|   |   |   |   |-- Communication.integration.test.tsx
|   |   |   |   |-- Dashboard.integration.test.tsx
|   |   |   |   |-- EnrollmentHandoff.integration.test.tsx
|   |   |   |   |-- Examination.integration.test.tsx
|   |   |   |   |-- Fees.integration.test.tsx
|   |   |   |   |-- Intake.integration.test.tsx
|   |   |   |   |-- Interviews.integration.test.tsx
|   |   |   |   |-- Queue.integration.test.tsx
|   |   |   |   |-- Reports.integration.test.tsx
|   |   |   |   |-- RequirementManagement.integration.test.tsx
|   |   |   |   |-- Review.integration.test.tsx
|   |   |   |   `-- Verification.integration.test.tsx
|   |   |   |-- applicant-portal
|   |   |   |   |-- AdmissionStatus.integration.test.tsx
|   |   |   |   |-- ApplicantJourney.integration.test.tsx
|   |   |   |   |-- ApplicationForm.integration.test.tsx
|   |   |   |   |-- ApplicationStatus.integration.test.tsx
|   |   |   |   |-- ApplicationTimeline.integration.test.tsx
|   |   |   |   |-- ApplicationWizard
|   |   |   |   |   `-- ApplicationWizard.integration.test.tsx
|   |   |   |   |-- ApplicationWizard.integration.test.tsx
|   |   |   |   |-- Dashboard.integration.test.tsx
|   |   |   |   |-- DocumentSubmission.integration.test.tsx
|   |   |   |   |-- DocumentUpload.integration.test.tsx
|   |   |   |   |-- EligibilityChecker.integration.test.tsx
|   |   |   |   |-- EnrollmentPayment
|   |   |   |   |   `-- EnrollmentPayment.integration.test.tsx
|   |   |   |   |-- EnrollmentPayment.integration.test.tsx
|   |   |   |   |-- InterviewScheduling.integration.test.tsx
|   |   |   |   |-- Offers.integration.test.tsx
|   |   |   |   `-- ProgramExplorer.integration.test.tsx
|   |   |   |-- faculty-portal
|   |   |   |   |-- Advising
|   |   |   |   |   `-- Advising.integration.test.tsx
|   |   |   |   |-- Advising.integration.test.tsx
|   |   |   |   |-- Analytics.integration.test.tsx
|   |   |   |   |-- Assessments.integration.test.tsx
|   |   |   |   |-- ChairpersonWorkspace.integration.test.tsx
|   |   |   |   |-- Communication.integration.test.tsx
|   |   |   |   |-- Dashboard.integration.test.tsx
|   |   |   |   |-- DeanWorkspace.integration.test.tsx
|   |   |   |   |-- Documents.integration.test.tsx
|   |   |   |   |-- FacultySecurity.integration.test.tsx
|   |   |   |   |-- LMSManager.integration.test.tsx
|   |   |   |   |-- Research.integration.test.tsx
|   |   |   |   |-- Schedule.integration.test.tsx
|   |   |   |   |-- SecretaryWorkspace.integration.test.tsx
|   |   |   |   |-- Settings.integration.test.tsx
|   |   |   |   |-- Students.integration.test.tsx
|   |   |   |   `-- Teaching.integration.test.tsx
|   |   |   |-- finance-console
|   |   |   |   |-- Budgeting.integration.test.tsx
|   |   |   |   |-- Cashier
|   |   |   |   |   `-- PaymentGateway.integration.test.tsx
|   |   |   |   |-- Cashier.integration.test.tsx
|   |   |   |   |-- Dashboard.integration.test.tsx
|   |   |   |   |-- FinancialReports.integration.test.tsx
|   |   |   |   |-- Invoicing.integration.test.tsx
|   |   |   |   |-- PaymentGateway.integration.test.tsx
|   |   |   |   |-- Payroll.integration.test.tsx
|   |   |   |   |-- PayrollProcessing.integration.test.tsx
|   |   |   |   |-- SemesterBilling.integration.test.tsx
|   |   |   |   |-- StudentBilling.integration.test.tsx
|   |   |   |   `-- TuitionAssessment.integration.test.tsx
|   |   |   |-- governance-console
|   |   |   |   |-- Accreditation.integration.test.tsx
|   |   |   |   |-- Audits.integration.test.tsx
|   |   |   |   |-- Committees.integration.test.tsx
|   |   |   |   |-- Compliance.integration.test.tsx
|   |   |   |   |-- Events.integration.test.tsx
|   |   |   |   |-- Grievances.integration.test.tsx
|   |   |   |   |-- Helpdesk.integration.test.tsx
|   |   |   |   |-- Policies.integration.test.tsx
|   |   |   |   |-- QualityAccreditation.integration.test.tsx
|   |   |   |   |-- RiskManagement.integration.test.tsx
|   |   |   |   `-- Visitors.integration.test.tsx
|   |   |   |-- identity-portal
|   |   |   |   |-- Email.integration.test.tsx
|   |   |   |   |-- MFA.integration.test.tsx
|   |   |   |   |-- MfaVerification.integration.test.tsx
|   |   |   |   |-- MultiFactorAuth.integration.test.tsx
|   |   |   |   |-- PasswordRecovery.integration.test.tsx
|   |   |   |   |-- PasswordReset.integration.test.tsx
|   |   |   |   |-- SecuritySettings.integration.test.tsx
|   |   |   |   |-- SessionManagement.integration.test.tsx
|   |   |   |   |-- UniversityAccount.integration.test.tsx
|   |   |   |   |-- UserLogin.integration.test.tsx
|   |   |   |   `-- UserRegistration.integration.test.tsx
|   |   |   |-- library-portal
|   |   |   |   |-- CatalogSearch.integration.test.tsx
|   |   |   |   |-- Circulation.integration.test.tsx
|   |   |   |   |-- DigitalResources.integration.test.tsx
|   |   |   |   |-- Fines.integration.test.tsx
|   |   |   |   |-- MyLoans.integration.test.tsx
|   |   |   |   `-- Reservations.integration.test.tsx
|   |   |   |-- libs
|   |   |   |   |-- api-clients
|   |   |   |   |   |-- admissionsApi.integration.test.tsx
|   |   |   |   |   |-- advisingApi.integration.test.tsx
|   |   |   |   |   |-- alumniApi.integration.test.tsx
|   |   |   |   |   |-- analyticsApi.integration.test.tsx
|   |   |   |   |   |-- apiClient.integration.test.tsx
|   |   |   |   |   |-- assessmentApi.integration.test.tsx
|   |   |   |   |   |-- assetManagementApi.integration.test.tsx
|   |   |   |   |   |-- canteenApi.integration.test.tsx
|   |   |   |   |   |-- careerApi.integration.test.tsx
|   |   |   |   |   |-- communicationApi.integration.test.tsx
|   |   |   |   |   |-- documentsApi.integration.test.tsx
|   |   |   |   |   |-- examinationResultApi.integration.test.tsx
|   |   |   |   |   |-- facilitiesApi.integration.test.tsx
|   |   |   |   |   |-- facilitiesAvailabilityApi.integration.test.tsx
|   |   |   |   |   |-- facultyAdmissionsApi.integration.test.tsx
|   |   |   |   |   |-- facultySettingsApi.integration.test.tsx
|   |   |   |   |   |-- facultyStudentsApi.integration.test.tsx
|   |   |   |   |   |-- financeApi.integration.test.tsx
|   |   |   |   |   |-- financeBillingApi.integration.test.tsx
|   |   |   |   |   |-- governanceApi.integration.test.tsx
|   |   |   |   |   |-- guidanceApi.integration.test.tsx
|   |   |   |   |   |-- healthCenterApi.integration.test.tsx
|   |   |   |   |   |-- hostelApi.integration.test.tsx
|   |   |   |   |   |-- hrApi.integration.test.tsx
|   |   |   |   |   |-- identityAccessAuthorizationApi.integration.test.tsx
|   |   |   |   |   |-- identityApi.integration.test.tsx
|   |   |   |   |   |-- interviewsApi.integration.test.tsx
|   |   |   |   |   |-- inventoryApi.integration.test.tsx
|   |   |   |   |   |-- libraryCatalogApi.integration.test.tsx
|   |   |   |   |   |-- lmsApi.integration.test.tsx
|   |   |   |   |   |-- procurementApi.integration.test.tsx
|   |   |   |   |   |-- registrarApi.integration.test.tsx
|   |   |   |   |   |-- registrarCurriculumApi.integration.test.tsx
|   |   |   |   |   |-- researchApi.integration.test.tsx
|   |   |   |   |   |-- scheduleApi.integration.test.tsx
|   |   |   |   |   |-- studentInformationApi.integration.test.tsx
|   |   |   |   |   |-- studentInformationReadModel.integration.test.tsx
|   |   |   |   |   |-- teachingApi.integration.test.tsx
|   |   |   |   |   `-- transportApi.integration.test.tsx
|   |   |   |   |-- auth-sdk
|   |   |   |   |   |-- FacultyGuard.integration.test.tsx
|   |   |   |   |   |-- FinanceGuard.integration.test.tsx
|   |   |   |   |   |-- IdentityGuard.integration.test.tsx
|   |   |   |   |   |-- LMSGuard.integration.test.tsx
|   |   |   |   |   `-- RegistrarGuard.integration.test.tsx
|   |   |   |   |-- domain-viewmodels
|   |   |   |   |   |-- AdministrationViewModels.integration.test.tsx
|   |   |   |   |   |-- CampusLifeViewModels.integration.test.tsx
|   |   |   |   |   |-- FinanceViewModels.integration.test.tsx
|   |   |   |   |   |-- GovernanceViewModels.integration.test.tsx
|   |   |   |   |   |-- GrievanceCaseViewModel.integration.test.tsx
|   |   |   |   |   |-- IdentityViewModels.integration.test.tsx
|   |   |   |   |   |-- InvoiceSummaryViewModel.integration.test.tsx
|   |   |   |   |   |-- LibraryViewModels.integration.test.tsx
|   |   |   |   |   |-- StudentLifecycleViewModels.integration.test.tsx
|   |   |   |   |   `-- StudentProfileViewModel.integration.test.tsx
|   |   |   |   |-- offline-sync
|   |   |   |   |   `-- syncEngineContracts.integration.test.tsx
|   |   |   |   |-- shell-kit
|   |   |   |   |   |-- AuthGuard.integration.test.tsx
|   |   |   |   |   |-- authConfig.integration.test.tsx
|   |   |   |   |   |-- bootstrap.integration.test.tsx
|   |   |   |   |   |-- portalRegistry.integration.test.tsx
|   |   |   |   |   `-- queryClient.integration.test.tsx
|   |   |   |   |-- ui-kit
|   |   |   |   |   |-- Badge.integration.test.tsx
|   |   |   |   |   |-- Button.integration.test.tsx
|   |   |   |   |   |-- Card.integration.test.tsx
|   |   |   |   |   |-- DocumentPreviewModal.integration.test.tsx
|   |   |   |   |   |-- EmptyState.integration.test.tsx
|   |   |   |   |   |-- FormInput.integration.test.tsx
|   |   |   |   |   |-- Modal.integration.test.tsx
|   |   |   |   |   |-- PageHeader.integration.test.tsx
|   |   |   |   |   `-- Table.integration.test.tsx
|   |   |   |   `-- workflow-sdk
|   |   |   |       |-- AcademicRecordWorkflow.integration.test.tsx
|   |   |   |       |-- AdmissionWorkflow.integration.test.tsx
|   |   |   |       |-- AuditWorkflow.integration.test.tsx
|   |   |   |       |-- CertificationWorkflow.integration.test.tsx
|   |   |   |       |-- EnrollmentWorkflow.integration.test.tsx
|   |   |   |       |-- FinanceWorkflow.integration.test.tsx
|   |   |   |       |-- GraduationWorkflow.integration.test.tsx
|   |   |   |       |-- IdentityWorkflow.integration.test.tsx
|   |   |   |       |-- LMSWorkflow.integration.test.tsx
|   |   |   |       |-- LibraryWorkflow.integration.test.tsx
|   |   |   |       |-- NotificationWorkflow.integration.test.tsx
|   |   |   |       `-- StudentLifecycleWorkflow.integration.test.tsx
|   |   |   |-- lms-web
|   |   |   |   |-- Assignments.integration.test.tsx
|   |   |   |   |-- Calendar.integration.test.tsx
|   |   |   |   |-- CourseAdministration.integration.test.tsx
|   |   |   |   |-- CourseContent.integration.test.tsx
|   |   |   |   |-- Dashboard.integration.test.tsx
|   |   |   |   |-- Discussions.integration.test.tsx
|   |   |   |   |-- GradebookOrchestration.integration.test.tsx
|   |   |   |   |-- Grades.integration.test.tsx
|   |   |   |   |-- ModuleTimeline.integration.test.tsx
|   |   |   |   |-- OfflineSubmissionReview.integration.test.tsx
|   |   |   |   `-- Quizzes.integration.test.tsx
|   |   |   |-- platform-console
|   |   |   |   |-- APIKeys.integration.test.tsx
|   |   |   |   |-- AnalyticsBI.integration.test.tsx
|   |   |   |   |-- CRM.integration.test.tsx
|   |   |   |   |-- Communication.integration.test.tsx
|   |   |   |   |-- DatabaseManagement.integration.test.tsx
|   |   |   |   |-- DocumentManagement.integration.test.tsx
|   |   |   |   |-- GlobalSettings.integration.test.tsx
|   |   |   |   |-- MultiCampus.integration.test.tsx
|   |   |   |   |-- Notification.integration.test.tsx
|   |   |   |   |-- SecurityAudits.integration.test.tsx
|   |   |   |   |-- SystemLogs.integration.test.tsx
|   |   |   |   `-- TenantManagement.integration.test.tsx
|   |   |   |-- registrar-portal
|   |   |   |   |-- AcademicComplianceDivision.integration.test.tsx
|   |   |   |   |-- AcademicRecordsDivision.integration.test.tsx
|   |   |   |   |-- AcademicSchedulingDivision.integration.test.tsx
|   |   |   |   |-- Admissions
|   |   |   |   |   `-- EnrollmentActivation.integration.test.tsx
|   |   |   |   |-- Admissions.integration.test.tsx
|   |   |   |   |-- AdmissionsDivision.integration.test.tsx
|   |   |   |   |-- CertificationDivision.integration.test.tsx
|   |   |   |   |-- CrossEnrollmentDivision.integration.test.tsx
|   |   |   |   |-- CurriculumDivision.integration.test.tsx
|   |   |   |   |-- EnrollmentDivision.integration.test.tsx
|   |   |   |   |-- GraduationDivision.integration.test.tsx
|   |   |   |   |-- RegistrarDashboard.integration.test.tsx
|   |   |   |   |-- RegistrarIntegration.integration.test.tsx
|   |   |   |   |-- RegistrarSecurity.integration.test.tsx
|   |   |   |   |-- StudentRegistryDivision.integration.test.tsx
|   |   |   |   |-- StudentServicesDivision.integration.test.tsx
|   |   |   |   `-- TransferDivision.integration.test.tsx
|   |   |   `-- student-portal
|   |   |       |-- AcademicRecord.integration.test.tsx
|   |   |       |-- AlumniNetwork.integration.test.tsx
|   |   |       |-- CareerDashboard.integration.test.tsx
|   |   |       |-- Clearance.integration.test.tsx
|   |   |       |-- CrossEnrollment.integration.test.tsx
|   |   |       |-- CurriculumProgress.integration.test.tsx
|   |   |       |-- Dashboard.integration.test.tsx
|   |   |       |-- Enrollment.integration.test.tsx
|   |   |       |-- EnrollmentHistory.integration.test.tsx
|   |   |       |-- Extracurriculars.integration.test.tsx
|   |   |       |-- Financials.integration.test.tsx
|   |   |       |-- Graduation.integration.test.tsx
|   |   |       |-- GuidanceSessions.integration.test.tsx
|   |   |       |-- HealthRecords.integration.test.tsx
|   |   |       |-- HostelAllocation.integration.test.tsx
|   |   |       |-- LearningManagement.integration.test.tsx
|   |   |       |-- MyEnrollments.integration.test.tsx
|   |   |       |-- Registration.integration.test.tsx
|   |   |       |-- Schedule.integration.test.tsx
|   |   |       |-- StudentProfile.integration.test.tsx
|   |   |       `-- Timetable.integration.test.tsx
|   |   |-- PathTesting
|   |   |   |-- admin-portal
|   |   |   |   |-- AcademicConfiguration.path.test.tsx
|   |   |   |   |-- AdmissionsProcessing.path.test.tsx
|   |   |   |   |-- AssetRegistry.path.test.tsx
|   |   |   |   |-- AuditCompliance.path.test.tsx
|   |   |   |   |-- CanteenOrders.path.test.tsx
|   |   |   |   |-- Dashboard.path.test.tsx
|   |   |   |   |-- EmployeeManagement.path.test.tsx
|   |   |   |   |-- FacilityBooking.path.test.tsx
|   |   |   |   |-- FleetManagement.path.test.tsx
|   |   |   |   |-- IdentitySecurity.path.test.tsx
|   |   |   |   |-- IntegrationManagement.path.test.tsx
|   |   |   |   |-- OrganizationManagement.path.test.tsx
|   |   |   |   |-- PlatformMonitoring.path.test.tsx
|   |   |   |   |-- PurchaseOrders.path.test.tsx
|   |   |   |   |-- RegistrarWorkspace.path.test.tsx
|   |   |   |   |-- Reports.path.test.tsx
|   |   |   |   |-- RoleAdministration.path.test.tsx
|   |   |   |   |-- StockManagement.path.test.tsx
|   |   |   |   |-- SystemAdministration.path.test.tsx
|   |   |   |   |-- UserAdministration.path.test.tsx
|   |   |   |   `-- WorkflowManagement.path.test.tsx
|   |   |   |-- admissions-portal
|   |   |   |   |-- AdmissionCases.path.test.tsx
|   |   |   |   |-- AdmissionsDecision.path.test.tsx
|   |   |   |   |-- AdmissionsProcessing.path.test.tsx
|   |   |   |   |-- Applications.path.test.tsx
|   |   |   |   |-- Communication.path.test.tsx
|   |   |   |   |-- Dashboard.path.test.tsx
|   |   |   |   |-- EnrollmentHandoff.path.test.tsx
|   |   |   |   |-- Examination.path.test.tsx
|   |   |   |   |-- Fees.path.test.tsx
|   |   |   |   |-- Intake.path.test.tsx
|   |   |   |   |-- Interviews.path.test.tsx
|   |   |   |   |-- Queue.path.test.tsx
|   |   |   |   |-- Reports.path.test.tsx
|   |   |   |   |-- RequirementManagement.path.test.tsx
|   |   |   |   |-- Review.path.test.tsx
|   |   |   |   `-- Verification.path.test.tsx
|   |   |   |-- applicant-portal
|   |   |   |   |-- AdmissionStatus.path.test.tsx
|   |   |   |   |-- ApplicationForm.path.test.tsx
|   |   |   |   |-- ApplicationStatus.path.test.tsx
|   |   |   |   |-- ApplicationTimeline.path.test.tsx
|   |   |   |   |-- ApplicationWizard.path.test.tsx
|   |   |   |   |-- Dashboard.path.test.tsx
|   |   |   |   |-- DocumentSubmission.path.test.tsx
|   |   |   |   |-- DocumentUpload.path.test.tsx
|   |   |   |   |-- EligibilityChecker.path.test.tsx
|   |   |   |   |-- EnrollmentPayment.path.test.tsx
|   |   |   |   |-- InterviewScheduling.path.test.tsx
|   |   |   |   |-- Offers.path.test.tsx
|   |   |   |   `-- ProgramExplorer.path.test.tsx
|   |   |   |-- faculty-portal
|   |   |   |   |-- Advising.path.test.tsx
|   |   |   |   |-- Analytics.path.test.tsx
|   |   |   |   |-- Assessments.path.test.tsx
|   |   |   |   |-- ChairpersonWorkspace.path.test.tsx
|   |   |   |   |-- Communication.path.test.tsx
|   |   |   |   |-- Dashboard.path.test.tsx
|   |   |   |   |-- DeanWorkspace.path.test.tsx
|   |   |   |   |-- Documents.path.test.tsx
|   |   |   |   |-- FacultySecurity.path.test.tsx
|   |   |   |   |-- LMSManager.path.test.tsx
|   |   |   |   |-- Research.path.test.tsx
|   |   |   |   |-- Schedule.path.test.tsx
|   |   |   |   |-- SecretaryWorkspace.path.test.tsx
|   |   |   |   |-- Settings.path.test.tsx
|   |   |   |   |-- Students.path.test.tsx
|   |   |   |   `-- Teaching.path.test.tsx
|   |   |   |-- finance-console
|   |   |   |   |-- Budgeting.path.test.tsx
|   |   |   |   |-- Cashier.path.test.tsx
|   |   |   |   |-- Dashboard.path.test.tsx
|   |   |   |   |-- FinancialReports.path.test.tsx
|   |   |   |   |-- Invoicing.path.test.tsx
|   |   |   |   |-- PaymentGateway.path.test.tsx
|   |   |   |   |-- Payroll.path.test.tsx
|   |   |   |   |-- PayrollProcessing.path.test.tsx
|   |   |   |   |-- SemesterBilling.path.test.tsx
|   |   |   |   |-- StudentBilling.path.test.tsx
|   |   |   |   `-- TuitionAssessment.path.test.tsx
|   |   |   |-- governance-console
|   |   |   |   |-- Accreditation.path.test.tsx
|   |   |   |   |-- Audits.path.test.tsx
|   |   |   |   |-- Committees.path.test.tsx
|   |   |   |   |-- Compliance.path.test.tsx
|   |   |   |   |-- Events.path.test.tsx
|   |   |   |   |-- Grievances.path.test.tsx
|   |   |   |   |-- Helpdesk.path.test.tsx
|   |   |   |   |-- Policies.path.test.tsx
|   |   |   |   |-- QualityAccreditation.path.test.tsx
|   |   |   |   |-- RiskManagement.path.test.tsx
|   |   |   |   `-- Visitors.path.test.tsx
|   |   |   |-- identity-portal
|   |   |   |   |-- Email.path.test.tsx
|   |   |   |   |-- MFA.path.test.tsx
|   |   |   |   |-- MfaVerification.path.test.tsx
|   |   |   |   |-- MultiFactorAuth.path.test.tsx
|   |   |   |   |-- PasswordRecovery.path.test.tsx
|   |   |   |   |-- PasswordReset.path.test.tsx
|   |   |   |   |-- SecuritySettings.path.test.tsx
|   |   |   |   |-- SessionManagement.path.test.tsx
|   |   |   |   |-- UniversityAccount.path.test.tsx
|   |   |   |   |-- UserLogin.path.test.tsx
|   |   |   |   `-- UserRegistration.path.test.tsx
|   |   |   |-- library-portal
|   |   |   |   |-- CatalogSearch.path.test.tsx
|   |   |   |   |-- Circulation.path.test.tsx
|   |   |   |   |-- DigitalResources.path.test.tsx
|   |   |   |   |-- Fines.path.test.tsx
|   |   |   |   |-- MyLoans.path.test.tsx
|   |   |   |   `-- Reservations.path.test.tsx
|   |   |   |-- lms-web
|   |   |   |   |-- Assignments.path.test.tsx
|   |   |   |   |-- Calendar.path.test.tsx
|   |   |   |   |-- CourseAdministration.path.test.tsx
|   |   |   |   |-- CourseContent.path.test.tsx
|   |   |   |   |-- Dashboard.path.test.tsx
|   |   |   |   |-- Discussions.path.test.tsx
|   |   |   |   |-- GradebookOrchestration.path.test.tsx
|   |   |   |   |-- Grades.path.test.tsx
|   |   |   |   |-- ModuleTimeline.path.test.tsx
|   |   |   |   |-- OfflineSubmissionReview.path.test.tsx
|   |   |   |   `-- Quizzes.path.test.tsx
|   |   |   |-- platform-console
|   |   |   |   |-- APIKeys.path.test.tsx
|   |   |   |   |-- AnalyticsBI.path.test.tsx
|   |   |   |   |-- CRM.path.test.tsx
|   |   |   |   |-- Communication.path.test.tsx
|   |   |   |   |-- DatabaseManagement.path.test.tsx
|   |   |   |   |-- DocumentManagement.path.test.tsx
|   |   |   |   |-- GlobalSettings.path.test.tsx
|   |   |   |   |-- MultiCampus.path.test.tsx
|   |   |   |   |-- Notification.path.test.tsx
|   |   |   |   |-- SecurityAudits.path.test.tsx
|   |   |   |   |-- SystemLogs.path.test.tsx
|   |   |   |   `-- TenantManagement.path.test.tsx
|   |   |   |-- registrar-portal
|   |   |   |   |-- AcademicComplianceDivision.path.test.tsx
|   |   |   |   |-- AcademicRecordsDivision.path.test.tsx
|   |   |   |   |-- AcademicSchedulingDivision.path.test.tsx
|   |   |   |   |-- Admissions.path.test.tsx
|   |   |   |   |-- AdmissionsDivision.path.test.tsx
|   |   |   |   |-- CertificationDivision.path.test.tsx
|   |   |   |   |-- CrossEnrollmentDivision.path.test.tsx
|   |   |   |   |-- CurriculumDivision.path.test.tsx
|   |   |   |   |-- EnrollmentDivision.path.test.tsx
|   |   |   |   |-- GraduationDivision.path.test.tsx
|   |   |   |   |-- RegistrarDashboard.path.test.tsx
|   |   |   |   |-- RegistrarSecurity.path.test.tsx
|   |   |   |   |-- StudentRegistryDivision.path.test.tsx
|   |   |   |   |-- StudentServicesDivision.path.test.tsx
|   |   |   |   `-- TransferDivision.path.test.tsx
|   |   |   `-- student-portal
|   |   |       |-- AcademicRecord.path.test.tsx
|   |   |       |-- AlumniNetwork.path.test.tsx
|   |   |       |-- CareerDashboard.path.test.tsx
|   |   |       |-- Clearance.path.test.tsx
|   |   |       |-- CrossEnrollment.path.test.tsx
|   |   |       |-- CurriculumProgress.path.test.tsx
|   |   |       |-- Dashboard.path.test.tsx
|   |   |       |-- Enrollment.path.test.tsx
|   |   |       |-- EnrollmentHistory.path.test.tsx
|   |   |       |-- Extracurriculars.path.test.tsx
|   |   |       |-- Financials.path.test.tsx
|   |   |       |-- Graduation.path.test.tsx
|   |   |       |-- GuidanceSessions.path.test.tsx
|   |   |       |-- HealthRecords.path.test.tsx
|   |   |       |-- HostelAllocation.path.test.tsx
|   |   |       |-- LearningManagement.path.test.tsx
|   |   |       |-- MyEnrollments.path.test.tsx
|   |   |       |-- Registration.path.test.tsx
|   |   |       |-- Schedule.path.test.tsx
|   |   |       |-- StudentProfile.path.test.tsx
|   |   |       `-- Timetable.path.test.tsx
|   |   |-- README.md
|   |   |-- Regression
|   |   |   |-- admin-portal
|   |   |   |   |-- AcademicConfiguration.regression.test.tsx
|   |   |   |   |-- AdmissionsProcessing.regression.test.tsx
|   |   |   |   |-- AssetRegistry.regression.test.tsx
|   |   |   |   |-- AuditCompliance.regression.test.tsx
|   |   |   |   |-- CanteenOrders.regression.test.tsx
|   |   |   |   |-- Dashboard.regression.test.tsx
|   |   |   |   |-- EmployeeManagement.regression.test.tsx
|   |   |   |   |-- FacilityBooking.regression.test.tsx
|   |   |   |   |-- FleetManagement.regression.test.tsx
|   |   |   |   |-- IdentitySecurity.regression.test.tsx
|   |   |   |   |-- IntegrationManagement.regression.test.tsx
|   |   |   |   |-- OrganizationManagement.regression.test.tsx
|   |   |   |   |-- PlatformMonitoring.regression.test.tsx
|   |   |   |   |-- PurchaseOrders.regression.test.tsx
|   |   |   |   |-- RegistrarWorkspace.regression.test.tsx
|   |   |   |   |-- Reports.regression.test.tsx
|   |   |   |   |-- RoleAdministration.regression.test.tsx
|   |   |   |   |-- StockManagement.regression.test.tsx
|   |   |   |   |-- SystemAdministration.regression.test.tsx
|   |   |   |   |-- UserAdministration.regression.test.tsx
|   |   |   |   `-- WorkflowManagement.regression.test.tsx
|   |   |   |-- admissions-portal
|   |   |   |   |-- AdmissionCases.regression.test.tsx
|   |   |   |   |-- AdmissionsDecision.regression.test.tsx
|   |   |   |   |-- AdmissionsProcessing.regression.test.tsx
|   |   |   |   |-- Applications.regression.test.tsx
|   |   |   |   |-- Communication.regression.test.tsx
|   |   |   |   |-- Dashboard.regression.test.tsx
|   |   |   |   |-- EnrollmentHandoff.regression.test.tsx
|   |   |   |   |-- Examination.regression.test.tsx
|   |   |   |   |-- Fees.regression.test.tsx
|   |   |   |   |-- Intake.regression.test.tsx
|   |   |   |   |-- Interviews.regression.test.tsx
|   |   |   |   |-- Queue.regression.test.tsx
|   |   |   |   |-- Reports.regression.test.tsx
|   |   |   |   |-- RequirementManagement.regression.test.tsx
|   |   |   |   |-- Review.regression.test.tsx
|   |   |   |   `-- Verification.regression.test.tsx
|   |   |   |-- applicant-portal
|   |   |   |   |-- AdmissionStatus.regression.test.tsx
|   |   |   |   |-- ApplicationForm.regression.test.tsx
|   |   |   |   |-- ApplicationStatus.regression.test.tsx
|   |   |   |   |-- ApplicationTimeline.regression.test.tsx
|   |   |   |   |-- ApplicationWizard.regression.test.tsx
|   |   |   |   |-- Dashboard.regression.test.tsx
|   |   |   |   |-- DocumentSubmission.regression.test.tsx
|   |   |   |   |-- DocumentUpload.regression.test.tsx
|   |   |   |   |-- EligibilityChecker.regression.test.tsx
|   |   |   |   |-- EnrollmentPayment.regression.test.tsx
|   |   |   |   |-- InterviewScheduling.regression.test.tsx
|   |   |   |   |-- Offers.regression.test.tsx
|   |   |   |   `-- ProgramExplorer.regression.test.tsx
|   |   |   |-- faculty-portal
|   |   |   |   |-- Advising.regression.test.tsx
|   |   |   |   |-- Analytics.regression.test.tsx
|   |   |   |   |-- Assessments.regression.test.tsx
|   |   |   |   |-- ChairpersonWorkspace.regression.test.tsx
|   |   |   |   |-- Communication.regression.test.tsx
|   |   |   |   |-- Dashboard.regression.test.tsx
|   |   |   |   |-- DeanWorkspace.regression.test.tsx
|   |   |   |   |-- Documents.regression.test.tsx
|   |   |   |   |-- FacultySecurity.regression.test.tsx
|   |   |   |   |-- LMSManager.regression.test.tsx
|   |   |   |   |-- Research.regression.test.tsx
|   |   |   |   |-- Schedule.regression.test.tsx
|   |   |   |   |-- SecretaryWorkspace.regression.test.tsx
|   |   |   |   |-- Settings.regression.test.tsx
|   |   |   |   |-- Students.regression.test.tsx
|   |   |   |   `-- Teaching.regression.test.tsx
|   |   |   |-- finance-console
|   |   |   |   |-- Budgeting.regression.test.tsx
|   |   |   |   |-- Cashier.regression.test.tsx
|   |   |   |   |-- Dashboard.regression.test.tsx
|   |   |   |   |-- FinancialReports.regression.test.tsx
|   |   |   |   |-- Invoicing.regression.test.tsx
|   |   |   |   |-- PaymentGateway.regression.test.tsx
|   |   |   |   |-- Payroll.regression.test.tsx
|   |   |   |   |-- PayrollProcessing.regression.test.tsx
|   |   |   |   |-- SemesterBilling.regression.test.tsx
|   |   |   |   |-- StudentBilling.regression.test.tsx
|   |   |   |   `-- TuitionAssessment.regression.test.tsx
|   |   |   |-- governance-console
|   |   |   |   |-- Accreditation.regression.test.tsx
|   |   |   |   |-- Audits.regression.test.tsx
|   |   |   |   |-- Committees.regression.test.tsx
|   |   |   |   |-- Compliance.regression.test.tsx
|   |   |   |   |-- Events.regression.test.tsx
|   |   |   |   |-- Grievances.regression.test.tsx
|   |   |   |   |-- Helpdesk.regression.test.tsx
|   |   |   |   |-- Policies.regression.test.tsx
|   |   |   |   |-- QualityAccreditation.regression.test.tsx
|   |   |   |   |-- RiskManagement.regression.test.tsx
|   |   |   |   `-- Visitors.regression.test.tsx
|   |   |   |-- identity-portal
|   |   |   |   |-- Email.regression.test.tsx
|   |   |   |   |-- MFA.regression.test.tsx
|   |   |   |   |-- MfaVerification.regression.test.tsx
|   |   |   |   |-- MultiFactorAuth.regression.test.tsx
|   |   |   |   |-- PasswordRecovery.regression.test.tsx
|   |   |   |   |-- PasswordReset.regression.test.tsx
|   |   |   |   |-- SecuritySettings.regression.test.tsx
|   |   |   |   |-- SessionManagement.regression.test.tsx
|   |   |   |   |-- UniversityAccount.regression.test.tsx
|   |   |   |   |-- UserLogin.regression.test.tsx
|   |   |   |   `-- UserRegistration.regression.test.tsx
|   |   |   |-- library-portal
|   |   |   |   |-- CatalogSearch.regression.test.tsx
|   |   |   |   |-- Circulation.regression.test.tsx
|   |   |   |   |-- DigitalResources.regression.test.tsx
|   |   |   |   |-- Fines.regression.test.tsx
|   |   |   |   |-- MyLoans.regression.test.tsx
|   |   |   |   `-- Reservations.regression.test.tsx
|   |   |   |-- lms-web
|   |   |   |   |-- Assignments.regression.test.tsx
|   |   |   |   |-- Calendar.regression.test.tsx
|   |   |   |   |-- CourseAdministration.regression.test.tsx
|   |   |   |   |-- CourseContent.regression.test.tsx
|   |   |   |   |-- Dashboard.regression.test.tsx
|   |   |   |   |-- Discussions.regression.test.tsx
|   |   |   |   |-- GradebookOrchestration.regression.test.tsx
|   |   |   |   |-- Grades.regression.test.tsx
|   |   |   |   |-- ModuleTimeline.regression.test.tsx
|   |   |   |   |-- OfflineSubmissionReview.regression.test.tsx
|   |   |   |   `-- Quizzes.regression.test.tsx
|   |   |   |-- platform-console
|   |   |   |   |-- APIKeys.regression.test.tsx
|   |   |   |   |-- AnalyticsBI.regression.test.tsx
|   |   |   |   |-- CRM.regression.test.tsx
|   |   |   |   |-- Communication.regression.test.tsx
|   |   |   |   |-- DatabaseManagement.regression.test.tsx
|   |   |   |   |-- DocumentManagement.regression.test.tsx
|   |   |   |   |-- GlobalSettings.regression.test.tsx
|   |   |   |   |-- MultiCampus.regression.test.tsx
|   |   |   |   |-- Notification.regression.test.tsx
|   |   |   |   |-- SecurityAudits.regression.test.tsx
|   |   |   |   |-- SystemLogs.regression.test.tsx
|   |   |   |   `-- TenantManagement.regression.test.tsx
|   |   |   |-- registrar-portal
|   |   |   |   |-- AcademicComplianceDivision.regression.test.tsx
|   |   |   |   |-- AcademicRecordsDivision.regression.test.tsx
|   |   |   |   |-- AcademicSchedulingDivision.regression.test.tsx
|   |   |   |   |-- Admissions.regression.test.tsx
|   |   |   |   |-- AdmissionsDivision.regression.test.tsx
|   |   |   |   |-- CertificationDivision.regression.test.tsx
|   |   |   |   |-- CrossEnrollmentDivision.regression.test.tsx
|   |   |   |   |-- CurriculumDivision.regression.test.tsx
|   |   |   |   |-- EnrollmentDivision.regression.test.tsx
|   |   |   |   |-- GraduationDivision.regression.test.tsx
|   |   |   |   |-- RegistrarDashboard.regression.test.tsx
|   |   |   |   |-- RegistrarSecurity.regression.test.tsx
|   |   |   |   |-- StudentRegistryDivision.regression.test.tsx
|   |   |   |   |-- StudentServicesDivision.regression.test.tsx
|   |   |   |   `-- TransferDivision.regression.test.tsx
|   |   |   `-- student-portal
|   |   |       |-- AcademicRecord.regression.test.tsx
|   |   |       |-- AlumniNetwork.regression.test.tsx
|   |   |       |-- CareerDashboard.regression.test.tsx
|   |   |       |-- Clearance.regression.test.tsx
|   |   |       |-- CrossEnrollment.regression.test.tsx
|   |   |       |-- CurriculumProgress.regression.test.tsx
|   |   |       |-- Dashboard.regression.test.tsx
|   |   |       |-- Enrollment.regression.test.tsx
|   |   |       |-- EnrollmentHistory.regression.test.tsx
|   |   |       |-- Extracurriculars.regression.test.tsx
|   |   |       |-- Financials.regression.test.tsx
|   |   |       |-- Graduation.regression.test.tsx
|   |   |       |-- GuidanceSessions.regression.test.tsx
|   |   |       |-- HealthRecords.regression.test.tsx
|   |   |       |-- HostelAllocation.regression.test.tsx
|   |   |       |-- LearningManagement.regression.test.tsx
|   |   |       |-- MyEnrollments.regression.test.tsx
|   |   |       |-- Registration.regression.test.tsx
|   |   |       |-- Schedule.regression.test.tsx
|   |   |       |-- StudentProfile.regression.test.tsx
|   |   |       `-- Timetable.regression.test.tsx
|   |   |-- Security
|   |   |   |-- admin-portal
|   |   |   |   |-- AcademicConfiguration.security.test.tsx
|   |   |   |   |-- AdmissionsProcessing.security.test.tsx
|   |   |   |   |-- AssetRegistry.security.test.tsx
|   |   |   |   |-- AuditCompliance.security.test.tsx
|   |   |   |   |-- CanteenOrders.security.test.tsx
|   |   |   |   |-- Dashboard.security.test.tsx
|   |   |   |   |-- EmployeeManagement.security.test.tsx
|   |   |   |   |-- FacilityBooking.security.test.tsx
|   |   |   |   |-- FleetManagement.security.test.tsx
|   |   |   |   |-- IdentitySecurity.security.test.tsx
|   |   |   |   |-- IntegrationManagement.security.test.tsx
|   |   |   |   |-- OrganizationManagement.security.test.tsx
|   |   |   |   |-- PlatformMonitoring.security.test.tsx
|   |   |   |   |-- PurchaseOrders.security.test.tsx
|   |   |   |   |-- RegistrarWorkspace.security.test.tsx
|   |   |   |   |-- Reports.security.test.tsx
|   |   |   |   |-- RoleAdministration.security.test.tsx
|   |   |   |   |-- StockManagement.security.test.tsx
|   |   |   |   |-- SystemAdministration.security.test.tsx
|   |   |   |   |-- UserAdministration.security.test.tsx
|   |   |   |   `-- WorkflowManagement.security.test.tsx
|   |   |   |-- admissions-portal
|   |   |   |   |-- AdmissionCases.security.test.tsx
|   |   |   |   |-- AdmissionsDecision.security.test.tsx
|   |   |   |   |-- AdmissionsProcessing.security.test.tsx
|   |   |   |   |-- Applications.security.test.tsx
|   |   |   |   |-- Communication.security.test.tsx
|   |   |   |   |-- Dashboard.security.test.tsx
|   |   |   |   |-- EnrollmentHandoff.security.test.tsx
|   |   |   |   |-- Examination.security.test.tsx
|   |   |   |   |-- Fees.security.test.tsx
|   |   |   |   |-- Intake.security.test.tsx
|   |   |   |   |-- Interviews.security.test.tsx
|   |   |   |   |-- Queue.security.test.tsx
|   |   |   |   |-- Reports.security.test.tsx
|   |   |   |   |-- RequirementManagement.security.test.tsx
|   |   |   |   |-- Review.security.test.tsx
|   |   |   |   `-- Verification.security.test.tsx
|   |   |   |-- applicant-portal
|   |   |   |   |-- AdmissionStatus.security.test.tsx
|   |   |   |   |-- ApplicationForm.security.test.tsx
|   |   |   |   |-- ApplicationStatus.security.test.tsx
|   |   |   |   |-- ApplicationTimeline.security.test.tsx
|   |   |   |   |-- ApplicationWizard.security.test.tsx
|   |   |   |   |-- Dashboard.security.test.tsx
|   |   |   |   |-- DocumentSubmission.security.test.tsx
|   |   |   |   |-- DocumentUpload.security.test.tsx
|   |   |   |   |-- EligibilityChecker.security.test.tsx
|   |   |   |   |-- EnrollmentPayment.security.test.tsx
|   |   |   |   |-- InterviewScheduling.security.test.tsx
|   |   |   |   |-- Offers.security.test.tsx
|   |   |   |   `-- ProgramExplorer.security.test.tsx
|   |   |   |-- faculty-portal
|   |   |   |   |-- Advising.security.test.tsx
|   |   |   |   |-- Analytics.security.test.tsx
|   |   |   |   |-- Assessments.security.test.tsx
|   |   |   |   |-- ChairpersonWorkspace.security.test.tsx
|   |   |   |   |-- Communication.security.test.tsx
|   |   |   |   |-- Dashboard.security.test.tsx
|   |   |   |   |-- DeanWorkspace.security.test.tsx
|   |   |   |   |-- Documents.security.test.tsx
|   |   |   |   |-- FacultySecurity.security.test.tsx
|   |   |   |   |-- LMSManager.security.test.tsx
|   |   |   |   |-- Research.security.test.tsx
|   |   |   |   |-- Schedule.security.test.tsx
|   |   |   |   |-- SecretaryWorkspace.security.test.tsx
|   |   |   |   |-- Settings.security.test.tsx
|   |   |   |   |-- Students.security.test.tsx
|   |   |   |   `-- Teaching.security.test.tsx
|   |   |   |-- finance-console
|   |   |   |   |-- Budgeting.security.test.tsx
|   |   |   |   |-- Cashier.security.test.tsx
|   |   |   |   |-- Dashboard.security.test.tsx
|   |   |   |   |-- FinancialReports.security.test.tsx
|   |   |   |   |-- Invoicing.security.test.tsx
|   |   |   |   |-- PaymentGateway.security.test.tsx
|   |   |   |   |-- Payroll.security.test.tsx
|   |   |   |   |-- PayrollProcessing.security.test.tsx
|   |   |   |   |-- SemesterBilling.security.test.tsx
|   |   |   |   |-- StudentBilling.security.test.tsx
|   |   |   |   `-- TuitionAssessment.security.test.tsx
|   |   |   |-- governance-console
|   |   |   |   |-- Accreditation.security.test.tsx
|   |   |   |   |-- Audits.security.test.tsx
|   |   |   |   |-- Committees.security.test.tsx
|   |   |   |   |-- Compliance.security.test.tsx
|   |   |   |   |-- Events.security.test.tsx
|   |   |   |   |-- Grievances.security.test.tsx
|   |   |   |   |-- Helpdesk.security.test.tsx
|   |   |   |   |-- Policies.security.test.tsx
|   |   |   |   |-- QualityAccreditation.security.test.tsx
|   |   |   |   |-- RiskManagement.security.test.tsx
|   |   |   |   `-- Visitors.security.test.tsx
|   |   |   |-- identity-portal
|   |   |   |   |-- Email.security.test.tsx
|   |   |   |   |-- MFA.security.test.tsx
|   |   |   |   |-- MfaVerification.security.test.tsx
|   |   |   |   |-- MultiFactorAuth.security.test.tsx
|   |   |   |   |-- PasswordRecovery.security.test.tsx
|   |   |   |   |-- PasswordReset.security.test.tsx
|   |   |   |   |-- SecuritySettings.security.test.tsx
|   |   |   |   |-- SessionManagement.security.test.tsx
|   |   |   |   |-- UniversityAccount.security.test.tsx
|   |   |   |   |-- UserLogin.security.test.tsx
|   |   |   |   `-- UserRegistration.security.test.tsx
|   |   |   |-- library-portal
|   |   |   |   |-- CatalogSearch.security.test.tsx
|   |   |   |   |-- Circulation.security.test.tsx
|   |   |   |   |-- DigitalResources.security.test.tsx
|   |   |   |   |-- Fines.security.test.tsx
|   |   |   |   |-- MyLoans.security.test.tsx
|   |   |   |   `-- Reservations.security.test.tsx
|   |   |   |-- libs
|   |   |   |   |-- api-clients
|   |   |   |   |   |-- admissionsApi.security.test.tsx
|   |   |   |   |   |-- advisingApi.security.test.tsx
|   |   |   |   |   |-- alumniApi.security.test.tsx
|   |   |   |   |   |-- analyticsApi.security.test.tsx
|   |   |   |   |   |-- apiClient.security.test.tsx
|   |   |   |   |   |-- assessmentApi.security.test.tsx
|   |   |   |   |   |-- assetManagementApi.security.test.tsx
|   |   |   |   |   |-- canteenApi.security.test.tsx
|   |   |   |   |   |-- careerApi.security.test.tsx
|   |   |   |   |   |-- communicationApi.security.test.tsx
|   |   |   |   |   |-- documentsApi.security.test.tsx
|   |   |   |   |   |-- examinationResultApi.security.test.tsx
|   |   |   |   |   |-- facilitiesApi.security.test.tsx
|   |   |   |   |   |-- facilitiesAvailabilityApi.security.test.tsx
|   |   |   |   |   |-- facultyAdmissionsApi.security.test.tsx
|   |   |   |   |   |-- facultySettingsApi.security.test.tsx
|   |   |   |   |   |-- facultyStudentsApi.security.test.tsx
|   |   |   |   |   |-- financeApi.security.test.tsx
|   |   |   |   |   |-- financeBillingApi.security.test.tsx
|   |   |   |   |   |-- governanceApi.security.test.tsx
|   |   |   |   |   |-- guidanceApi.security.test.tsx
|   |   |   |   |   |-- healthCenterApi.security.test.tsx
|   |   |   |   |   |-- hostelApi.security.test.tsx
|   |   |   |   |   |-- hrApi.security.test.tsx
|   |   |   |   |   |-- identityAccessAuthorizationApi.security.test.tsx
|   |   |   |   |   |-- identityApi.security.test.tsx
|   |   |   |   |   |-- interviewsApi.security.test.tsx
|   |   |   |   |   |-- inventoryApi.security.test.tsx
|   |   |   |   |   |-- libraryCatalogApi.security.test.tsx
|   |   |   |   |   |-- lmsApi.security.test.tsx
|   |   |   |   |   |-- procurementApi.security.test.tsx
|   |   |   |   |   |-- registrarApi.security.test.tsx
|   |   |   |   |   |-- registrarCurriculumApi.security.test.tsx
|   |   |   |   |   |-- researchApi.security.test.tsx
|   |   |   |   |   |-- scheduleApi.security.test.tsx
|   |   |   |   |   |-- studentInformationApi.security.test.tsx
|   |   |   |   |   |-- studentInformationReadModel.security.test.tsx
|   |   |   |   |   |-- teachingApi.security.test.tsx
|   |   |   |   |   `-- transportApi.security.test.tsx
|   |   |   |   |-- auth-sdk
|   |   |   |   |   |-- FacultyGuard.security.test.tsx
|   |   |   |   |   |-- FinanceGuard.security.test.tsx
|   |   |   |   |   |-- IdentityGuard.security.test.tsx
|   |   |   |   |   |-- LMSGuard.security.test.tsx
|   |   |   |   |   `-- RegistrarGuard.security.test.tsx
|   |   |   |   |-- domain-viewmodels
|   |   |   |   |   |-- AdministrationViewModels.security.test.tsx
|   |   |   |   |   |-- CampusLifeViewModels.security.test.tsx
|   |   |   |   |   |-- FinanceViewModels.security.test.tsx
|   |   |   |   |   |-- GovernanceViewModels.security.test.tsx
|   |   |   |   |   |-- GrievanceCaseViewModel.security.test.tsx
|   |   |   |   |   |-- IdentityViewModels.security.test.tsx
|   |   |   |   |   |-- InvoiceSummaryViewModel.security.test.tsx
|   |   |   |   |   |-- LibraryViewModels.security.test.tsx
|   |   |   |   |   |-- StudentLifecycleViewModels.security.test.tsx
|   |   |   |   |   `-- StudentProfileViewModel.security.test.tsx
|   |   |   |   |-- offline-sync
|   |   |   |   |   `-- syncEngineContracts.security.test.tsx
|   |   |   |   |-- shell-kit
|   |   |   |   |   |-- AuthGuard.security.test.tsx
|   |   |   |   |   |-- authConfig.security.test.tsx
|   |   |   |   |   |-- bootstrap.security.test.tsx
|   |   |   |   |   |-- portalRegistry.security.test.tsx
|   |   |   |   |   `-- queryClient.security.test.tsx
|   |   |   |   |-- ui-kit
|   |   |   |   |   |-- Badge.security.test.tsx
|   |   |   |   |   |-- Button.security.test.tsx
|   |   |   |   |   |-- Card.security.test.tsx
|   |   |   |   |   |-- DocumentPreviewModal.security.test.tsx
|   |   |   |   |   |-- EmptyState.security.test.tsx
|   |   |   |   |   |-- FormInput.security.test.tsx
|   |   |   |   |   |-- Modal.security.test.tsx
|   |   |   |   |   |-- PageHeader.security.test.tsx
|   |   |   |   |   `-- Table.security.test.tsx
|   |   |   |   `-- workflow-sdk
|   |   |   |       |-- AcademicRecordWorkflow.security.test.tsx
|   |   |   |       |-- AdmissionWorkflow.security.test.tsx
|   |   |   |       |-- AuditWorkflow.security.test.tsx
|   |   |   |       |-- CertificationWorkflow.security.test.tsx
|   |   |   |       |-- EnrollmentWorkflow.security.test.tsx
|   |   |   |       |-- FinanceWorkflow.security.test.tsx
|   |   |   |       |-- GraduationWorkflow.security.test.tsx
|   |   |   |       |-- IdentityWorkflow.security.test.tsx
|   |   |   |       |-- LMSWorkflow.security.test.tsx
|   |   |   |       |-- LibraryWorkflow.security.test.tsx
|   |   |   |       |-- NotificationWorkflow.security.test.tsx
|   |   |   |       `-- StudentLifecycleWorkflow.security.test.tsx
|   |   |   |-- lms-web
|   |   |   |   |-- Assignments.security.test.tsx
|   |   |   |   |-- Calendar.security.test.tsx
|   |   |   |   |-- CourseAdministration.security.test.tsx
|   |   |   |   |-- CourseContent.security.test.tsx
|   |   |   |   |-- Dashboard.security.test.tsx
|   |   |   |   |-- Discussions.security.test.tsx
|   |   |   |   |-- GradebookOrchestration.security.test.tsx
|   |   |   |   |-- Grades.security.test.tsx
|   |   |   |   |-- ModuleTimeline.security.test.tsx
|   |   |   |   |-- OfflineSubmissionReview.security.test.tsx
|   |   |   |   `-- Quizzes.security.test.tsx
|   |   |   |-- platform-console
|   |   |   |   |-- APIKeys.security.test.tsx
|   |   |   |   |-- AnalyticsBI.security.test.tsx
|   |   |   |   |-- CRM.security.test.tsx
|   |   |   |   |-- Communication.security.test.tsx
|   |   |   |   |-- DatabaseManagement.security.test.tsx
|   |   |   |   |-- DocumentManagement.security.test.tsx
|   |   |   |   |-- GlobalSettings.security.test.tsx
|   |   |   |   |-- MultiCampus.security.test.tsx
|   |   |   |   |-- Notification.security.test.tsx
|   |   |   |   |-- SecurityAudits.security.test.tsx
|   |   |   |   |-- SystemLogs.security.test.tsx
|   |   |   |   `-- TenantManagement.security.test.tsx
|   |   |   |-- registrar-portal
|   |   |   |   |-- AcademicComplianceDivision.security.test.tsx
|   |   |   |   |-- AcademicRecordsDivision.security.test.tsx
|   |   |   |   |-- AcademicSchedulingDivision.security.test.tsx
|   |   |   |   |-- Admissions.security.test.tsx
|   |   |   |   |-- AdmissionsDivision.security.test.tsx
|   |   |   |   |-- CertificationDivision.security.test.tsx
|   |   |   |   |-- CrossEnrollmentDivision.security.test.tsx
|   |   |   |   |-- CurriculumDivision.security.test.tsx
|   |   |   |   |-- EnrollmentDivision.security.test.tsx
|   |   |   |   |-- GraduationDivision.security.test.tsx
|   |   |   |   |-- RegistrarDashboard.security.test.tsx
|   |   |   |   |-- RegistrarSecurity.security.test.tsx
|   |   |   |   |-- StudentRegistryDivision.security.test.tsx
|   |   |   |   |-- StudentServicesDivision.security.test.tsx
|   |   |   |   `-- TransferDivision.security.test.tsx
|   |   |   `-- student-portal
|   |   |       |-- AcademicRecord.security.test.tsx
|   |   |       |-- AlumniNetwork.security.test.tsx
|   |   |       |-- CareerDashboard.security.test.tsx
|   |   |       |-- Clearance.security.test.tsx
|   |   |       |-- CrossEnrollment.security.test.tsx
|   |   |       |-- CurriculumProgress.security.test.tsx
|   |   |       |-- Dashboard.security.test.tsx
|   |   |       |-- Enrollment.security.test.tsx
|   |   |       |-- EnrollmentHistory.security.test.tsx
|   |   |       |-- Extracurriculars.security.test.tsx
|   |   |       |-- Financials.security.test.tsx
|   |   |       |-- Graduation.security.test.tsx
|   |   |       |-- GuidanceSessions.security.test.tsx
|   |   |       |-- HealthRecords.security.test.tsx
|   |   |       |-- HostelAllocation.security.test.tsx
|   |   |       |-- LearningManagement.security.test.tsx
|   |   |       |-- MyEnrollments.security.test.tsx
|   |   |       |-- Registration.security.test.tsx
|   |   |       |-- Schedule.security.test.tsx
|   |   |       |-- StudentProfile.security.test.tsx
|   |   |       `-- Timetable.security.test.tsx
|   |   `-- Unit
|   |       |-- admin-portal
|   |       |   |-- AcademicConfiguration.unit.test.tsx
|   |       |   |-- AdmissionsProcessing.unit.test.tsx
|   |       |   |-- AssetRegistry.unit.test.tsx
|   |       |   |-- AuditCompliance.unit.test.tsx
|   |       |   |-- CanteenOrders.unit.test.tsx
|   |       |   |-- Dashboard.unit.test.tsx
|   |       |   |-- EmployeeManagement.unit.test.tsx
|   |       |   |-- FacilityBooking.unit.test.tsx
|   |       |   |-- FleetManagement.unit.test.tsx
|   |       |   |-- IdentitySecurity.unit.test.tsx
|   |       |   |-- IntegrationManagement.unit.test.tsx
|   |       |   |-- OrganizationManagement.unit.test.tsx
|   |       |   |-- PlatformMonitoring.unit.test.tsx
|   |       |   |-- PurchaseOrders.unit.test.tsx
|   |       |   |-- RegistrarWorkspace.unit.test.tsx
|   |       |   |-- Reports.unit.test.tsx
|   |       |   |-- RoleAdministration.unit.test.tsx
|   |       |   |-- StockManagement.unit.test.tsx
|   |       |   |-- SystemAdministration.unit.test.tsx
|   |       |   |-- UserAdministration.unit.test.tsx
|   |       |   `-- WorkflowManagement.unit.test.tsx
|   |       |-- admissions-portal
|   |       |   |-- AdmissionCases.unit.test.tsx
|   |       |   |-- AdmissionsDecision.unit.test.tsx
|   |       |   |-- AdmissionsProcessing.unit.test.tsx
|   |       |   |-- Applications.unit.test.tsx
|   |       |   |-- Communication.unit.test.tsx
|   |       |   |-- Dashboard.unit.test.tsx
|   |       |   |-- EnrollmentHandoff.unit.test.tsx
|   |       |   |-- Examination.unit.test.tsx
|   |       |   |-- Fees.unit.test.tsx
|   |       |   |-- Intake.unit.test.tsx
|   |       |   |-- Interviews.unit.test.tsx
|   |       |   |-- Queue.unit.test.tsx
|   |       |   |-- Reports.unit.test.tsx
|   |       |   |-- RequirementManagement.unit.test.tsx
|   |       |   |-- Review.unit.test.tsx
|   |       |   `-- Verification.unit.test.tsx
|   |       |-- applicant-portal
|   |       |   |-- AdmissionStatus.unit.test.tsx
|   |       |   |-- ApplicantJourney.unit.test.tsx
|   |       |   |-- ApplicationForm.unit.test.tsx
|   |       |   |-- ApplicationStatus.unit.test.tsx
|   |       |   |-- ApplicationTimeline.unit.test.tsx
|   |       |   |-- ApplicationWizard.unit.test.tsx
|   |       |   |-- Dashboard.unit.test.tsx
|   |       |   |-- DocumentSubmission.unit.test.tsx
|   |       |   |-- DocumentUpload.unit.test.tsx
|   |       |   |-- EligibilityChecker.unit.test.tsx
|   |       |   |-- EnrollmentPayment.unit.test.tsx
|   |       |   |-- InterviewScheduling.unit.test.tsx
|   |       |   |-- Offers.unit.test.tsx
|   |       |   `-- ProgramExplorer.unit.test.tsx
|   |       |-- faculty-portal
|   |       |   |-- Advising.unit.test.tsx
|   |       |   |-- Analytics.unit.test.tsx
|   |       |   |-- Assessments.unit.test.tsx
|   |       |   |-- ChairpersonWorkspace.unit.test.tsx
|   |       |   |-- Communication.unit.test.tsx
|   |       |   |-- Dashboard.unit.test.tsx
|   |       |   |-- DeanWorkspace.unit.test.tsx
|   |       |   |-- Documents.unit.test.tsx
|   |       |   |-- FacultySecurity.unit.test.tsx
|   |       |   |-- LMSManager.unit.test.tsx
|   |       |   |-- Research.unit.test.tsx
|   |       |   |-- Schedule.unit.test.tsx
|   |       |   |-- SecretaryWorkspace.unit.test.tsx
|   |       |   |-- SectionRoster.unit.test.tsx
|   |       |   |-- Settings.unit.test.tsx
|   |       |   |-- Students.unit.test.tsx
|   |       |   `-- Teaching.unit.test.tsx
|   |       |-- finance-console
|   |       |   |-- AdmissionAssessment.unit.test.tsx
|   |       |   |-- Budgeting.unit.test.tsx
|   |       |   |-- Cashier.unit.test.tsx
|   |       |   |-- Dashboard.unit.test.tsx
|   |       |   |-- Downpayment.unit.test.tsx
|   |       |   |-- EnrollmentFinance
|   |       |   |   |-- AdmissionAssessment
|   |       |   |   |   `-- AdmissionAssessment.unit.test.tsx
|   |       |   |   |-- Downpayment
|   |       |   |   |   `-- Downpayment.unit.test.tsx
|   |       |   |   `-- FinancialClearance
|   |       |   |       `-- FinancialClearance.unit.test.tsx
|   |       |   |-- FinanceConsole.unit.test.tsx
|   |       |   |-- FinancialClearance.unit.test.tsx
|   |       |   |-- FinancialReports.unit.test.tsx
|   |       |   |-- Invoicing.unit.test.tsx
|   |       |   |-- PaymentGateway.unit.test.tsx
|   |       |   |-- Payroll.unit.test.tsx
|   |       |   |-- PayrollProcessing.unit.test.tsx
|   |       |   |-- SemesterBilling.unit.test.tsx
|   |       |   |-- StudentBilling.unit.test.tsx
|   |       |   `-- TuitionAssessment.unit.test.tsx
|   |       |-- governance-console
|   |       |   |-- Accreditation.unit.test.tsx
|   |       |   |-- Audits.unit.test.tsx
|   |       |   |-- Committees.unit.test.tsx
|   |       |   |-- Compliance.unit.test.tsx
|   |       |   |-- Events.unit.test.tsx
|   |       |   |-- Grievances.unit.test.tsx
|   |       |   |-- Helpdesk.unit.test.tsx
|   |       |   |-- Policies.unit.test.tsx
|   |       |   |-- QualityAccreditation.unit.test.tsx
|   |       |   |-- RiskManagement.unit.test.tsx
|   |       |   `-- Visitors.unit.test.tsx
|   |       |-- identity-portal
|   |       |   |-- Email.unit.test.tsx
|   |       |   |-- MFA.unit.test.tsx
|   |       |   |-- MfaVerification.unit.test.tsx
|   |       |   |-- MultiFactorAuth.unit.test.tsx
|   |       |   |-- PasswordRecovery.unit.test.tsx
|   |       |   |-- PasswordReset.unit.test.tsx
|   |       |   |-- SecuritySettings.unit.test.tsx
|   |       |   |-- SessionManagement.unit.test.tsx
|   |       |   |-- UniversityAccount.unit.test.tsx
|   |       |   |-- UserLogin.unit.test.tsx
|   |       |   `-- UserRegistration.unit.test.tsx
|   |       |-- library-portal
|   |       |   |-- CatalogSearch.unit.test.tsx
|   |       |   |-- Circulation.unit.test.tsx
|   |       |   |-- DigitalResources.unit.test.tsx
|   |       |   |-- Fines.unit.test.tsx
|   |       |   |-- MyLoans.unit.test.tsx
|   |       |   `-- Reservations.unit.test.tsx
|   |       |-- libs
|   |       |   |-- api-clients
|   |       |   |   |-- admissionsApi.unit.test.tsx
|   |       |   |   |-- advisingApi.unit.test.tsx
|   |       |   |   |-- alumniApi.unit.test.tsx
|   |       |   |   |-- analyticsApi.unit.test.tsx
|   |       |   |   |-- apiClient.unit.test.tsx
|   |       |   |   |-- assessmentApi.unit.test.tsx
|   |       |   |   |-- assetManagementApi.unit.test.tsx
|   |       |   |   |-- canteenApi.unit.test.tsx
|   |       |   |   |-- careerApi.unit.test.tsx
|   |       |   |   |-- communicationApi.unit.test.tsx
|   |       |   |   |-- documentsApi.unit.test.tsx
|   |       |   |   |-- examinationResultApi.unit.test.tsx
|   |       |   |   |-- facilitiesApi.unit.test.tsx
|   |       |   |   |-- facilitiesAvailabilityApi.unit.test.tsx
|   |       |   |   |-- facultyAdmissionsApi.unit.test.tsx
|   |       |   |   |-- facultySettingsApi.unit.test.tsx
|   |       |   |   |-- facultyStudentsApi.unit.test.tsx
|   |       |   |   |-- financeApi.unit.test.tsx
|   |       |   |   |-- financeBillingApi.unit.test.tsx
|   |       |   |   |-- governanceApi.unit.test.tsx
|   |       |   |   |-- guidanceApi.unit.test.tsx
|   |       |   |   |-- healthCenterApi.unit.test.tsx
|   |       |   |   |-- hostelApi.unit.test.tsx
|   |       |   |   |-- hrApi.unit.test.tsx
|   |       |   |   |-- identityAccessAuthorizationApi.unit.test.tsx
|   |       |   |   |-- identityApi.unit.test.tsx
|   |       |   |   |-- interviewsApi.unit.test.tsx
|   |       |   |   |-- inventoryApi.unit.test.tsx
|   |       |   |   |-- libraryCatalogApi.unit.test.tsx
|   |       |   |   |-- lmsApi.unit.test.tsx
|   |       |   |   |-- procurementApi.unit.test.tsx
|   |       |   |   |-- registrarApi.unit.test.tsx
|   |       |   |   |-- registrarCurriculumApi.unit.test.tsx
|   |       |   |   |-- researchApi.unit.test.tsx
|   |       |   |   |-- scheduleApi.unit.test.tsx
|   |       |   |   |-- studentInformationApi.unit.test.tsx
|   |       |   |   |-- studentInformationReadModel.unit.test.tsx
|   |       |   |   |-- teachingApi.unit.test.tsx
|   |       |   |   `-- transportApi.unit.test.tsx
|   |       |   |-- auth-sdk
|   |       |   |   |-- FacultyGuard.unit.test.tsx
|   |       |   |   |-- FinanceGuard.unit.test.tsx
|   |       |   |   |-- IdentityGuard.unit.test.tsx
|   |       |   |   |-- LMSGuard.unit.test.tsx
|   |       |   |   `-- RegistrarGuard.unit.test.tsx
|   |       |   |-- domain-viewmodels
|   |       |   |   |-- AdministrationViewModels.unit.test.tsx
|   |       |   |   |-- CampusLifeViewModels.unit.test.tsx
|   |       |   |   |-- FinanceViewModels.unit.test.tsx
|   |       |   |   |-- GovernanceViewModels.unit.test.tsx
|   |       |   |   |-- GrievanceCaseViewModel.unit.test.tsx
|   |       |   |   |-- IdentityViewModels.unit.test.tsx
|   |       |   |   |-- InvoiceSummaryViewModel.unit.test.tsx
|   |       |   |   |-- LibraryViewModels.unit.test.tsx
|   |       |   |   |-- StudentLifecycleViewModels.unit.test.tsx
|   |       |   |   `-- StudentProfileViewModel.unit.test.tsx
|   |       |   |-- offline-sync
|   |       |   |   `-- syncEngineContracts.unit.test.tsx
|   |       |   |-- shell-kit
|   |       |   |   |-- AuthGuard.unit.test.tsx
|   |       |   |   |-- authConfig.unit.test.tsx
|   |       |   |   |-- bootstrap.unit.test.tsx
|   |       |   |   |-- portalRegistry.unit.test.tsx
|   |       |   |   `-- queryClient.unit.test.tsx
|   |       |   |-- ui-kit
|   |       |   |   |-- Badge.unit.test.tsx
|   |       |   |   |-- Button.unit.test.tsx
|   |       |   |   |-- Card.unit.test.tsx
|   |       |   |   |-- DocumentPreviewModal.unit.test.tsx
|   |       |   |   |-- EmptyState.unit.test.tsx
|   |       |   |   |-- FormInput.unit.test.tsx
|   |       |   |   |-- Modal.unit.test.tsx
|   |       |   |   |-- PageHeader.unit.test.tsx
|   |       |   |   `-- Table.unit.test.tsx
|   |       |   `-- workflow-sdk
|   |       |       |-- AcademicRecordWorkflow.unit.test.tsx
|   |       |       |-- AdmissionWorkflow.unit.test.tsx
|   |       |       |-- AuditWorkflow.unit.test.tsx
|   |       |       |-- CertificationWorkflow.unit.test.tsx
|   |       |       |-- EnrollmentWorkflow.unit.test.tsx
|   |       |       |-- FinanceWorkflow.unit.test.tsx
|   |       |       |-- GraduationWorkflow.unit.test.tsx
|   |       |       |-- IdentityWorkflow.unit.test.tsx
|   |       |       |-- LMSWorkflow.unit.test.tsx
|   |       |       |-- LibraryWorkflow.unit.test.tsx
|   |       |       |-- NotificationWorkflow.unit.test.tsx
|   |       |       `-- StudentLifecycleWorkflow.unit.test.tsx
|   |       |-- lms-web
|   |       |   |-- Assignments.unit.test.tsx
|   |       |   |-- Calendar.unit.test.tsx
|   |       |   |-- CourseAdministration.unit.test.tsx
|   |       |   |-- CourseContent.unit.test.tsx
|   |       |   |-- Dashboard.unit.test.tsx
|   |       |   |-- Discussions.unit.test.tsx
|   |       |   |-- GradebookOrchestration.unit.test.tsx
|   |       |   |-- Grades.unit.test.tsx
|   |       |   |-- ModuleTimeline.unit.test.tsx
|   |       |   |-- OfflineSubmissionReview.unit.test.tsx
|   |       |   `-- Quizzes.unit.test.tsx
|   |       |-- platform-console
|   |       |   |-- APIKeys.unit.test.tsx
|   |       |   |-- AnalyticsBI.unit.test.tsx
|   |       |   |-- CRM.unit.test.tsx
|   |       |   |-- Communication.unit.test.tsx
|   |       |   |-- DatabaseManagement.unit.test.tsx
|   |       |   |-- DocumentManagement.unit.test.tsx
|   |       |   |-- GlobalSettings.unit.test.tsx
|   |       |   |-- MultiCampus.unit.test.tsx
|   |       |   |-- Notification.unit.test.tsx
|   |       |   |-- SecurityAudits.unit.test.tsx
|   |       |   |-- SystemLogs.unit.test.tsx
|   |       |   `-- TenantManagement.unit.test.tsx
|   |       |-- registrar-portal
|   |       |   |-- AcademicComplianceDivision.unit.test.tsx
|   |       |   |-- AcademicRecordInitialization.unit.test.tsx
|   |       |   |-- AcademicRecordsDivision.unit.test.tsx
|   |       |   |-- AcademicSchedulingDivision.unit.test.tsx
|   |       |   |-- AcademicStanding.unit.test.tsx
|   |       |   |-- AddDropOversight.unit.test.tsx
|   |       |   |-- Admissions.unit.test.tsx
|   |       |   |-- AdmissionsDivision.unit.test.tsx
|   |       |   |-- CertificationDivision.unit.test.tsx
|   |       |   |-- CourseOfferings.unit.test.tsx
|   |       |   |-- CrossEnrollmentDivision.unit.test.tsx
|   |       |   |-- CurriculumDivision.unit.test.tsx
|   |       |   |-- EnrollmentDivision.unit.test.tsx
|   |       |   |-- EnrollmentValidation.unit.test.tsx
|   |       |   |-- GraduationDivision.unit.test.tsx
|   |       |   |-- MasterStudentList.unit.test.tsx
|   |       |   |-- OfficialGrades.unit.test.tsx
|   |       |   |-- Prerequisites.unit.test.tsx
|   |       |   |-- RegistrarDashboard.unit.test.tsx
|   |       |   |-- RegistrarEnrollmentValidation.unit.test.tsx
|   |       |   |-- RegistrarIntegration.unit.test.tsx
|   |       |   |-- RegistrarSecurity.unit.test.tsx
|   |       |   |-- RegistrationExceptions.unit.test.tsx
|   |       |   |-- RegistrationRequests.unit.test.tsx
|   |       |   |-- RegistrationWindows.unit.test.tsx
|   |       |   |-- StudentRegistryDivision.unit.test.tsx
|   |       |   |-- StudentServicesDivision.unit.test.tsx
|   |       |   |-- SubjectCatalog.unit.test.tsx
|   |       |   |-- SubjectLoading.unit.test.tsx
|   |       |   |-- TransferDivision.unit.test.tsx
|   |       |   `-- Waitlists.unit.test.tsx
|   |       `-- student-portal
|   |           |-- AcademicRecord.unit.test.tsx
|   |           |-- AlumniNetwork.unit.test.tsx
|   |           |-- BrowseCourses.unit.test.tsx
|   |           |-- CareerDashboard.unit.test.tsx
|   |           |-- Clearance.unit.test.tsx
|   |           |-- CrossEnrollment.unit.test.tsx
|   |           |-- CurriculumProgress.unit.test.tsx
|   |           |-- Dashboard.unit.test.tsx
|   |           |-- Enrollment.unit.test.tsx
|   |           |-- EnrollmentHistory.unit.test.tsx
|   |           |-- Extracurriculars.unit.test.tsx
|   |           |-- Financials.unit.test.tsx
|   |           |-- Graduation.unit.test.tsx
|   |           |-- GuidanceSessions.unit.test.tsx
|   |           |-- HealthRecords.unit.test.tsx
|   |           |-- HostelAllocation.unit.test.tsx
|   |           |-- LearningManagement.unit.test.tsx
|   |           |-- MyEnrollments.unit.test.tsx
|   |           |-- MyRegistration.unit.test.tsx
|   |           |-- Registration.unit.test.tsx
|   |           |-- Schedule.unit.test.tsx
|   |           |-- StudentProfile.unit.test.tsx
|   |           |-- Timetable.unit.test.tsx
|   |           `-- Waitlist.unit.test.tsx
|   |-- tsconfig.app.base.json
|   |-- tsconfig.json
|   |-- tsconfig.node.base.json
|   |-- university-ERPstructure.md
|   `-- vitest.config.ts
|-- UniversityErp.slnx
|-- commit.logs
|-- docker-compose.yml
|-- errorlogs.md
|-- fix-encodings.js
|-- generate-frontend-test-structure.sh
|-- generate-test-templates-v2.sh
|-- health-logger.sh
|-- isolated_release.sh
|-- logs.md
|-- newupdate.md
|-- package-lock.json
|-- package.json
|-- release_all.sh
|-- result.log
|-- runtimelogs.md
|-- scaffold-backend-tests.sh
|-- scaffold-frontend-cloudflare-nginx.sh
|-- scaffold-frontend-tests.sh
|-- scaffold_features.ps1
|-- scripts
|   |-- check_port_collisions.ps1
|   |-- check_port_collisions.sh
|   `-- port_validator.js
|-- setup_structure.ps1
|-- setup_structure.sh
|-- tests.logs
|-- universal-semantic-versioning-prompt.md
|-- university-ERPstructure.md
|-- university-erp-cloudflare-tunnel-zero-trust-security-addendum.md
|-- university-erp-docker-compose-orchestration-prompt.md
|-- university-erp-domain-based-modular-architecture (2).md
|-- university-erp-frontend-dbma-architecture.md
|-- university-erp-frontend-features-ddd-dbma-prompt.md
`-- university-erp-scaffolding-script-review.md

1522 directories, 4203 files
