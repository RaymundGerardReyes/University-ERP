namespace LearningManagement.Application.Features.ProcessOfflineAssignmentSubmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using LearningManagement.Application.Abstractions;
using LearningManagement.Contracts.IntegrationEvents;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class ProcessOfflineAssignmentSubmissionCommandHandler : IRequestHandler<ProcessOfflineAssignmentSubmissionCommand, Result<Guid>>
{
    private readonly IOfflineSubmissionRepository _repository;
    private readonly IScheduleTokenVerifier _tokenVerifier;
    private readonly IPublisher _eventPublisher;

    public ProcessOfflineAssignmentSubmissionCommandHandler(
        IOfflineSubmissionRepository repository,
        IScheduleTokenVerifier tokenVerifier,
        IPublisher eventPublisher)
    {
        _repository = repository;
        _tokenVerifier = tokenVerifier;
        _eventPublisher = eventPublisher;
    }

    public async Task<Result<Guid>> Handle(ProcessOfflineAssignmentSubmissionCommand request, CancellationToken cancellationToken)
    {
        bool isTokenValid = _tokenVerifier.VerifyScheduleToken(request.ScheduleToken, request.AssignmentId, request.StudentId);
        if (!isTokenValid)
        {
            return Result<Guid>.Failure(new Error("Security.TamperedToken", "The offline schedule token is invalid or tampered with."));
        }

        var submissionId = Guid.NewGuid();
        // await _repository.SaveAssignmentSubmissionAsync(submissionId, request.AssignmentId, request.StudentId, request.EssayContent, request.SubmittedAtUtc, cancellationToken);

        var integrationEvent = new OfflineAssignmentSubmittedIntegrationEvent(
            EventId: Guid.NewGuid(),
            OccurredOnUtc: DateTime.UtcNow,
            AssignmentId: request.AssignmentId,
            StudentId: request.StudentId,
            CourseCode: request.CourseCode,
            AssignmentTitle: request.AssignmentTitle,
            EssayContent: request.EssayContent,
            ScheduleToken: request.ScheduleToken
        );

        await _eventPublisher.Publish(integrationEvent, cancellationToken);

        return Result<Guid>.Success(submissionId);
    }
}