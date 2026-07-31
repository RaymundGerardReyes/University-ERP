namespace StudentInformation.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Domain.DomainEvents;

/// <summary>
/// The core Aggregate Root for the StudentInformation bounded context.
/// </summary>
public sealed class Student : AggregateRoot<StudentId>
{
    // Primitive mapping to the IdentityAccess module (no direct domain coupling)
    public Guid IdentityUserId { get; private set; } 
    public string EnrollmentNumber { get; private set; } = string.Empty;
    public EnrollmentStatus Status { get; private set; }
    public DateTime EnrolledOnUtc { get; private set; }

public string PhoneNumber { get; private set; } = string.Empty;
    public string EmergencyContactName { get; private set; } = string.Empty;
    public string EmergencyContactNumber { get; private set; } = string.Empty;
    
    private Student(StudentId id, Guid identityUserId, string enrollmentNumber, DateTime enrolledOnUtc)
        : base(id)
    {
        IdentityUserId = identityUserId;
        EnrollmentNumber = enrollmentNumber;
        Status = EnrollmentStatus.Active;
        EnrolledOnUtc = enrolledOnUtc;
    }

    // Required by EF Core
    private Student() : base() { }

    public static Result<Student> Enroll(
        StudentId id, 
        Guid identityUserId, 
        string enrollmentNumber, 
        DateTime enrolledOnUtc)
    {
        if (string.IsNullOrWhiteSpace(enrollmentNumber))
        {
            return Result<Student>.Failure(new Error(
                "Student.InvalidEnrollmentNumber", 
                "A valid enrollment number is required to enroll a student."));
        }

        if (identityUserId == Guid.Empty)
        {
            return Result<Student>.Failure(new Error(
                "Student.MissingIdentity", 
                "A registered User Identity is required to enroll a student."));
        }

        var student = new Student(id, identityUserId, enrollmentNumber, enrolledOnUtc);

        student.RaiseDomainEvent(new StudentEnrolledDomainEvent(
            Guid.NewGuid(),
            enrolledOnUtc,
            student.Id,
            student.IdentityUserId));

        return Result<Student>.Success(student);
    }

    public void Suspend()
    {
        Status = EnrollmentStatus.Suspended;
    }

    public Result<bool> UpdateContactInformation(string phoneNumber, string emergencyName, string emergencyNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return Result<bool>.Failure(new Error("Student.InvalidContact", "Primary phone number is required."));
        }

        PhoneNumber = phoneNumber;
        EmergencyContactName = emergencyName;
        EmergencyContactNumber = emergencyNumber;

        // Raise domain event to notify CRM or Notification modules if necessary
        // RaiseDomainEvent(new StudentContactUpdatedDomainEvent(Id));

        return Result<bool>.Success(true);
    }
}
