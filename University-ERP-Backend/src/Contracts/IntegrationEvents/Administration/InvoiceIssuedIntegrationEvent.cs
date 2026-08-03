namespace Contracts.IntegrationEvents.Administration;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when a student invoice is issued by the Finance context.
/// Consumed asynchronously by StudentLifecycle, Notification, and Analytics.
/// Uses primitive types to maintain low coupling between bounded contexts.
/// </summary>
public sealed record InvoiceIssuedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid InvoiceId,
    Guid StudentId,
    decimal Amount,
    string Description
) : IDomainEvent;
