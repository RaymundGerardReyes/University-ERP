namespace LearningManagement.Contracts.IntegrationEvents;

/// <summary>
/// Published when a student's offline assessment (quiz/exam) is submitted
/// from the Avalonia LmsOffline client via the sync endpoint.
/// </summary>
public sealed record OfflineAssessmentSubmittedIntegrationEvent(
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    IReadOnlyList<AnswerPayload> Answers,
    string ScheduleToken,
    DateTimeOffset SubmittedAtUtc
);

public sealed record AnswerPayload(
    string QuestionId,
    string SelectedOption
);
