namespace Examination.Application.Features.GetExamSessions;

using MediatR;
using SharedKernel.Domain.Primitives;
using Examination.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class GetExamSessionsQueryHandler : IRequestHandler<GetExamSessionsQuery, Result<IReadOnlyList<ExamSessionDto>>>
{
    private readonly IExamSessionRepository _repository;

    public GetExamSessionsQueryHandler(IExamSessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<IReadOnlyList<ExamSessionDto>>> Handle(GetExamSessionsQuery request, CancellationToken cancellationToken)
    {
        var sessions = await _repository.GetAllAsync(cancellationToken);

        var dtos = sessions.Select(s => new ExamSessionDto(
            s.Id.ToString(),
            s.AssessmentId.ToString(),
            s.RoomNumber,
            s.InvigilatorId.ToString(),
            s.StartTimeUtc,
            s.Incidents
        )).ToList().AsReadOnly();

        return Result<IReadOnlyList<ExamSessionDto>>.Success(dtos);
    }
}
