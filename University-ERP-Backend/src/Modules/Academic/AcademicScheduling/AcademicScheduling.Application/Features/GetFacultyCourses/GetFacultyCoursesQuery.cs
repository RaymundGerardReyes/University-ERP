namespace AcademicScheduling.Application.Features.GetFacultyCourses;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using AcademicScheduling.Application.Abstractions;

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
    private readonly IAcademicSchedulingRepository _repository;

    public GetFacultyCoursesQueryHandler(IAcademicSchedulingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CourseSectionDto>> Handle(GetFacultyCoursesQuery request, CancellationToken cancellationToken)
    {
        var courses = await _repository.GetFacultyCoursesAsync(request.FacultyId, cancellationToken);
        var dtos = new List<CourseSectionDto>();

        foreach (var course in courses)
        {
            dtos.Add(new CourseSectionDto(
                course.Id,
                course.CourseCode,
                course.CourseName,
                course.SectionName,
                course.Schedule,
                course.Room,
                course.EnrolledCount
            ));
        }

        return dtos;
    }
}