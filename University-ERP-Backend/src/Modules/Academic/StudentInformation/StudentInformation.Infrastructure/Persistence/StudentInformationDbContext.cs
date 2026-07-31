namespace StudentInformation.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using StudentInformation.Domain.Aggregates;

/// <summary>
/// The isolated Entity Framework database context for the Student Information module.
/// </summary>
public sealed class StudentInformationDbContext : DbContext
{
    public StudentInformationDbContext(DbContextOptions<StudentInformationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Automatically apply the StudentConfiguration we just wrote
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(StudentInformationDbContext).Assembly);
        
        base.OnModelCreating(modelBuilder);
    }
}
