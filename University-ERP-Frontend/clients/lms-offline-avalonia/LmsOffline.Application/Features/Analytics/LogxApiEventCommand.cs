namespace LmsOffline.Application.Features.Analytics;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;

public sealed record LogxApiEventCommand(Guid StudentId, string Verb, string Target, string ContextData) : IRequest<Result<bool>>;

public sealed class LogxApiEventCommandHandler : IRequestHandler<LogxApiEventCommand, Result<bool>>
{
    private readonly ILocalLearningRecordStore _localLrs;

    public LogxApiEventCommandHandler(ILocalLearningRecordStore localLrs)
    {
        _localLrs = localLrs;
    }

    public async Task<Result<bool>> Handle(LogxApiEventCommand request, CancellationToken cancellationToken)
    {
        var learningEvent = LearningEvent.Create(request.StudentId, request.Verb, request.Target, request.ContextData);
        
        await _localLrs.SaveEventAsync(learningEvent, cancellationToken);

        return Result<bool>.Success(true);
    }
}