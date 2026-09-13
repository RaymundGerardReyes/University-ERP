namespace StudentInformation.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using StudentInformation.Application.Abstractions;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed class StudentAcademicRecordRepository : IStudentAcademicRecordRepository
{
    private readonly StudentInformationDbContext _dbContext;

    public StudentAcademicRecordRepository(StudentInformationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StudentAcademicRecord?> GetByStudentIdAsync(string studentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.AcademicRecords
            .Include(r => r.CourseRecords)
            .FirstOrDefaultAsync(r => r.StudentId == studentId, cancellationToken);
    }

    public async Task AddAsync(StudentAcademicRecord record, CancellationToken cancellationToken = default)
    {
        await _dbContext.AcademicRecords.AddAsync(record, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(StudentAcademicRecord record, CancellationToken cancellationToken = default)
    {
        _dbContext.AcademicRecords.Update(record);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<StudentAcademicRecord>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.AcademicRecords
            .Include(r => r.CourseRecords)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}
