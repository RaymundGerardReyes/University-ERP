namespace LearningManagement.Contracts.IntegrationEvents;

/// <summary>
/// Published when a student's offline assignment (essay/long-form) is submitted
/// from the Avalonia LmsOffline client via the sync endpoint.
/// </summary>
public sealed record OfflineAssignmentSubmittedIntegrationEvent(
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken,
    DateTimeOffset SubmittedAtUtc
);
