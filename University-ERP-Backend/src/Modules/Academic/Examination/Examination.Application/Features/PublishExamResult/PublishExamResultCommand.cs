namespace Examination.Application.Features.PublishExamResult;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

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

/// <summary>
/// Stub handler — full integration event publication via IPublisher in Phase 3.
/// </summary>
public sealed class PublishExamResultCommandHandler : IRequestHandler<PublishExamResultCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(PublishExamResultCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}