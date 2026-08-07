namespace LmsOffline.Infrastructure.Persistence.Repositories;

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Application.Interfaces;
using LmsOffline.Application.Features.Dashboard;
using LmsOffline.Domain.ValueObjects;

public class DashboardRepository : IDashboardRepository
{
    private readonly EncryptedSqliteContext _dbContext;

    public DashboardRepository(EncryptedSqliteContext dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    }

    public async Task<StudentDashboardStatsDto?> GetDashboardStatsAsync(CancellationToken cancellationToken = default)
    {
        var student = await _dbContext.StudentUsers
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.LastLoginUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (student == null)
        {
            return null;
        }

        var pendingAssessments = await _dbContext.Assessments.CountAsync(a => a.SyncState == SyncStatus.PendingSync, cancellationToken);
        var pendingAssignments = await _dbContext.Assignments.CountAsync(a => a.SyncState == SyncStatus.PendingSync, cancellationToken);
        var pendingLearningEvents = await _dbContext.LearningRecordStore.CountAsync(l => l.SyncState == SyncStatus.PendingSync, cancellationToken);

        int totalPendingOutbox = pendingAssessments + pendingAssignments + pendingLearningEvents;

        // Mock Data for Missing Domains
        double overallProgress = 78.5; // Mock calculation
        string currentGpa = "3.85 / 4.0"; // Mock calculation
        int completedModulesCount = await _dbContext.Modules.CountAsync(cancellationToken); // Mock logic for modules downloaded = completed

        var recentEvents = await _dbContext.LearningRecordStore
            .OrderByDescending(e => e.OccurredOnUtc)
            .Take(5)
            .ToListAsync(cancellationToken);

        var recentActivitiesDto = recentEvents.Select(e => new RecentActivityDto
        {
            Icon = "📝",
            ActivityName = e.ActionVerb + " " + e.TargetObject,
            TimestampText = e.OccurredOnUtc.ToLocalTime().ToString("g"),
            Status = e.SyncState == SyncStatus.Synced ? "Synced" : "Queued in Outbox"
        }).ToList();

        if (!recentActivitiesDto.Any())
        {
            recentActivitiesDto.Add(new RecentActivityDto
            {
                Icon = "🌟",
                ActivityName = "Offline Vault Initialized",
                TimestampText = DateTime.Now.ToString("g"),
                Status = "Ready"
            });
        }

        var lastEvent = recentEvents.FirstOrDefault();
        string lastActiveLesson = lastEvent != null 
            ? $"Resuming: {lastEvent.TargetObject}" 
            : "No active lessons found. Start learning!";

        var assessments = await _dbContext.Assessments
            .Take(2)
            .ToListAsync(cancellationToken);

        var alertsDto = assessments.Select(a => new UrgentAlertDto
        {
            Title = a.Title,
            TimeInfo = "Availability: " + a.Window.StartTimeUtc.ToLocalTime().ToString("MMM dd") + " - " + a.Window.EndTimeUtc.ToLocalTime().ToString("MMM dd"),
            BadgeText = a.IsStarted ? "IN PROGRESS" : "UPCOMING",
            SeverityColor = a.IsStarted ? "#EF4444" : "#F59E0B"
        }).ToList();

        return new StudentDashboardStatsDto
        {
            StudentName = student.FullName,
            StudentId = student.StudentIdNumber,
            AcademicProgram = student.AcademicProgram,
            OverallProgress = overallProgress,
            CurrentGpa = currentGpa,
            CompletedModulesCount = completedModulesCount,
            PendingOutboxCount = totalPendingOutbox,
            LastActiveLessonTitle = lastActiveLesson,
            RecentActivities = recentActivitiesDto,
            UrgentAlerts = alertsDto
        };
    }
}
