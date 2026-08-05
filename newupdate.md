On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   CodebaseInfrastructure.md
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/ModuleRegistration/AcademicModulesRegistration.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/ModuleRegistration/AdministrationModulesRegistration.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/ModuleRegistration/GovernanceModulesRegistration.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/ModuleRegistration/PlatformModulesRegistration.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/Program.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Api/UniversityErp.Api.csproj
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Migrator/Program.cs
	modified:   University-ERP-Backend/src/Bootstrap/UniversityErp.Migrator/UniversityErp.Migrator.csproj
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/Features/AllocateRoom/AllocateRoomCommand.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/Features/GetFacultyCourses/GetFacultyCoursesQuery.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/Features/GetStudentTimetable/GetStudentTimetableQuery.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/Features/SubmitAttendance/SubmitAttendanceCommand.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Infrastructure/AcademicScheduling.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Application/Features/GetGradebook/GetGradebookQuery.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Examination/Examination.Infrastructure/Examination.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Infrastructure/LearningManagementModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Infrastructure/Persistence/LearningManagementDbContext.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Infrastructure/Registrar.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Application/Abstractions/IStudentRepository.cs
	modified:   University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Application/Features/GetAdvisees/GetAdviseesQuery.cs
	modified:   University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Infrastructure/Persistence/StudentInformationDbContext.cs
	modified:   University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Infrastructure/Repositories/StudentRepository.cs
	modified:   University-ERP-Backend/src/Modules/Administration/AssetManagement/AssetManagement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/AssetManagement/AssetManagement.Presentation/AssetManagement.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Facilities/Facilities.Application/Features/BookFacility/BookFacilityCommand.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Facilities/Facilities.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Facilities/Facilities.Presentation/Facilities.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Infrastructure/Finance.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Finance/Finance.Presentation/Finance.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Infrastructure/HumanResources.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Presentation/HumanResources.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Inventory/Inventory.Application/Features/AdjustStock/AdjustStockCommand.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Inventory/Inventory.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Inventory/Inventory.Presentation/Inventory.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Library/Library.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Library/Library.Presentation/Library.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/MessCanteen/MessCanteen.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/MessCanteen/MessCanteen.Presentation/MessCanteen.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Payroll/Payroll.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Payroll/Payroll.Presentation/Payroll.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Procurement/Procurement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Procurement/Procurement.Presentation/Procurement.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Administration/Transport/Transport.Application/Features/AssignRoute/AssignRouteCommand.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Transport/Transport.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Administration/Transport/Transport.Presentation/Transport.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Governance/EventManagement/EventManagement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Governance/EventManagement/EventManagement.Presentation/EventManagement.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Governance/GrievanceManagement/GrievanceManagement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Governance/GrievanceManagement/GrievanceManagement.Presentation/GrievanceManagement.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Governance/Helpdesk/Helpdesk.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Governance/Helpdesk/Helpdesk.Presentation/Helpdesk.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Governance/QualityAccreditation/QualityAccreditation.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Governance/QualityAccreditation/QualityAccreditation.Presentation/QualityAccreditation.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Governance/VisitorManagement/VisitorManagement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Governance/VisitorManagement/VisitorManagement.Presentation/VisitorManagement.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/AnalyticsBI/AnalyticsBI.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Platform/AnalyticsBI/AnalyticsBI.Presentation/AnalyticsBI.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/CRM/CRM.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Platform/CRM/CRM.Presentation/CRM.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Application/Abstractions/ICommunicationRepository.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Application/Features/GetInbox/GetInboxQuery.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Application/Features/SendMessage/SendMessageCommand.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Infrastructure/Communication.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/Communication/Communication.Presentation/Communication.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Infrastructure/DocumentManagement.Infrastructure.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Presentation/DocumentManagement.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/IdentityAccess/IdentityAccess.Application/Features/AuthenticateUser/AuthenticateUserQueryHandler.cs
	modified:   University-ERP-Backend/src/Modules/Platform/MultiCampus/MultiCampus.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Platform/MultiCampus/MultiCampus.Presentation/MultiCampus.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/Platform/Notification/Notification.Application/ModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/Platform/Notification/Notification.Presentation/Notification.Presentation.csproj
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Infrastructure/AdmissionsModuleRegistration.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Infrastructure/Persistence/AdmissionsDbContext.cs
	modified:   University-ERP-Backend/src/Modules/StudentLifecycle/Admissions/Admissions.Infrastructure/Repositories/AdmissionApplicationRepository.cs
	modified:   University-ERP-Frontend/apps/admin-portal/package.json
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/AssetRegistry/AssetRegistry.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/AuditCompliance/AuditCompliance.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/CanteenOrders/CanteenOrders.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/Dashboard/Dashboard.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/EmployeeManagement/EmployeeManagement.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/FacilityBooking/FacilityBooking.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/FleetManagement/FleetManagement.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/RoleAdministration/RoleAdministration.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/StockManagement/StockManagement.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/SystemAdministration/SystemAdministration.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/features/UserAdministration/UserAdministration.page.tsx
	modified:   University-ERP-Frontend/apps/admin-portal/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/package.json
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.api.ts
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.hooks.ts
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.test.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/AdmissionStatus/AdmissionStatus.types.ts
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/Dashboard/Dashboard.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.page.tsx
	modified:   University-ERP-Frontend/apps/applicant-portal/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/package.json
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Advising/Advising.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Advising/Advising.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Analytics/Analytics.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Analytics/Analytics.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Assessments/Assessments.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Assessments/Assessments.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Communication/Communication.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Communication/Communication.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Dashboard/Dashboard.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Documents/Documents.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Documents/Documents.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Research/Research.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Research/Research.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Schedule/Schedule.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Schedule/Schedule.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Students/Students.hooks.ts
	modified:   University-ERP-Frontend/apps/faculty-portal/src/features/Teaching/Teaching.hooks.ts
	deleted:    University-ERP-Frontend/apps/faculty-portal/src/features/features/EnrollmentApprovals/EnrollmentApprovals.page.tsx
	modified:   University-ERP-Frontend/apps/faculty-portal/src/shell/Routing.tsx
	modified:   University-ERP-Frontend/apps/finance-console/package.json
	modified:   University-ERP-Frontend/apps/governance-console/package.json
	modified:   University-ERP-Frontend/apps/identity-portal/package.json
	modified:   University-ERP-Frontend/apps/identity-portal/src/features/SecuritySettings/SecuritySettings.api.ts
	modified:   University-ERP-Frontend/apps/identity-portal/src/features/UserLogin/UserLogin.page.tsx
	modified:   University-ERP-Frontend/apps/library-portal/package.json
	modified:   University-ERP-Frontend/apps/lms-web/package.json
	modified:   University-ERP-Frontend/apps/platform-console/package.json
	modified:   University-ERP-Frontend/apps/student-portal/package.json
	modified:   University-ERP-Frontend/apps/student-portal/src/features/LearningManagement/LearningManagement.page.tsx
	modified:   University-ERP-Frontend/apps/student-portal/src/features/MyEnrollments/MyEnrollments.hooks.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/advisingApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/analyticsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/assessmentApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/communicationApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/documentsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/facultyStudentsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/libraryCatalogApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/researchApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/scheduleApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/studentInformationApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/academic/teachingApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/administration/assetManagementApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/administration/financeApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/administration/hrApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/administration/inventoryApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/administration/procurementApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/campus-life/canteenApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/campus-life/transportApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/governance/facilitiesApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/governance/governanceApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/package.json
	modified:   University-ERP-Frontend/libs/api-clients/platform/facultySettingsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/admissionsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/alumniApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/careerApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/facultyAdmissionsApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/guidanceApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/healthCenterApi.ts
	modified:   University-ERP-Frontend/libs/api-clients/student-lifecycle/hostelApi.ts
	modified:   University-ERP-Frontend/package-lock.json
	modified:   University-ERP-Frontend/package.json
	modified:   newupdate.md
	modified:   package.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Application/Abstractions/
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Domain/Aggregates/AttendanceRecord.cs
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Domain/Aggregates/CourseSection.cs
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Domain/Aggregates/RoomAllocation.cs
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Infrastructure/AcademicSchedulingModuleRegistration.cs
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Academic/AcademicScheduling/AcademicScheduling.Infrastructure/Repositories/
	University-ERP-Backend/src/Modules/Academic/Examination/Examination.Application/Abstractions/IExaminationRepository.cs
	University-ERP-Backend/src/Modules/Academic/Examination/Examination.Domain/Aggregates/GradebookRecord.cs
	University-ERP-Backend/src/Modules/Academic/Examination/Examination.Infrastructure/ExaminationModuleRegistration.cs
	University-ERP-Backend/src/Modules/Academic/Examination/Examination.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Academic/Examination/Examination.Infrastructure/Repositories/
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/Abstractions/ILearningManagementRepository.cs
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/Features/Analytics/
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Application/Features/Assessments/
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Domain/Aggregates/
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Infrastructure/Repositories/LearningManagementRepository.cs
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Presentation/Endpoints/AnalyticsEndpoint.cs
	University-ERP-Backend/src/Modules/Academic/LearningManagement/LearningManagement.Presentation/Endpoints/AssessmentsEndpoint.cs
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/Abstractions/
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Application/Features/Schedule/
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Domain/Aggregates/CourseSection.cs
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Infrastructure/RegistrarModuleRegistration.cs
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Infrastructure/Repositories/
	University-ERP-Backend/src/Modules/Academic/Registrar/Registrar.Presentation/Endpoints/ScheduleEndpoint.cs
	University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Application/Features/GetAdvisees/GetAdviseesQueryHandler.cs
	University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Application/Features/GetMyStudents/
	University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Domain/Aggregates/FacultyAdvisee.cs
	University-ERP-Backend/src/Modules/Academic/StudentInformation/StudentInformation.Presentation/Endpoints/FacultyStudentsEndpoint.cs
	University-ERP-Backend/src/Modules/Administration/Finance/Finance.Infrastructure/FinanceModuleRegistration.cs
	University-ERP-Backend/src/Modules/Administration/Finance/Finance.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Administration/Finance/Finance.Infrastructure/Repositories/
	University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Application/Abstractions/
	University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Infrastructure/HumanResourcesModuleRegistration.cs
	University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Administration/HumanResources/HumanResources.Infrastructure/Repositories/
	University-ERP-Backend/src/Modules/Platform/Communication/Communication.Infrastructure/CommunicationModuleRegistration.cs
	University-ERP-Backend/src/Modules/Platform/Communication/Communication.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Platform/Communication/Communication.Infrastructure/Repositories/
	University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Infrastructure/DocumentManagementModuleRegistration.cs
	University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Infrastructure/Persistence/
	University-ERP-Backend/src/Modules/Platform/DocumentManagement/DocumentManagement.Infrastructure/Repositories/
	University-ERP-Frontend/apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/AcademicConfiguration/AcademicConfiguration.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AssetRegistry/AssetRegistry.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AssetRegistry/AssetRegistry.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AssetRegistry/AssetRegistry.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/AssetRegistry/AssetRegistry.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AuditCompliance/AuditCompliance.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AuditCompliance/AuditCompliance.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/AuditCompliance/AuditCompliance.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/AuditCompliance/AuditCompliance.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/CanteenOrders/CanteenOrders.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/CanteenOrders/CanteenOrders.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/CanteenOrders/CanteenOrders.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/CanteenOrders/CanteenOrders.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/Dashboard/Dashboard.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/Dashboard/Dashboard.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/Dashboard/Dashboard.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/Dashboard/Dashboard.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/EmployeeManagement/EmployeeManagement.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/EmployeeManagement/EmployeeManagement.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/EmployeeManagement/EmployeeManagement.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/EmployeeManagement/EmployeeManagement.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/FacilityBooking/FacilityBooking.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/FacilityBooking/FacilityBooking.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/FacilityBooking/FacilityBooking.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/FacilityBooking/FacilityBooking.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/FleetManagement/FleetManagement.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/FleetManagement/FleetManagement.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/FleetManagement/FleetManagement.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/FleetManagement/FleetManagement.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/IdentitySecurity/IdentitySecurity.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/IdentitySecurity/IdentitySecurity.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/IdentitySecurity/IdentitySecurity.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/IdentitySecurity/IdentitySecurity.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/IntegrationManagement/IntegrationManagement.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/IntegrationManagement/IntegrationManagement.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/IntegrationManagement/IntegrationManagement.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/IntegrationManagement/IntegrationManagement.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/OrganizationManagement/OrganizationManagement.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/PlatformMonitoring/PlatformMonitoring.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/PlatformMonitoring/PlatformMonitoring.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/PlatformMonitoring/PlatformMonitoring.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/PlatformMonitoring/PlatformMonitoring.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/PurchaseOrders/PurchaseOrders.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/Reports/Reports.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/Reports/Reports.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/Reports/Reports.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/Reports/Reports.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/RoleAdministration/RoleAdministration.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/RoleAdministration/RoleAdministration.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/RoleAdministration/RoleAdministration.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/RoleAdministration/RoleAdministration.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/StockManagement/StockManagement.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/StockManagement/StockManagement.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/StockManagement/StockManagement.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/StockManagement/StockManagement.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/SystemAdministration/SystemAdministration.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/SystemAdministration/SystemAdministration.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/SystemAdministration/SystemAdministration.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/SystemAdministration/SystemAdministration.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/UserAdministration/UserAdministration.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/UserAdministration/UserAdministration.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/UserAdministration/UserAdministration.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/UserAdministration/UserAdministration.types.ts
	University-ERP-Frontend/apps/admin-portal/src/features/WorkflowManagement/WorkflowManagement.api.ts
	University-ERP-Frontend/apps/admin-portal/src/features/WorkflowManagement/WorkflowManagement.hooks.ts
	University-ERP-Frontend/apps/admin-portal/src/features/WorkflowManagement/WorkflowManagement.test.tsx
	University-ERP-Frontend/apps/admin-portal/src/features/WorkflowManagement/WorkflowManagement.types.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationForm/
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationStatus/
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.api.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.hooks.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.test.tsx
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationTimeline/ApplicationTimeline.types.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.api.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.hooks.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.test.tsx
	University-ERP-Frontend/apps/applicant-portal/src/features/ApplicationWizard/ApplicationWizard.types.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/Dashboard/Dashboard.api.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/Dashboard/Dashboard.hooks.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/Dashboard/Dashboard.test.tsx
	University-ERP-Frontend/apps/applicant-portal/src/features/Dashboard/Dashboard.types.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.api.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.hooks.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.test.tsx
	University-ERP-Frontend/apps/applicant-portal/src/features/DocumentSubmission/DocumentSubmission.types.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/DocumentUpload/
	University-ERP-Frontend/apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.api.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.hooks.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.test.tsx
	University-ERP-Frontend/apps/applicant-portal/src/features/EligibilityChecker/EligibilityChecker.types.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/InterviewScheduling/
	University-ERP-Frontend/apps/applicant-portal/src/features/Offers/
	University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.api.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.hooks.ts
	University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.test.tsx
	University-ERP-Frontend/apps/applicant-portal/src/features/ProgramExplorer/ProgramExplorer.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Advising/Advising.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Advising/Advising.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Advising/Advising.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Analytics/Analytics.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Analytics/Analytics.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Analytics/Analytics.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Assessments/Assessments.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Assessments/Assessments.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Assessments/Assessments.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Communication/Communication.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Communication/Communication.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Communication/Communication.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Dashboard/Dashboard.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Dashboard/Dashboard.hooks.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Dashboard/Dashboard.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Dashboard/Dashboard.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Documents/Documents.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Documents/Documents.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Documents/Documents.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/EnrollmentApprovals/
	University-ERP-Frontend/apps/faculty-portal/src/features/Research/Research.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Research/Research.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Research/Research.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Schedule/Schedule.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Schedule/Schedule.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Schedule/Schedule.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Settings/Settings.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Settings/Settings.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Settings/Settings.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Students/Students.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Students/Students.page.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Students/Students.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Students/Students.types.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Teaching/Teaching.api.ts
	University-ERP-Frontend/apps/faculty-portal/src/features/Teaching/Teaching.page.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Teaching/Teaching.test.tsx
	University-ERP-Frontend/apps/faculty-portal/src/features/Teaching/Teaching.types.ts
	University-ERP-Frontend/apps/finance-console/src/features/Budgeting/
	University-ERP-Frontend/apps/finance-console/src/features/Dashboard/
	University-ERP-Frontend/apps/finance-console/src/features/FinancialReports/
	University-ERP-Frontend/apps/finance-console/src/features/Invoicing/
	University-ERP-Frontend/apps/finance-console/src/features/PaymentGateway/
	University-ERP-Frontend/apps/finance-console/src/features/Payroll/
	University-ERP-Frontend/apps/finance-console/src/features/StudentBilling/StudentBilling.api.ts
	University-ERP-Frontend/apps/finance-console/src/features/StudentBilling/StudentBilling.test.tsx
	University-ERP-Frontend/apps/finance-console/src/features/StudentBilling/StudentBilling.types.ts
	University-ERP-Frontend/apps/governance-console/src/features/Accreditation/
	University-ERP-Frontend/apps/governance-console/src/features/Audits/
	University-ERP-Frontend/apps/governance-console/src/features/Committees/
	University-ERP-Frontend/apps/governance-console/src/features/Compliance/
	University-ERP-Frontend/apps/governance-console/src/features/Policies/
	University-ERP-Frontend/apps/governance-console/src/features/RiskManagement/
	University-ERP-Frontend/apps/identity-portal/src/features/MultiFactorAuth/
	University-ERP-Frontend/apps/identity-portal/src/features/PasswordRecovery/
	University-ERP-Frontend/apps/library-portal/src/features/CatalogSearch/
	University-ERP-Frontend/apps/library-portal/src/features/DigitalResources/
	University-ERP-Frontend/apps/library-portal/src/features/Fines/
	University-ERP-Frontend/apps/library-portal/src/features/MyLoans/
	University-ERP-Frontend/apps/library-portal/src/features/Reservations/
	University-ERP-Frontend/apps/lms-web/src/features/Assignments/
	University-ERP-Frontend/apps/lms-web/src/features/Calendar/
	University-ERP-Frontend/apps/lms-web/src/features/CourseContent/
	University-ERP-Frontend/apps/lms-web/src/features/Dashboard/
	University-ERP-Frontend/apps/lms-web/src/features/Discussions/
	University-ERP-Frontend/apps/lms-web/src/features/Grades/
	University-ERP-Frontend/apps/lms-web/src/features/Quizzes/
	University-ERP-Frontend/apps/platform-console/src/features/APIKeys/
	University-ERP-Frontend/apps/platform-console/src/features/DatabaseManagement/
	University-ERP-Frontend/apps/platform-console/src/features/GlobalSettings/
	University-ERP-Frontend/apps/platform-console/src/features/SecurityAudits/
	University-ERP-Frontend/apps/platform-console/src/features/SystemLogs/
	University-ERP-Frontend/apps/platform-console/src/features/TenantManagement/
	University-ERP-Frontend/apps/student-portal/src/features/AcademicRecord/
	University-ERP-Frontend/apps/student-portal/src/features/Clearance/
	University-ERP-Frontend/apps/student-portal/src/features/Dashboard/
	University-ERP-Frontend/apps/student-portal/src/features/Enrollment/
	University-ERP-Frontend/apps/student-portal/src/features/Extracurriculars/
	University-ERP-Frontend/apps/student-portal/src/features/Financials/
	University-ERP-Frontend/apps/student-portal/src/features/Timetable/
	University-ERP-Frontend/scaffold_features.ps1
	scaffold_features.ps1

no changes added to commit (use "git add" and/or "git commit -a")
