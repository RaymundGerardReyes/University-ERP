namespace Contracts.IntegrationEvents.Governance;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when a support/helpdesk ticket is submitted.
/// Consumed by Administration (Facilities/IT) and Notification services.
/// </summary>
public sealed record SupportTicketRequestedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid TicketId,
    Guid RequesterId,
    string Category,
    string UrgencyLevel
) : IDomainEvent;
