namespace StudentInformation.Domain.ValueObjects;

/// <summary>
/// Represents the current academic standing of a student.
/// </summary>
public enum EnrollmentStatus
{
    Pending,
    Active,
    Suspended,
    Graduated,
    Withdrawn
}
