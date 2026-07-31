namespace Examination.Application.Features.PublishExamResult;

using MediatR;
using SharedKernel.Domain.Primitives;
using Contracts.IntegrationEvents.Academic; 

/// <summary>
/// CQRS Command to finalize a grade and publish it to the event bus.
/// </summary>
public sealed record PublishExamResultCommand(
    Guid AssessmentId, 
    Guid StudentId, 
    string CourseCode, 
    decimal Score, 
    string Grade
) : IRequest<Result<bool>>;

public sealed class PublishExamResultCommandHandler : IRequestHandler<PublishExamResultCommand, Result<bool>>
{
    private readonly IPublisher _publisher;

    public PublishExamResultCommandHandler(IPublisher publisher) => _publisher = publisher;

    public async Task<Result<bool>> Handle(PublishExamResultCommand request, CancellationToken cancellationToken)
    {
        // Publish integration event to notify StudentInformation (Transcript) and LMS (Gradebook)
        var integrationEvent = new ExamResultPublishedIntegrationEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            request.AssessmentId,
            request.StudentId,
            request.CourseCode,
            request.Score,
            request.Grade
        );

        await _publisher.Publish(integrationEvent, cancellationToken);

        return Result<bool>.Success(true);
    }
}