namespace LmsOffline.Domain.Aggregates;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Domain Aggregate Root representing an authenticated student account in the offline vault.
/// </summary>
public sealed class StudentUser : AggregateRoot<Guid>
{
    public string StudentIdNumber { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;
    public string AcademicProgram { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public byte[] PasswordSalt { get; private set; } = Array.Empty<byte>();
    public string Role { get; private set; } = "Student";
    public bool IsActive { get; private set; } = true;
    public DateTime LastLoginUtc { get; private set; }

    private StudentUser() { } // Required for EF Core / SQLCipher

    private StudentUser(
        Guid id, 
        string studentIdNumber, 
        string email, 
        string fullName, 
        string academicProgram, 
        string passwordHash, 
        byte[] passwordSalt) : base(id)
    {
        StudentIdNumber = studentIdNumber;
        Email = email;
        FullName = fullName;
        AcademicProgram = academicProgram;
        PasswordHash = passwordHash;
        PasswordSalt = passwordSalt;
        LastLoginUtc = DateTime.UtcNow;
    }

    public static Result<StudentUser> Create(
        string studentIdNumber, 
        string email, 
        string fullName, 
        string academicProgram, 
        string passwordHash, 
        byte[] passwordSalt)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
        {
            return Result<StudentUser>.Failure(new Error("Student.InvalidEmail", "A valid institutional email is required."));
        }

        if (string.IsNullOrWhiteSpace(passwordHash) || passwordSalt.Length == 0)
        {
            return Result<StudentUser>.Failure(new Error("Student.InvalidCredentials", "Password hash and salt cannot be empty."));
        }

        return Result<StudentUser>.Success(new StudentUser(
            Guid.NewGuid(), 
            studentIdNumber, 
            email, 
            fullName, 
            academicProgram, 
            passwordHash, 
            passwordSalt));
    }

    public void RecordSuccessfulLogin()
    {
        LastLoginUtc = DateTime.UtcNow;
    }
}