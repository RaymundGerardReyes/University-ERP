namespace Contracts.IntegrationEvents.Academic;

using MediatR;
using System;

public sealed record WaitlistPromotedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string StudentId,
    string CourseCode
) : INotification;
