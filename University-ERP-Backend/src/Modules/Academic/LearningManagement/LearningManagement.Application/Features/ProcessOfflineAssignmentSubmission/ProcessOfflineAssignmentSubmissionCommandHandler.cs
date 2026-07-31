using LearningManagement.Application.Abstractions;
using LearningManagement.Contracts.IntegrationEvents;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LearningManagement.Application.Features.ProcessOfflineAssignmentSubmission;

/// <summary>
/// Handles ingestion of an offline assignment (essay) submission from the Avalonia client.
/// </summary>
internal sealed class ProcessOfflineAssignmentSubmissionCommandHandler
    : IRequestHandler<ProcessOfflineAssignmentSubmissionCommand, ProcessOfflineAssignmentSubmissionResult>
{
    private readonly IOfflineSubmissionRepository _repository;
    private readonly IScheduleTokenVerifier _tokenVerifier;
    private readonly IPublisher _publisher;
    private readonly ILogger<ProcessOfflineAssignmentSubmissionCommandHandler> _logger;

    public ProcessOfflineAssignmentSubmissionCommandHandler(
        IOfflineSubmissionRepository repository,
        IScheduleTokenVerifier tokenVerifier,
        IPublisher publisher,
        ILogger<ProcessOfflineAssignmentSubmissionCommandHandler> logger)
    {
        _repository = repository;
        _tokenVerifier = tokenVerifier;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task<ProcessOfflineAssignmentSubmissionResult> Handle(
        ProcessOfflineAssignmentSubmissionCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Validate cryptographic schedule token
        var tokenValid = _tokenVerifier.Verify(
            request.ScheduleToken,
            request.AssignmentId.ToString(),
            request.SubmittedAtUtc);

        if (!tokenValid)
        {
            _logger.LogWarning(
                "Rejected offline assignment {AssignmentId} for student {StudentId}: invalid schedule token.",
                request.AssignmentId, request.StudentId);

            return new ProcessOfflineAssignmentSubmissionResult(
                request.AssignmentId,
                IsAccepted: false,
                RejectionReason: "Invalid or expired schedule token. Submission window may have passed.");
        }

        // 2. Idempotency check
        var alreadyExists = await _repository.ExistsAssignmentAsync(request.AssignmentId, cancellationToken);
        if (alreadyExists)
        {
            _logger.LogInformation(
                "Assignment {AssignmentId} already ingested. Returning idempotent acceptance.",
                request.AssignmentId);

            return new ProcessOfflineAssignmentSubmissionResult(
                request.AssignmentId,
                IsAccepted: true,
                RejectionReason: null);
        }

        // 3. Persist the submission
        await _repository.SaveAssignmentSubmissionAsync(new OfflineAssignmentRecord(
            request.AssignmentId,
            request.StudentId,
            request.CourseCode,
            request.AssignmentTitle,
            request.EssayContent,
            request.SubmittedAtUtc), cancellationToken);

        // 4. Publish integration event
        await _publisher.Publish(new OfflineAssignmentSubmittedIntegrationEvent(
            request.AssignmentId,
            request.StudentId,
            request.CourseCode,
            request.AssignmentTitle,
            request.EssayContent,
            request.ScheduleToken,
            request.SubmittedAtUtc), cancellationToken);

        _logger.LogInformation(
            "Successfully ingested offline assignment {AssignmentId} for student {StudentId}.",
            request.AssignmentId, request.StudentId);

        return new ProcessOfflineAssignmentSubmissionResult(
            request.AssignmentId,
            IsAccepted: true,
            RejectionReason: null);
    }
}
