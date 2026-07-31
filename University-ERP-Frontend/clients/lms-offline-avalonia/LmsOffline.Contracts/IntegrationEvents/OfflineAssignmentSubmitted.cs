namespace LmsOffline.Contracts.IntegrationEvents;

using System;

/// <summary>
/// Contract sent to the ERP Backend when an assignment is synced from the outbox.
/// </summary>
public sealed record OfflineAssignmentSubmitted(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid AssignmentId,
    Guid StudentId,
    string ContentPayload
);
