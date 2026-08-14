namespace Assessments.Infrastructure.Repositories;

using Assessments.Application.Abstractions;
using Assessments.Domain.Aggregates;
using Assessments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

public sealed class GradebookRepository : IGradebookRepository
{
    private readonly AssessmentsDbContext _dbContext;

    public GradebookRepository(AssessmentsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Gradebook?> GetBySectionIdAsync(string sectionId, CancellationToken cancellationToken = default)
    {
        // Use Include to eagerly load the child entities (the roster)
        return await _dbContext.Gradebooks
            .Include(g => g.Roster)
            .FirstOrDefaultAsync(g => g.SectionId == sectionId, cancellationToken);
    }

    public async Task UpdateAsync(Gradebook gradebook, CancellationToken cancellationToken = default)
    {
        _dbContext.Gradebooks.Update(gradebook);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
