namespace LmsOffline.Application.Features.Grades;

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;

public record GetLocalGradesQuery(string StudentIdNumber) : IRequest<Result<List<GradeRecord>>>;

public class GetLocalGradesQueryHandler : IRequestHandler<GetLocalGradesQuery, Result<List<GradeRecord>>>
{
    private readonly ILocalGradeRepository _gradeRepository;

    public GetLocalGradesQueryHandler(ILocalGradeRepository gradeRepository)
    {
        _gradeRepository = gradeRepository;
    }

    public async Task<Result<List<GradeRecord>>> Handle(GetLocalGradesQuery request, CancellationToken cancellationToken)
    {
        var grades = await _gradeRepository.GetByStudentIdAsync(request.StudentIdNumber, cancellationToken);
        return Result<List<GradeRecord>>.Success(grades);
    }
}
