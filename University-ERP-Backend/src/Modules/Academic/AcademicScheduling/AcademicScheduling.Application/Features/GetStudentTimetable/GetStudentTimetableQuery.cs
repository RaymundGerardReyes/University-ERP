namespace AcademicScheduling.Application.Features.GetStudentTimetable;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AcademicScheduling.Application.Abstractions;
using System;

public sealed record TimetableEntryDto(string CourseCode, string Room, string DayOfWeek, string StartTime, string EndTime, string FacultyName);

public sealed record GetStudentTimetableQuery(Guid StudentId, string AcademicTerm) : IRequest<IReadOnlyList<TimetableEntryDto>>;

public sealed class GetStudentTimetableQueryHandler : IRequestHandler<GetStudentTimetableQuery, IReadOnlyList<TimetableEntryDto>>
{
    private readonly IAcademicSchedulingRepository _repository;

    public GetStudentTimetableQueryHandler(IAcademicSchedulingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<TimetableEntryDto>> Handle(GetStudentTimetableQuery request, CancellationToken cancellationToken)
    {
        var timetable = new List<TimetableEntryDto>();

        var courses = await _repository.GetStudentTimetableAsync(request.StudentId.ToString(), cancellationToken);

        foreach (var course in courses)
        {
            timetable.Add(new TimetableEntryDto(
                course.CourseCode,
                course.Room,
                "Monday", // Map from day of week if stored
                course.Schedule,
                course.Schedule,
                course.FacultyId.ToString()
            ));
        }

        return timetable;
    }
}