namespace Contracts.IntegrationEvents.Academic;

using MediatR;
using System;
using System.Collections.Generic;

public sealed record GradesPostedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string SectionId,
    Dictionary<string, decimal> StudentFinalGrades
) : INotification;
