namespace AcademicScheduling.Application.Features.GetStudentTimetable;

using MediatR;

public sealed record TimetableEntryDto(string CourseCode, string Room, string DayOfWeek, string StartTime, string EndTime, string FacultyName);

public sealed record GetStudentTimetableQuery(Guid StudentId, string AcademicTerm) : IRequest<IReadOnlyList<TimetableEntryDto>>;

public sealed class GetStudentTimetableQueryHandler : IRequestHandler<GetStudentTimetableQuery, IReadOnlyList<TimetableEntryDto>>
{
    public Task<IReadOnlyList<TimetableEntryDto>> Handle(GetStudentTimetableQuery request, CancellationToken cancellationToken)
    {
        var timetable = new List<TimetableEntryDto>
        {
            new("CS-301", "Room 402", "Monday", "08:00 AM", "10:00 AM", "Dr. Alan Turing"),
            new("CS-305", "Lab 2", "Wednesday", "10:00 AM", "12:00 PM", "Dr. Ada Lovelace")
        };
        
        return Task.FromResult((IReadOnlyList<TimetableEntryDto>)timetable);
    }
}