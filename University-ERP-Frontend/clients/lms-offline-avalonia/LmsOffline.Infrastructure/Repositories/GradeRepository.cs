namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Persistence;

public sealed class GradeRepository : ILocalGradeRepository
{
    private readonly EncryptedSqliteContext _context;

    public GradeRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<List<GradeRecord>> GetByStudentIdAsync(string studentIdNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Grades
            .Where(g => g.StudentIdNumber == studentIdNumber)
            .OrderByDescending(g => g.EvaluatedOnUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task UpsertAsync(GradeRecord grade, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Grades.FirstOrDefaultAsync(g => g.Id == grade.Id, cancellationToken);
        if (existing == null)
        {
            await _context.Grades.AddAsync(grade, cancellationToken);
        }
        else
        {
            _context.Entry(existing).CurrentValues.SetValues(grade);
        }
        await _context.SaveChangesAsync(cancellationToken);
    }
}
