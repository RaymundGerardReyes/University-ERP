namespace LmsOffline.Infrastructure.Persistence.Repositories;

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Application.Interfaces;
using LmsOffline.Application.Features.Dashboard;
using LmsOffline.Domain.ValueObjects;
using System.Collections.Generic;

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

        string studentName = student?.FullName ?? "Alex Rivera";
        string studentId   = student?.StudentIdNumber ?? "2026-8809";
        string program     = student?.AcademicProgram ?? "BS Computer Science";

        // Query real data
        var packages = await _dbContext.Packages.ToListAsync(cancellationToken);
        var assessments = await _dbContext.Assessments.ToListAsync(cancellationToken);
        var assignments = await _dbContext.Assignments.ToListAsync(cancellationToken);
        var learningEvents = await _dbContext.LearningRecordStore.OrderByDescending(l => l.OccurredOnUtc).Take(10).ToListAsync(cancellationToken);
        var grades = await _dbContext.Grades.OrderByDescending(g => g.EvaluatedOnUtc).Take(5).ToListAsync(cancellationToken);

        int totalCourses = packages.Count;
        int dueSoonCount = assessments.Count(a => a.Window.EndTimeUtc > DateTime.UtcNow && (a.Window.EndTimeUtc - DateTime.UtcNow).TotalDays <= 7) +
                           assignments.Count(a => a.Window.EndTimeUtc > DateTime.UtcNow && (a.Window.EndTimeUtc - DateTime.UtcNow).TotalDays <= 7);
        int overdueCount = assessments.Count(a => a.Window.EndTimeUtc < DateTime.UtcNow && !a.IsStarted) +
                           assignments.Count(a => a.Window.EndTimeUtc < DateTime.UtcNow);

        double totalProgress = packages.Count > 0 ? packages.Average(p => p.TotalLessons > 0 ? (double)p.CompletedLessons / p.TotalLessons * 100 : 0) : 0;

        // ── KPI Cards ──────────────────────────────────────────────────────────
        var kpiCards = new List<KpiCardDto>
        {
            new KpiCardDto
            {
                Label      = "Course Progress",
                Value      = $"{totalProgress:F0}%",
                SubLabel   = "Overall learning",
                AccentColor = "#6366F1",
                Icon       = "📈"
            },
            new KpiCardDto
            {
                Label      = "Active Courses",
                Value      = totalCourses.ToString(),
                SubLabel   = "Currently enrolled",
                AccentColor = "#10B981",
                Icon       = "📚"
            },
            new KpiCardDto
            {
                Label      = "Due Soon",
                Value      = dueSoonCount.ToString(),
                SubLabel   = "Next 7 days",
                AccentColor = "#F59E0B",
                Icon       = "⏳"
            },
            new KpiCardDto
            {
                Label      = "Overdue",
                Value      = overdueCount.ToString(),
                SubLabel   = "Needs attention",
                AccentColor = "#EF4444",
                Icon       = "⚠️"
            },
        };

        // ── Continue Learning ──────────────────────────────────────────────────
        var lastPackage = packages.OrderByDescending(p => p.InstalledOnUtc).FirstOrDefault();
        var continueLearning = lastPackage != null ? new ContinueLearningDto
        {
            CourseCode      = lastPackage.CourseCode,
            CourseName      = lastPackage.Title,
            CurrentModule   = "Continue from last saved state",
            ProgressPercent = lastPackage.TotalLessons > 0 ? (double)lastPackage.CompletedLessons / lastPackage.TotalLessons * 100 : 0,
            ProgressLabel   = $"{lastPackage.CompletedLessons} of {lastPackage.TotalLessons} modules completed"
        } : null;

        // ── Immediate Horizon ──────────────────────────────────────────────────
        var deadlines = new List<DeadlineDto>();
        
        foreach (var a in assessments.Where(a => !a.IsStarted))
        {
            string bucket = a.Window.EndTimeUtc < DateTime.UtcNow ? "Overdue" : 
                            (a.Window.EndTimeUtc.Date == DateTime.UtcNow.Date ? "Today" : "Upcoming");
            
            string urgencyColor = bucket == "Overdue" ? "#FEE2E2" : (bucket == "Today" ? "#FEF3C7" : "#EFF6FF");
            string borderColor = bucket == "Overdue" ? "#EF4444" : (bucket == "Today" ? "#F59E0B" : "#3B82F6");

            deadlines.Add(new DeadlineDto
            {
                CourseCode = "Assessment",
                Title = a.Title,
                RelativeTime = a.Window.EndTimeUtc.ToString("MMM dd HH:mm"),
                UrgencyColor = urgencyColor,
                BorderColor = borderColor,
                ActionText = bucket == "Overdue" ? "Late Submit" : "Start Now",
                Bucket = bucket
            });
        }

        foreach (var a in assignments.Where(a => a.SyncState != LmsOffline.Domain.ValueObjects.SyncStatus.Synced))
        {
            string bucket = a.Window.EndTimeUtc < DateTime.UtcNow ? "Overdue" : 
                            (a.Window.EndTimeUtc.Date == DateTime.UtcNow.Date ? "Today" : "Upcoming");
            
            string urgencyColor = bucket == "Overdue" ? "#FEE2E2" : (bucket == "Today" ? "#FEF3C7" : "#EFF6FF");
            string borderColor = bucket == "Overdue" ? "#EF4444" : (bucket == "Today" ? "#F59E0B" : "#3B82F6");

            deadlines.Add(new DeadlineDto
            {
                CourseCode = a.CourseCode,
                Title = a.Title,
                RelativeTime = a.Window.EndTimeUtc.ToString("MMM dd HH:mm"),
                UrgencyColor = urgencyColor,
                BorderColor = borderColor,
                ActionText = "View Assignment",
                Bucket = bucket
            });
        }

        // ── Course Progress ────────────────────────────────────────────────────
        var courseProgresses = packages.Select(p => new CourseProgressDto
        {
            CourseCode = p.CourseCode,
            CourseName = p.Title,
            ProgressPercent = p.TotalLessons > 0 ? (double)p.CompletedLessons / p.TotalLessons * 100 : 0,
            ModuleLabel = $"{p.CompletedLessons} of {p.TotalLessons} modules completed"
        }).ToList();

        // ── Recent Activity ────────────────────────────────────────────────────
        var recentActivities = learningEvents.Select(l => new RecentActivityDto
        {
            Icon = "✓",
            ActionLabel = l.ActionVerb,
            CourseCode = "",
            Title = l.TargetObject,
            RelativeTime = l.OccurredOnUtc.ToString("HH:mm"),
            DateGroup = l.OccurredOnUtc.Date == DateTime.UtcNow.Date ? "Today" : "Previous"
        }).ToList();

        // ── Feedback ───────────────────────────────────────────────────────────
        var feedbacks = grades.Select(g => new FeedbackDto
        {
            CourseCode = g.CourseCode,
            Title = g.AssessmentTitle,
            RelativeTime = g.EvaluatedOnUtc.ToString("MMM dd"),
            BadgeText = $"{g.Score}/{g.MaxScore}",
            BadgeColor = g.Score >= (g.MaxScore * 0.6) ? "#10B981" : "#EF4444",
            BadgeForeground = "#FFFFFF",
            Icon = "📝"
        }).ToList();

        return new StudentDashboardStatsDto
        {
            StudentName          = studentName,
            StudentId            = studentId,
            AcademicProgram      = program,
            WelcomeSubtitle      = "Here's what needs your attention today.",
            TodayDateString      = DateTime.Now.ToString("dddd, MMMM d"),
            TopUrgentActionMessage = $"{overdueCount} overdue · {dueSoonCount} due soon",

            KpiCards             = kpiCards,
            ContinueLearning     = continueLearning,
            Deadlines            = deadlines,
            CourseProgresses     = courseProgresses,
            RecentActivities     = recentActivities,
            Feedbacks            = feedbacks,

            AcademicYear         = "2026–2027",
            Semester             = "First Semester",
            ActiveCourseCount    = totalCourses,
        };
    }
}
