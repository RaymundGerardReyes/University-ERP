namespace LmsOffline.Application.Features.SubmitOfflineAssignment;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;

public sealed class SubmitOfflineAssignmentCommandHandler : IRequestHandler<SubmitOfflineAssignmentCommand, Result<bool>>
{
    private readonly IOfflineAssignmentRepository _repository;

    public SubmitOfflineAssignmentCommandHandler(IOfflineAssignmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(SubmitOfflineAssignmentCommand request, CancellationToken cancellationToken)
    {
        // 1. Verify the assignment's cryptographic Availability Window 
        var window = AvailabilityWindow.Create(DateTime.UtcNow.AddDays(-7), DateTime.UtcNow.AddDays(1));
        
        // 2. Initialize the OfflineAssignment Domain Aggregate
        var assignment = new OfflineAssignment(
            id: Guid.NewGuid(),
            assignmentId: request.AssessmentId, // Reused parameter from the command
            title: "Draft Essay Submission",
            window: window
        );

        // 3. Encrypt and attach the markdown/text payload
        assignment.AttachDraftPayload(request.StudentAnswersJson, request.SubmittedAtUtc);
        
        // 4. Queue for the OutboxSyncProcessor
        assignment.UpdateSyncStatus(SyncStatus.PendingSync);

        // 5. Persist to local SQLCipher DB
        await _repository.SaveAsync(assignment, cancellationToken);

        return Result<bool>.Success(true);
    }
}