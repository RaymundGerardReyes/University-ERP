namespace LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using LearningManagement.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed class ProcessOfflineAssessmentSubmissionCommandHandler : IRequestHandler<ProcessOfflineAssessmentSubmissionCommand, Result<bool>>
{
    private readonly IOfflineSubmissionRepository _repository;

    public ProcessOfflineAssessmentSubmissionCommandHandler(IOfflineSubmissionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(ProcessOfflineAssessmentSubmissionCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.EncryptedAnswersJson))
        {
            return Result<bool>.Failure(new Error("LMS.EmptyPayload", "The assessment payload cannot be empty."));
        }

        return Result<bool>.Success(true);
    }
}