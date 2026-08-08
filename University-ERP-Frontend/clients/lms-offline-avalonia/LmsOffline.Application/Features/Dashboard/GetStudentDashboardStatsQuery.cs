namespace LmsOffline.Application.Features.Dashboard;

using System;
using System.Collections.Generic;
using MediatR;
using SharedKernel.Domain.Primitives;

// ─── SECTION 1: KPI Cards ─────────────────────────────────────────────────────
public class KpiCardDto
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string SubLabel { get; set; } = string.Empty;
    public string AccentColor { get; set; } = "#6366F1";
    public string Icon { get; set; } = "📊";
}

// ─── SECTION 2: Continue Learning ─────────────────────────────────────────────
public class ContinueLearningDto
{
    public string CourseCode { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string CurrentModule { get; set; } = string.Empty;
    public double ProgressPercent { get; set; } = 0;
    public string ProgressLabel { get; set; } = string.Empty; // e.g. "5 of 8 modules"
}

// ─── SECTION 3: Immediate Horizon Deadline ────────────────────────────────────
public class DeadlineDto
{
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string RelativeTime { get; set; } = string.Empty;
    public string UrgencyColor { get; set; } = "#1F2937";
    public string BorderColor { get; set; } = "#374151";
    public string ActionText { get; set; } = "Start";
    /// <summary>Overdue | Today | Upcoming</summary>
    public string Bucket { get; set; } = "Today";
}

// ─── SECTION 4: Course Progress ───────────────────────────────────────────────
public class CourseProgressDto
{
    public string CourseCode { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public double ProgressPercent { get; set; } = 0;
    public string ModuleLabel { get; set; } = string.Empty; // e.g. "5 of 8 modules completed"
}

// ─── SECTION 5: Recent Activity ───────────────────────────────────────────────
public class RecentActivityDto
{
    public string Icon { get; set; } = "✓";
    public string ActionLabel { get; set; } = string.Empty; // e.g. "Submitted"
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string RelativeTime { get; set; } = string.Empty;
    public string DateGroup { get; set; } = string.Empty; // "Today" | "Yesterday"
}

// ─── SECTION 6: Feedback ──────────────────────────────────────────────────────
public class FeedbackDto
{
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string RelativeTime { get; set; } = string.Empty;
    public string BadgeText { get; set; } = string.Empty;
    public string BadgeColor { get; set; } = "#1F2937";
    public string BadgeForeground { get; set; } = "#F9FAFB";
    public string Icon { get; set; } = "📬";
}

// ─── ROOT DTO ─────────────────────────────────────────────────────────────────
public class StudentDashboardStatsDto
{
    // Welcome
    public string StudentName { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string AcademicProgram { get; set; } = string.Empty;
    public string WelcomeSubtitle { get; set; } = "Here's what needs your attention today.";
    public string TodayDateString { get; set; } = string.Empty;

    // Legacy / Banner
    public string TopUrgentActionMessage { get; set; } = string.Empty;

    // KPIs
    public List<KpiCardDto> KpiCards { get; set; } = new();

    // Continue Learning
    public ContinueLearningDto? ContinueLearning { get; set; }

    // Immediate Horizon (raw list — ViewModel will split by Bucket)
    public List<DeadlineDto> Deadlines { get; set; } = new();

    // Course Progress
    public List<CourseProgressDto> CourseProgresses { get; set; } = new();

    // Recent Activity
    public List<RecentActivityDto> RecentActivities { get; set; } = new();

    // Recent Feedback
    public List<FeedbackDto> Feedbacks { get; set; } = new();

    // Academic Snapshot
    public string AcademicYear { get; set; } = "2026–2027";
    public string Semester { get; set; } = "First Semester";
    public int ActiveCourseCount { get; set; } = 6;
}

public class GetStudentDashboardStatsQuery : IRequest<Result<StudentDashboardStatsDto>>
{
}
