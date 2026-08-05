namespace Registrar.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Registrar.Domain.Aggregates;

public sealed class RegistrarDbContext : DbContext
{
    public RegistrarDbContext(DbContextOptions<RegistrarDbContext> options)
        : base(options)
    {
    }

    public DbSet<CourseRegistration> CourseRegistrations => Set<CourseRegistration>();
    public DbSet<GraduationClearance> GraduationClearances => Set<GraduationClearance>();
    public DbSet<TranscriptRequest> TranscriptRequests => Set<TranscriptRequest>();
    public DbSet<CourseSection> CourseSections => Set<CourseSection>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Pattern: Fencing off Registrar data
        modelBuilder.HasDefaultSchema("registrar");

        modelBuilder.Entity<CourseRegistration>(entity =>
        {
            entity.ToTable("CourseRegistrations");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<CourseSection>(entity =>
        {
            entity.ToTable("CourseSections");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<GraduationClearance>(entity =>
        {
            entity.ToTable("GraduationClearances");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<TranscriptRequest>(entity =>
        {
            entity.ToTable("TranscriptRequests");
            entity.HasKey(e => e.Id);
        });

        base.OnModelCreating(modelBuilder);
    }
}