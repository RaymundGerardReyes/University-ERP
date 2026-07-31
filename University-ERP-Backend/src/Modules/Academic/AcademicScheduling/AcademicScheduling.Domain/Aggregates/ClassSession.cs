namespace AcademicScheduling.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

/// <summary>
/// Institution-wide scheduling and resource planning.
/// Prevents room double-booking and manages faculty timetables.
/// </summary>
public sealed class ClassSession : AggregateRoot<Guid>
{
    public string CourseCode { get; private set; } = string.Empty;
    public string RoomNumber { get; private set; } = string.Empty;
    public Guid FacultyId { get; private set; }
    public string DayOfWeek { get; private set; } = string.Empty;
    public TimeSpan StartTime { get; private set; }
    public TimeSpan EndTime { get; private set; }

    // Required by EF Core
    private ClassSession() { }

    private ClassSession(Guid id, string courseCode, string roomNumber, Guid facultyId, string dayOfWeek, TimeSpan start, TimeSpan end) 
        : base(id)
    {
        CourseCode = courseCode;
        RoomNumber = roomNumber;
        FacultyId = facultyId;
        DayOfWeek = dayOfWeek;
        StartTime = start;
        EndTime = end;
    }

    public static Result<ClassSession> Schedule(
        string courseCode, string roomNumber, Guid facultyId, string dayOfWeek, TimeSpan start, TimeSpan end)
    {
        if (start >= end)
        {
            return Result<ClassSession>.Failure(new Error("Scheduling.InvalidTime", "Start time must be before end time."));
        }

        var session = new ClassSession(Guid.NewGuid(), courseCode, roomNumber, facultyId, dayOfWeek, start, end);
        return Result<ClassSession>.Success(session);
    }
}