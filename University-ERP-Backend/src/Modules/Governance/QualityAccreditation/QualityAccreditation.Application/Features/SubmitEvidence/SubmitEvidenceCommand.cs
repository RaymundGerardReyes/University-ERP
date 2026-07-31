namespace QualityAccreditation.Application.Features.SubmitEvidence;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using QualityAccreditation.Domain.Aggregates;
using QualityAccreditation.Application.Abstractions;

public sealed record SubmitEvidenceCommand(string StandardCode, string SubmitterId, string DocumentReference) : IRequest<Result<Guid>>;

public sealed class SubmitEvidenceCommandHandler : IRequestHandler<SubmitEvidenceCommand, Result<Guid>>
{
    private readonly IAccreditationRepository _repository;

    public SubmitEvidenceCommandHandler(IAccreditationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(SubmitEvidenceCommand request, CancellationToken cancellationToken)
    {
        var evidenceResult = AccreditationEvidence.Submit(
            request.StandardCode, 
            request.SubmitterId, 
            request.DocumentReference);

        if (evidenceResult.IsFailure)
        {
            return Result<Guid>.Failure(evidenceResult.Error);
        }

        await _repository.AddAsync(evidenceResult.Value, cancellationToken);
        return Result<Guid>.Success(evidenceResult.Value.Id);
    }
}
