namespace StudentInformation.Application.Abstractions;

using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;

/// <summary>
/// Repository interface for Student aggregate persistence.
/// </summary>
public interface IStudentRepository
{
    Task<Student?> GetByIdAsync(StudentId id, CancellationToken cancellationToken = default);
    Task<bool> IsEnrollmentNumberUniqueAsync(string enrollmentNumber, CancellationToken cancellationToken = default);
    Task AddAsync(Student student, CancellationToken cancellationToken = default);
}
