namespace StudentInformation.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using StudentInformation.Application.Abstractions;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Infrastructure.Persistence;

/// <summary>
/// Concrete implementation of the IStudentRepository using EF Core.
/// </summary>
internal sealed class StudentRepository : IStudentRepository
{
    private readonly StudentInformationDbContext _dbContext;

    public StudentRepository(StudentInformationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Student?> GetByIdAsync(StudentId id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Students
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<bool> IsEnrollmentNumberUniqueAsync(string enrollmentNumber, CancellationToken cancellationToken = default)
    {
        // Returns true if NO student currently has this enrollment number
        return !await _dbContext.Students
            .AnyAsync(s => s.EnrollmentNumber == enrollmentNumber, cancellationToken);
    }

    public async Task AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        await _dbContext.Students.AddAsync(student, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
