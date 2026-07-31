using LearningManagement.Contracts.IntegrationEvents;

namespace LearningManagement.Application.Abstractions;

/// <summary>
/// Repository abstraction for persisting offline LMS submission records ingested
/// from the Avalonia client's outbox sync processor.
/// </summary>
public interface IOfflineSubmissionRepository
{
    Task<bool> ExistsAsync(Guid assessmentId, CancellationToken cancellationToken = default);
    Task SaveAssessmentSubmissionAsync(OfflineAssessmentRecord record, CancellationToken cancellationToken = default);

    Task<bool> ExistsAssignmentAsync(Guid assignmentId, CancellationToken cancellationToken = default);
    Task SaveAssignmentSubmissionAsync(OfflineAssignmentRecord record, CancellationToken cancellationToken = default);
}

/// <summary>
/// In-memory data transfer record representing a persisted offline assessment submission.
/// </summary>
public sealed record OfflineAssessmentRecord(
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    IReadOnlyList<AnswerPayload> Answers,
    DateTimeOffset SubmittedAtUtc
);

/// <summary>
/// In-memory data transfer record representing a persisted offline assignment submission.
/// </summary>
public sealed record OfflineAssignmentRecord(
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    DateTimeOffset SubmittedAtUtc
);
