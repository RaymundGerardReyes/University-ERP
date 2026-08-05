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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Rule: Explicitly map tables to specific schemas to prevent overlap
        modelBuilder.Entity<Student>().ToTable("Students", "academic");
        
        modelBuilder.Entity<FacultyAdvisee>(entity =>
        {
            entity.ToTable("FacultyAdvisees", "advising");
            entity.HasKey(e => e.Id);
        });

        base.OnModelCreating(modelBuilder);
    }
}