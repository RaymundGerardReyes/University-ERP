namespace Curriculum.Infrastructure.Persistence;

using Curriculum.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;

public sealed class CurriculumDbContext : DbContext
{
    public CurriculumDbContext(DbContextOptions<CurriculumDbContext> options) : base(options)
    {
    }

    public DbSet<CourseDefinition> Courses { get; set; } = null!;
    public DbSet<PrerequisiteRule> Prerequisites { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CourseDefinition>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Code).IsRequired().HasMaxLength(20);
            
            entity.HasMany(c => c.Prerequisites)
                  .WithOne()
                  .HasForeignKey("CourseDefinitionId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PrerequisiteRule>(entity =>
        {
            entity.HasKey(p => p.Id);
        });
    }
}
