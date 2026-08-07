namespace LmsOffline.Application.Features.Dashboard;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using LmsOffline.Application.Interfaces;
using SharedKernel.Domain.Primitives;

public class GetStudentDashboardStatsQueryHandler : IRequestHandler<GetStudentDashboardStatsQuery, Result<StudentDashboardStatsDto>>
{
    private readonly IDashboardRepository _dashboardRepository;

    public GetStudentDashboardStatsQueryHandler(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository ?? throw new ArgumentNullException(nameof(dashboardRepository));
    }

    public async Task<Result<StudentDashboardStatsDto>> Handle(GetStudentDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var stats = await _dashboardRepository.GetDashboardStatsAsync(cancellationToken);
            if (stats == null)
            {
                return Result<StudentDashboardStatsDto>.Failure(new Error("Dashboard.NoStudent", "No active student found for dashboard."));
            }
            return Result<StudentDashboardStatsDto>.Success(stats);
        }
        catch (Exception ex)
        {
            return Result<StudentDashboardStatsDto>.Failure(new Error("Dashboard.Error", ex.Message));
        }
    }
}
