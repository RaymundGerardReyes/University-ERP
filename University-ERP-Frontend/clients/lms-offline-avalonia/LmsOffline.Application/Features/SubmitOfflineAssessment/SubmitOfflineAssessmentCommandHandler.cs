namespace LmsOffline.Application.Features.SubmitOfflineAssessment;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;

public class SubmitOfflineAssessmentCommandHandler : IRequestHandler<SubmitOfflineAssessmentCommand, Result<bool>>
{
    private readonly IOfflineAssessmentRepository _assessmentRepository;

    public SubmitOfflineAssessmentCommandHandler(IOfflineAssessmentRepository assessmentRepository)
    {
        _assessmentRepository = assessmentRepository;
    }

    public Task<Result<bool>> Handle(SubmitOfflineAssessmentCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}