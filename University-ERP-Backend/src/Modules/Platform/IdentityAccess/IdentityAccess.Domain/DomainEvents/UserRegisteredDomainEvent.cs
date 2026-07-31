namespace IdentityAccess.Domain.DomainEvents;

using SharedKernel.Domain.Primitives;
using IdentityAccess.Domain.ValueObjects;

/// <summary>
/// Event raised when a new User aggregate is created.
/// </summary>
public sealed record UserRegisteredDomainEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    UserId UserId,
    Email Email
) : IDomainEvent;
