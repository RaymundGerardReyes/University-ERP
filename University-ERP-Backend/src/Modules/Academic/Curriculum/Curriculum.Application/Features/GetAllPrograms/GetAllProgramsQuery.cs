namespace Curriculum.Application.Features.GetAllPrograms;

using MediatR;
using Curriculum.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// ─── DTOs ────────────────────────────────────────────────────────────────────

public sealed record AcademicProgramDto(
    string ProgramId,
    string Code,
    string Name,
    string College,
    int TotalUnits,
    int YearsToComplete,
    bool IsActive);

// ─── Query & Handler ──────────────────────────────────────────────────────────

public sealed record GetAllProgramsQuery() : IRequest<IReadOnlyList<AcademicProgramDto>>;

public sealed class GetAllProgramsQueryHandler
    : IRequestHandler<GetAllProgramsQuery, IReadOnlyList<AcademicProgramDto>>
{
    private readonly IAcademicProgramRepository _repository;

    public GetAllProgramsQueryHandler(IAcademicProgramRepository repository)
        => _repository = repository;

    public async Task<IReadOnlyList<AcademicProgramDto>> Handle(
        GetAllProgramsQuery request,
        CancellationToken cancellationToken)
    {
        var programs = await _repository.GetAllAsync(cancellationToken);

        return programs.Select(p => new AcademicProgramDto(
            p.Id.ToString(),
            p.Code,
            p.Name,
            p.College,
            p.TotalUnits,
            p.YearsToComplete,
            p.IsActive)).ToList();
    }
}

