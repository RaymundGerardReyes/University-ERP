namespace Admissions.Domain.Events;

using SharedKernel.Domain.Primitives;
using System;

public sealed record StudentEnrolledDomainEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string ApplicationId,
    string GeneratedStudentId,
    DateTime EnrolledAt
) : IDomainEvent;
