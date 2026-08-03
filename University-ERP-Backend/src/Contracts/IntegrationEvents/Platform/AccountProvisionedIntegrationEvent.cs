namespace Contracts.IntegrationEvents.Platform;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Integration event published when a user account is provisioned in IdentityAccess.
/// Consumed by Communication (to send welcome email) and Directory services.
/// </summary>
public sealed record AccountProvisionedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid UserId,
    string Email,
    string AssignedRole
) : IDomainEvent;
