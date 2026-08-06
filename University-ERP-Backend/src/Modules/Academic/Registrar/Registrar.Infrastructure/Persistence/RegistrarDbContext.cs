namespace Registrar.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using global::Registrar.Domain.Aggregates;

public sealed class RegistrarDbContext : DbContext
{
    public RegistrarDbContext(DbContextOptions<RegistrarDbContext> options)
        : base(options)
    {
    }

    public DbSet<CourseRegistration> CourseRegistrations => Set<CourseRegistration>();
    public DbSet<CourseSection> CourseSections => Set<CourseSection>();
    public DbSet<GraduationClearance> GraduationClearances => Set<GraduationClearance>();
    public DbSet<TranscriptRequest> TranscriptRequests => Set<TranscriptRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("registrar");
        
        modelBuilder.Entity<CourseRegistration>().HasKey(x => x.Id);
        modelBuilder.Entity<CourseSection>().HasKey(x => x.Id);
        modelBuilder.Entity<GraduationClearance>().HasKey(x => x.Id);
        modelBuilder.Entity<TranscriptRequest>().HasKey(x => x.Id);
        
        base.OnModelCreating(modelBuilder);
    }
}