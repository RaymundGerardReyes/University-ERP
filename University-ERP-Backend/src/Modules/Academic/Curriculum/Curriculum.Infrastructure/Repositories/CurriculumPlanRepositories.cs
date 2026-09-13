namespace Curriculum.Infrastructure.Repositories;

using Curriculum.Application.Abstractions;
using Curriculum.Domain.Aggregates;
using Curriculum.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed class AcademicProgramRepository : IAcademicProgramRepository
{
    private readonly CurriculumDbContext _db;

    public AcademicProgramRepository(CurriculumDbContext db) => _db = db;

    public async Task<AcademicProgram?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(code)) return null;
        var trimmed = code.Trim();

        if (Guid.TryParse(trimmed, out var guid))
        {
            var byId = await _db.AcademicPrograms.FirstOrDefaultAsync(p => p.Id == guid, cancellationToken);
            if (byId != null) return byId;
        }

        var normalized = trimmed.ToUpper();
        return await _db.AcademicPrograms
            .FirstOrDefaultAsync(p => p.Code.ToUpper() == normalized || p.Name.ToUpper() == normalized || p.Name.ToUpper().Contains(normalized), cancellationToken);
    }

    public async Task<AcademicProgram?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _db.AcademicPrograms
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<IReadOnlyList<AcademicProgram>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _db.AcademicPrograms
            .OrderBy(p => p.Code)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(AcademicProgram program, CancellationToken cancellationToken = default)
    {
        await _db.AcademicPrograms.AddAsync(program, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }
}

public sealed class CurriculumPlanRepository : ICurriculumPlanRepository
{
    private readonly CurriculumDbContext _db;

    public CurriculumPlanRepository(CurriculumDbContext db) => _db = db;

    public async Task<AcademicCurriculum?> GetActiveByProgramCodeAsync(string programCode, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(programCode)) return null;
        var normalized = programCode.Trim().ToUpper();

        return await _db.AcademicCurricula
            .Include(c => c.CurriculumSubjects)
            .FirstOrDefaultAsync(c => c.ProgramCode.ToUpper() == normalized && c.Status == "Active", cancellationToken);
    }

    public async Task<IReadOnlyList<AcademicCurriculum>> GetAllByProgramCodeAsync(string programCode, CancellationToken cancellationToken = default)
        => await _db.AcademicCurricula
            .Include(c => c.CurriculumSubjects)
            .Where(c => c.ProgramCode == programCode)
            .OrderByDescending(c => c.AcademicYear)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(AcademicCurriculum curriculum, CancellationToken cancellationToken = default)
    {
        await _db.AcademicCurricula.AddAsync(curriculum, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }
}

