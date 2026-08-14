namespace Curriculum.Infrastructure.Repositories;

using Curriculum.Application.Abstractions;
using Curriculum.Domain.Aggregates;
using Curriculum.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed class CourseDefinitionRepository : ICourseDefinitionRepository
{
    private readonly CurriculumDbContext _dbContext;

    public CourseDefinitionRepository(CurriculumDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CourseDefinition?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Courses
            .Include(c => c.Prerequisites)
            .FirstOrDefaultAsync(c => c.Code == code, cancellationToken);
    }

    public async Task<CourseDefinition?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Courses
            .Include(c => c.Prerequisites)
            .FirstOrDefaultAsync(c => c.Id.ToString() == id, cancellationToken);
    }

    public async Task<IReadOnlyList<CourseDefinition>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Courses
            .Include(c => c.Prerequisites)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(CourseDefinition course, CancellationToken cancellationToken = default)
    {
        await _dbContext.Courses.AddAsync(course, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CourseDefinition course, CancellationToken cancellationToken = default)
    {
        _dbContext.Courses.Update(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
