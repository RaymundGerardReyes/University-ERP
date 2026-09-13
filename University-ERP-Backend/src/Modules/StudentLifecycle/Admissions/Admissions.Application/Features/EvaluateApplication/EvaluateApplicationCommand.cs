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
    private readonly IPublisher? _publisher;

    public EvaluateApplicationCommandHandler(IAdmissionApplicationRepository repository, IPublisher? publisher = null)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(EvaluateApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var mappedStatus = request.Decision switch
        {
            "Accept" => "Accepted",
            "Reject" => "Rejected",
            _ => request.Decision
        };
        application.UpdateStatus(mappedStatus);
        application.AddTimelineEvent($"Academic Evaluation: {mappedStatus}", request.Notes, "Completed", System.DateTime.UtcNow);

        await _repository.SaveChangesAsync(cancellationToken);

        if (mappedStatus == "Accepted" && _publisher != null)
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
