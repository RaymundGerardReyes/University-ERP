namespace Admissions.Application.Features.RecommendAdmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Domain.Aggregates;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record RecommendAdmissionCommand(string ApplicationId, string Remarks) : IRequest<Result<bool>>;

public sealed class RecommendAdmissionCommandHandler : IRequestHandler<RecommendAdmissionCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public RecommendAdmissionCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(RecommendAdmissionCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var result = application.Recommend(request.Remarks);
        if (result.IsFailure)
            return result;

        await _repository.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
