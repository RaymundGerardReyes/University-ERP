---
name: cross-module-event-tracer
description: >-
  Traces, audits, and scaffolds asynchronous cross-module workflows and integration events between Academic, Administration, Governance, Platform, and StudentLifecycle modules in University-ERP.
---

# Cross-Module Event Tracer Skill

This skill provides an exhaustive catalog of integration events, domain boundaries, and instructions for implementing and debugging cross-module asynchronous workflows in `University-ERP`.

---

## 1. Monolith Integration Event Catalog

All integration events are defined in `University-ERP-Backend/src/Contracts/IntegrationEvents/`:

### Academic Domain
| Event | Triggering Context | Downstream Consumers |
| :--- | :--- | :--- |
| `StudentEnrolledIntegrationEvent` | `Enrollment`, `StudentInformation` | `Finance` (Tuition assessment), `IdentityAccess` (Account provisioning), `LMS` (Course enrollment) |
| `CourseDroppedIntegrationEvent` | `Enrollment` | `Finance` (Tuition refund/adjustment), `AcademicScheduling` (Seat release) |
| `WaitlistPromotedIntegrationEvent` | `Enrollment` | `Notification` (Alert student), `Finance` (Tuition hold) |
| `GradesPostedIntegrationEvent` | `Assessments`, `Registrar` | `StudentInformation` (Update GPA), `Graduation` (Clearance evaluation) |
| `ExamResultPublishedIntegrationEvent` | `Examination` | `StudentInformation`, `Admissions` |

### Administration Domain
| Event | Triggering Context | Downstream Consumers |
| :--- | :--- | :--- |
| `InvoiceIssuedIntegrationEvent` | `Finance` | `StudentPortal` (Notification), `StudentInformation` (Billing hold) |
| `PaymentVerifiedIntegrationEvent` | `Finance` | `Admissions` (Unlock enrollment handoff), `Registrar` (Clear registration hold) |
| `PayrollCalculatedIntegrationEvent` | `Payroll` | `Finance` (General ledger journal entry) |

### Governance Domain
| Event | Triggering Context | Downstream Consumers |
| :--- | :--- | :--- |
| `GrievanceSubmittedIntegrationEvent` | `GrievanceManagement` | `Worker` (SLA breach timer), `Notification` (Dean notice) |
| `SupportTicketRequestedIntegrationEvent` | `Helpdesk` | `Notification` (Staff dispatch) |

### Platform Domain
| Event | Triggering Context | Downstream Consumers |
| :--- | :--- | :--- |
| `AccountProvisionedIntegrationEvent` | `IdentityAccess` | `Notification` (Welcome email & credentials), `StudentInformation` |
| `UserRegisteredIntegrationEvent` | `IdentityAccess` | `StudentInformation`, `HumanResources` |

### StudentLifecycle Domain
| Event | Triggering Context | Downstream Consumers |
| :--- | :--- | :--- |
| `ApplicantAcceptedIntegrationEvent` | `Admissions` | `Finance` (Admission fee invoice), `IdentityAccess` (Pre-registration user) |
| `RoomAllocatedIntegrationEvent` | `Hostel` | `Finance` (Dormitory billing fee addition) |

---

## 2. Event-Driven Cross-Module Pipeline Examples

### Flow 1: Admission to Active Enrollment Pipeline
```
[ApplicantPortal] ──> Submits application
      │
[Admissions Module] ──> Evaluates & Accepts
      │ (Raises ApplicantAcceptedIntegrationEvent)
      ▼
[Finance Module] ──> Issues Admission Fee Invoice
      │ (Student pays fee via PaymentGateway)
      ▼ (Raises PaymentVerifiedIntegrationEvent)
[Admissions Module] ──> Activates Enrollment
      │ (Raises StudentEnrolledIntegrationEvent)
      ├────────────────────────┬────────────────────────┐
      ▼                        ▼                        ▼
[IdentityAccess]         [Registrar]              [Finance]
Provisions student       Initializes academic     Assesses term
SSO account & email      record & course limits   full tuition
```

---

## 3. Implementing a New Integration Event

### Step 1: Define Event Contract in `Contracts/`
File: `src/Contracts/IntegrationEvents/<Domain>/<EventName>IntegrationEvent.cs`
```csharp
using UniversityErp.SharedKernel.Domain;

namespace UniversityErp.Contracts.IntegrationEvents.<Domain>;

public sealed record <EventName>IntegrationEvent(
    Guid EventId,
    DateTime OccurredOn,
    Guid AggregateId,
    string CorrelationId,
    // Domain-specific payloads
    string StudentNumber,
    decimal Amount
) : INotification;
```

### Step 2: Publish via Outbox in Publishing Module
Inside `<Module>.Application`:
```csharp
// Inside Command Handler after state mutation:
var integrationEvent = new <EventName>IntegrationEvent(
    Guid.NewGuid(),
    DateTime.UtcNow,
    aggregate.Id,
    _correlationContext.CorrelationId,
    aggregate.StudentNumber,
    aggregate.TotalAmount
);

await _outboxService.SaveAsync(integrationEvent, cancellationToken);
```

### Step 3: Consume in Downstream Module
File: `src/Modules/<TargetDomain>/<TargetModule>/<TargetModule>.Application/Consumers/<EventName>IntegrationEventConsumer.cs`
```csharp
using MediatR;
using UniversityErp.Contracts.IntegrationEvents.<Domain>;

namespace UniversityErp.Modules.<TargetModule>.Application.Consumers;

public sealed class <EventName>IntegrationEventConsumer 
    : INotificationHandler<<EventName>IntegrationEvent>
{
    private readonly ISender _sender;

    public <EventName>IntegrationEventConsumer(ISender sender)
    {
        _sender = sender;
    }

    public async Task Handle(<EventName>IntegrationEvent notification, CancellationToken ct)
    {
        // Dispatch local command to preserve CQRS boundary
        await _sender.Send(new Process<EventName>Command(
            notification.AggregateId,
            notification.StudentNumber,
            notification.Amount
        ), ct);
    }
}
```

