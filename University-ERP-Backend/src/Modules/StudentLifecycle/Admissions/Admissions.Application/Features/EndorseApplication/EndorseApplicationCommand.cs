namespace Admissions.Application.Features.EndorseApplication;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record EndorseApplicationCommand(string ApplicationId) : IRequest<Result<bool>>;

public sealed class EndorseApplicationCommandHandler : IRequestHandler<EndorseApplicationCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public EndorseApplicationCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(EndorseApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var result = application.Endorse();
        if (result.IsFailure)
            return result;

        await _repository.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
