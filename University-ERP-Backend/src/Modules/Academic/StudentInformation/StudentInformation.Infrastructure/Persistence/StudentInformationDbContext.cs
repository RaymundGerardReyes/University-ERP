// Example: src/Modules/Academic/StudentInformation/StudentInformation.Infrastructure/Persistence/StudentInformationDbContext.cs
namespace StudentInformation.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using StudentInformation.Domain.Aggregates;

public sealed class StudentInformationDbContext : DbContext
{
    public StudentInformationDbContext(DbContextOptions<StudentInformationDbContext> options)
        : base(options) { }

    public DbSet<Student> Students => Set<Student>();
    public DbSet<FacultyAdvisee> FacultyAdvisees => Set<FacultyAdvisee>();
    public DbSet<StudentAcademicRecord> AcademicRecords => Set<StudentAcademicRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Rule: Explicitly map tables to specific schemas to prevent overlap
        modelBuilder.Entity<FacultyAdvisee>(entity =>
        {
            entity.ToTable("FacultyAdvisees", "advising");
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<StudentAcademicRecord>(entity =>
        {
            entity.ToTable("StudentAcademicRecords", "academic");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.StudentId).IsRequired();
            entity.OwnsMany(e => e.CourseRecords, cr =>
            {
                cr.ToTable("CourseGradeRecords", "academic");
                cr.WithOwner().HasForeignKey("StudentAcademicRecordId");
                cr.HasKey(c => c.Id);
            });
        });

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(StudentInformationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}