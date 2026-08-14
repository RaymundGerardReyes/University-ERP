namespace Contracts.IntegrationEvents.Academic;

using MediatR;
using System;

public sealed record CourseDroppedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string StudentId,
    string SectionId,
    string TermId
) : INotification;
