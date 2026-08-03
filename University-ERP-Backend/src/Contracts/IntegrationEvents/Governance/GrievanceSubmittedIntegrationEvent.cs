namespace Contracts.IntegrationEvents.Governance;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when a formal grievance is submitted.
/// Consumed by Administration, Legal Compliance, and Notification services.
/// </summary>
public sealed record GrievanceSubmittedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid GrievanceId,
    Guid SubmitterId,
    string Category,
    string Priority
) : IDomainEvent;
