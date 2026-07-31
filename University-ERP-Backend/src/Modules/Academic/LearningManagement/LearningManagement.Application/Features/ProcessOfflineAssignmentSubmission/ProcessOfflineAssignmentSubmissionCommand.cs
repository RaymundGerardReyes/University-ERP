using MediatR;

namespace LearningManagement.Application.Features.ProcessOfflineAssignmentSubmission;

/// <summary>
/// CQRS command carrying the decrypted offline assignment (essay) submission
/// payload received from the Avalonia LmsOffline client.
/// </summary>
public sealed record ProcessOfflineAssignmentSubmissionCommand(
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken,
    DateTimeOffset SubmittedAtUtc
) : IRequest<ProcessOfflineAssignmentSubmissionResult>;

public sealed record ProcessOfflineAssignmentSubmissionResult(
    Guid AssignmentId,
    bool IsAccepted,
    string? RejectionReason
);
