namespace Examination.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Examination.Domain.Aggregates;

public sealed class ExaminationDbContext : DbContext
{
    public ExaminationDbContext(DbContextOptions<ExaminationDbContext> options)
        : base(options)
    {
    }

    // Expose the Aggregate Roots
    public DbSet<ExamSession> ExamSessions => Set<ExamSession>();
    public DbSet<ExamResult> ExamResults => Set<ExamResult>();
    public DbSet<QuestionItem> QuestionItems => Set<QuestionItem>();
    public DbSet<GradebookRecord> GradebookRecords => Set<GradebookRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Core: Force all tables in this module into the 'examination' schema
        modelBuilder.HasDefaultSchema("examination");

        modelBuilder.Entity<ExamSession>(entity =>
        {
            entity.ToTable("ExamSessions");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<ExamResult>(entity =>
        {
            entity.ToTable("ExamResults");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<QuestionItem>(entity =>
        {
            entity.ToTable("QuestionItems");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<GradebookRecord>(entity =>
        {
            entity.ToTable("GradebookRecords");
            entity.HasKey(e => e.Id);
        });

        base.OnModelCreating(modelBuilder);
    }
}