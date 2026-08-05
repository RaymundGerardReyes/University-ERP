namespace Examination.Infrastructure.Repositories;

using Examination.Application.Abstractions;
using Examination.Domain.Aggregates;
using Examination.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class ExaminationRepository(ExaminationDbContext dbContext) : IExaminationRepository
{
    public async Task<IReadOnlyList<GradebookRecord>> GetGradebookBySectionAsync(string sectionId, CancellationToken cancellationToken)
    {
        return await dbContext.GradebookRecords
            .AsNoTracking()
            .Where(r => r.SectionId == sectionId)
            .ToListAsync(cancellationToken);
    }
}
