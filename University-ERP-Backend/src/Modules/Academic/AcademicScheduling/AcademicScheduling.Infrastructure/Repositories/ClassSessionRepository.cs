namespace AcademicScheduling.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AcademicScheduling.Application.Abstractions;
using AcademicScheduling.Domain.Aggregates;
using AcademicScheduling.Infrastructure.Persistence;

public sealed class ClassSessionRepository : IClassSessionRepository
{
    private readonly AcademicSchedulingDbContext _dbContext;

    public ClassSessionRepository(AcademicSchedulingDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Used by SubmitAttendanceCommand and AllocateRoomCommand
    public async Task<ClassSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.ClassSessions
            .FirstOrDefaultAsync(cs => cs.Id == id, cancellationToken);
    }

    // Supports Timetable queries
    public async Task<IReadOnlyList<ClassSession>> GetByFacultyIdAsync(Guid facultyId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.ClassSessions
            .AsNoTracking()
            .Where(cs => cs.FacultyId == facultyId) // Adjust to match your aggregate
            .ToListAsync(cancellationToken);
    }

    public void Add(ClassSession classSession)
    {
        _dbContext.ClassSessions.Add(classSession);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}