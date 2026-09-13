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
    private readonly IPublisher? _publisher;

    public EndorseApplicationCommandHandler(IAdmissionApplicationRepository repository, IPublisher? publisher = null)
    {
        _repository = repository;
        _publisher = publisher;
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

        if (_publisher != null)
        {
            var integrationEvent = new Contracts.IntegrationEvents.StudentLifecycle.ApplicantAcceptedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                application.ApplicantId ?? application.Id,
                application.ProgramId ?? "General",
                "AY 2026-2027"
            );
            await _publisher.Publish(integrationEvent, cancellationToken);
        }

        return Result<bool>.Success(true);
    }
}
