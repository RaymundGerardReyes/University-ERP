namespace Admissions.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Admissions.Domain.Aggregates;
using Admissions.Domain.Entities;

public sealed class AdmissionsDbContext : DbContext
{
    public AdmissionsDbContext(DbContextOptions<AdmissionsDbContext> options)
        : base(options)
    {
    }

    // Expose the Aggregate Roots
    public DbSet<AdmissionApplication> Applications => Set<AdmissionApplication>();
    public DbSet<ProgramOffering> ProgramOfferings => Set<ProgramOffering>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Pattern: Strictly isolate all tables into the 'admissions' schema
        modelBuilder.HasDefaultSchema("admissions");

        modelBuilder.Entity<AdmissionApplication>(entity =>
        {
            entity.ToTable("AdmissionApplications");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ApplicantId).IsRequired();
            entity.Property(e => e.ProgramId).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            
            // Map the collections for the Aggregate Root
            entity.HasMany(e => e.Documents)
                  .WithOne()
                  .HasForeignKey(e => e.AdmissionApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.TimelineEvents)
                  .WithOne()
                  .HasForeignKey(e => e.AdmissionApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AdmissionDocument>(entity =>
        {
            entity.ToTable("AdmissionDocuments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Status).IsRequired();
        });

        modelBuilder.Entity<ApplicationTimelineEvent>(entity =>
        {
            entity.ToTable("ApplicationTimelineEvents");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Status).IsRequired();
        });

        modelBuilder.Entity<ProgramOffering>(entity =>
        {
            entity.ToTable("ProgramOfferings");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.College).IsRequired();
            entity.Property(e => e.Degree).IsRequired();
            entity.Property(e => e.Major).IsRequired();
            
            // Store the list of strings natively using PostgreSQL JSONB
            entity.Property(e => e.Tags).HasColumnType("jsonb");
        });

        base.OnModelCreating(modelBuilder);
    }
}