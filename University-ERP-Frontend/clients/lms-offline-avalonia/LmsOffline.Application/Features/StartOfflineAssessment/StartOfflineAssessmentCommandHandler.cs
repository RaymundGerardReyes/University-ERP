namespace LmsOffline.Application.Features.StartOfflineAssessment;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;

public class StartOfflineAssessmentCommandHandler : IRequestHandler<StartOfflineAssessmentCommand, Result<Guid>>
{
    private readonly IOfflineAssessmentRepository _assessmentRepository;

    public StartOfflineAssessmentCommandHandler(IOfflineAssessmentRepository assessmentRepository)
    {
        _assessmentRepository = assessmentRepository;
    }

    public async Task<Result<Guid>> Handle(StartOfflineAssessmentCommand request, CancellationToken cancellationToken)
    {
        // FIXED (CS1501): Removed the CancellationToken argument to match the 1-argument interface signature
        var assessment = await _assessmentRepository.GetByIdAsync(request.AssessmentId);
        
        if (assessment == null)
        {
            return Result<Guid>.Failure(new Error("Assessment.NotFound", "The offline assessment was not found."));
        }

        // (Your domain policy checks, like WindowEnforcementPolicy, would execute here)

        // FIXED (CS1061): Changed UpdateAsync to SaveAsync to match our unified Repository pattern
        await _assessmentRepository.SaveAsync(assessment);

        return Result<Guid>.Success(assessment.Id);
    }
}