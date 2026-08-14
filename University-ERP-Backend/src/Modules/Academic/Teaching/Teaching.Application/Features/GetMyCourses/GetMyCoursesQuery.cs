namespace Teaching.Application.Features.GetMyCourses;

using MediatR;
using Teaching.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO perfectly matching the React Frontend CourseSection interface
public sealed record CourseSectionDto(
    string Id,
    string CourseCode,
    string CourseName,
    string SectionName,
    string Schedule,
    string Room,
    int EnrolledCount
);

public sealed record GetMyCoursesQuery(string FacultyId) : IRequest<IReadOnlyList<CourseSectionDto>>;

public sealed class GetMyCoursesQueryHandler : IRequestHandler<GetMyCoursesQuery, IReadOnlyList<CourseSectionDto>>
{
    private readonly ICourseSectionRepository _repository;

    public GetMyCoursesQueryHandler(ICourseSectionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CourseSectionDto>> Handle(GetMyCoursesQuery request, CancellationToken cancellationToken)
    {
        // Fetch active sections assigned to this specific faculty member from PostgreSQL
        var sections = await _repository.GetByFacultyIdAsync(request.FacultyId, cancellationToken);

        // Project the database entities into the DTO required by the UI
        var myCourses = sections.Select(s => new CourseSectionDto(
            s.Id.ToString(),
            s.CourseCode,
            s.CourseName,
            s.SectionName,
            s.Schedule,
            s.Room,
            s.EnrolledCount
        )).ToList();

        return myCourses;
    }
}
