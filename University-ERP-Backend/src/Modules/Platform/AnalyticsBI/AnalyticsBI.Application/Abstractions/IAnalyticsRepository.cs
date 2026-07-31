namespace AnalyticsBI.Application.Abstractions;

using AnalyticsBI.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface IAnalyticsRepository
{
    Task AddAsync(DashboardReport report, CancellationToken cancellationToken);
}
