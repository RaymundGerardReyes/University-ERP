namespace LmsOffline.Application.Features.StartOfflineAssessment;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Policies;
using LmsOffline.Domain.ValueObjects;

public sealed class StartOfflineAssessmentCommandHandler : IRequestHandler<StartOfflineAssessmentCommand, Result<Guid>>
{
    private readonly IOfflineAssessmentRepository _repository;
    private readonly WindowEnforcementPolicy _policy;

    public StartOfflineAssessmentCommandHandler(IOfflineAssessmentRepository repository, WindowEnforcementPolicy policy)
    {
        _repository = repository;
        _policy = policy;
    }

    public async Task<Result<Guid>> Handle(StartOfflineAssessmentCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch the assessment from the local encrypted SQLite DB
        var assessment = await _repository.GetByIdAsync(request.AssessmentId, cancellationToken);
        if (assessment is null)
        {
            return Result<Guid>.Failure(new Error("Assessment.NotFound", "The requested offline assessment was not found on this device."));
        }

        // 2. Reconstruct the AttemptToken from the command data
        var token = new AttemptToken(request.TokenValue, request.TokenIssuedAtUtc);

        // 3. Attempt to start the assessment (Domain logic enforces the security policy)
        try
        {
            assessment.Start(token, request.CurrentDeviceTimeUtc, _policy);
        }
        catch (System.Exception ex)
        {
            // Catch domain exceptions (like AssessmentWindowClosedException) and return as a clean Result
            return Result<Guid>.Failure(new Error("Assessment.StartFailed", ex.Message));
        }

        // 4. Save the "Started" state back to the encrypted local database
        await _repository.UpdateAsync(assessment, cancellationToken);

        return Result<Guid>.Success(assessment.Id);
    }
}
