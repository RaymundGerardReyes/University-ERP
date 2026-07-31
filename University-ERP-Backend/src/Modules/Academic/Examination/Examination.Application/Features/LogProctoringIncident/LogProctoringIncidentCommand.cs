namespace Examination.Application.Features.LogProctoringIncident;

using MediatR;
using SharedKernel.Domain.Primitives;
using Examination.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record LogProctoringIncidentCommand(
    Guid ExamSessionId, 
    string IncidentDescription
) : IRequest<Result<bool>>;

public sealed class LogProctoringIncidentCommandHandler : IRequestHandler<LogProctoringIncidentCommand, Result<bool>>
{
    private readonly IExamSessionRepository _repository;

    public LogProctoringIncidentCommandHandler(IExamSessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(LogProctoringIncidentCommand request, CancellationToken cancellationToken)
    {
        var session = await _repository.GetByIdAsync(request.ExamSessionId, cancellationToken);

        if (session is null)
        {
            return Result<bool>.Failure(new Error("Examination.SessionNotFound", "The specified exam session does not exist."));
        }

        session.LogProctoringIncident(request.IncidentDescription);
        
        await _repository.UpdateAsync(session, cancellationToken);

        return Result<bool>.Success(true);
    }
}