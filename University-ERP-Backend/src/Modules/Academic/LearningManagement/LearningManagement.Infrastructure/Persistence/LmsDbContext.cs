namespace LearningManagement.Infrastructure.Persistence;

using LearningManagement.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;

public sealed class LmsDbContext : DbContext
{
    public LmsDbContext(DbContextOptions<LmsDbContext> options) : base(options)
    {
    }

    public DbSet<CourseSyllabus> Syllabi { get; set; } = null!;
    public DbSet<LearningModule> LearningModules { get; set; } = null!;
    public DbSet<ContentItem> ContentItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CourseSyllabus>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.SectionId).IsRequired().HasMaxLength(50);
            
            entity.HasMany(s => s.Modules)
                  .WithOne()
                  .HasForeignKey("CourseSyllabusId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LearningModule>(entity =>
        {
            entity.HasKey(m => m.Id);
            
            entity.HasMany(m => m.ContentItems)
                  .WithOne()
                  .HasForeignKey("LearningModuleId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ContentItem>(entity =>
        {
            entity.HasKey(c => c.Id);
        });
    }
}
