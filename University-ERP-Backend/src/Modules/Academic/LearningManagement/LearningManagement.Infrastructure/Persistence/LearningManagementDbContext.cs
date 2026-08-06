using LearningManagement.Application.Abstractions;
using LearningManagement.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;

namespace LearningManagement.Infrastructure.Persistence;

public sealed class LearningManagementDbContext : DbContext
{
    public LearningManagementDbContext(DbContextOptions<LearningManagementDbContext> options)
        : base(options) { }

    public DbSet<Assessment> Assessments => Set<Assessment>();
    public DbSet<ClassPerformance> ClassPerformances => Set<ClassPerformance>();

    public DbSet<OfflineAssessmentSubmissionEntity> OfflineAssessmentSubmissions => Set<OfflineAssessmentSubmissionEntity>();
    public DbSet<OfflineAssignmentSubmissionEntity> OfflineAssignmentSubmissions => Set<OfflineAssignmentSubmissionEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("lms");

        modelBuilder.Entity<Assessment>(entity =>
        {
            entity.ToTable("Assessments");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<ClassPerformance>(entity =>
        {
            entity.ToTable("ClassPerformance");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<OfflineAssessmentSubmissionEntity>(entity =>
        {
            entity.ToTable("OfflineAssessmentSubmissions");
            entity.HasKey(e => e.AssessmentId);
            entity.Property(e => e.CourseCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.ModuleTitle).HasMaxLength(200).IsRequired();
            entity.Property(e => e.AnswersJson).HasColumnType("jsonb").IsRequired();
        });

        modelBuilder.Entity<OfflineAssignmentSubmissionEntity>(entity =>
        {
            entity.ToTable("OfflineAssignmentSubmissions");
            entity.HasKey(e => e.AssignmentId);
            entity.Property(e => e.CourseCode).HasMaxLength(20).IsRequired();
            entity.Property(e => e.AssignmentTitle).HasMaxLength(200).IsRequired();
            entity.Property(e => e.EssayContent).HasColumnType("text").IsRequired();
        });
    }
}

// ─── Persistence Entities ──────────────────────────────────────────────────────

public sealed class OfflineAssessmentSubmissionEntity
{
    public Guid AssessmentId { get; set; }
    public Guid StudentId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string ModuleTitle { get; set; } = string.Empty;
    public string AnswersJson { get; set; } = string.Empty;
    public DateTimeOffset SubmittedAtUtc { get; set; }
    public DateTimeOffset IngestedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class OfflineAssignmentSubmissionEntity
{
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string AssignmentTitle { get; set; } = string.Empty;
    public string EssayContent { get; set; } = string.Empty;
    public DateTimeOffset SubmittedAtUtc { get; set; }
    public DateTimeOffset IngestedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}
