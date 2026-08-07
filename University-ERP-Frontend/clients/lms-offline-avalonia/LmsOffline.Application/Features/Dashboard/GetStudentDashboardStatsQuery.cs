namespace LmsOffline.Application.Features.Dashboard;

using System;
using System.Collections.Generic;
using MediatR;
using SharedKernel.Domain.Primitives;

public class UrgentAlertDto
{
    public string Title { get; set; } = string.Empty;
    public string TimeInfo { get; set; } = string.Empty;
    public string SeverityColor { get; set; } = "#F59E0B";
    public string BadgeText { get; set; } = "DUE SOON";
}

public class RecentActivityDto
{
    public string Icon { get; set; } = "📖";
    public string ActivityName { get; set; } = string.Empty;
    public string TimestampText { get; set; } = string.Empty;
    public string Status { get; set; } = "Saved Offline";
}

public class StudentDashboardStatsDto
{
    public string StudentName { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string AcademicProgram { get; set; } = string.Empty;
    public double OverallProgress { get; set; }
    public string CurrentGpa { get; set; } = string.Empty;
    public int CompletedModulesCount { get; set; }
    public int PendingOutboxCount { get; set; }
    public string LastActiveLessonTitle { get; set; } = string.Empty;

    public List<UrgentAlertDto> UrgentAlerts { get; set; } = new();
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
}

public class GetStudentDashboardStatsQuery : IRequest<Result<StudentDashboardStatsDto>>
{
}
