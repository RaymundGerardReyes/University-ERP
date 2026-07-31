namespace StudentInformation.Domain.DomainEvents;

using SharedKernel.Domain.Primitives;
using StudentInformation.Domain.ValueObjects;

/// <summary>
/// Event raised internally when a new student is successfully enrolled.
/// </summary>
public sealed record StudentEnrolledDomainEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    StudentId StudentId,
    Guid IdentityUserId
) : IDomainEvent;
