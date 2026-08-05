namespace Finance.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Finance.Domain.Aggregates;

public sealed class FinanceDbContext : DbContext
{
    public FinanceDbContext(DbContextOptions<FinanceDbContext> options)
        : base(options)
    {
    }

    // Expose the Aggregate Root
    public DbSet<StudentBilling> StudentBillings => Set<StudentBilling>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // DBMA Core: Force all tables in this module into the 'finance' schema
        modelBuilder.HasDefaultSchema("finance");

        modelBuilder.Entity<StudentBilling>(entity =>
        {
            entity.ToTable("StudentBillings");
            entity.HasKey(e => e.Id);
            
            // Map Value Objects and Primitives
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PaidAmount).HasColumnType("decimal(18,2)");
        });

        base.OnModelCreating(modelBuilder);
    }
}