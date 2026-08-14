namespace Enrollment.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using Enrollment.Domain.Events;
using System;
using System.Collections.Generic;
using System.Linq;

public sealed class TermRegistration : AggregateRoot<Guid>
{
    public string StudentId { get; private set; } = string.Empty;
    public string TermId { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public int EnrolledCredits { get; private set; }
    
    private readonly List<RegistrationLineItem> _lineItems = new();
    public IReadOnlyCollection<RegistrationLineItem> LineItems => _lineItems.AsReadOnly();

    private TermRegistration() { }

    public TermRegistration(Guid id, string studentId, string termId) : base(id)
    {
        StudentId = studentId;
        TermId = termId;
        Status = "ENROLLED";
        EnrolledCredits = 0;
    }

    public Result<bool> AddCourse(string sectionId, string courseCode, int credits)
    {
        var existing = _lineItems.FirstOrDefault(li => li.SectionId == sectionId && li.Status != "DROPPED");
        if (existing != null)
        {
            return Result<bool>.Failure(new Error("Enrollment.AlreadyEnrolled", "Already enrolled in this course section."));
        }

        var lineItem = new RegistrationLineItem(Guid.NewGuid(), sectionId, courseCode, credits);
        _lineItems.Add(lineItem);
        EnrolledCredits += credits;
        Status = "ENROLLED";

        return Result<bool>.Success(true);
    }

    public Result<bool> DropCourse(string lineItemId, string reason)
    {
        var lineItem = _lineItems.FirstOrDefault(li => li.Id.ToString() == lineItemId);
        
        if (lineItem == null)
        {
            return Result<bool>.Failure(new Error("Enrollment.ItemNotFound", "The specified course is not in your current registration."));
        }

        if (lineItem.Status == "DROPPED")
        {
            return Result<bool>.Failure(new Error("Enrollment.AlreadyDropped", "This course has already been dropped."));
        }

        // Apply domain state changes
        lineItem.MarkAsDropped(reason);
        EnrolledCredits -= lineItem.Credits;

        // Determine if dropping this course changes the overall term status
        if (EnrolledCredits == 0)
        {
            Status = "WITHDRAWN";
        }

        // CRITICAL: Raise a domain event so the Waitlist system knows a seat opened up
        RaiseDomainEvent(new CourseDroppedDomainEvent(
            Guid.NewGuid(), 
            DateTime.UtcNow, 
            StudentId, 
            lineItem.SectionId, 
            TermId
        ));

        return Result<bool>.Success(true);
    }
}

public sealed class RegistrationLineItem : Entity<Guid>
{
    public string SectionId { get; private set; } = string.Empty;
    public string CourseCode { get; private set; } = string.Empty;
    public int Credits { get; private set; }
    public string Status { get; private set; } = string.Empty;
    public string? DropReason { get; private set; }

    private RegistrationLineItem() { }

    internal RegistrationLineItem(Guid id, string sectionId, string courseCode, int credits) : base(id)
    {
        SectionId = sectionId;
        CourseCode = courseCode;
        Credits = credits;
        Status = "ENROLLED";
    }

    internal void MarkAsDropped(string reason)
    {
        Status = "DROPPED";
        DropReason = reason;
    }
}
