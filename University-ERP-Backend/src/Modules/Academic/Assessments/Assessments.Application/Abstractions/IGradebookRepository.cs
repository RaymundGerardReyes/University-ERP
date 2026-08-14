namespace Assessments.Application.Abstractions;

using Assessments.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IGradebookRepository
{
    Task<Gradebook?> GetBySectionIdAsync(string sectionId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Gradebook gradebook, CancellationToken cancellationToken = default);
}
