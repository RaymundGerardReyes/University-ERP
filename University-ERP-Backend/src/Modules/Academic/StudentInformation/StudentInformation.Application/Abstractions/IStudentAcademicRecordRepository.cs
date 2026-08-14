namespace StudentInformation.Application.Abstractions;

using StudentInformation.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IStudentAcademicRecordRepository
{
    /// <summary>
    /// Retrieves the student's entire academic ledger, including all historical course records.
    /// </summary>
    Task<StudentAcademicRecord?> GetByStudentIdAsync(string studentId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Persists the freshly computed GPA and Academic Standing back to the PostgreSQL database.
    /// </summary>
    Task UpdateAsync(StudentAcademicRecord record, CancellationToken cancellationToken = default);

    Task AddAsync(StudentAcademicRecord record, CancellationToken cancellationToken = default);
    Task<System.Collections.Generic.IReadOnlyList<StudentAcademicRecord>> GetAllAsync(CancellationToken cancellationToken = default);
}
