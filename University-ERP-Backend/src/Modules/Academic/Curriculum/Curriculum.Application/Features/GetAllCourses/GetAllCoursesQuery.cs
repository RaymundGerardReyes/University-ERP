namespace Curriculum.Application.Features.GetAllCourses;

using MediatR;
using Curriculum.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed record PrerequisiteDto(string RuleId, string RequiredCourseCode, string MinimumGrade, bool IsEnforced);
public sealed record CourseCatalogDto(string CourseId, string Code, string Title, int Units, string Department, string Status, string Description, List<PrerequisiteDto> Prerequisites);

public sealed record GetAllCoursesQuery() : IRequest<IReadOnlyList<CourseCatalogDto>>;

public sealed class GetAllCoursesQueryHandler : IRequestHandler<GetAllCoursesQuery, IReadOnlyList<CourseCatalogDto>>
{
    private readonly ICourseDefinitionRepository _repository;

    public GetAllCoursesQueryHandler(ICourseDefinitionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CourseCatalogDto>> Handle(GetAllCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = await _repository.GetAllAsync(cancellationToken);
        
        return courses.Select(c => new CourseCatalogDto(
            c.Id.ToString(),
            c.Code,
            c.Title,
            c.Units,
            c.Department,
            c.Status,
            c.Description,
            c.Prerequisites.Select(p => new PrerequisiteDto(p.Id.ToString(), p.RequiredCourseCode, p.MinimumGrade, p.IsEnforced)).ToList()
        )).ToList();
    }
}
