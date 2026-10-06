namespace GrievanceManagement.Application.Features.EscalateComplaint;

using MediatR;
using SharedKernel.Domain.Primitives;
using GrievanceManagement.Domain.Aggregates;
using GrievanceManagement.Application.Abstractions;
using Contracts.IntegrationEvents.Governance;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record EscalateComplaintCommand(
    Guid ComplaintId,
    string TargetDepartment,
    string Priority,
    string EscalationReason
) : IRequest<Result<bool>>;

public sealed class EscalateComplaintCommandHandler : IRequestHandler<EscalateComplaintCommand, Result<bool>>
{
    private readonly IGrievanceRepository _repository;
    private readonly IPublisher _publisher;

    public EscalateComplaintCommandHandler(IGrievanceRepository repository, IPublisher publisher)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(EscalateComplaintCommand request, CancellationToken cancellationToken)
    {
        var complaint = await _repository.GetByIdAsync(request.ComplaintId, cancellationToken);
        if (complaint == null)
        {
            return Result<bool>.Failure(new Error("Grievance.NotFound", "The specified complaint does not exist."));
        }

        var escalateResult = complaint.Escalate(request.TargetDepartment, request.Priority, request.EscalationReason);
        if (escalateResult.IsFailure)
        {
            return Result<bool>.Failure(escalateResult.Error);
        }

        await _repository.UpdateAsync(complaint, cancellationToken);

        Guid submitterGuid = Guid.TryParse(complaint.ComplainantId, out var parsedGuid)
            ? parsedGuid
            : Guid.NewGuid();

        var integrationEvent = new GrievanceSubmittedIntegrationEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            complaint.Id,
            submitterGuid,
            request.TargetDepartment,
            request.Priority
        );

        await _publisher.Publish(integrationEvent, cancellationToken);

        return Result<bool>.Success(true);
    }
}

