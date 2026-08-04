namespace LearningManagement.Contracts.IntegrationEvents;

using MediatR;
using System;

/// <summary>
/// Published when an offline assessment syncs successfully and securely.
/// Subscribers: 
/// - Examination/Gradebook (to calculate grades based on the AnswersJson)
/// - AnalyticsBI (to convert the submission into an xAPI statement)
/// </summary>
public sealed record OfflineAssessmentSubmittedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    string AnswersJson,
    string ScheduleToken
) : INotification;