# Enterprise University ERP System

A modern, production-ready **University Enterprise Resource Planning (ERP) & Learning Management System (LMS)** engineered with **Domain-Based Modular Architecture (DBMA)**, **Clean Architecture (CQRS)**, and **Event-Driven Integration**.

The system provides end-to-end digital transformation for higher education institutions. It manages everything from applicant admissions and complex academic scheduling to student financials, cashier operations, PCI-DSS compliant payment processing, facility management, and a hybrid web/offline-first desktop LMS client.

---

## 🏛 Architectural Philosophy & System Overview

The core philosophy of this system is **Strict Modular Isolation via DBMA**. Traditional ERPs become tangled monoliths; this system is designed as a **Modular Monolith** where bounded contexts (e.g., `Finance`, `Admissions`, `Registrar`) are strictly isolated and communicate exclusively through an **Anti-Corruption Layer (ACL)** and **Event-Driven Integration** (via MediatR and messaging queues).

### The Event-Driven Workflow Example
```text
                           ┌─────────────────────────┐
                           │    Applicant Portal     │
                           └────────────┬────────────┘
                                        │ Initiate Checkout
                                        ▼
┌──────────────────────┐   Opaque Token ┌─────────────────────────┐
│   Admissions Portal  │ ◄───────────── │ Payment Gateway (PaaS)  │
└──────────▲───────────┘                └────────────┬────────────┘
           │ PaymentVerified                         │ Poll / Webhook
           │ IntegrationEvent                        ▼
┌──────────┴───────────┐                ┌─────────────────────────┐
│   Admissions Module  │ ◄───────────── │     Finance Module      │
│  (StudentLifecycle)  │                │    (Administration)     │
└──────────────────────┘                └────────────┬────────────┘
                                                     │ HttpClient
                                                     ▼
                                        ┌─────────────────────────┐
                                        │   External Banking API  │
                                        └─────────────────────────┘
```
* **Separation of Concerns**: The Admissions module knows nothing about credit cards or banks. The Finance module emits a `PaymentVerifiedIntegrationEvent`, and the Admissions module consumes it to advance the student's enrollment status.

---

## ⚙️ Backend Services (`University-ERP-Backend`)

Built with **.NET 9**, **MediatR (CQRS)**, **Entity Framework Core**, and **PostgreSQL**. The backend is divided into 5 Core Clusters, containing 22 strict Bounded Contexts.

### 1. Academic Cluster
* **`AcademicScheduling`**: Allocates rooms, manages faculty courses, and generates student timetables. Resolves complex room conflicts.
* **`Examination`**: Manages question banks, exam sessions, digital proctoring incidents, gradebook calculations, and result publishing.
* **`LearningManagement` (LMS)**: Manages assessments, parses submissions, and generates offline delta-sync packages for desktop clients.
* **`Registrar`**: Evaluates candidates, processes transcript requests, enforces graduation clearances, and validates course enrollments.
* **`StudentInformation`**: Central student repository managing faculty advisees, contact info, and official enrollment records.

### 2. Administration Cluster
* **`Finance`**: 
  * **Tuition & Billing**: Assesses tuition and issues invoices.
  * **Decoupled Payments**: Manages opaque `PaymentSession` tokens (`AwaitingPayment`, `PendingBankConfirmation`, `Paid`, `Expired`) with strict idempotency keys.
  * **Banking Integration**: Communicates with external bank APIs for EMVCo **QR Ph** dynamic payloads and handles asynchronous webhook callbacks (`POST /webhooks/banking`).
  * **Cash Transactions**: Generates and verifies secure tokens for in-person cashier transactions.
* **`HumanResources`**: Onboards employees and manages staff records.
* **`Payroll`**: Generates payslips and calculates salary batch jobs.
* **`AssetManagement` & `Inventory`**: Registers institutional assets and tracks stock adjustments.
* **`Facilities` & `Transport`**: Books facility reservations and assigns campus bus routes.
* **`MessCanteen` & `Library`**: Reserves student meal plans and tracks catalog checkouts.

### 3. Governance Cluster
* **`EventManagement`**: Plans and schedules campus-wide events.
* **`GrievanceManagement`**: Submits and tracks student/faculty complaints.
* **`Helpdesk`**: Issues and resolves IT/Facilities service tickets.
* **`QualityAccreditation`**: Manages evidence submission workflows for institutional accreditation.
* **`VisitorManagement`**: Registers and tracks campus visitor logs.

### 4. Platform Cluster
* **`IdentityAccess`**: Centralized authentication, JWT issuing, role-based access control, and cross-origin SSO handoffs.
* **`AnalyticsBI`**: Generates institutional health reports and class performance metrics.
* **`CRM`**: Manages prospective student pipelines.
* **`Notifications`**: Unified SMS and Email dispatching service.

### 5. StudentLifecycle Cluster
* **`Admissions`**: Manages the digital intake pipeline, document submission, portfolio review, and automated event-driven status transitions.
* **`Housing`**: Allocates dormitory rooms and manages residence records.

---

## 🎨 Web Frontend Portals (`University-ERP-Frontend`)

A monolithic frontend workspace powered by **Vite**, **React**, **TypeScript**, and a shared `@university-erp/ui-kit` implementing a cohesive, dark-first, glassmorphic enterprise design system.

### The Portals (`apps/`)
1. **💳 Payment Gateway (`payment-gateway`)**: A strictly isolated, PCI-DSS compliant surface running on its own origin. It removes raw card inputs, integrates QR Ph via EMVCo, and uses a real-time polling observer pattern against the backend webhooks.
2. **🙋‍♂️ Applicant Portal (`applicant-portal`)**: Multi-step admission wizards, document uploads, and seamless checkout redirects.
3. **💼 Admissions Portal (`admissions-portal`)**: Staff workspace featuring a unified case view, automated document verification via PDF preview modals, and intake tracking.
4. **🏦 Finance Console (`finance-console`)**: Cashier workstation featuring token auto-population from URL parameters and in-person payment processing.
5. **🎓 Student Portal (`student-portal`)**: Student dashboard for deadlines, schedules, and grades.
6. **👨‍🏫 Faculty Portal (`faculty-portal`)**: Instructor view for section rosters and attendance.
7. **📚 LMS Web (`lms-web`)**: Browser-based learning management system.
8. **🏛 Registrar Portal (`registrar-portal`)**: Administrative grading and transcript management.
9. **⚙️ Admin & Platform Consoles (`admin-portal`, `platform-console`)**: System analytics, health, and IT configuration.
10. **🛡 Security & Governance (`security-portal`, `governance-console`)**: Campus security operations and grievance oversight.

### Shared Libraries (`libs/`)
* **`api-clients`**: Auto-generated, strictly typed API adapters for all backend endpoints.
* **`ui-kit`**: Shared design tokens, CSS variables, and complex components (like the React-Portals-powered `DocumentPreviewModal`).

---

## 💻 Offline-First LMS Client (`clients/lms-offline-avalonia`)

A cross-platform desktop application designed specifically for students in low-connectivity or offline environments. Built with **C#**, **Avalonia UI**, and **SQLite/SQLCipher**.

### Key Offline Features:
* **Outbox/Inbox Sync Engine**: A robust, bi-directional automated synchronization engine. Students can take assessments and submit assignments completely offline. The data is securely buffered in the encrypted SQLite database and automatically pushed to the backend upon network restoration.
* **Binary Resource Caching**: Pre-fetches and locally caches course materials, syllabus documents, and assessment assets (PDFs, images) for offline study.
* **Resilient Authentication**: Propagates detailed backend HTTP status codes (such as `401 Unauthorized` and `403 Forbidden`) to provide accurate status feedback and securely manage identity tokens during offline-to-online transitions.

---

## 🚀 Quick Start & Local Execution

### Prerequisites
* **.NET 9 SDK**
* **Node.js 20+** & **npm**
* **PostgreSQL**

### Running the System

1. **Database Setup & Migrations**:
   ```bash
   dotnet ef database update --project University-ERP-Backend/src/Modules/Administration/Finance/Finance.Infrastructure --startup-project University-ERP-Backend/src/Bootstrap/UniversityErp.Api
   ```

2. **Start Backend API**:
   ```bash
   npm run dev:backend
   ```

3. **Start Frontend Applications**:
   ```bash
   npm run dev:frontend
   ```
   * Applicant Portal: `http://localhost:5174`
   * Admissions Portal: `http://localhost:5175`
   * Finance Console: `http://localhost:5176`
   * Payment Gateway: `http://localhost:5177`

4. **Start Offline LMS Client**:
   ```bash
   cd University-ERP-Frontend/clients/lms-offline-avalonia
   dotnet run
   ```

---

## 📜 Semantic Versioning & Release Management

This repository adheres to strict **SemVer 2.0.0** and **Conventional Commits** standards using runtime-namespaced tags to prevent version collisions in the monorepo:
* Backend Modules: `backend-administration-vX.Y.Z`, `backend-studentlifecycle-vX.Y.Z`
* Frontend Portals: `applicant-portal-vX.Y.Z`, `payment-gateway-vX.Y.Z`
* Offline Client: `lms-offline-client-vX.Y.Z`

Automated release isolation can be triggered via `./isolated_release.sh`.
