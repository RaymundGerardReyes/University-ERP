namespace LmsOffline.Application.Features.SubmitOfflineAssignment;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.ValueObjects;

public sealed class SubmitOfflineAssignmentCommandHandler : IRequestHandler<SubmitOfflineAssignmentCommand, Result<Guid>>
{
    private readonly IOfflineAssessmentRepository _repository;

    public SubmitOfflineAssignmentCommandHandler(IOfflineAssessmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(SubmitOfflineAssignmentCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch the assessment from the encrypted local database
        var assessment = await _repository.GetByIdAsync(request.AssessmentId, cancellationToken);
        if (assessment is null)
        {
            return Result<Guid>.Failure(new Error("Assessment.NotFound", "Assessment data missing from local device."));
        }

        // 2. NFR Fulfillment: Flag the assessment for the OutboxSyncProcessor to pick up!
        assessment.UpdateSyncStatus(SyncStatus.PendingSync);

        // 3. Save securely to disk
        await _repository.UpdateAsync(assessment, cancellationToken);

        return Result<Guid>.Success(assessment.Id);
    }
}
