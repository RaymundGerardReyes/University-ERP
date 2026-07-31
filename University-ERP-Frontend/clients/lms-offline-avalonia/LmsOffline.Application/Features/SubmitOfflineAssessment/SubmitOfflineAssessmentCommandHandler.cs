namespace LmsOffline.Application.Features.SubmitOfflineAssessment;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.ValueObjects;

public sealed class SubmitOfflineAssessmentCommandHandler : IRequestHandler<SubmitOfflineAssessmentCommand, Result<Guid>>
{
    private readonly IOfflineAssessmentRepository _repository;

    public SubmitOfflineAssessmentCommandHandler(IOfflineAssessmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(SubmitOfflineAssessmentCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch the exam from the secure local database
        var assessment = await _repository.GetByIdAsync(request.AssessmentId, cancellationToken);
        if (assessment is null)
        {
            return Result<Guid>.Failure(new Error("Assessment.NotFound", "The assessment was not found on this device."));
        }

        if (!assessment.IsStarted)
        {
            return Result<Guid>.Failure(new Error("Assessment.NotStarted", "Cannot submit an assessment that was never started."));
        }

        // 2. NFR Fulfillment: Flag the assessment so the OutboxSyncProcessor pushes it when internet returns
        assessment.UpdateSyncStatus(SyncStatus.PendingSync);

        // 3. Save the final state to disk
        await _repository.UpdateAsync(assessment, cancellationToken);

        return Result<Guid>.Success(assessment.Id);
    }
}
