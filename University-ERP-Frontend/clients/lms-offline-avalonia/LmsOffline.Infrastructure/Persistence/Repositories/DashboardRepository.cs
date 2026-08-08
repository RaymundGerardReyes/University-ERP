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

        // ── KPI Cards ──────────────────────────────────────────────────────────
        var kpiCards = new List<KpiCardDto>
        {
            new KpiCardDto
            {
                Label      = "Course Progress",
                Value      = "72%",
                SubLabel   = "Overall learning",
                AccentColor = "#6366F1",
                Icon       = "📈"
            },
            new KpiCardDto
            {
                Label      = "Active Courses",
                Value      = "6",
                SubLabel   = "Currently enrolled",
                AccentColor = "#10B981",
                Icon       = "📚"
            },
            new KpiCardDto
            {
                Label      = "Due Soon",
                Value      = "4",
                SubLabel   = "Next 7 days",
                AccentColor = "#F59E0B",
                Icon       = "⏳"
            },
            new KpiCardDto
            {
                Label      = "Overdue",
                Value      = "1",
                SubLabel   = "Needs attention",
                AccentColor = "#EF4444",
                Icon       = "⚠️"
            },
        };

        // ── Continue Learning ──────────────────────────────────────────────────
        var continueLearning = new ContinueLearningDto
        {
            CourseCode      = "CS-201",
            CourseName      = "Introduction to Programming",
            CurrentModule   = "Module 5 · Control Structures",
            ProgressPercent = 78,
            ProgressLabel   = "5 of 8 modules completed"
        };

        // ── Immediate Horizon ──────────────────────────────────────────────────
        var deadlines = new List<DeadlineDto>
        {
            new DeadlineDto
            {
                CourseCode    = "CS-305",
                Title         = "Database Security Assignment",
                RelativeTime  = "Yesterday",
                UrgencyColor  = "#FEE2E2",
                BorderColor   = "#EF4444",
                ActionText    = "Submit Now",
                Bucket        = "Overdue"
            },
            new DeadlineDto
            {
                CourseCode    = "CS-201",
                Title         = "Long Quiz",
                RelativeTime  = "10:00 AM",
                UrgencyColor  = "#FEF3C7",
                BorderColor   = "#F59E0B",
                ActionText    = "Start Quiz",
                Bucket        = "Today"
            },
            new DeadlineDto
            {
                CourseCode    = "CS-305",
                Title         = "Laboratory Activity",
                RelativeTime  = "2:00 PM",
                UrgencyColor  = "#FEF3C7",
                BorderColor   = "#F59E0B",
                ActionText    = "Open Activity",
                Bucket        = "Today"
            },
            new DeadlineDto
            {
                CourseCode    = "CS-410",
                Title         = "Assignment",
                RelativeTime  = "Tomorrow",
                UrgencyColor  = "#EFF6FF",
                BorderColor   = "#3B82F6",
                ActionText    = "View Details",
                Bucket        = "Upcoming"
            },
            new DeadlineDto
            {
                CourseCode    = "CS-201",
                Title         = "Long Quiz",
                RelativeTime  = "Aug 11",
                UrgencyColor  = "#EFF6FF",
                BorderColor   = "#3B82F6",
                ActionText    = "View Details",
                Bucket        = "Upcoming"
            },
        };

        // ── Course Progress ────────────────────────────────────────────────────
        var courseProgresses = new List<CourseProgressDto>
        {
            new CourseProgressDto
            {
                CourseCode      = "CS-201",
                CourseName      = "Introduction to Programming",
                ProgressPercent = 78,
                ModuleLabel     = "5 of 8 modules completed"
            },
            new CourseProgressDto
            {
                CourseCode      = "CS-305",
                CourseName      = "Database Systems",
                ProgressPercent = 62,
                ModuleLabel     = "4 of 7 modules completed"
            },
            new CourseProgressDto
            {
                CourseCode      = "CS-410",
                CourseName      = "Operating Systems",
                ProgressPercent = 91,
                ModuleLabel     = "7 of 8 modules completed"
            },
            new CourseProgressDto
            {
                CourseCode      = "CS-203",
                CourseName      = "Data Structures & Algorithms",
                ProgressPercent = 40,
                ModuleLabel     = "3 of 6 modules completed"
            },
        };

        // ── Recent Activity ────────────────────────────────────────────────────
        var recentActivities = new List<RecentActivityDto>
        {
            new RecentActivityDto
            {
                Icon          = "✓",
                ActionLabel   = "Submitted",
                CourseCode    = "CS-305",
                Title         = "Database Assignment",
                RelativeTime  = "8:15 AM",
                DateGroup     = "Today"
            },
            new RecentActivityDto
            {
                Icon          = "✓",
                ActionLabel   = "Completed",
                CourseCode    = "CS-201",
                Title         = "Practice Activity",
                RelativeTime  = "9:42 AM",
                DateGroup     = "Today"
            },
            new RecentActivityDto
            {
                Icon          = "✓",
                ActionLabel   = "Completed",
                CourseCode    = "CS-410",
                Title         = "Module 7",
                RelativeTime  = "4:32 PM",
                DateGroup     = "Yesterday"
            },
            new RecentActivityDto
            {
                Icon          = "📖",
                ActionLabel   = "Opened",
                CourseCode    = "CS-203",
                Title         = "Sorting Algorithms Lecture",
                RelativeTime  = "2:10 PM",
                DateGroup     = "Yesterday"
            },
        };

        // ── Feedback ───────────────────────────────────────────────────────────
        var feedbacks = new List<FeedbackDto>
        {
            new FeedbackDto
            {
                CourseCode      = "CS-305",
                Title           = "Midterm Examination Scored",
                RelativeTime    = "2 hours ago",
                BadgeText       = "95/100",
                BadgeColor      = "#10B981",
                BadgeForeground = "#FFFFFF",
                Icon            = "✅"
            },
            new FeedbackDto
            {
                CourseCode      = "CS-101",
                Title           = "New Group Activity Posted",
                RelativeTime    = "Yesterday",
                BadgeText       = "NEW",
                BadgeColor      = "#3B82F6",
                BadgeForeground = "#FFFFFF",
                Icon            = "🆕"
            },
            new FeedbackDto
            {
                CourseCode      = "GE-101",
                Title           = "Assignment 1 Reviewed by Professor",
                RelativeTime    = "2 days ago",
                BadgeText       = "REVIEWED",
                BadgeColor      = "#6B7280",
                BadgeForeground = "#FFFFFF",
                Icon            = "📝"
            }
        };

        return new StudentDashboardStatsDto
        {
            StudentName          = studentName,
            StudentId            = studentId,
            AcademicProgram      = program,
            WelcomeSubtitle      = "Here's what needs your attention today.",
            TodayDateString      = DateTime.Now.ToString("dddd, MMMM d"),
            TopUrgentActionMessage = "1 assignment overdue · 2 activities due today",

            KpiCards             = kpiCards,
            ContinueLearning     = continueLearning,
            Deadlines            = deadlines,
            CourseProgresses     = courseProgresses,
            RecentActivities     = recentActivities,
            Feedbacks            = feedbacks,

            AcademicYear         = "2026–2027",
            Semester             = "First Semester",
            ActiveCourseCount    = 6,
        };
    }
}
