namespace Admissions.Application.Features.EvaluateApplication;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record EvaluateApplicationCommand(string ApplicationId, string Decision, string Notes) : IRequest<Result<bool>>;

public sealed class EvaluateApplicationCommandHandler : IRequestHandler<EvaluateApplicationCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public EvaluateApplicationCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(EvaluateApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        application.UpdateStatus(request.Decision); // "Accept", "Reject", "Waitlist"
        application.AddTimelineEvent($"Academic Evaluation: {request.Decision}", request.Notes, "Completed", System.DateTime.UtcNow);

        await _repository.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
