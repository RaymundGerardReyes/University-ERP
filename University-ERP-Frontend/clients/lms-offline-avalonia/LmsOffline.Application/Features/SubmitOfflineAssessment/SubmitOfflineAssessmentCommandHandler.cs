namespace LmsOffline.Application.Features.SubmitOfflineAssessment;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;

public sealed class SubmitOfflineAssessmentCommandHandler : IRequestHandler<SubmitOfflineAssessmentCommand, Result<bool>>
{
    private readonly IOfflineAssessmentRepository _repository;

    public SubmitOfflineAssessmentCommandHandler(IOfflineAssessmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(SubmitOfflineAssessmentCommand request, CancellationToken cancellationToken)
    {
        // 1. In a real scenario, fetch the active assessment window to ensure it hasn't expired.
        var window = AvailabilityWindow.Create(DateTime.UtcNow.AddHours(-2), DateTime.UtcNow.AddHours(2));
        
        // 2. Create the offline domain aggregate
        var assessment = new OfflineAssessment(
            id: Guid.NewGuid(),
            assessmentId: request.AssessmentId,
            title: "Pending Offline Submission",
            window: window,
            maxAttempts: 1
        );

        // 3. Attach the JSON payload and mark it for the Outbox Sync
        assessment.AttachSubmissionPayload(request.StudentAnswersJson, request.SubmittedAtUtc);
        assessment.UpdateSyncStatus(SyncStatus.PendingSync);

        // 4. Save to encrypted SQLite DB
        await _repository.SaveAsync(assessment, cancellationToken);

        return Result<bool>.Success(true);
    }
}