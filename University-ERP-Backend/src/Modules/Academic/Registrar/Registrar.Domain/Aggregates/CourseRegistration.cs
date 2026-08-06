namespace Registrar.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

/// <summary>
/// Controls official academic records and registration.
/// Acts as the ultimate authority on whether a student is legally enrolled in a course.
/// </summary>
public sealed class CourseRegistration : AggregateRoot<Guid>
{
    public Guid StudentId { get; private set; }
    public string CourseCode { get; private set; } = string.Empty;
    public string AcademicTerm { get; private set; } = string.Empty;
    public string RegistrationStatus { get; private set; } = string.Empty; // e.g., Enrolled, Dropped, Withdrawn
    public DateTime RegisteredOnUtc { get; private set; }

    // Required by EF Core
    private CourseRegistration() { }

    private CourseRegistration(Guid id, Guid studentId, string courseCode, string academicTerm, DateTime registeredOn) 
        : base(id)
    {
        StudentId = studentId;
        CourseCode = courseCode;
        AcademicTerm = academicTerm;
        RegistrationStatus = "PendingValidation";
        RegisteredOnUtc = registeredOn;
    }

    public static Result<CourseRegistration> Register(Guid studentId, string courseCode, string academicTerm)
    {
        if (string.IsNullOrWhiteSpace(courseCode))
        {
            return Result<CourseRegistration>.Failure(new Error("Registrar.InvalidCourse", "Course Code is required."));
        }

        var registration = new CourseRegistration(Guid.NewGuid(), studentId, courseCode, academicTerm, DateTime.UtcNow);
        
        // In a full implementation, we would raise a Domain Event here:
        // registration.RaiseDomainEvent(new CourseRegisteredDomainEvent(registration.Id));

        return Result<CourseRegistration>.Success(registration);
    }

    public void DropCourse()
    {
        RegistrationStatus = "Dropped";
    }

    public Result<string> Validate()
    {
        if (RegistrationStatus != "PendingValidation")
        {
            return Result<string>.Failure(new Error("Registrar.ValidationFailed", "Only pending registrations can be validated."));
        }

        RegistrationStatus = "Validated";
        return Result<string>.Success("Course registration validated successfully.");
    }
}