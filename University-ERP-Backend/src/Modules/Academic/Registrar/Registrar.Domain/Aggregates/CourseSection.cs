namespace Registrar.Domain.Aggregates;

using System;

using SharedKernel.Domain.Primitives;

public sealed class CourseSection : AggregateRoot<string>
{
    public string CourseCode { get; private set; } = string.Empty;
    public string Schedule { get; private set; } = string.Empty;
    public string Room { get; private set; } = string.Empty;
    public Guid FacultyId { get; private set; }
    public string Status { get; private set; } = "Open"; // Open, Closed, Grades_Submitted, Grades_Locked

    private CourseSection() { }

    public CourseSection(string id, string courseCode, string schedule, string room, Guid facultyId) : base(id)
    {
        CourseCode = courseCode;
        Schedule = schedule;
        Room = room;
        FacultyId = facultyId;
        Status = "Open";
    }

    public Result<string> LockGrades()
    {
        if (Status == "Grades_Locked")
        {
            return Result<string>.Failure(new Error("Registrar.GradesAlreadyLocked", "The grades for this section are already locked."));
        }

        Status = "Grades_Locked";
        
        // This is where a Domain Event could be published to inform the AcademicStanding aggregate
        // RaiseDomainEvent(new GradesLockedDomainEvent(this.Id));

        return Result<string>.Success("Section grades have been securely locked by the Registrar.");
    }
}
