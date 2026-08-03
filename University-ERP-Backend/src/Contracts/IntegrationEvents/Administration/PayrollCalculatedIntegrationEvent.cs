namespace Contracts.IntegrationEvents.Administration;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when monthly payroll calculations complete for employees.
/// Consumed by Finance (for disbursements) and Notification services.
/// </summary>
public sealed record PayrollCalculatedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid PayrollBatchId,
    int TotalEmployeesProcessed,
    decimal TotalDisbursementAmount,
    string PayPeriod
) : IDomainEvent;
