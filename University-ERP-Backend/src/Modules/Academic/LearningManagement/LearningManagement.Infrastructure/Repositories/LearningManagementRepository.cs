namespace LearningManagement.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LearningManagement.Application.Abstractions;
using LearningManagement.Domain.Aggregates;
using LearningManagement.Infrastructure.Persistence;

public sealed class LearningManagementRepository(LearningManagementDbContext dbContext) : ILearningManagementRepository
{
    public async Task<IReadOnlyList<Assessment>> GetAssessmentsAsync(CancellationToken cancellationToken)
    {
        return await dbContext.Assessments
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ClassPerformance>> GetClassPerformanceAsync(string facultyId, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(facultyId, out var parsedGuid))
        {
            return await dbContext.ClassPerformances
                .AsNoTracking()
                .Where(p => p.FacultyId == parsedGuid)
                .ToListAsync(cancellationToken);
        }
        return new List<ClassPerformance>();
    }
}
