namespace Assessments.Infrastructure.Persistence;

using Assessments.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;

public sealed class AssessmentsDbContext : DbContext
{
    public AssessmentsDbContext(DbContextOptions<AssessmentsDbContext> options) : base(options)
    {
    }

    public DbSet<Gradebook> Gradebooks { get; set; } = null!;
    public DbSet<StudentGradeRecord> StudentGradeRecords { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Gradebook Aggregate Root Configuration
        modelBuilder.Entity<Gradebook>(entity =>
        {
            entity.HasKey(g => g.Id);
            entity.Property(g => g.SectionId).IsRequired().HasMaxLength(50);
            entity.Property(g => g.Status).IsRequired().HasMaxLength(20);

            // Configure the one-to-many relationship with StudentGradeRecord
            entity.HasMany(g => g.Roster)
                  .WithOne()
                  .HasForeignKey("GradebookId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // StudentGradeRecord Entity Configuration
        modelBuilder.Entity<StudentGradeRecord>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.StudentId).IsRequired().HasMaxLength(50);
            entity.Property(s => s.FinalGrade).HasColumnType("decimal(5,2)"); // Allow nulls for pending grades
            entity.Property(s => s.Status).IsRequired().HasMaxLength(20);
        });
    }
}
