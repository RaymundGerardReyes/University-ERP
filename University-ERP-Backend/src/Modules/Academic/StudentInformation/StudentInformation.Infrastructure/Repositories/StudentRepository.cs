// Example: src/Modules/Academic/StudentInformation/StudentInformation.Infrastructure/Repositories/StudentRepository.cs
namespace StudentInformation.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using StudentInformation.Application.Abstractions;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

internal sealed class StudentRepository : IStudentRepository
{
    private readonly StudentInformationDbContext _dbContext;

    // Inject the isolated DbContext
    public StudentRepository(StudentInformationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Student?> GetByIdAsync(StudentId id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Students.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<bool> IsEnrollmentNumberUniqueAsync(string enrollmentNumber, CancellationToken cancellationToken = default)
    {
        return !await _dbContext.Students.AnyAsync(s => s.EnrollmentNumber == enrollmentNumber, cancellationToken);
    }

    public async Task AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        await _dbContext.Students.AddAsync(student, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<System.Collections.Generic.IReadOnlyList<FacultyAdvisee>> GetAdviseesByFacultyIdAsync(Guid facultyId, CancellationToken cancellationToken = default)
    {
        // Execute the query against the "advising" schema
        return await _dbContext.FacultyAdvisees
            .AsNoTracking()
            .Where(a => a.FacultyId == facultyId)
            .ToListAsync(cancellationToken);
    }
}