namespace GrievanceManagement.Application.Features.SubmitComplaint;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using GrievanceManagement.Domain.Aggregates;
using GrievanceManagement.Application.Abstractions;

public sealed record SubmitComplaintCommand(string ComplainantId, string Category, string Description) : IRequest<Result<Guid>>;

public sealed class SubmitComplaintCommandHandler : IRequestHandler<SubmitComplaintCommand, Result<Guid>>
{
    private readonly IGrievanceRepository _repository;

    public SubmitComplaintCommandHandler(IGrievanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(SubmitComplaintCommand request, CancellationToken cancellationToken)
    {
        // 1. Invoke the Domain Aggregate factory to validate invariants
        var complaintResult = Complaint.Submit(
            request.ComplainantId, 
            request.Category, 
            request.Description);

        // 2. Return early if invariants are violated
        if (complaintResult.IsFailure)
        {
            return Result<Guid>.Failure(complaintResult.Error);
        }

        // 3. Persist the valid aggregate
        await _repository.AddAsync(complaintResult.Value, cancellationToken);

        // 4. Return success
        return Result<Guid>.Success(complaintResult.Value.Id);
    }
}
