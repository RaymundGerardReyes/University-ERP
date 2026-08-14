namespace Curriculum.Application.Features.BrowseCourses;

using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO perfectly matching the React Frontend expectations
public sealed record CourseSectionDto(
    string SectionId, 
    string Code, 
    string Title, 
    int Credits, 
    string Schedule, 
    string Status
);

// 2. The Query
public sealed record BrowseCoursesQuery(string TermId) : IRequest<IReadOnlyList<CourseSectionDto>>;

// 3. The Handler
public sealed class BrowseCoursesQueryHandler : IRequestHandler<BrowseCoursesQuery, IReadOnlyList<CourseSectionDto>>
{
    public async Task<IReadOnlyList<CourseSectionDto>> Handle(BrowseCoursesQuery request, CancellationToken cancellationToken)
    {
        var activeCatalog = new List<CourseSectionDto>
        {
            new("SEC-101", "CS101", "Introduction to Programming", 3, "MWF 9:00 AM", "OPEN"),
            new("SEC-102", "CS305", "Database Management Systems", 4, "TTh 1:00 PM", "FULL"), // Waitlist trigger
            new("SEC-103", "ENG101", "College Writing", 3, "MWF 11:00 AM", "OPEN"),
            new("SEC-104", "MATH201", "Linear Algebra", 4, "TTh 8:00 AM", "OPEN")
        };

        return await Task.FromResult(activeCatalog);
    }
}
