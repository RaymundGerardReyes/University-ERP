namespace StudentInformation.Presentation.Contracts;

/// <summary>
/// HTTP Request payload for enrolling a student.
/// </summary>
public sealed record EnrollStudentRequest(
    Guid IdentityUserId,
    string EnrollmentNumber
);
