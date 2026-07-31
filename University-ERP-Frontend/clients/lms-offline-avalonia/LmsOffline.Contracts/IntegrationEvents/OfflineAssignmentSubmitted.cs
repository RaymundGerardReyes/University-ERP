namespace LmsOffline.Contracts.IntegrationEvents;

using System;

public sealed record OfflineAssignmentSubmitted(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken
);