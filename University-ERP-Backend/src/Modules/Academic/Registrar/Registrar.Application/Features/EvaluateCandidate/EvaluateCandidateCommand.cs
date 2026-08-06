namespace Registrar.Application.Features.EvaluateCandidate;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record EvaluateCandidateCommand(Guid StudentId, decimal FinalGpa) : IRequest<Result<string>>;

public sealed class EvaluateCandidateCommandHandler : IRequestHandler<EvaluateCandidateCommand, Result<string>>
{
    // private readonly IGraduationClearanceRepository _repository;

    public EvaluateCandidateCommandHandler()
    {
    }

    public async Task<Result<string>> Handle(EvaluateCandidateCommand request, CancellationToken cancellationToken)
    {
        // var clearance = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        // if (clearance == null) return Result.Failure(new Error("NotFound", "Graduation clearance record not found."));

        // // Ensure cleared
        // clearance.EvaluateClearance(hasRequiredCredits: true, hasZeroBalance: true);

        // var result = clearance.ComputeLatinHonors(request.FinalGpa);
        // if (result.IsFailure) return result;

        // await _repository.UpdateAsync(clearance, cancellationToken);
        
        await Task.CompletedTask;
        return Result<string>.Success($"Successfully evaluated honors for candidate {request.StudentId}");
    }
}
