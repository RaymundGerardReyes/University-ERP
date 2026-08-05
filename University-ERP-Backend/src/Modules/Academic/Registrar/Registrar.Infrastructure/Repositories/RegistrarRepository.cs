namespace Registrar.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Registrar.Application.Abstractions;
using Registrar.Domain.Aggregates;
using Registrar.Infrastructure.Persistence;

public sealed class RegistrarRepository(RegistrarDbContext dbContext) : IRegistrarRepository
{
    public async Task<IReadOnlyList<CourseSection>> GetFacultyScheduleAsync(string facultyId, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(facultyId, out var parsedGuid))
        {
            return await dbContext.CourseSections
                .AsNoTracking()
                .Where(cs => cs.FacultyId == parsedGuid)
                .ToListAsync(cancellationToken);
        }
        return new List<CourseSection>();
    }
}
