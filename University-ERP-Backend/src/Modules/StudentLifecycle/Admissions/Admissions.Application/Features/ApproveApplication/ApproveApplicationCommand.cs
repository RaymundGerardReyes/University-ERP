namespace Admissions.Application.Features.ApproveApplication;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

// 1. The CQRS Command Payload
public sealed record ApproveApplicationCommand(
    string ApplicationId, 
    string Action,
    string? Notes = null
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

        // Apply the status transition based on the Faculty/Staff action
        if (request.Action == "Verify")
        {
            var verifyResult = application.VerifyDocuments();
            if (verifyResult.IsFailure) return verifyResult;
        }
        else if (request.Action == "Recommend")
        {
            var recommendResult = application.Recommend(request.Notes ?? "Recommended by Department Chairperson.");
            if (recommendResult.IsFailure) return recommendResult;
        }
        else if (request.Action == "Endorse")
        {
            var endorseResult = application.Endorse();
            if (endorseResult.IsFailure) return endorseResult;

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
        }
        else if (request.Action == "Activate")
        {
            var newStudentId = $"STU-{DateTime.UtcNow.Year}-{new Random().Next(1000, 9999)}";
            var activateResult = application.ActivateEnrollment(newStudentId);
            if (activateResult.IsFailure) return activateResult;

            if (_publisher != null)
            {
                foreach (var domainEvent in application.GetDomainEvents())
                {
                    await _publisher.Publish(domainEvent, cancellationToken);
                }
                application.ClearDomainEvents();
            }
        }
        else if (request.Action == "Approve")
        {
            var acceptResult = application.Accept(request.Notes ?? "Approved by Faculty/Committee.");
            if (acceptResult.IsFailure) return acceptResult;

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
        }
        else if (request.Action == "Reject")
        {
            var rejectResult = application.Reject(request.Notes ?? "Rejected during review.");
            if (rejectResult.IsFailure) return rejectResult;
        }
        else
        {
            return Result<bool>.Failure(new Error("Admissions.InvalidAction", $"Action '{request.Action}' is not supported."));
        }

        // Persist the state change
        await _repository.SaveChangesAsync(cancellationToken);
        
        return Result<bool>.Success(true);
    }
}