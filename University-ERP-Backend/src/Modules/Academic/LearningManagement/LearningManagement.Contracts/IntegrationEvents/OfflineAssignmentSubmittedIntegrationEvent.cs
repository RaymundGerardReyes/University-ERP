namespace LearningManagement.Contracts.IntegrationEvents;

using MediatR;
using System;

public sealed record OfflineAssignmentSubmittedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken
) : INotification;