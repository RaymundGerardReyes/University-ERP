namespace LearningManagement.Infrastructure.Repositories;

using LearningManagement.Application.Abstractions;
using LearningManagement.Domain.Aggregates;
using LearningManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

public sealed class CourseSyllabusRepository : ICourseSyllabusRepository
{
    private readonly LmsDbContext _dbContext;

    public CourseSyllabusRepository(LmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CourseSyllabus?> GetBySectionIdAsync(string sectionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Syllabi
            .Include(s => s.Modules)
                .ThenInclude(m => m.ContentItems)
            .FirstOrDefaultAsync(s => s.SectionId == sectionId, cancellationToken);
    }

    public async Task AddAsync(CourseSyllabus syllabus, CancellationToken cancellationToken = default)
    {
        await _dbContext.Syllabi.AddAsync(syllabus, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CourseSyllabus syllabus, CancellationToken cancellationToken = default)
    {
        _dbContext.Syllabi.Update(syllabus);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
