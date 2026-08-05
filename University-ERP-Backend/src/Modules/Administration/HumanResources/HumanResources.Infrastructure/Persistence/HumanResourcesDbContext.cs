namespace HumanResources.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using HumanResources.Domain.Aggregates;

public sealed class HumanResourcesDbContext : DbContext
{
    public HumanResourcesDbContext(DbContextOptions<HumanResourcesDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Pattern: Fencing off HR data
        modelBuilder.HasDefaultSchema("hr");

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.ToTable("Employees");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
        });

        base.OnModelCreating(modelBuilder);
    }
}