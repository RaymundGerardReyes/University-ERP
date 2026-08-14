namespace Contracts.IntegrationEvents.StudentLifecycle;

using System;
using MediatR;

public sealed record StudentEnrolledIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    string ApplicationId,
    string GeneratedStudentId
) : INotification;
