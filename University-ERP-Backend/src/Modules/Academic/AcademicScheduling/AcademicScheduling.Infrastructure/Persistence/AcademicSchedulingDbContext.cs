namespace AcademicScheduling.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using AcademicScheduling.Domain.Aggregates;

public sealed class AcademicSchedulingDbContext : DbContext
{
    public AcademicSchedulingDbContext(DbContextOptions<AcademicSchedulingDbContext> options)
        : base(options)
    {
    }

    // Expose the Aggregate Root
    public DbSet<ClassSession> ClassSessions => Set<ClassSession>();
    public DbSet<CourseSection> CourseSections => Set<CourseSection>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<RoomAllocation> RoomAllocations => Set<RoomAllocation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // The DBMA Pattern: Strict isolation into its own schema
        modelBuilder.HasDefaultSchema("academic_scheduling");

        modelBuilder.Entity<ClassSession>(entity =>
        {
            entity.ToTable("ClassSessions");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<CourseSection>(entity =>
        {
            entity.ToTable("CourseSections");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<AttendanceRecord>(entity =>
        {
            entity.ToTable("AttendanceRecords");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Data).HasColumnType("jsonb");
        });

        modelBuilder.Entity<RoomAllocation>(entity =>
        {
            entity.ToTable("RoomAllocations");
            entity.HasKey(e => e.Id);
        });

        base.OnModelCreating(modelBuilder);
    }
}