namespace Teaching.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class CourseSection : AggregateRoot<Guid>
{
    public string FacultyId { get; private set; } = string.Empty;
    public string CourseCode { get; private set; } = string.Empty;
    public string CourseName { get; private set; } = string.Empty;
    public string SectionName { get; private set; } = string.Empty;
    public string Schedule { get; private set; } = string.Empty;
    public string Room { get; private set; } = string.Empty;
    public int EnrolledCount { get; private set; }
    public string Status { get; private set; } = "Active";

    private CourseSection() { }

    public CourseSection(Guid id, string facultyId, string courseCode, string courseName, string sectionName, string schedule, string room, int enrolledCount) : base(id)
    {
        FacultyId = facultyId;
        CourseCode = courseCode;
        CourseName = courseName;
        SectionName = sectionName;
        Schedule = schedule;
        Room = room;
        EnrolledCount = enrolledCount;
        Status = "Active";
    }
}
