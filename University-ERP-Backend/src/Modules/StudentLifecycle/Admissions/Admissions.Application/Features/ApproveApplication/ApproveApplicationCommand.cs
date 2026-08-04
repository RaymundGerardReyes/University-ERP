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

    public ApproveApplicationCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
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
            // This specific string unlocks the frontend Routing interceptor!
            application.UpdateStatus("Accepted"); 
        }

        // Persist the state change
        await _repository.SaveChangesAsync(cancellationToken);
        
        return Result<bool>.Success(true);
    }
}