namespace Assessments.Domain.Events;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;

public sealed record SectionGradesPostedDomainEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string SectionId,
    Dictionary<string, decimal> StudentFinalGrades
) : IDomainEvent;
