namespace LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using LearningManagement.Application.Abstractions;
using LearningManagement.Contracts.IntegrationEvents;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class ProcessOfflineAssessmentSubmissionCommandHandler : IRequestHandler<ProcessOfflineAssessmentSubmissionCommand, Result<Guid>>
{
    private readonly IOfflineSubmissionRepository _repository;
    private readonly IScheduleTokenVerifier _tokenVerifier;
    private readonly IPublisher _eventPublisher;

    public ProcessOfflineAssessmentSubmissionCommandHandler(
        IOfflineSubmissionRepository repository,
        IScheduleTokenVerifier tokenVerifier,
        IPublisher eventPublisher)
    {
        _repository = repository;
        _tokenVerifier = tokenVerifier;
        _eventPublisher = eventPublisher;
    }

    public async Task<Result<Guid>> Handle(ProcessOfflineAssessmentSubmissionCommand request, CancellationToken cancellationToken)
    {
        // 1. Verify Cryptographic Schedule Token
        bool isTokenValid = _tokenVerifier.VerifyScheduleToken(request.ScheduleToken, request.AssessmentId, request.StudentId);
        if (!isTokenValid)
        {
            return Result<Guid>.Failure(new Error("Security.TamperedToken", "The offline schedule token is invalid or tampered with."));
        }

        // 2. Persist the raw submission (Mocked save)
        var submissionId = Guid.NewGuid();
        // await _repository.SaveAssessmentSubmissionAsync(submissionId, request.AssessmentId, request.StudentId, request.AnswersJson, request.SubmittedAtUtc, cancellationToken);
        
        // 3. Fire Integration Event to update Gradebook & Learning Analytics (LRS)
        var integrationEvent = new OfflineAssessmentSubmittedIntegrationEvent(
            EventId: Guid.NewGuid(),
            OccurredOnUtc: DateTime.UtcNow,
            AssessmentId: request.AssessmentId,
            StudentId: request.StudentId,
            CourseCode: request.CourseCode,
            ModuleTitle: request.ModuleTitle,
            AnswersJson: request.AnswersJson,
            ScheduleToken: request.ScheduleToken
        );

        await _eventPublisher.Publish(integrationEvent, cancellationToken);

        return Result<Guid>.Success(submissionId);
    }
}