# Task & Schedule Orchestration Analysis

Based on the `Structure.md` architecture and the frontend implementation patterns across the `faculty-portal` and `student-portal`, here is a detailed analysis of how tasks are created, managed, and distributed without data collisions or scheduling conflicts.

## 1. Task Creation by Faculty
While the `faculty-portal` currently exposes UI for grade management (`Assessments.page.tsx`) and attendance tracking (`TeachingDashboard.page.tsx`), the underlying backend structure provides the complete lifecycle for task creation:
* **The Examination Module**: Faculty members can create quiz and exam items using the `CreateQuestionCommand`. These aggregate into an `ExamSession`.
* **The Learning Management Module**: Assignments and learning materials are treated as an `Assessment` aggregate. The offline synchronization engine (via `GetOfflineModulePackageQuery` and `ProcessOfflineAssignmentSubmissionCommand`) allows faculty to publish these tasks.

When a faculty member creates a task, it is strictly scoped to a specific **`sectionId`**. This ID acts as the primary key for the distribution engine.

## 2. Preventing Time Schedule Conflicts
Time scheduling is decoupled from task creation and managed exclusively by the **`AcademicScheduling`** bounded context.
* **Aggregates**: `ClassSession`, `CourseSection`, and `RoomAllocation`.
* **Mechanisms**: When a curriculum is planned, the `AllocateRoomCommand` and `GetFacultyScheduleQuery` are invoked to validate availability. 
* **UI Reflection**: In the `faculty-portal` (`TeachingDashboard.page.tsx`), the faculty only sees pre-validated `course.schedule` and `course.room` metadata. Because scheduling is resolved upstream in the `AcademicScheduling` module, overlapping assignments or clashing class times are mechanically prevented before the faculty even interacts with their dashboard.

## 3. Isolating College Departments
The monorepo uses Domain-Driven Design (DDD) to isolate departmental data.
* **The Registrar Module**: Handles the `CourseSection` and `CourseRegistration` aggregates. It maintains the definitive truth of which section belongs to which department/college.
* **Context Mapping**: The `sectionId` is passed from `faculty-portal` API calls (e.g., `assessmentApi.getGradebook(sectionId)`). The backend repositories evaluate the user's Identity (via `ScheduleTokenVerifier.cs` and `IdentityAccess` module) to ensure the logged-in faculty is authorized to modify that specific section. 
* This multi-tenant-like isolation means the Engineering department's tasks can never bleed into the Nursing department's sections.

## 4. Distributing to Students (Conflict-Free)
The handoff from `faculty-portal` to `student-portal` is completely asynchronous to avoid database deadlocks and merge conflicts.
* **Event-Driven Sync**: When a student enrolls via the `Registrar` module, a `StudentEnrolledIntegrationEvent` is fired. The `LearningManagement` worker (`StudentEnrolledEventHandler.cs`) catches this event and creates a localized `StudentGradeRecord` for that student.
* **Student Consumption**: In the `student-portal` (`LearningManagement.page.tsx`), the student views their tasks by querying `getCourseDetails(courseId)`. The API only returns the `Assessment` and `activities` bound to their specific `StudentId` and `CourseSection`.
* **Offline Conflict Resolution**: If a student completes a task offline via the Avalonia client, the `ProcessOfflineAssignmentSubmissionCommand` processes the payload. It uses a robust Outbox/Inbox mechanism to guarantee that the submission is tied to the correct `StudentId` and task version, eliminating concurrency issues if multiple students submit at the exact same millisecond.

### Summary
The system avoids conflicts by ensuring **no direct point-to-point communication** occurs between the Faculty and Student portals. Instead:
1. Faculty act on a **Section** (governed by `AcademicScheduling`).
2. Students act on a **Registration** (governed by `Registrar`).
3. The **LearningManagement** module sits in the middle, tying tasks to sections, and using domain events to safely broadcast changes across the ERP ecosystem.
