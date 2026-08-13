=========================================
 University ERP Frontend Bootstrap
=========================================

[1/9] Cleaning previous installation...

[2/9] Cleaning npm cache...
Cache verified and compressed (~\AppData\Local\npm-cache\_cacache)
Content verified: 757 (295284541 bytes)
Content garbage-collected: 2 (2410343 bytes)
Index entries: 757
Finished in 3.365s

[3/9] Installing all workspace dependencies...

added 184 packages, and audited 206 packages in 2m

47 packages are looking for funding
  run `npm fund` for details

2 high severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

[4/9] Deduplicating packages...

up to date, audited 206 packages in 2s

47 packages are looking for funding
  run `npm fund` for details

2 high severity vulnerabilities

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

[5/9] Running audit...
# npm audit report

react-router  7.12.0 - 8.2.0
Severity: high
React Router: RSC Mode CSRF Bypass Allows Action Execution Before 400 Response - https://github.com/advisories/GHSA-qwww-vcr4-c8h2
fix available via `npm audit fix`
node_modules/react-router
  react-router-dom  >=7.12.0-pre.0
  Depends on vulnerable versions of react-router
  node_modules/react-router-dom

2 high severity vulnerabilities

To address all issues, run:
  npm audit fix

[7/9] Running tests...

> admin-portal@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/admin-portal[39m

 [32m✓[39m src/features/IdentitySecurity/IdentitySecurity.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/features/AuditCompliance/AuditCompliance.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/features/PurchaseOrders/PurchaseOrders.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/features/RoleAdministration/RoleAdministration.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/features/SystemAdministration/SystemAdministration.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/FleetManagement/FleetManagement.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/IntegrationManagement/IntegrationManagement.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/EmployeeManagement/EmployeeManagement.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/StockManagement/StockManagement.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/AcademicConfiguration/AcademicConfiguration.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Dashboard/Dashboard.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/UserAdministration/UserAdministration.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/FacilityBooking/FacilityBooking.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/AssetRegistry/AssetRegistry.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/CanteenOrders/CanteenOrders.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/OrganizationManagement/OrganizationManagement.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/PlatformMonitoring/PlatformMonitoring.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Reports/Reports.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/WorkflowManagement/WorkflowManagement.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m19 passed[39m[22m[90m (19)[39m
[2m      Tests [22m [1m[32m12 passed[39m[22m[90m (12)[39m
[2m   Start at [22m 01:44:25
[2m   Duration [22m 2.36s[2m (transform 5.37s, setup 0ms, import 6.98s, tests 94ms, environment 3ms)[22m


> admissions-portal@1.0.0 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/admissions-portal[39m

No test files found, exiting with code 0


> applicant-portal@0.4.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/applicant-portal[39m

 [32m✓[39m src/features/ProgramExplorer/ProgramExplorer.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/DocumentSubmission/DocumentSubmission.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/ApplicationWizard/ApplicationWizard.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/EligibilityChecker/EligibilityChecker.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/AdmissionStatus/AdmissionStatus.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/features/ApplicationTimeline/ApplicationTimeline.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/features/Dashboard/Dashboard.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/features/ApplicationStatus/ApplicationStatus.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/ApplicationForm/ApplicationForm.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/DocumentUpload/DocumentUpload.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Offers/Offers.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/InterviewScheduling/InterviewScheduling.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m12 passed[39m[22m[90m (12)[39m
[2m      Tests [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m   Start at [22m 01:44:30
[2m   Duration [22m 685ms[2m (transform 140ms, setup 0ms, import 497ms, tests 41ms, environment 3ms)[22m


> faculty-portal@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/faculty-portal[39m

 [32m✓[39m src/features/Communication/Communication.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Analytics/Analytics.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Schedule/Schedule.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Dashboard/Dashboard.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Teaching/Teaching.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Students/Students.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Research/Research.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/Documents/Documents.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/features/Advising/Advising.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/features/Assessments/Assessments.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/features/Settings/Settings.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m

[2m Test Files [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m      Tests [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m   Start at [22m 01:44:32
[2m   Duration [22m 680ms[2m (transform 168ms, setup 0ms, import 563ms, tests 48ms, environment 2ms)[22m


> finance-console@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/finance-console[39m

 [32m✓[39m src/features/Budgeting/Budgeting.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/Dashboard/Dashboard.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/PaymentGateway/PaymentGateway.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/Invoicing/Invoicing.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/FinancialReports/FinancialReports.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Payroll/Payroll.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/StudentBilling/StudentBilling.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 01:44:34
[2m   Duration [22m 594ms[2m (transform 67ms, setup 0ms, import 232ms, tests 10ms, environment 2ms)[22m


> governance-console@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/governance-console[39m

 [32m✓[39m src/features/Accreditation/Accreditation.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Audits/Audits.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/RiskManagement/RiskManagement.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Policies/Policies.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Committees/Committees.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Compliance/Compliance.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 01:44:36
[2m   Duration [22m 825ms[2m (transform 52ms, setup 0ms, import 201ms, tests 7ms, environment 1ms)[22m


> identity-portal@0.2.0 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/identity-portal[39m

 [32m✓[39m src/features/MfaVerification/MfaVerification.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/features/SessionManagement/SessionManagement.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/SecuritySettings/SecuritySettings.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/PasswordReset/PasswordReset.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/UserRegistration/UserRegistration.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/UserLogin/UserLogin.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/features/PasswordRecovery/PasswordRecovery.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/MultiFactorAuth/MultiFactorAuth.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m8 passed[39m[22m[90m (8)[39m
[2m      Tests [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m   Start at [22m 01:44:39
[2m   Duration [22m 587ms[2m (transform 105ms, setup 0ms, import 410ms, tests 29ms, environment 1ms)[22m


> library-portal@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/library-portal[39m

 [32m✓[39m src/features/CatalogSearch/CatalogSearch.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/DigitalResources/DigitalResources.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Reservations/Reservations.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Fines/Fines.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/MyLoans/MyLoans.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 01:44:40
[2m   Duration [22m 489ms[2m (transform 63ms, setup 0ms, import 171ms, tests 6ms, environment 1ms)[22m


> lms-web@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/lms-web[39m

 [32m✓[39m src/features/Assignments/Assignments.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Discussions/Discussions.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Calendar/Calendar.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Dashboard/Dashboard.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Grades/Grades.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/CourseContent/CourseContent.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Quizzes/Quizzes.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 01:44:42
[2m   Duration [22m 516ms[2m (transform 73ms, setup 0ms, import 277ms, tests 9ms, environment 1ms)[22m


> platform-console@0.1.1 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/platform-console[39m

 [32m✓[39m src/features/APIKeys/APIKeys.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/DatabaseManagement/DatabaseManagement.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/GlobalSettings/GlobalSettings.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/SystemLogs/SystemLogs.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/SecurityAudits/SecurityAudits.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/TenantManagement/TenantManagement.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 01:44:43
[2m   Duration [22m 463ms[2m (transform 83ms, setup 0ms, import 224ms, tests 8ms, environment 1ms)[22m


> registrar-portal@1.0.0 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/registrar-portal[39m

No test files found, exiting with code 0


> security-portal@1.0.0 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/security-portal[39m

No test files found, exiting with code 0


> student-portal@1.0.0 test
> vitest run --passWithNoTests


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90mD:/University-ERP/University-ERP-Frontend/apps/student-portal[39m

 [32m✓[39m src/features/CareerDashboard/CareerDashboard.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/GuidanceSessions/GuidanceSessions.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/AlumniNetwork/AlumniNetwork.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/features/HealthRecords/HealthRecords.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/HostelAllocation/HostelAllocation.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/StudentProfile/StudentProfile.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/features/Dashboard/Dashboard.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/MyEnrollments/MyEnrollments.test.tsx [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/features/AcademicRecord/AcademicRecord.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/Financials/Financials.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/Enrollment/Enrollment.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 2[2mms[22m[39m
 [32m✓[39m src/features/Extracurriculars/Extracurriculars.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Timetable/Timetable.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m
 [32m✓[39m src/features/Clearance/Clearance.test.tsx [2m([22m[2m0 test[22m[2m)[22m[32m 1[2mms[22m[39m

[2m Test Files [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m      Tests [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m   Start at [22m 01:44:46
[2m   Duration [22m 852ms[2m (transform 160ms, setup 0ms, import 648ms, tests 50ms, environment 3ms)[22m


[8/9] Building every application...

> admin-portal@0.1.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 182 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.68 kB │ gzip:   0.45 kB
dist/assets/index-CnpJ9dzY.js  328.66 kB │ gzip: 106.24 kB

[32m✓ built in 3.12s[39m

> admissions-portal@1.0.0 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 88 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.41 kB │ gzip:  0.28 kB
dist/assets/index-cJBQpNUN.css   12.88 kB │ gzip:  3.35 kB
dist/assets/index-jYEtr-r0.js   263.11 kB │ gzip: 83.50 kB

[32m✓ built in 454ms[39m

> applicant-portal@0.4.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 203 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:   0.32 kB
dist/assets/index-CmnkJuXB.css   12.88 kB │ gzip:   3.35 kB
dist/assets/index-Cnm24Zq5.js   354.33 kB │ gzip: 111.58 kB

[32m✓ built in 332ms[39m

> faculty-portal@0.1.1 build
> tsc && vite build

src/features/ChairpersonWorkspace/EvaluationQueue.page.tsx(17,57): error TS2345: Argument of type '"Accept" | "Reject" | "Waitlist"' is not assignable to parameter of type '"Approve" | "Verify"'.
  Type '"Accept"' is not assignable to type '"Approve" | "Verify"'.
src/features/SecretaryWorkspace/AdmissionQueue.page.tsx(16,81): error TS2345: Argument of type '"ForwardToChairperson"' is not assignable to parameter of type '"Approve" | "Verify"'.

> finance-console@0.1.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 197 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.68 kB │ gzip:  0.45 kB
dist/assets/index--ACt-Ehd.js  269.79 kB │ gzip: 84.73 kB

[32m✓ built in 496ms[39m

> governance-console@0.1.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 175 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.68 kB │ gzip:   0.45 kB
dist/assets/index-BRbrO4YT.js  317.51 kB │ gzip: 101.94 kB

[32m✓ built in 348ms[39m

> identity-portal@0.2.0 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 201 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.68 kB │ gzip:   0.45 kB
dist/assets/index-BsRPk-gM.js  332.47 kB │ gzip: 106.14 kB

[32m✓ built in 348ms[39m

> library-portal@0.1.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 171 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.68 kB │ gzip:   0.45 kB
dist/assets/index-CdQzo-Ol.js  308.70 kB │ gzip: 100.55 kB

[32m✓ built in 1.06s[39m

> lms-web@0.1.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 195 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.67 kB │ gzip:  0.45 kB
dist/assets/index-Bpyvpikd.js  266.93 kB │ gzip: 84.39 kB

[32m✓ built in 537ms[39m

> platform-console@0.1.1 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 91 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.34 kB │ gzip:  0.25 kB
dist/assets/index-DPd4EBfv.js  260.31 kB │ gzip: 82.54 kB

[32m✓ built in 340ms[39m

> registrar-portal@1.0.0 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 234 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.41 kB │ gzip:   0.28 kB
dist/assets/index-cJBQpNUN.css   12.88 kB │ gzip:   3.35 kB
dist/assets/index-DAkdjPIl.js   365.76 kB │ gzip: 112.11 kB

[32m✓ built in 604ms[39m

> security-portal@1.0.0 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 88 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.41 kB │ gzip:  0.28 kB
dist/assets/index-cJBQpNUN.css   12.88 kB │ gzip:  3.35 kB
dist/assets/index-Dhw782YF.js   263.38 kB │ gzip: 83.59 kB

[32m✓ built in 261ms[39m

> student-portal@1.0.0 build
> tsc && vite build

[36mvite v8.2.0 [32mbuilding client environment for production...[36m[39m
[2Ktransforming...✓ 199 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:   0.31 kB
dist/assets/index-cJBQpNUN.css   12.88 kB │ gzip:   3.35 kB
dist/assets/index-NDknp7XE.js   354.60 kB │ gzip: 111.76 kB

[32m✓ built in 288ms[39m

> @university-erp/api-clients@0.1.0 build
> echo 'No build step required for this library'

'No build step required for this library'

> @university-erp/auth-sdk@0.1.0 build
> echo 'No build step required for this library'

'No build step required for this library'

> @university-erp/core-logger@0.1.0 build
> echo 'No build step required for this library'

'No build step required for this library'

> @university-erp/domain-viewmodels@0.1.0 build
> echo 'No build step required for this library'

'No build step required for this library'

> @university-erp/ui-kit@0.1.0 build
> echo 'No build step required for this library'

'No build step required for this library'
