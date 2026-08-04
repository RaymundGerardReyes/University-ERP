namespace AcademicScheduling.Application.Features.GetFacultyCourses;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO perfectly matching the frontend 'CourseSection' interface
public sealed record CourseSectionDto(
    string Id,
    string CourseCode,
    string CourseName,
    string SectionName,
    string Schedule,
    string Room,
    int EnrolledCount
);

// 2. The MediatR Query
public sealed record GetFacultyCoursesQuery(string FacultyId) : IRequest<IReadOnlyList<CourseSectionDto>>;

// 3. The Query Handler
public sealed class GetFacultyCoursesQueryHandler : IRequestHandler<GetFacultyCoursesQuery, IReadOnlyList<CourseSectionDto>>
{
    public Task<IReadOnlyList<CourseSectionDto>> Handle(GetFacultyCoursesQuery request, CancellationToken cancellationToken)
    {
        // In a complete implementation, we would query the IAcademicSchedulingRepository 
        // joining Course, Section, and Enrollment data.
        
        // Supplying the exact structure required by the UI for seamless integration
        var mockData = new List<CourseSectionDto>
        {
            new("SEC-1001", "CS-101", "Introduction to Computing", "BSCS-1A", "Mon/Wed 09:00 AM - 10:30 AM", "Lab 402", 35),
            new("SEC-1002", "CS-305", "Database Management & DBMA", "BSCS-3C", "Tue/Thu 01:00 PM - 02:30 PM", "Hall B", 42),
            new("SEC-1003", "CS-401", "Software Engineering II", "BSIT-4A", "Fri 08:00 AM - 11:00 AM", "Lab 405", 28)
        };

        return Task.FromResult<IReadOnlyList<CourseSectionDto>>(mockData);
    }
}