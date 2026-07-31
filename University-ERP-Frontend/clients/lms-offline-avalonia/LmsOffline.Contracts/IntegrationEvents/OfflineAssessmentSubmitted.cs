namespace LmsOffline.Contracts.IntegrationEvents;

using System;

public sealed record OfflineAssessmentSubmitted(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    string AnswersJson,
    string ScheduleToken
);