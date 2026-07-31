namespace LmsOffline.Application.Commands;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Policies;

#region Handlers
/// <summary>
/// Handles execution of the StartOfflineAssessmentCommand.
/// </summary>
public sealed class StartOfflineAssessmentCommandHandler : IRequestHandler<StartOfflineAssessmentCommand, bool>
{
    private readonly IOfflineAssessmentRepository _repository;

    public StartOfflineAssessmentCommandHandler(IOfflineAssessmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(StartOfflineAssessmentCommand request, CancellationToken cancellationToken)
    {
        var assessment = await _repository.GetByIdAsync(request.AssessmentId, cancellationToken);
        if (assessment is null)
        {
            throw new InvalidOperationException($"Offline assessment with ID '{request.AssessmentId}' was not found.");
        }

        var policy = new WindowEnforcementPolicy();
        assessment.Start(request.Token, request.CurrentTimeUtc, policy);

        await _repository.UpdateAsync(assessment, cancellationToken);
        return true;
    }
}
#endregion
