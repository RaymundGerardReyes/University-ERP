namespace StudentInformation.Application.Features.Graduation;

using MediatR;
using StudentInformation.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed record ClearanceCandidateDto(string StudentId, decimal Gpa, int Credits, string Status);

public sealed record GetPendingClearancesQuery() : IRequest<IReadOnlyList<ClearanceCandidateDto>>;

public sealed class GetPendingClearancesQueryHandler : IRequestHandler<GetPendingClearancesQuery, IReadOnlyList<ClearanceCandidateDto>>
{
    private readonly IStudentAcademicRecordRepository _repository;

    public GetPendingClearancesQueryHandler(IStudentAcademicRecordRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<ClearanceCandidateDto>> Handle(GetPendingClearancesQuery request, CancellationToken cancellationToken)
    {
        var allRecords = await _repository.GetAllAsync(cancellationToken);
        
        var pending = allRecords
            .Where(r => r.GraduationStatus == "Pending Review")
            .Select(r => new ClearanceCandidateDto(r.StudentId, r.CumulativeGpa, r.TotalEarnedUnits, r.GraduationStatus))
            .ToList();

        return pending;
    }
}
