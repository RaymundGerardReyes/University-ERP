namespace Teaching.Infrastructure.Repositories;

using Teaching.Application.Abstractions;
using Teaching.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class CourseSectionRepository : ICourseSectionRepository
{
    private readonly DbContext _dbContext;

    public CourseSectionRepository(DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Used by the Faculty Dashboard to fetch their active teaching schedule
    public async Task<IReadOnlyList<CourseSection>> GetByFacultyIdAsync(string facultyId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<CourseSection>()
            .AsNoTracking()
            .Where(cs => cs.FacultyId == facultyId && cs.Status == "Active")
            .OrderBy(cs => cs.CourseCode) // Sort alphabetically for a clean UI
            .ToListAsync(cancellationToken);
    }

    public async Task<CourseSection?> GetByIdAsync(string sectionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<CourseSection>()
            .FirstOrDefaultAsync(cs => cs.Id.ToString() == sectionId, cancellationToken);
    }
}
