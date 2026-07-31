using LearningManagement.Application.Abstractions;
using LearningManagement.Contracts.IntegrationEvents;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;

/// <summary>
/// Handles ingestion of an offline assessment submission from the Avalonia client.
/// Validates the cryptographic schedule token, persists the graded record,
/// and publishes an integration event for downstream modules (e.g., Registrar, Examination).
/// </summary>
internal sealed class ProcessOfflineAssessmentSubmissionCommandHandler
    : IRequestHandler<ProcessOfflineAssessmentSubmissionCommand, ProcessOfflineAssessmentSubmissionResult>
{
    private readonly IOfflineSubmissionRepository _repository;
    private readonly IScheduleTokenVerifier _tokenVerifier;
    private readonly IPublisher _publisher;
    private readonly ILogger<ProcessOfflineAssessmentSubmissionCommandHandler> _logger;

    public ProcessOfflineAssessmentSubmissionCommandHandler(
        IOfflineSubmissionRepository repository,
        IScheduleTokenVerifier tokenVerifier,
        IPublisher publisher,
        ILogger<ProcessOfflineAssessmentSubmissionCommandHandler> logger)
    {
        _repository = repository;
        _tokenVerifier = tokenVerifier;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task<ProcessOfflineAssessmentSubmissionResult> Handle(
        ProcessOfflineAssessmentSubmissionCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Validate the cryptographic ScheduleToken from the Avalonia client
        var tokenValid = _tokenVerifier.Verify(
            request.ScheduleToken,
            request.AssessmentId.ToString(),
            request.SubmittedAtUtc);

        if (!tokenValid)
        {
            _logger.LogWarning(
                "Rejected offline assessment {AssessmentId} for student {StudentId}: invalid schedule token.",
                request.AssessmentId, request.StudentId);

            return new ProcessOfflineAssessmentSubmissionResult(
                request.AssessmentId,
                IsAccepted: false,
                RejectionReason: "Invalid or expired schedule token. Submission window may have passed.");
        }

        // 2. Idempotency check — reject duplicate outbox replay
        var alreadyExists = await _repository.ExistsAsync(request.AssessmentId, cancellationToken);
        if (alreadyExists)
        {
            _logger.LogInformation(
                "Assessment {AssessmentId} already ingested. Returning idempotent acceptance.",
                request.AssessmentId);

            return new ProcessOfflineAssessmentSubmissionResult(
                request.AssessmentId,
                IsAccepted: true,
                RejectionReason: null);
        }

        // 3. Persist the offline submission record
        await _repository.SaveAssessmentSubmissionAsync(new OfflineAssessmentRecord(
            request.AssessmentId,
            request.StudentId,
            request.CourseCode,
            request.ModuleTitle,
            request.Answers,
            request.SubmittedAtUtc), cancellationToken);

        // 4. Publish integration event for Examination / Registrar modules to consume
        await _publisher.Publish(new OfflineAssessmentSubmittedIntegrationEvent(
            request.AssessmentId,
            request.StudentId,
            request.CourseCode,
            request.ModuleTitle,
            request.Answers,
            request.ScheduleToken,
            request.SubmittedAtUtc), cancellationToken);

        _logger.LogInformation(
            "Successfully ingested offline assessment {AssessmentId} for student {StudentId}.",
            request.AssessmentId, request.StudentId);

        return new ProcessOfflineAssessmentSubmissionResult(
            request.AssessmentId,
            IsAccepted: true,
            RejectionReason: null);
    }
}
