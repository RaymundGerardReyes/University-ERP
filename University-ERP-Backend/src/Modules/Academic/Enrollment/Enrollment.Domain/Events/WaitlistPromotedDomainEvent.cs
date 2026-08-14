namespace Enrollment.Domain.Events;

using SharedKernel.Domain.Primitives;
using System;

public sealed record WaitlistPromotedDomainEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string StudentId,
    string CourseCode
) : IDomainEvent;
