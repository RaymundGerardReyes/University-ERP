namespace Enrollment.Domain.Events;

using SharedKernel.Domain.Primitives;
using System;

public sealed record CourseDroppedDomainEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string StudentId,
    string SectionId,
    string TermId
) : IDomainEvent;
