namespace Admissions.Application.Features.ApproveApplication;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

// 1. The CQRS Command Payload
public sealed record ApproveApplicationCommand(
    string ApplicationId, 
    string Action
) : IRequest<Result<bool>>;

// 2. The Command Handler
public sealed class ApproveApplicationCommandHandler : IRequestHandler<ApproveApplicationCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;
    private readonly IPublisher? _publisher;

    public ApproveApplicationCommandHandler(IAdmissionApplicationRepository repository, IPublisher? publisher = null)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task<Result<bool>> Handle(ApproveApplicationCommand request, CancellationToken cancellationToken)
    {
        // Fetch the application aggregate from PostgreSQL
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        
        if (application is null)
        {
            return Result<bool>.Failure(new Error("Admissions.NotFound", "The requested application was not found."));
        }

        // Apply the status transition based on the Faculty's action
        if (request.Action == "Verify")
        {
            application.UpdateStatus("Verified");
        }
        else if (request.Action == "Approve")
        {
            application.UpdateStatus("Accepted"); 
        }
        else if (request.Action == "Reject")
        {
            application.UpdateStatus("Rejected");
        }

        // Persist the state change
        await _repository.SaveChangesAsync(cancellationToken);

        if (request.Action == "Approve" && _publisher != null)
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