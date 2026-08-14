namespace Enrollment.Application.Abstractions;

using Enrollment.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IWaitlistRepository
{
    Task<WaitlistEntry?> GetNextPendingEntryAsync(string sectionId, string termId, CancellationToken cancellationToken = default);
    Task UpdateAsync(WaitlistEntry entry, CancellationToken cancellationToken = default);
}
