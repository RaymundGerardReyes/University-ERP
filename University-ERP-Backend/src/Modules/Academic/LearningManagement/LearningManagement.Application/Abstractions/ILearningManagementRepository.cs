namespace LearningManagement.Application.Abstractions;

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LearningManagement.Domain.Aggregates;

public interface ILearningManagementRepository
{
    Task<IReadOnlyList<Assessment>> GetAssessmentsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<ClassPerformance>> GetClassPerformanceAsync(string facultyId, CancellationToken cancellationToken);
}
