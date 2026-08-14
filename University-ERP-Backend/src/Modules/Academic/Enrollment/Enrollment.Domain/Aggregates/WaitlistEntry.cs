namespace Enrollment.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class WaitlistEntry : AggregateRoot<Guid>
{
    public string StudentId { get; private set; } = string.Empty;
    public string SectionId { get; private set; } = string.Empty;
    public string TermId { get; private set; } = string.Empty;
    public string CourseCode { get; private set; } = string.Empty;
    public int Credits { get; private set; }
    public string Status { get; private set; } = "PENDING"; 
    public DateTime RequestedOnUtc { get; private set; }

    private WaitlistEntry() { }

    public WaitlistEntry(Guid id, string studentId, string sectionId, string termId, string courseCode, int credits) : base(id)
    {
        StudentId = studentId;
        SectionId = sectionId;
        TermId = termId;
        CourseCode = courseCode;
        Credits = credits;
        Status = "PENDING";
        RequestedOnUtc = DateTime.UtcNow;
    }

    public void Promote()
    {
        Status = "PROMOTED";
        
        // Announce to the system that a promotion just happened
        RaiseDomainEvent(new Events.WaitlistPromotedDomainEvent(
            Guid.NewGuid(), 
            DateTime.UtcNow, 
            StudentId, 
            CourseCode
        ));
    }
}
