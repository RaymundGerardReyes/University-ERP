namespace Registrar.Application.Features.EvaluateGraduationClearance;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record EvaluateGraduationClearanceCommand(
    Guid ClearanceId, 
    bool HasRequiredCredits, 
    bool HasZeroBalance
) : IRequest<Result<string>>;

public sealed class EvaluateGraduationClearanceCommandHandler : IRequestHandler<EvaluateGraduationClearanceCommand, Result<string>>
{
    public Task<Result<string>> Handle(EvaluateGraduationClearanceCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch GraduationClearance aggregate from IRegistrarRepository using request.ClearanceId
        // Mocking the aggregate retrieval for the DBMA structure
        var clearance = GraduationClearance.Initiate(Guid.NewGuid(), "B.S. Computer Science").Value;

        // 2. Evaluate
        var evaluation = clearance.EvaluateClearance(request.HasRequiredCredits, request.HasZeroBalance);

        // 3. Save updated state back to repository

        if (evaluation.IsSuccess)
        {
            return Task.FromResult(Result<string>.Success(clearance.ClearanceStatus));
        }

        return Task.FromResult(Result<string>.Failure(evaluation.Error));
    }
}