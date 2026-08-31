.
|-- Dockerfile.applicant
|-- Dockerfile.build-all
|-- Dockerfile.portal
|-- apps
|   |-- admin-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-CmnkJuXB.css
|   |   |   |   `-- index-fa44ciig.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- AcademicConfiguration
|   |   |   |   |   |-- AcademicConfiguration.api.ts
|   |   |   |   |   |-- AcademicConfiguration.hooks.ts
|   |   |   |   |   |-- AcademicConfiguration.page.tsx
|   |   |   |   |   |-- AcademicConfiguration.test.tsx
|   |   |   |   |   `-- AcademicConfiguration.types.ts
|   |   |   |   |-- AdmissionsProcessing
|   |   |   |   |   |-- AdmissionsProcessing.hooks.ts
|   |   |   |   |   |-- AdmissionsWorkspace.page.tsx
|   |   |   |   |   `-- components
|   |   |   |   |       |-- ChairpersonEvaluationView.tsx
|   |   |   |   |       |-- DeanEndorsementView.tsx
|   |   |   |   |       |-- RegistrarEnrollmentView.tsx
|   |   |   |   |       `-- SecretaryIntakeView.tsx
|   |   |   |   |-- AssetRegistry
|   |   |   |   |   |-- AssetRegistry.api.ts
|   |   |   |   |   |-- AssetRegistry.hooks.ts
|   |   |   |   |   |-- AssetRegistry.page.tsx
|   |   |   |   |   |-- AssetRegistry.test.tsx
|   |   |   |   |   `-- AssetRegistry.types.ts
|   |   |   |   |-- AuditCompliance
|   |   |   |   |   |-- AuditCompliance.api.ts
|   |   |   |   |   |-- AuditCompliance.hooks.ts
|   |   |   |   |   |-- AuditCompliance.page.tsx
|   |   |   |   |   |-- AuditCompliance.test.tsx
|   |   |   |   |   `-- AuditCompliance.types.ts
|   |   |   |   |-- CanteenOrders
|   |   |   |   |   |-- CanteenOrders.api.ts
|   |   |   |   |   |-- CanteenOrders.hooks.ts
|   |   |   |   |   |-- CanteenOrders.page.tsx
|   |   |   |   |   |-- CanteenOrders.test.tsx
|   |   |   |   |   `-- CanteenOrders.types.ts
|   |   |   |   |-- Dashboard
|   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |-- EmployeeManagement
|   |   |   |   |   |-- EmployeeManagement.api.ts
|   |   |   |   |   |-- EmployeeManagement.hooks.ts
|   |   |   |   |   |-- EmployeeManagement.page.tsx
|   |   |   |   |   |-- EmployeeManagement.test.tsx
|   |   |   |   |   `-- EmployeeManagement.types.ts
|   |   |   |   |-- FacilityBooking
|   |   |   |   |   |-- FacilityBooking.api.ts
|   |   |   |   |   |-- FacilityBooking.hooks.ts
|   |   |   |   |   |-- FacilityBooking.page.tsx
|   |   |   |   |   |-- FacilityBooking.test.tsx
|   |   |   |   |   `-- FacilityBooking.types.ts
|   |   |   |   |-- FleetManagement
|   |   |   |   |   |-- FleetManagement.api.ts
|   |   |   |   |   |-- FleetManagement.hooks.ts
|   |   |   |   |   |-- FleetManagement.page.tsx
|   |   |   |   |   |-- FleetManagement.test.tsx
|   |   |   |   |   `-- FleetManagement.types.ts
|   |   |   |   |-- IdentitySecurity
|   |   |   |   |   |-- IdentitySecurity.api.ts
|   |   |   |   |   |-- IdentitySecurity.hooks.ts
|   |   |   |   |   |-- IdentitySecurity.page.tsx
|   |   |   |   |   |-- IdentitySecurity.test.tsx
|   |   |   |   |   `-- IdentitySecurity.types.ts
|   |   |   |   |-- IntegrationManagement
|   |   |   |   |   |-- IntegrationManagement.api.ts
|   |   |   |   |   |-- IntegrationManagement.hooks.ts
|   |   |   |   |   |-- IntegrationManagement.page.tsx
|   |   |   |   |   |-- IntegrationManagement.test.tsx
|   |   |   |   |   `-- IntegrationManagement.types.ts
|   |   |   |   |-- OrganizationManagement
|   |   |   |   |   |-- OrganizationManagement.api.ts
|   |   |   |   |   |-- OrganizationManagement.hooks.ts
|   |   |   |   |   |-- OrganizationManagement.page.tsx
|   |   |   |   |   |-- OrganizationManagement.test.tsx
|   |   |   |   |   `-- OrganizationManagement.types.ts
|   |   |   |   |-- PlatformMonitoring
|   |   |   |   |   |-- PlatformMonitoring.api.ts
|   |   |   |   |   |-- PlatformMonitoring.hooks.ts
|   |   |   |   |   |-- PlatformMonitoring.page.tsx
|   |   |   |   |   |-- PlatformMonitoring.test.tsx
|   |   |   |   |   `-- PlatformMonitoring.types.ts
|   |   |   |   |-- PurchaseOrders
|   |   |   |   |   |-- PurchaseOrders.api.ts
|   |   |   |   |   |-- PurchaseOrders.hooks.ts
|   |   |   |   |   |-- PurchaseOrders.page.tsx
|   |   |   |   |   |-- PurchaseOrders.test.tsx
|   |   |   |   |   `-- PurchaseOrders.types.ts
|   |   |   |   |-- RegistrarWorkspace
|   |   |   |   |   |-- RegistrarWorkspace.page.tsx
|   |   |   |   |   `-- components
|   |   |   |   |       |-- GraduationClearanceView.tsx
|   |   |   |   |       `-- TranscriptRequestsView.tsx
|   |   |   |   |-- Reports
|   |   |   |   |   |-- Reports.api.ts
|   |   |   |   |   |-- Reports.hooks.ts
|   |   |   |   |   |-- Reports.page.tsx
|   |   |   |   |   |-- Reports.test.tsx
|   |   |   |   |   `-- Reports.types.ts
|   |   |   |   |-- RoleAdministration
|   |   |   |   |   |-- RoleAdministration.api.ts
|   |   |   |   |   |-- RoleAdministration.hooks.ts
|   |   |   |   |   |-- RoleAdministration.page.tsx
|   |   |   |   |   |-- RoleAdministration.test.tsx
|   |   |   |   |   `-- RoleAdministration.types.ts
|   |   |   |   |-- StockManagement
|   |   |   |   |   |-- StockManagement.api.ts
|   |   |   |   |   |-- StockManagement.hooks.ts
|   |   |   |   |   |-- StockManagement.page.tsx
|   |   |   |   |   |-- StockManagement.test.tsx
|   |   |   |   |   `-- StockManagement.types.ts
|   |   |   |   |-- SystemAdministration
|   |   |   |   |   |-- SystemAdministration.api.ts
|   |   |   |   |   |-- SystemAdministration.hooks.ts
|   |   |   |   |   |-- SystemAdministration.page.tsx
|   |   |   |   |   |-- SystemAdministration.test.tsx
|   |   |   |   |   `-- SystemAdministration.types.ts
|   |   |   |   |-- UserAdministration
|   |   |   |   |   |-- UserAdministration.api.ts
|   |   |   |   |   |-- UserAdministration.hooks.ts
|   |   |   |   |   |-- UserAdministration.page.tsx
|   |   |   |   |   |-- UserAdministration.test.tsx
|   |   |   |   |   `-- UserAdministration.types.ts
|   |   |   |   `-- WorkflowManagement
|   |   |   |       |-- WorkflowManagement.api.ts
|   |   |   |       |-- WorkflowManagement.hooks.ts
|   |   |   |       |-- WorkflowManagement.page.tsx
|   |   |   |       |-- WorkflowManagement.test.tsx
|   |   |   |       `-- WorkflowManagement.types.ts
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- admissions-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-CmnkJuXB.css
|   |   |   |   `-- index-DimZ4ETb.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- App.tsx
|   |   |   |-- features
|   |   |   |   |-- AdmissionCases
|   |   |   |   |   |-- AdmissionCases.api.ts
|   |   |   |   |   |-- AdmissionCases.hooks.ts
|   |   |   |   |   |-- AdmissionCases.page.tsx
|   |   |   |   |   |-- AdmissionCases.page.tsx.bak
|   |   |   |   |   |-- AdmissionCases.test.tsx
|   |   |   |   |   `-- AdmissionCases.types.ts
|   |   |   |   |-- AdmissionsDecision
|   |   |   |   |   |-- AdmissionsDecision.api.ts
|   |   |   |   |   |-- AdmissionsDecision.hooks.ts
|   |   |   |   |   |-- AdmissionsDecision.page.tsx
|   |   |   |   |   |-- AdmissionsDecision.test.tsx
|   |   |   |   |   `-- AdmissionsDecision.types.ts
|   |   |   |   |-- AdmissionsProcessing
|   |   |   |   |   `-- components
|   |   |   |   |       `-- SecretaryIntakeView.tsx
|   |   |   |   |-- Applications
|   |   |   |   |   |-- AdmissionCase.page.tsx
|   |   |   |   |   `-- Applications.page.tsx
|   |   |   |   |-- Communication
|   |   |   |   |   `-- ApplicantCommunication.page.tsx
|   |   |   |   |-- Dashboard
|   |   |   |   |   `-- Dashboard.page.tsx
|   |   |   |   |-- EnrollmentHandoff
|   |   |   |   |   |-- EnrollmentHandoff.api.ts
|   |   |   |   |   |-- EnrollmentHandoff.hooks.ts
|   |   |   |   |   |-- EnrollmentHandoff.page.tsx
|   |   |   |   |   |-- EnrollmentHandoff.test.tsx
|   |   |   |   |   `-- EnrollmentHandoff.types.ts
|   |   |   |   |-- Examination
|   |   |   |   |   `-- EntranceExamination.page.tsx
|   |   |   |   |-- Fees
|   |   |   |   |   `-- AdmissionFees.page.tsx
|   |   |   |   |-- Intake
|   |   |   |   |   |-- ApplicationIntake.page.tsx
|   |   |   |   |   `-- ApplicationIntake.page.tsx.bak
|   |   |   |   |-- Interviews
|   |   |   |   |   |-- Interviews.api.ts
|   |   |   |   |   |-- Interviews.hooks.ts
|   |   |   |   |   |-- Interviews.page.tsx
|   |   |   |   |   |-- Interviews.test.tsx
|   |   |   |   |   `-- Interviews.types.ts
|   |   |   |   |-- Queue
|   |   |   |   |   `-- AdmissionQueue.page.tsx
|   |   |   |   |-- Reports
|   |   |   |   |   `-- AdmissionsReports.page.tsx
|   |   |   |   |-- RequirementManagement
|   |   |   |   |   |-- RequirementManagement.api.ts
|   |   |   |   |   |-- RequirementManagement.hooks.ts
|   |   |   |   |   |-- RequirementManagement.page.tsx
|   |   |   |   |   |-- RequirementManagement.test.tsx
|   |   |   |   |   `-- RequirementManagement.types.ts
|   |   |   |   |-- Review
|   |   |   |   |   `-- ApplicationReview.page.tsx
|   |   |   |   `-- Verification
|   |   |   |       `-- ApplicationVerification.page.tsx
|   |   |   |-- index.css
|   |   |   |-- main.tsx
|   |   |   `-- shell
|   |   |       |-- AppShell.tsx
|   |   |       `-- Routing.tsx
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- applicant-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-7TJ7Ms84.js
|   |   |   |   `-- index-CmnkJuXB.css
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- AdmissionStatus
|   |   |   |   |   |-- AdmissionStatus.api.ts
|   |   |   |   |   |-- AdmissionStatus.hooks.ts
|   |   |   |   |   |-- AdmissionStatus.page.tsx
|   |   |   |   |   |-- AdmissionStatus.test.tsx
|   |   |   |   |   `-- AdmissionStatus.types.ts
|   |   |   |   |-- ApplicantJourney.hooks.ts
|   |   |   |   |-- ApplicantJourney.test.tsx
|   |   |   |   |-- ApplicationForm
|   |   |   |   |   |-- ApplicationForm.api.ts
|   |   |   |   |   |-- ApplicationForm.hooks.ts
|   |   |   |   |   |-- ApplicationForm.page.tsx
|   |   |   |   |   |-- ApplicationForm.test.tsx
|   |   |   |   |   `-- ApplicationForm.types.ts
|   |   |   |   |-- ApplicationStatus
|   |   |   |   |   |-- ApplicationStatus.api.ts
|   |   |   |   |   |-- ApplicationStatus.hooks.ts
|   |   |   |   |   |-- ApplicationStatus.page.tsx
|   |   |   |   |   |-- ApplicationStatus.test.tsx
|   |   |   |   |   `-- ApplicationStatus.types.ts
|   |   |   |   |-- ApplicationTimeline
|   |   |   |   |   |-- ApplicationTimeline.api.ts
|   |   |   |   |   |-- ApplicationTimeline.hooks.ts
|   |   |   |   |   |-- ApplicationTimeline.page.tsx
|   |   |   |   |   |-- ApplicationTimeline.test.tsx
|   |   |   |   |   `-- ApplicationTimeline.types.ts
|   |   |   |   |-- ApplicationWizard
|   |   |   |   |   |-- ApplicationWizard.api.ts
|   |   |   |   |   |-- ApplicationWizard.hooks.ts
|   |   |   |   |   |-- ApplicationWizard.page.tsx
|   |   |   |   |   |-- ApplicationWizard.test.tsx
|   |   |   |   |   `-- ApplicationWizard.types.ts
|   |   |   |   |-- Dashboard
|   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |-- DocumentSubmission
|   |   |   |   |   |-- DocumentSubmission.api.ts
|   |   |   |   |   |-- DocumentSubmission.hooks.ts
|   |   |   |   |   |-- DocumentSubmission.page.tsx
|   |   |   |   |   |-- DocumentSubmission.test.tsx
|   |   |   |   |   `-- DocumentSubmission.types.ts
|   |   |   |   |-- DocumentUpload
|   |   |   |   |   |-- DocumentUpload.api.ts
|   |   |   |   |   |-- DocumentUpload.hooks.ts
|   |   |   |   |   |-- DocumentUpload.page.tsx
|   |   |   |   |   |-- DocumentUpload.test.tsx
|   |   |   |   |   `-- DocumentUpload.types.ts
|   |   |   |   |-- EligibilityChecker
|   |   |   |   |   |-- EligibilityChecker.api.ts
|   |   |   |   |   |-- EligibilityChecker.hooks.ts
|   |   |   |   |   |-- EligibilityChecker.page.tsx
|   |   |   |   |   |-- EligibilityChecker.test.tsx
|   |   |   |   |   `-- EligibilityChecker.types.ts
|   |   |   |   |-- EnrollmentPayment
|   |   |   |   |   |-- ApplicationFeePayment.page.tsx
|   |   |   |   |   |-- EnrollmentPayment.api.ts
|   |   |   |   |   |-- EnrollmentPayment.hooks.ts
|   |   |   |   |   |-- EnrollmentPayment.page.tsx
|   |   |   |   |   |-- EnrollmentPayment.test.tsx
|   |   |   |   |   `-- EnrollmentPayment.types.ts
|   |   |   |   |-- InterviewScheduling
|   |   |   |   |   |-- InterviewScheduling.api.ts
|   |   |   |   |   |-- InterviewScheduling.hooks.ts
|   |   |   |   |   |-- InterviewScheduling.page.tsx
|   |   |   |   |   |-- InterviewScheduling.test.tsx
|   |   |   |   |   `-- InterviewScheduling.types.ts
|   |   |   |   |-- Offers
|   |   |   |   |   |-- Offers.api.ts
|   |   |   |   |   |-- Offers.hooks.ts
|   |   |   |   |   |-- Offers.page.tsx
|   |   |   |   |   |-- Offers.test.tsx
|   |   |   |   |   `-- Offers.types.ts
|   |   |   |   `-- ProgramExplorer
|   |   |   |       |-- ProgramExplorer.api.ts
|   |   |   |       |-- ProgramExplorer.hooks.ts
|   |   |   |       |-- ProgramExplorer.page.tsx
|   |   |   |       |-- ProgramExplorer.test.tsx
|   |   |   |       `-- ProgramExplorer.types.ts
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   |-- ErrorBoundary.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   |-- theme.css
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- faculty-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-Dgt8zfi3.js
|   |   |   |   `-- index-cJBQpNUN.css
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- Advising
|   |   |   |   |   |-- Advising.api.ts
|   |   |   |   |   |-- Advising.hooks.ts
|   |   |   |   |   |-- Advising.page.tsx
|   |   |   |   |   |-- Advising.test.tsx
|   |   |   |   |   `-- Advising.types.ts
|   |   |   |   |-- Analytics
|   |   |   |   |   |-- Analytics.api.ts
|   |   |   |   |   |-- Analytics.hooks.ts
|   |   |   |   |   |-- Analytics.page.tsx
|   |   |   |   |   |-- Analytics.test.tsx
|   |   |   |   |   `-- Analytics.types.ts
|   |   |   |   |-- Assessments
|   |   |   |   |   |-- Assessments.api.ts
|   |   |   |   |   |-- Assessments.hooks.ts
|   |   |   |   |   |-- Assessments.page.tsx
|   |   |   |   |   |-- Assessments.test.tsx
|   |   |   |   |   `-- Assessments.types.ts
|   |   |   |   |-- ChairpersonWorkspace
|   |   |   |   |   |-- AcademicEvaluation.page.tsx
|   |   |   |   |   |-- CurriculumMatching.page.tsx
|   |   |   |   |   |-- EvaluationQueue.page.tsx
|   |   |   |   |   `-- Recommendation.page.tsx
|   |   |   |   |-- Communication
|   |   |   |   |   |-- Communication.api.ts
|   |   |   |   |   |-- Communication.hooks.ts
|   |   |   |   |   |-- Communication.page.tsx
|   |   |   |   |   |-- Communication.test.tsx
|   |   |   |   |   `-- Communication.types.ts
|   |   |   |   |-- Dashboard
|   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |-- DeanWorkspace
|   |   |   |   |   |-- CollegeApproval.page.tsx
|   |   |   |   |   |-- Endorsement.page.tsx
|   |   |   |   |   `-- RecommendationQueue.page.tsx
|   |   |   |   |-- Documents
|   |   |   |   |   |-- Documents.api.ts
|   |   |   |   |   |-- Documents.hooks.ts
|   |   |   |   |   |-- Documents.page.tsx
|   |   |   |   |   |-- Documents.test.tsx
|   |   |   |   |   `-- Documents.types.ts
|   |   |   |   |-- FacultySecurity
|   |   |   |   |   |-- ApplicantAccess.page.tsx
|   |   |   |   |   |-- ConfidentialDocuments.page.tsx
|   |   |   |   |   `-- RecommendationAudit.page.tsx
|   |   |   |   |-- LMSManager
|   |   |   |   |   |-- LMSManager.hooks.ts
|   |   |   |   |   `-- LMSManager.page.tsx
|   |   |   |   |-- Research
|   |   |   |   |   |-- Research.api.ts
|   |   |   |   |   |-- Research.hooks.ts
|   |   |   |   |   |-- Research.page.tsx
|   |   |   |   |   |-- Research.test.tsx
|   |   |   |   |   `-- Research.types.ts
|   |   |   |   |-- Schedule
|   |   |   |   |   |-- Schedule.api.ts
|   |   |   |   |   |-- Schedule.hooks.ts
|   |   |   |   |   |-- Schedule.page.tsx
|   |   |   |   |   |-- Schedule.test.tsx
|   |   |   |   |   `-- Schedule.types.ts
|   |   |   |   |-- SecretaryWorkspace
|   |   |   |   |   |-- AdmissionQueue.page.tsx
|   |   |   |   |   |-- DocumentVerification.page.tsx
|   |   |   |   |   |-- InterviewScheduling.page.tsx
|   |   |   |   |   `-- MissingRequirements.page.tsx
|   |   |   |   |-- Settings
|   |   |   |   |   |-- Settings.api.ts
|   |   |   |   |   |-- Settings.hooks.ts
|   |   |   |   |   |-- Settings.page.tsx
|   |   |   |   |   |-- Settings.test.tsx
|   |   |   |   |   `-- Settings.types.ts
|   |   |   |   |-- Students
|   |   |   |   |   |-- Students.api.ts
|   |   |   |   |   |-- Students.hooks.ts
|   |   |   |   |   |-- Students.page.tsx
|   |   |   |   |   |-- Students.test.tsx
|   |   |   |   |   |-- Students.types.ts
|   |   |   |   |   `-- StudentsDashboard.page.tsx
|   |   |   |   `-- Teaching
|   |   |   |       |-- SectionRoster.page.tsx
|   |   |   |       |-- SectionRoster.test.tsx
|   |   |   |       |-- Teaching.api.ts
|   |   |   |       |-- Teaching.hooks.ts
|   |   |   |       |-- Teaching.page.tsx
|   |   |   |       |-- Teaching.test.tsx
|   |   |   |       |-- Teaching.types.ts
|   |   |   |       `-- TeachingDashboard.page.tsx
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   |-- theme.css
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- finance-console
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   `-- index-D4VupJRD.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- Budgeting
|   |   |   |   |   |-- Budgeting.api.ts
|   |   |   |   |   |-- Budgeting.hooks.ts
|   |   |   |   |   |-- Budgeting.page.tsx
|   |   |   |   |   |-- Budgeting.test.tsx
|   |   |   |   |   `-- Budgeting.types.ts
|   |   |   |   |-- Cashier
|   |   |   |   |   |-- ClearanceApproval.page.tsx
|   |   |   |   |   `-- PaymentGateway.page.tsx
|   |   |   |   |-- Dashboard
|   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |-- EnrollmentFinance
|   |   |   |   |   |-- AdmissionAssessment
|   |   |   |   |   |   |-- AdmissionAssessment.api.ts
|   |   |   |   |   |   |-- AdmissionAssessment.hooks.ts
|   |   |   |   |   |   |-- AdmissionAssessment.page.tsx
|   |   |   |   |   |   |-- AdmissionAssessment.test.tsx
|   |   |   |   |   |   `-- AdmissionAssessment.types.ts
|   |   |   |   |   |-- Downpayment
|   |   |   |   |   |   |-- Downpayment.api.ts
|   |   |   |   |   |   |-- Downpayment.hooks.ts
|   |   |   |   |   |   |-- Downpayment.page.tsx
|   |   |   |   |   |   |-- Downpayment.test.tsx
|   |   |   |   |   |   `-- Downpayment.types.ts
|   |   |   |   |   `-- FinancialClearance
|   |   |   |   |       |-- FinancialClearance.api.ts
|   |   |   |   |       |-- FinancialClearance.hooks.ts
|   |   |   |   |       |-- FinancialClearance.page.tsx
|   |   |   |   |       |-- FinancialClearance.test.tsx
|   |   |   |   |       `-- FinancialClearance.types.ts
|   |   |   |   |-- FinanceConsole.test.tsx
|   |   |   |   |-- FinancialReports
|   |   |   |   |   |-- FinancialReports.api.ts
|   |   |   |   |   |-- FinancialReports.hooks.ts
|   |   |   |   |   |-- FinancialReports.page.tsx
|   |   |   |   |   |-- FinancialReports.test.tsx
|   |   |   |   |   `-- FinancialReports.types.ts
|   |   |   |   |-- Invoicing
|   |   |   |   |   |-- Invoicing.api.ts
|   |   |   |   |   |-- Invoicing.hooks.ts
|   |   |   |   |   |-- Invoicing.page.tsx
|   |   |   |   |   |-- Invoicing.test.tsx
|   |   |   |   |   `-- Invoicing.types.ts
|   |   |   |   |-- PaymentGateway
|   |   |   |   |   |-- PaymentGateway.api.ts
|   |   |   |   |   |-- PaymentGateway.hooks.ts
|   |   |   |   |   |-- PaymentGateway.page.tsx
|   |   |   |   |   |-- PaymentGateway.test.tsx
|   |   |   |   |   `-- PaymentGateway.types.ts
|   |   |   |   |-- Payroll
|   |   |   |   |   |-- Payroll.api.ts
|   |   |   |   |   |-- Payroll.hooks.ts
|   |   |   |   |   |-- Payroll.page.tsx
|   |   |   |   |   |-- Payroll.test.tsx
|   |   |   |   |   `-- Payroll.types.ts
|   |   |   |   |-- PayrollProcessing
|   |   |   |   |   |-- PayrollProcessing.hooks.ts
|   |   |   |   |   `-- PayrollProcessing.page.tsx
|   |   |   |   |-- SemesterBilling
|   |   |   |   |   |-- SemesterBilling.api.ts
|   |   |   |   |   |-- SemesterBilling.hooks.ts
|   |   |   |   |   |-- SemesterBilling.page.tsx
|   |   |   |   |   |-- SemesterBilling.test.tsx
|   |   |   |   |   `-- SemesterBilling.types.ts
|   |   |   |   |-- StudentBilling
|   |   |   |   |   |-- ScholarshipGrants.page.tsx
|   |   |   |   |   |-- StatementOfAccount.page.tsx
|   |   |   |   |   |-- StudentBilling.api.ts
|   |   |   |   |   |-- StudentBilling.hooks.ts
|   |   |   |   |   |-- StudentBilling.page.tsx
|   |   |   |   |   |-- StudentBilling.test.tsx
|   |   |   |   |   `-- StudentBilling.types.ts
|   |   |   |   `-- TuitionAssessment
|   |   |   |       `-- TuitionAssessment.page.tsx
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- governance-console
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   `-- index-MesTFSc4.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- Accreditation
|   |   |   |   |   |-- Accreditation.api.ts
|   |   |   |   |   |-- Accreditation.hooks.ts
|   |   |   |   |   |-- Accreditation.page.tsx
|   |   |   |   |   |-- Accreditation.test.tsx
|   |   |   |   |   `-- Accreditation.types.ts
|   |   |   |   |-- Audits
|   |   |   |   |   |-- Audits.api.ts
|   |   |   |   |   |-- Audits.hooks.ts
|   |   |   |   |   |-- Audits.page.tsx
|   |   |   |   |   |-- Audits.test.tsx
|   |   |   |   |   `-- Audits.types.ts
|   |   |   |   |-- Committees
|   |   |   |   |   |-- Committees.api.ts
|   |   |   |   |   |-- Committees.hooks.ts
|   |   |   |   |   |-- Committees.page.tsx
|   |   |   |   |   |-- Committees.test.tsx
|   |   |   |   |   `-- Committees.types.ts
|   |   |   |   |-- Compliance
|   |   |   |   |   |-- Compliance.api.ts
|   |   |   |   |   |-- Compliance.hooks.ts
|   |   |   |   |   |-- Compliance.page.tsx
|   |   |   |   |   |-- Compliance.test.tsx
|   |   |   |   |   `-- Compliance.types.ts
|   |   |   |   |-- Events
|   |   |   |   |   `-- Events.page.tsx
|   |   |   |   |-- Grievances
|   |   |   |   |   `-- Grievances.page.tsx
|   |   |   |   |-- Helpdesk
|   |   |   |   |   `-- Helpdesk.page.tsx
|   |   |   |   |-- Policies
|   |   |   |   |   |-- Policies.api.ts
|   |   |   |   |   |-- Policies.hooks.ts
|   |   |   |   |   |-- Policies.page.tsx
|   |   |   |   |   |-- Policies.test.tsx
|   |   |   |   |   `-- Policies.types.ts
|   |   |   |   |-- QualityAccreditation
|   |   |   |   |   `-- QualityAccreditation.page.tsx
|   |   |   |   |-- RiskManagement
|   |   |   |   |   |-- RiskManagement.api.ts
|   |   |   |   |   |-- RiskManagement.hooks.ts
|   |   |   |   |   |-- RiskManagement.page.tsx
|   |   |   |   |   |-- RiskManagement.test.tsx
|   |   |   |   |   `-- RiskManagement.types.ts
|   |   |   |   `-- Visitors
|   |   |   |       `-- Visitors.page.tsx
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- identity-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   `-- index-BapRoB-Z.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- Email
|   |   |   |   |   `-- EmailProvisioning.page.tsx
|   |   |   |   |-- MFA
|   |   |   |   |   |-- AccessRevocation.page.tsx
|   |   |   |   |   `-- MFASetup.page.tsx
|   |   |   |   |-- MfaVerification
|   |   |   |   |   |-- MfaVerification.api.ts
|   |   |   |   |   |-- MfaVerification.hooks.ts
|   |   |   |   |   |-- MfaVerification.page.tsx
|   |   |   |   |   |-- MfaVerification.test.tsx
|   |   |   |   |   `-- MfaVerification.types.ts
|   |   |   |   |-- MultiFactorAuth
|   |   |   |   |   |-- MultiFactorAuth.api.ts
|   |   |   |   |   |-- MultiFactorAuth.hooks.ts
|   |   |   |   |   |-- MultiFactorAuth.page.tsx
|   |   |   |   |   |-- MultiFactorAuth.test.tsx
|   |   |   |   |   `-- MultiFactorAuth.types.ts
|   |   |   |   |-- PasswordRecovery
|   |   |   |   |   |-- PasswordRecovery.api.ts
|   |   |   |   |   |-- PasswordRecovery.hooks.ts
|   |   |   |   |   |-- PasswordRecovery.page.tsx
|   |   |   |   |   |-- PasswordRecovery.test.tsx
|   |   |   |   |   `-- PasswordRecovery.types.ts
|   |   |   |   |-- PasswordReset
|   |   |   |   |   |-- PasswordReset.api.ts
|   |   |   |   |   |-- PasswordReset.hooks.ts
|   |   |   |   |   |-- PasswordReset.page.tsx
|   |   |   |   |   |-- PasswordReset.test.tsx
|   |   |   |   |   `-- PasswordReset.types.ts
|   |   |   |   |-- SecuritySettings
|   |   |   |   |   |-- SecuritySettings.api.ts
|   |   |   |   |   |-- SecuritySettings.hooks.ts
|   |   |   |   |   |-- SecuritySettings.page.tsx
|   |   |   |   |   |-- SecuritySettings.test.tsx
|   |   |   |   |   `-- SecuritySettings.types.ts
|   |   |   |   |-- SessionManagement
|   |   |   |   |   |-- SessionManagement.api.ts
|   |   |   |   |   |-- SessionManagement.hooks.ts
|   |   |   |   |   |-- SessionManagement.page.tsx
|   |   |   |   |   |-- SessionManagement.test.tsx
|   |   |   |   |   `-- SessionManagement.types.ts
|   |   |   |   |-- UniversityAccount
|   |   |   |   |   |-- AccountProvisioning.page.tsx
|   |   |   |   |   `-- DirectorySearch.page.tsx
|   |   |   |   |-- UserLogin
|   |   |   |   |   |-- UserLogin.api.ts
|   |   |   |   |   |-- UserLogin.hooks.ts
|   |   |   |   |   |-- UserLogin.page.tsx
|   |   |   |   |   |-- UserLogin.test.tsx
|   |   |   |   |   `-- UserLogin.types.ts
|   |   |   |   `-- UserRegistration
|   |   |   |       |-- UserRegistration.api.ts
|   |   |   |       |-- UserRegistration.hooks.ts
|   |   |   |       |-- UserRegistration.page.tsx
|   |   |   |       |-- UserRegistration.test.tsx
|   |   |   |       `-- UserRegistration.types.ts
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- library-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   `-- index-Cg4XXSgl.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- CatalogSearch
|   |   |   |   |   |-- CatalogSearch.api.ts
|   |   |   |   |   |-- CatalogSearch.hooks.ts
|   |   |   |   |   |-- CatalogSearch.page.tsx
|   |   |   |   |   |-- CatalogSearch.test.tsx
|   |   |   |   |   `-- CatalogSearch.types.ts
|   |   |   |   |-- Circulation
|   |   |   |   |   `-- Circulation.page.tsx
|   |   |   |   |-- DigitalResources
|   |   |   |   |   |-- DigitalResources.api.ts
|   |   |   |   |   |-- DigitalResources.hooks.ts
|   |   |   |   |   |-- DigitalResources.page.tsx
|   |   |   |   |   |-- DigitalResources.test.tsx
|   |   |   |   |   `-- DigitalResources.types.ts
|   |   |   |   |-- Fines
|   |   |   |   |   |-- Fines.api.ts
|   |   |   |   |   |-- Fines.hooks.ts
|   |   |   |   |   |-- Fines.page.tsx
|   |   |   |   |   |-- Fines.test.tsx
|   |   |   |   |   `-- Fines.types.ts
|   |   |   |   |-- MyLoans
|   |   |   |   |   |-- MyLoans.api.ts
|   |   |   |   |   |-- MyLoans.hooks.ts
|   |   |   |   |   |-- MyLoans.page.tsx
|   |   |   |   |   |-- MyLoans.test.tsx
|   |   |   |   |   `-- MyLoans.types.ts
|   |   |   |   `-- Reservations
|   |   |   |       |-- Reservations.api.ts
|   |   |   |       |-- Reservations.hooks.ts
|   |   |   |       |-- Reservations.page.tsx
|   |   |   |       |-- Reservations.test.tsx
|   |   |   |       `-- Reservations.types.ts
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- lms-web
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   `-- index-B27XvGfG.js
|   |   |   |-- index.html
|   |   |   |-- manifest.webmanifest
|   |   |   `-- service-worker.ts
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- public
|   |   |   |-- manifest.webmanifest
|   |   |   `-- service-worker.ts
|   |   |-- src
|   |   |   |-- config
|   |   |   |   `-- env.ts
|   |   |   |-- features
|   |   |   |   |-- AssignmentDraftEditor
|   |   |   |   |-- Assignments
|   |   |   |   |   |-- Assignments.api.ts
|   |   |   |   |   |-- Assignments.hooks.ts
|   |   |   |   |   |-- Assignments.page.tsx
|   |   |   |   |   |-- Assignments.test.tsx
|   |   |   |   |   `-- Assignments.types.ts
|   |   |   |   |-- Calendar
|   |   |   |   |   |-- Calendar.api.ts
|   |   |   |   |   |-- Calendar.hooks.ts
|   |   |   |   |   |-- Calendar.page.tsx
|   |   |   |   |   |-- Calendar.test.tsx
|   |   |   |   |   `-- Calendar.types.ts
|   |   |   |   |-- CourseAdministration
|   |   |   |   |   `-- CoursePackaging.page.tsx
|   |   |   |   |-- CourseContent
|   |   |   |   |   |-- CourseContent.api.ts
|   |   |   |   |   |-- CourseContent.hooks.ts
|   |   |   |   |   |-- CourseContent.page.tsx
|   |   |   |   |   |-- CourseContent.test.tsx
|   |   |   |   |   `-- CourseContent.types.ts
|   |   |   |   |-- Dashboard
|   |   |   |   |   |-- Dashboard.api.ts
|   |   |   |   |   |-- Dashboard.hooks.ts
|   |   |   |   |   |-- Dashboard.page.tsx
|   |   |   |   |   |-- Dashboard.test.tsx
|   |   |   |   |   `-- Dashboard.types.ts
|   |   |   |   |-- Discussions
|   |   |   |   |   |-- Discussions.api.ts
|   |   |   |   |   |-- Discussions.hooks.ts
|   |   |   |   |   |-- Discussions.page.tsx
|   |   |   |   |   |-- Discussions.test.tsx
|   |   |   |   |   `-- Discussions.types.ts
|   |   |   |   |-- GradebookOrchestration
|   |   |   |   |   `-- GradebookSync.page.tsx
|   |   |   |   |-- Grades
|   |   |   |   |   |-- Grades.api.ts
|   |   |   |   |   |-- Grades.hooks.ts
|   |   |   |   |   |-- Grades.page.tsx
|   |   |   |   |   |-- Grades.test.tsx
|   |   |   |   |   `-- Grades.types.ts
|   |   |   |   |-- ModuleTimeline
|   |   |   |   |   `-- ModuleTimeline.page.tsx
|   |   |   |   |-- OfflineSubmissionReview
|   |   |   |   |   `-- SubmissionReview.page.tsx
|   |   |   |   |-- QuizWindowGuard
|   |   |   |   `-- Quizzes
|   |   |   |       |-- Quizzes.api.ts
|   |   |   |       |-- Quizzes.hooks.ts
|   |   |   |       |-- Quizzes.page.tsx
|   |   |   |       |-- Quizzes.test.tsx
|   |   |   |       `-- Quizzes.types.ts
|   |   |   |-- main.tsx
|   |   |   |-- offline
|   |   |   |   |-- indexedDbSchema.ts
|   |   |   |   |-- serviceWorkerRegistration.ts
|   |   |   |   `-- syncQueue.ts
|   |   |   |-- shell
|   |   |   |   |-- AppShell.tsx
|   |   |   |   `-- Routing.tsx
|   |   |   |-- state
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- payment-gateway
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-DnpdxvTm.js
|   |   |   |   `-- index-cJBQpNUN.css
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- App.tsx
|   |   |   `-- main.tsx
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- platform-console
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   `-- index-CDXWAHcf.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- features
|   |   |   |   |-- APIKeys
|   |   |   |   |   |-- APIKeys.api.ts
|   |   |   |   |   |-- APIKeys.hooks.ts
|   |   |   |   |   |-- APIKeys.page.tsx
|   |   |   |   |   |-- APIKeys.test.tsx
|   |   |   |   |   `-- APIKeys.types.ts
|   |   |   |   |-- AnalyticsBI
|   |   |   |   |   `-- AnalyticsBI.page.tsx
|   |   |   |   |-- CRM
|   |   |   |   |   `-- CRM.page.tsx
|   |   |   |   |-- Communication
|   |   |   |   |   `-- Communication.page.tsx
|   |   |   |   |-- DatabaseManagement
|   |   |   |   |   |-- DatabaseManagement.api.ts
|   |   |   |   |   |-- DatabaseManagement.hooks.ts
|   |   |   |   |   |-- DatabaseManagement.page.tsx
|   |   |   |   |   |-- DatabaseManagement.test.tsx
|   |   |   |   |   `-- DatabaseManagement.types.ts
|   |   |   |   |-- DocumentManagement
|   |   |   |   |   `-- DocumentManagement.page.tsx
|   |   |   |   |-- GlobalSettings
|   |   |   |   |   |-- GlobalSettings.api.ts
|   |   |   |   |   |-- GlobalSettings.hooks.ts
|   |   |   |   |   |-- GlobalSettings.page.tsx
|   |   |   |   |   |-- GlobalSettings.test.tsx
|   |   |   |   |   `-- GlobalSettings.types.ts
|   |   |   |   |-- MultiCampus
|   |   |   |   |   `-- MultiCampus.page.tsx
|   |   |   |   |-- Notification
|   |   |   |   |   `-- Notification.page.tsx
|   |   |   |   |-- SecurityAudits
|   |   |   |   |   |-- SecurityAudits.api.ts
|   |   |   |   |   |-- SecurityAudits.hooks.ts
|   |   |   |   |   |-- SecurityAudits.page.tsx
|   |   |   |   |   |-- SecurityAudits.test.tsx
|   |   |   |   |   `-- SecurityAudits.types.ts
|   |   |   |   |-- SystemLogs
|   |   |   |   |   |-- SystemLogs.api.ts
|   |   |   |   |   |-- SystemLogs.hooks.ts
|   |   |   |   |   |-- SystemLogs.page.tsx
|   |   |   |   |   |-- SystemLogs.test.tsx
|   |   |   |   |   `-- SystemLogs.types.ts
|   |   |   |   `-- TenantManagement
|   |   |   |       |-- TenantManagement.api.ts
|   |   |   |       |-- TenantManagement.hooks.ts
|   |   |   |       |-- TenantManagement.page.tsx
|   |   |   |       |-- TenantManagement.test.tsx
|   |   |   |       `-- TenantManagement.types.ts
|   |   |   |-- main.tsx
|   |   |   |-- shell
|   |   |   |   `-- Routing.tsx
|   |   |   `-- vite-env.d.ts
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- registrar-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-CmnkJuXB.css
|   |   |   |   `-- index-qmryzBB_.js
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- App.tsx
|   |   |   |-- features
|   |   |   |   |-- AcademicComplianceDivision
|   |   |   |   |   |-- CHEDCompliance.page.tsx
|   |   |   |   |   |-- Compliance.api.ts
|   |   |   |   |   |-- Compliance.hooks.ts
|   |   |   |   |   |-- Compliance.types.ts
|   |   |   |   |   `-- ResidencyRules.page.tsx
|   |   |   |   |-- AcademicRecordsDivision
|   |   |   |   |   |-- AcademicRecordInitialization.page.tsx
|   |   |   |   |   |-- AcademicRecordInitialization.test.tsx
|   |   |   |   |   |-- AcademicStanding.page.tsx
|   |   |   |   |   |-- AcademicStanding.test.tsx
|   |   |   |   |   |-- OfficialGrades.page.tsx
|   |   |   |   |   |-- OfficialGrades.test.tsx
|   |   |   |   |   |-- Records.api.ts
|   |   |   |   |   |-- Records.hooks.ts
|   |   |   |   |   `-- Records.types.ts
|   |   |   |   |-- AcademicSchedulingDivision
|   |   |   |   |   |-- AcademicSchedulingDivision.api.ts
|   |   |   |   |   |-- AcademicSchedulingDivision.hooks.ts
|   |   |   |   |   |-- AcademicSchedulingDivision.page.tsx
|   |   |   |   |   |-- AcademicSchedulingDivision.test.tsx
|   |   |   |   |   `-- AcademicSchedulingDivision.types.ts
|   |   |   |   |-- Admissions
|   |   |   |   |   `-- EnrollmentActivation.page.tsx
|   |   |   |   |-- AdmissionsDivision
|   |   |   |   |   |-- Admissions.api.ts
|   |   |   |   |   |-- Admissions.hooks.ts
|   |   |   |   |   |-- Admissions.types.ts
|   |   |   |   |   |-- AdmissionsQueue.page.tsx
|   |   |   |   |   `-- FacultyEndorsements.page.tsx
|   |   |   |   |-- CertificationDivision
|   |   |   |   |   |-- Certification.api.ts
|   |   |   |   |   |-- Certification.hooks.ts
|   |   |   |   |   |-- Certification.types.ts
|   |   |   |   |   |-- DiplomaVerification.page.tsx
|   |   |   |   |   `-- TranscriptRequests.page.tsx
|   |   |   |   |-- ClearanceProcessing
|   |   |   |   |   `-- PendingClearancesView.tsx
|   |   |   |   |-- CrossEnrollmentDivision
|   |   |   |   |   |-- CrossEnrollmentDivision.api.ts
|   |   |   |   |   |-- CrossEnrollmentDivision.hooks.ts
|   |   |   |   |   |-- CrossEnrollmentDivision.page.tsx
|   |   |   |   |   |-- CrossEnrollmentDivision.test.tsx
|   |   |   |   |   `-- CrossEnrollmentDivision.types.ts
|   |   |   |   |-- CurriculumDivision
|   |   |   |   |   |-- CourseOfferings.page.tsx
|   |   |   |   |   |-- CourseOfferings.test.tsx
|   |   |   |   |   |-- Curriculum.api.ts
|   |   |   |   |   |-- Curriculum.hooks.ts
|   |   |   |   |   |-- Curriculum.types.ts
|   |   |   |   |   |-- Prerequisites.page.tsx
|   |   |   |   |   |-- Prerequisites.test.tsx
|   |   |   |   |   |-- SubjectCatalog.page.tsx
|   |   |   |   |   `-- SubjectCatalog.test.tsx
|   |   |   |   |-- EnrollmentDivision
|   |   |   |   |   |-- AddDropOversight.page.tsx
|   |   |   |   |   |-- AddDropOversight.test.tsx
|   |   |   |   |   |-- Enrollment.api.ts
|   |   |   |   |   |-- Enrollment.hooks.ts
|   |   |   |   |   |-- Enrollment.types.ts
|   |   |   |   |   |-- EnrollmentValidation.page.tsx
|   |   |   |   |   |-- EnrollmentValidation.test.tsx
|   |   |   |   |   |-- RegistrationExceptions.page.tsx
|   |   |   |   |   |-- RegistrationExceptions.test.tsx
|   |   |   |   |   |-- RegistrationRequests.page.tsx
|   |   |   |   |   |-- RegistrationRequests.test.tsx
|   |   |   |   |   |-- RegistrationWindows.page.tsx
|   |   |   |   |   |-- RegistrationWindows.test.tsx
|   |   |   |   |   |-- SubjectLoading.page.tsx
|   |   |   |   |   |-- SubjectLoading.test.tsx
|   |   |   |   |   |-- Waitlists.page.tsx
|   |   |   |   |   `-- Waitlists.test.tsx
|   |   |   |   |-- GraduationDivision
|   |   |   |   |   |-- Graduation.api.ts
|   |   |   |   |   |-- Graduation.hooks.ts
|   |   |   |   |   |-- Graduation.types.ts
|   |   |   |   |   |-- GraduationCandidates.page.tsx
|   |   |   |   |   `-- LatinHonors.page.tsx
|   |   |   |   |-- RegistrarDashboard
|   |   |   |   |   |-- RegistrarDashboard.api.ts
|   |   |   |   |   |-- RegistrarDashboard.hooks.ts
|   |   |   |   |   |-- RegistrarDashboard.page.tsx
|   |   |   |   |   |-- RegistrarDashboard.test.tsx
|   |   |   |   |   `-- RegistrarDashboard.types.ts
|   |   |   |   |-- RegistrarEnrollmentValidation.test.tsx
|   |   |   |   |-- RegistrarIntegration.test.tsx
|   |   |   |   |-- RegistrarSecurity
|   |   |   |   |   |-- RecordAccessAudit.page.tsx
|   |   |   |   |   |-- Security.api.ts
|   |   |   |   |   |-- Security.hooks.ts
|   |   |   |   |   |-- Security.types.ts
|   |   |   |   |   `-- SensitiveVault.page.tsx
|   |   |   |   |-- StudentRegistryDivision
|   |   |   |   |   |-- LeaveOfAbsence.page.tsx
|   |   |   |   |   |-- MasterStudentList.page.tsx
|   |   |   |   |   |-- MasterStudentList.test.tsx
|   |   |   |   |   |-- Registry.api.ts
|   |   |   |   |   |-- Registry.hooks.ts
|   |   |   |   |   |-- Registry.types.ts
|   |   |   |   |   |-- StudentNumberAssignment.page.tsx
|   |   |   |   |   `-- StudentProfile.page.tsx
|   |   |   |   |-- StudentServicesDivision
|   |   |   |   |   |-- DataCorrections.page.tsx
|   |   |   |   |   |-- Services.api.ts
|   |   |   |   |   |-- Services.hooks.ts
|   |   |   |   |   |-- Services.types.ts
|   |   |   |   |   `-- StudentInquiries.page.tsx
|   |   |   |   `-- TransferDivision
|   |   |   |       |-- TransferDivision.api.ts
|   |   |   |       |-- TransferDivision.hooks.ts
|   |   |   |       |-- TransferDivision.page.tsx
|   |   |   |       |-- TransferDivision.test.tsx
|   |   |   |       `-- TransferDivision.types.ts
|   |   |   |-- main.tsx
|   |   |   `-- shell
|   |   |       |-- AppShell.tsx
|   |   |       |-- GlobalSearchModal.tsx
|   |   |       `-- Routing.tsx
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   |-- security-portal
|   |   |-- dist
|   |   |   |-- assets
|   |   |   |   |-- index-Dfxy4O-t.js
|   |   |   |   `-- index-cJBQpNUN.css
|   |   |   `-- index.html
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- App.tsx
|   |   |   |-- main.tsx
|   |   |   `-- shell
|   |   |       |-- AppShell.tsx
|   |   |       `-- Routing.tsx
|   |   |-- tsconfig.json
|   |   |-- tsconfig.node.json
|   |   `-- vite.config.ts
|   `-- student-portal
|       |-- dist
|       |   |-- assets
|       |   |   |-- index-CT34Fv1n.js
|       |   |   `-- index-cJBQpNUN.css
|       |   `-- index.html
|       |-- index.html
|       |-- package.json
|       |-- public
|       |-- src
|       |   |-- config
|       |   |   `-- env.ts
|       |   |-- features
|       |   |   |-- AcademicRecord
|       |   |   |   |-- AcademicRecord.api.ts
|       |   |   |   |-- AcademicRecord.hooks.ts
|       |   |   |   |-- AcademicRecord.page.tsx
|       |   |   |   |-- AcademicRecord.test.tsx
|       |   |   |   `-- AcademicRecord.types.ts
|       |   |   |-- AlumniNetwork
|       |   |   |   |-- AlumniNetwork.api.ts
|       |   |   |   |-- AlumniNetwork.hooks.ts
|       |   |   |   |-- AlumniNetwork.page.tsx
|       |   |   |   |-- AlumniNetwork.test.tsx
|       |   |   |   `-- AlumniNetwork.types.ts
|       |   |   |-- CareerDashboard
|       |   |   |   |-- CareerDashboard.api.ts
|       |   |   |   |-- CareerDashboard.hooks.ts
|       |   |   |   |-- CareerDashboard.page.tsx
|       |   |   |   |-- CareerDashboard.test.tsx
|       |   |   |   `-- CareerDashboard.types.ts
|       |   |   |-- Clearance
|       |   |   |   |-- Clearance.api.ts
|       |   |   |   |-- Clearance.hooks.ts
|       |   |   |   |-- Clearance.page.tsx
|       |   |   |   |-- Clearance.test.tsx
|       |   |   |   `-- Clearance.types.ts
|       |   |   |-- CrossEnrollment
|       |   |   |   |-- CrossEnrollment.api.ts
|       |   |   |   |-- CrossEnrollment.hooks.ts
|       |   |   |   |-- CrossEnrollment.page.tsx
|       |   |   |   |-- CrossEnrollment.test.tsx
|       |   |   |   `-- CrossEnrollment.types.ts
|       |   |   |-- CurriculumProgress
|       |   |   |   |-- CurriculumProgress.api.ts
|       |   |   |   |-- CurriculumProgress.hooks.ts
|       |   |   |   |-- CurriculumProgress.page.tsx
|       |   |   |   |-- CurriculumProgress.test.tsx
|       |   |   |   `-- CurriculumProgress.types.ts
|       |   |   |-- Dashboard
|       |   |   |   |-- Dashboard.api.ts
|       |   |   |   |-- Dashboard.hooks.ts
|       |   |   |   |-- Dashboard.page.tsx
|       |   |   |   |-- Dashboard.test.tsx
|       |   |   |   `-- Dashboard.types.ts
|       |   |   |-- Enrollment
|       |   |   |   |-- Enrollment.api.ts
|       |   |   |   |-- Enrollment.hooks.ts
|       |   |   |   |-- Enrollment.page.tsx
|       |   |   |   |-- Enrollment.test.tsx
|       |   |   |   `-- Enrollment.types.ts
|       |   |   |-- EnrollmentHistory
|       |   |   |   |-- EnrollmentHistory.api.ts
|       |   |   |   |-- EnrollmentHistory.hooks.ts
|       |   |   |   |-- EnrollmentHistory.page.tsx
|       |   |   |   |-- EnrollmentHistory.test.tsx
|       |   |   |   `-- EnrollmentHistory.types.ts
|       |   |   |-- Extracurriculars
|       |   |   |   |-- Extracurriculars.api.ts
|       |   |   |   |-- Extracurriculars.hooks.ts
|       |   |   |   |-- Extracurriculars.page.tsx
|       |   |   |   |-- Extracurriculars.test.tsx
|       |   |   |   `-- Extracurriculars.types.ts
|       |   |   |-- Financials
|       |   |   |   |-- Financials.api.ts
|       |   |   |   |-- Financials.hooks.ts
|       |   |   |   |-- Financials.page.tsx
|       |   |   |   |-- Financials.test.tsx
|       |   |   |   `-- Financials.types.ts
|       |   |   |-- Graduation
|       |   |   |   |-- Graduation.api.ts
|       |   |   |   |-- Graduation.hooks.ts
|       |   |   |   |-- Graduation.page.tsx
|       |   |   |   |-- Graduation.test.tsx
|       |   |   |   `-- Graduation.types.ts
|       |   |   |-- GuidanceSessions
|       |   |   |   |-- GuidanceSessions.api.ts
|       |   |   |   |-- GuidanceSessions.hooks.ts
|       |   |   |   |-- GuidanceSessions.page.tsx
|       |   |   |   |-- GuidanceSessions.test.tsx
|       |   |   |   `-- GuidanceSessions.types.ts
|       |   |   |-- HealthRecords
|       |   |   |   |-- HealthRecords.api.ts
|       |   |   |   |-- HealthRecords.hooks.ts
|       |   |   |   |-- HealthRecords.page.tsx
|       |   |   |   |-- HealthRecords.test.tsx
|       |   |   |   `-- HealthRecords.types.ts
|       |   |   |-- HostelAllocation
|       |   |   |   |-- HostelAllocation.api.ts
|       |   |   |   |-- HostelAllocation.hooks.ts
|       |   |   |   |-- HostelAllocation.page.tsx
|       |   |   |   |-- HostelAllocation.test.tsx
|       |   |   |   `-- HostelAllocation.types.ts
|       |   |   |-- LearningManagement
|       |   |   |   |-- LearningManagement.hooks.ts
|       |   |   |   |-- LearningManagement.page.tsx
|       |   |   |   `-- LearningManagement.styles.css
|       |   |   |-- MyEnrollments
|       |   |   |   |-- MyEnrollments.api.ts
|       |   |   |   |-- MyEnrollments.hooks.ts
|       |   |   |   |-- MyEnrollments.page.tsx
|       |   |   |   |-- MyEnrollments.styles.css
|       |   |   |   |-- MyEnrollments.test.tsx
|       |   |   |   `-- MyEnrollments.types.ts
|       |   |   |-- Registration
|       |   |   |   |-- BrowseCourses.page.tsx
|       |   |   |   |-- BrowseCourses.test.tsx
|       |   |   |   |-- MyRegistration.page.tsx
|       |   |   |   |-- MyRegistration.test.tsx
|       |   |   |   |-- Registration.api.ts
|       |   |   |   |-- Registration.hooks.ts
|       |   |   |   |-- Registration.page.tsx
|       |   |   |   |-- Registration.test.tsx
|       |   |   |   |-- Registration.types.ts
|       |   |   |   |-- Waitlist.page.tsx
|       |   |   |   `-- Waitlist.test.tsx
|       |   |   |-- Schedule
|       |   |   |   |-- Schedule.api.ts
|       |   |   |   |-- Schedule.hooks.ts
|       |   |   |   |-- Schedule.page.tsx
|       |   |   |   |-- Schedule.test.tsx
|       |   |   |   `-- Schedule.types.ts
|       |   |   |-- StudentProfile
|       |   |   |   |-- StudentProfile.api.ts
|       |   |   |   |-- StudentProfile.hooks.ts
|       |   |   |   |-- StudentProfile.page.tsx
|       |   |   |   |-- StudentProfile.test.tsx
|       |   |   |   `-- StudentProfile.types.ts
|       |   |   `-- Timetable
|       |   |       |-- Timetable.api.ts
|       |   |       |-- Timetable.hooks.ts
|       |   |       |-- Timetable.page.tsx
|       |   |       |-- Timetable.test.tsx
|       |   |       `-- Timetable.types.ts
|       |   |-- main.tsx
|       |   |-- shell
|       |   |   |-- AppShell.tsx
|       |   |   |-- ErrorBoundary.tsx
|       |   |   |-- NavigationLogger.tsx
|       |   |   `-- Routing.tsx
|       |   |-- state
|       |   |-- theme.css
|       |   `-- vite-env.d.ts
|       |-- tsconfig.json
|       |-- tsconfig.node.json
|       `-- vite.config.ts
|-- bootstrap.sh
|-- clients
|   `-- lms-offline-avalonia
|       |-- ApplyDynamicResources.ps1
|       |-- FixSpacing.ps1
|       |-- LmsOffline.Application
|       |   |-- Features
|       |   |   |-- Analytics
|       |   |   |   `-- LogxApiEventCommand.cs
|       |   |   |-- Auth
|       |   |   |   `-- AuthenticateStudentCommandHandler.cs
|       |   |   |-- AuthenticateStudent
|       |   |   |   |-- AuthenticateStudentCommand.cs
|       |   |   |   |-- AuthenticateStudentCommandHandler.cs
|       |   |   |   `-- AuthenticateStudentResult.cs
|       |   |   |-- Dashboard
|       |   |   |   |-- GetStudentDashboardStatsQuery.cs
|       |   |   |   `-- GetStudentDashboardStatsQueryHandler.cs
|       |   |   |-- Diagnostics
|       |   |   |   `-- GetSystemHealthQuery.cs
|       |   |   |-- DownloadModulePackage
|       |   |   |   |-- DownloadModulePackageCommand.cs
|       |   |   |   `-- DownloadModulePackageCommandHandler.cs
|       |   |   |-- Grades
|       |   |   |   |-- GetLocalGradesQuery.cs
|       |   |   |   `-- SyncGradesFromBackendCommand.cs
|       |   |   |-- PackageManager
|       |   |   |   |-- GetInstalledPackagesQuery.cs
|       |   |   |   |-- VerifyPackageCommand.cs
|       |   |   |   `-- VerifyPackageIntegrityCommand.cs
|       |   |   |-- StartOfflineAssessment
|       |   |   |   |-- StartOfflineAssessmentCommand.cs
|       |   |   |   `-- StartOfflineAssessmentCommandHandler.cs
|       |   |   |-- SubmitOfflineAssessment
|       |   |   |   |-- SubmitOfflineAssessmentCommand.cs
|       |   |   |   `-- SubmitOfflineAssessmentCommandHandler.cs
|       |   |   |-- SubmitOfflineAssignment
|       |   |   |   |-- SubmitOfflineAssignmentCommand.cs
|       |   |   |   `-- SubmitOfflineAssignmentCommandHandler.cs
|       |   |   `-- SyncPendingSubmissions
|       |   |       |-- SyncPendingSubmissionsCommand.cs
|       |   |       `-- SyncPendingSubmissionsCommandHandler.cs
|       |   |-- Interfaces
|       |   |   |-- IDashboardRepository.cs
|       |   |   |-- IExamIntegrityService.cs
|       |   |   |-- IExternalIdentityService.cs
|       |   |   |-- ILocalGradeRepository.cs
|       |   |   |-- ILocalLearningRecordStore.cs
|       |   |   |-- ILocalPackageRepository.cs
|       |   |   |-- ILocalStorageDiagnostics.cs
|       |   |   |-- IOfflineAssessmentRepository.cs
|       |   |   |-- IOfflineAssignmentRepository.cs
|       |   |   |-- IOfflineIdentityRepository.cs
|       |   |   |-- IOfflineModuleRepository.cs
|       |   |   |-- IPackageSecurityService.cs
|       |   |   |-- IPackageVerifier.cs
|       |   |   `-- IPasswordHasher.cs
|       |   |-- LmsOffline.Application.csproj
|       |   |-- ModuleRegistration.cs
|       |   `-- Validators
|       |       `-- StartOfflineAssessmentCommandValidator.cs
|       |-- LmsOffline.Contracts
|       |   |-- IntegrationEvents
|       |   |   |-- LearningAnalyticsBatchReadyEvent.cs
|       |   |   |-- OfflineAssessmentSubmitted.cs
|       |   |   |-- OfflineAssignmentSubmitted.cs
|       |   |   `-- PackageVerifiedEvent.cs
|       |   `-- LmsOffline.Contracts.csproj
|       |-- LmsOffline.Domain
|       |   |-- Aggregates
|       |   |   |-- CoursePackage.cs
|       |   |   |-- GradeRecord.cs
|       |   |   |-- LearningEvent.cs
|       |   |   |-- OfflineAssessment.cs
|       |   |   |-- OfflineAssignment.cs
|       |   |   |-- OfflineModule.cs
|       |   |   `-- StudentUser.cs
|       |   |-- Entities
|       |   |   `-- StudentUser.cs
|       |   |-- Exceptions
|       |   |   `-- AssessmentWindowClosedException.cs
|       |   |-- LmsOffline.Domain.csproj
|       |   |-- Policies
|       |   |   `-- WindowEnforcementPolicy.cs
|       |   `-- ValueObjects
|       |       |-- AttemptToken.cs
|       |       |-- AvailabilityWindow.cs
|       |       `-- SyncStatus.cs
|       |-- LmsOffline.Infrastructure
|       |   |-- Auth
|       |   |   |-- ExternalIdentityService.cs
|       |   |   `-- OfflineTokenCache.cs
|       |   |-- Data
|       |   |   |-- EncryptedSqliteContext.cs
|       |   |   `-- SqliteStorageDiagnostics.cs
|       |   |-- LmsOffline.Infrastructure.csproj
|       |   |-- Persistence
|       |   |   |-- EncryptedSqliteContext.cs
|       |   |   |-- Migrations
|       |   |   `-- Repositories
|       |   |       |-- DashboardRepository.cs
|       |   |       `-- OfflineIdentityRepository.cs
|       |   |-- Repositories
|       |   |   |-- GradeRepository.cs
|       |   |   |-- LocalPackageRepository.cs
|       |   |   |-- OfflineAssessmentRepository.cs
|       |   |   |-- OfflineAssignmentRepository.cs
|       |   |   |-- OfflineIdentityRepository.cs
|       |   |   `-- OfflineModuleRepository.cs
|       |   |-- Security
|       |   |   |-- EcdsaPackageSecurityService.cs
|       |   |   |-- EcdsaPackageVerifier.cs
|       |   |   `-- Pbkdf2PasswordHasher.cs
|       |   `-- Sync
|       |       |-- OutboxBackgroundService.cs
|       |       |-- OutboxSyncProcessor.cs
|       |       `-- ScheduleTokenVerifier.cs
|       |-- LmsOffline.Presentation
|       |   |-- App.axaml
|       |   |-- App.axaml.cs
|       |   |-- DesignSystem
|       |   |   |-- Foundations
|       |   |   |   |-- Borders.axaml
|       |   |   |   |-- Colors.axaml
|       |   |   |   |-- Elevation.axaml
|       |   |   |   |-- Motion.axaml
|       |   |   |   |-- Radius.axaml
|       |   |   |   |-- Spacing.axaml
|       |   |   |   |-- Typography.axaml
|       |   |   |   `-- ZIndex.axaml
|       |   |   |-- Themes
|       |   |   |   |-- Dark.axaml
|       |   |   |   `-- Light.axaml
|       |   |   `-- Tokens
|       |   |       |-- BadgeTokens.axaml
|       |   |       |-- ButtonTokens.axaml
|       |   |       |-- CardTokens.axaml
|       |   |       `-- InputTokens.axaml
|       |   |-- Features
|       |   |   |-- Assessments
|       |   |   |   |-- AssessmentView.axaml
|       |   |   |   |-- AssessmentView.axaml.cs
|       |   |   |   |-- AssessmentViewModel.cs
|       |   |   |   |-- AssignmentSubmissionView.axaml
|       |   |   |   |-- AssignmentSubmissionView.axaml.cs
|       |   |   |   |-- AssignmentSubmissionViewModel.cs
|       |   |   |   |-- LogicQuizView.axaml
|       |   |   |   |-- LogicQuizView.axaml.cs
|       |   |   |   `-- LogicQuizViewModel.cs
|       |   |   |-- Auth
|       |   |   |   |-- LoginView.axaml
|       |   |   |   |-- LoginView.axaml.cs
|       |   |   |   `-- LoginViewModel.cs
|       |   |   |-- Calendar
|       |   |   |   |-- TimelineScheduleView.axaml
|       |   |   |   |-- TimelineScheduleView.axaml.cs
|       |   |   |   `-- TimelineScheduleViewModel.cs
|       |   |   |-- Courses
|       |   |   |   |-- ActivityHubView.axaml
|       |   |   |   |-- ActivityHubView.axaml.cs
|       |   |   |   |-- ActivityHubViewModel.cs
|       |   |   |   |-- CourseContentView.axaml
|       |   |   |   |-- CourseContentView.axaml.cs
|       |   |   |   |-- CourseContentViewModel.cs
|       |   |   |   |-- CourseViewerView.axaml
|       |   |   |   |-- CourseViewerView.axaml.cs
|       |   |   |   |-- CourseViewerViewModel.cs
|       |   |   |   |-- ModuleTimelineView.axaml
|       |   |   |   |-- ModuleTimelineView.axaml.cs
|       |   |   |   |-- ModuleTimelineViewModel.cs
|       |   |   |   |-- ResourcesView.axaml
|       |   |   |   |-- ResourcesView.axaml.cs
|       |   |   |   `-- ResourcesViewModel.cs
|       |   |   |-- Dashboard
|       |   |   |   |-- StudentDashboardView.axaml
|       |   |   |   |-- StudentDashboardView.axaml.cs
|       |   |   |   `-- StudentDashboardViewModel.cs
|       |   |   |-- Diagnostics
|       |   |   |   |-- DiagnosticsView.axaml
|       |   |   |   |-- DiagnosticsView.axaml.cs
|       |   |   |   `-- DiagnosticsViewModel.cs
|       |   |   |-- Grades
|       |   |   |   |-- GradesView.axaml
|       |   |   |   |-- GradesView.axaml.cs
|       |   |   |   `-- GradesViewModel.cs
|       |   |   |-- LearningTimeline
|       |   |   |   |-- LearningTimelineView.axaml
|       |   |   |   |-- LearningTimelineView.axaml.cs
|       |   |   |   `-- LearningTimelineViewModel.cs
|       |   |   |-- PackageManager
|       |   |   |   |-- PackageManagerView.axaml
|       |   |   |   |-- PackageManagerView.axaml.cs
|       |   |   |   `-- PackageManagerViewModel.cs
|       |   |   `-- SyncHub
|       |   |       |-- SyncHubView.axaml
|       |   |       |-- SyncHubView.axaml.cs
|       |   |       `-- SyncHubViewModel.cs
|       |   |-- LmsOffline.Presentation.csproj
|       |   |-- MainWindow.axaml
|       |   |-- MainWindow.axaml.cs
|       |   |-- Program.cs
|       |   |-- Services
|       |   |   |-- AvaloniaExamIntegrityService.cs
|       |   |   `-- FileLogger.cs
|       |   |-- Shared
|       |   |   `-- Controls
|       |   |       |-- AppCard.axaml
|       |   |       |-- AppCard.axaml.cs
|       |   |       |-- NavigationItem.axaml
|       |   |       |-- NavigationItem.axaml.cs
|       |   |       |-- StatusBadge.axaml
|       |   |       `-- StatusBadge.axaml.cs
|       |   |-- Shell
|       |   |   |-- AppSidebar.axaml
|       |   |   |-- AppSidebar.axaml.cs
|       |   |   |-- AppStatusBar.axaml
|       |   |   `-- AppStatusBar.axaml.cs
|       |   |-- ViewLocator.cs
|       |   |-- ViewModels
|       |   |   |-- AssessmentViewModel.cs
|       |   |   |-- AssignmentSubmissionViewModel.cs
|       |   |   |-- LogicQuizViewModel.cs
|       |   |   `-- MainWindowViewModel.cs
|       |   |-- Views
|       |   |   |-- AssessmentView.axaml
|       |   |   |-- AssessmentView.axaml.cs
|       |   |   |-- AssignmentSubmissionView.axaml
|       |   |   |-- AssignmentSubmissionView.axaml.cs
|       |   |   |-- CustomControls
|       |   |   |   |-- CustomTitleBar.axaml
|       |   |   |   `-- CustomTitleBar.axaml.cs
|       |   |   |-- LogicQuizView.axaml
|       |   |   `-- LogicQuizView.axaml.cs
|       |   `-- app.manifest
|       |-- LmsOffline.Tests
|       |   |-- LmsOffline.Tests.csproj
|       |   |-- OfflineTokenCacheTests.cs
|       |   |-- SyncConflictResolutionTests.cs
|       |   |-- UnitTest1.cs
|       |   `-- WindowEnforcementPolicyTests.cs
|       |-- LmsOfflineClient.slnx
|       |-- MigrateOpticalSystem.ps1
|       |-- UpdateTokens.ps1
|       |-- app.log
|       |-- build-and-publish.bat
|       |-- crash.log
|       `-- lms_offline.db
|-- domain
|   |-- adr
|   |-- model
|   `-- runbooks
|-- libs
|   |-- api-clients
|   |   |-- academic
|   |   |   |-- advisingApi.ts
|   |   |   |-- analyticsApi.ts
|   |   |   |-- assessmentApi.ts
|   |   |   |-- communicationApi.ts
|   |   |   |-- documentsApi.ts
|   |   |   |-- examinationResultApi.ts
|   |   |   |-- facultyStudentsApi.ts
|   |   |   |-- libraryCatalogApi.ts
|   |   |   |-- lmsApi.ts
|   |   |   |-- registrarApi.ts
|   |   |   |-- registrarCurriculumApi.ts
|   |   |   |-- researchApi.ts
|   |   |   |-- scheduleApi.ts
|   |   |   |-- studentInformationApi.ts
|   |   |   `-- teachingApi.ts
|   |   |-- administration
|   |   |   |-- assetManagementApi.ts
|   |   |   |-- financeApi.ts
|   |   |   |-- financeBillingApi.ts
|   |   |   |-- hrApi.ts
|   |   |   |-- inventoryApi.ts
|   |   |   `-- procurementApi.ts
|   |   |-- apiClient.ts
|   |   |-- campus-life
|   |   |   |-- canteenApi.ts
|   |   |   `-- transportApi.ts
|   |   |-- governance
|   |   |   |-- facilitiesApi.ts
|   |   |   |-- facilitiesAvailabilityApi.ts
|   |   |   `-- governanceApi.ts
|   |   |-- index.ts
|   |   |-- package.json
|   |   |-- platform
|   |   |   |-- facultySettingsApi.ts
|   |   |   |-- identityAccessAuthorizationApi.ts
|   |   |   `-- identityApi.ts
|   |   `-- student-lifecycle
|   |       |-- admissionsApi.ts
|   |       |-- alumniApi.ts
|   |       |-- careerApi.ts
|   |       |-- facultyAdmissionsApi.ts
|   |       |-- guidanceApi.ts
|   |       |-- healthCenterApi.ts
|   |       |-- hostelApi.ts
|   |       |-- interviewsApi.ts
|   |       |-- studentInformationApi.ts
|   |       `-- studentInformationReadModel.ts
|   |-- auth-sdk
|   |   |-- dotnet
|   |   |   `-- OidcClient.cs
|   |   |-- index.ts
|   |   |-- package.json
|   |   |-- react
|   |   |   |-- AuthContext.ts
|   |   |   |-- AuthProvider.tsx
|   |   |   |-- silentRefresh.ts
|   |   |   `-- useAuth.ts
|   |   `-- src
|   |       `-- guards
|   |           |-- FacultyGuard.tsx
|   |           |-- FinanceGuard.tsx
|   |           |-- IdentityGuard.tsx
|   |           |-- LMSGuard.tsx
|   |           `-- RegistrarGuard.tsx
|   |-- core-logger
|   |   |-- index.ts
|   |   `-- package.json
|   |-- domain-viewmodels
|   |   |-- AdministrationViewModels.ts
|   |   |-- CampusLifeViewModels.ts
|   |   |-- FinanceViewModels.ts
|   |   |-- GovernanceViewModels.ts
|   |   |-- GrievanceCaseViewModel.ts
|   |   |-- IdentityViewModels.ts
|   |   |-- InvoiceSummaryViewModel.ts
|   |   |-- LibraryViewModels.ts
|   |   |-- StudentLifecycleViewModels.ts
|   |   |-- StudentProfileViewModel.ts
|   |   |-- index.ts
|   |   `-- package.json
|   |-- offline-sync
|   |   `-- syncEngineContracts.ts
|   |-- shell-kit
|   |   |-- AuthGuard.tsx
|   |   |-- authConfig.ts
|   |   |-- bootstrap.tsx
|   |   |-- index.ts
|   |   |-- package.json
|   |   |-- portalRegistry.ts
|   |   `-- queryClient.ts
|   |-- ui-kit
|   |   |-- components
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- components
|   |   |   |   |-- Badge.tsx
|   |   |   |   |-- Button.tsx
|   |   |   |   |-- Card.tsx
|   |   |   |   |-- DocumentPreviewModal.tsx
|   |   |   |   |-- EmptyState.tsx
|   |   |   |   |-- FormInput.tsx
|   |   |   |   |-- Modal.tsx
|   |   |   |   |-- PageHeader.tsx
|   |   |   |   `-- Table.tsx
|   |   |   |-- index.ts
|   |   |   `-- styles.css
|   |   |-- theming
|   |   `-- tokens
|   |-- vite-config
|   |   |-- index.ts
|   |   `-- package.json
|   `-- workflow-sdk
|       |-- index.ts
|       |-- package.json
|       |-- src
|       |   |-- AcademicRecordWorkflow.ts
|       |   |-- AdmissionWorkflow.ts
|       |   |-- AuditWorkflow.ts
|       |   |-- CertificationWorkflow.ts
|       |   |-- EnrollmentWorkflow.ts
|       |   |-- FinanceWorkflow.ts
|       |   |-- GraduationWorkflow.ts
|       |   |-- IdentityWorkflow.ts
|       |   |-- LMSWorkflow.ts
|       |   |-- LibraryWorkflow.ts
|       |   |-- NotificationWorkflow.ts
|       |   |-- StudentLifecycleWorkflow.ts
|       |   `-- index.ts
|       `-- tsconfig.json
|-- package-lock.json
|-- package.json
|-- repair-npm.sh
|-- scaffold_features.ps1
|-- tests
|   |-- AccessibilityTests
|   |   `-- wcag-audit.spec.ts
|   |-- ArchitectureTests
|   |-- ComponentTests
|   |   |-- admin-portal
|   |   |-- faculty-portal
|   |   |-- finance-console
|   |   |-- governance-console
|   |   |-- identity-portal
|   |   |-- library-portal
|   |   |-- lms-web
|   |   `-- student-portal
|   |-- E2ETests
|   |   |-- HostelBillingFlow.spec.ts
|   |   |-- OfflineQuizWindowFlow.spec.ts
|   |   `-- StudentEnrollmentFlow.spec.ts
|   |-- PerformanceTests
|   |   `-- lighthouse-budgets.json
|   `-- SecurityTests
|       |-- cspComplianceTests.ts
|       `-- tokenStorageAuditTests.ts
|-- tsconfig.app.base.json
|-- tsconfig.json
`-- tsconfig.node.base.json

388 directories, 1231 files
