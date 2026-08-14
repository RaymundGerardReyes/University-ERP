namespace Curriculum.Application.Abstractions;

using Curriculum.Domain.Aggregates;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public interface ICourseDefinitionRepository
{
    Task<CourseDefinition?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<CourseDefinition?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CourseDefinition>> GetAllAsync(CancellationToken cancellationToken = default);
    
    Task AddAsync(CourseDefinition course, CancellationToken cancellationToken = default);
    Task UpdateAsync(CourseDefinition course, CancellationToken cancellationToken = default);
}
