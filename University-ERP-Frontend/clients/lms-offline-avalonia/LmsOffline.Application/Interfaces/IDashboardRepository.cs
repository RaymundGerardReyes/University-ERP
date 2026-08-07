namespace LmsOffline.Application.Interfaces;

using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Application.Features.Dashboard;

public interface IDashboardRepository
{
    Task<StudentDashboardStatsDto?> GetDashboardStatsAsync(CancellationToken cancellationToken = default);
}
