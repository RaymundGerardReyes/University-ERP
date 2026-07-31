using LearningManagement.Contracts.IntegrationEvents;
using MediatR;

namespace LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;

/// <summary>
/// CQRS command carrying the decrypted offline assessment submission
/// payload received from the Avalonia LmsOffline client.
/// </summary>
public sealed record ProcessOfflineAssessmentSubmissionCommand(
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    IReadOnlyList<AnswerPayload> Answers,
    string ScheduleToken,
    DateTimeOffset SubmittedAtUtc
) : IRequest<ProcessOfflineAssessmentSubmissionResult>;

public sealed record ProcessOfflineAssessmentSubmissionResult(
    Guid AssessmentId,
    bool IsAccepted,
    string? RejectionReason
);
