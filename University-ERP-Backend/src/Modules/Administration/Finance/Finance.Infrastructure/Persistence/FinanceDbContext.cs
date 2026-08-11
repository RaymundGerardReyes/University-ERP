namespace Finance.Infrastructure.Persistence;

using Finance.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;

public sealed class FinanceDbContext : DbContext
{
    public FinanceDbContext(DbContextOptions<FinanceDbContext> options)
        : base(options)
    {
    }

    public DbSet<StudentBilling> StudentBillings => Set<StudentBilling>();
    
    // NEW: Add the CashTransaction DbSet
    public DbSet<CashTransaction> CashTransactions => Set<CashTransaction>();

    // NEW: Add the PaymentSession DbSet
    public DbSet<PaymentSession> PaymentSessions => Set<PaymentSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("finance");

        modelBuilder.Entity<StudentBilling>(entity =>
        {
            entity.ToTable("StudentBillings");
            entity.HasKey(e => e.Id);
            // ... existing StudentBilling configurations
        });

        // NEW: CashTransaction mapping
        modelBuilder.Entity<CashTransaction>(entity =>
        {
            entity.ToTable("CashTransactions");
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.TransactionToken)
                  .IsRequired()
                  .HasMaxLength(50);

            // We query heavily by the token, so it requires a unique index
            entity.HasIndex(e => e.TransactionToken).IsUnique();

            entity.Property(e => e.ReferenceId)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Amount)
                  .IsRequired()
                  .HasColumnType("numeric(18,2)"); // Precision for currency

            entity.Property(e => e.Status)
                  .IsRequired()
                  .HasMaxLength(30)
                  .HasDefaultValue("Pending");

            entity.Property(e => e.CreatedOnUtc)
                  .IsRequired();

            entity.Property(e => e.CompletedOnUtc)
                  .IsRequired(false);
        });

        // NEW: PaymentSession mapping
        modelBuilder.Entity<PaymentSession>(entity =>
        {
            entity.ToTable("PaymentSessions");
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.SessionId)
                  .IsRequired()
                  .HasMaxLength(100);
                  
            entity.HasIndex(e => e.SessionId).IsUnique();
            
            entity.Property(e => e.InvoiceId)
                  .IsRequired()
                  .HasMaxLength(100);
                  
            entity.Property(e => e.ApplicantId)
                  .IsRequired()
                  .HasMaxLength(100);
                  
            entity.Property(e => e.Amount)
                  .IsRequired()
                  .HasColumnType("numeric(18,2)");

            entity.Property(e => e.Purpose)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Status)
                  .IsRequired()
                  .HasMaxLength(30)
                  .HasDefaultValue("Active");
                  
            entity.Property(e => e.Currency)
                  .IsRequired()
                  .HasMaxLength(10)
                  .HasDefaultValue("PHP");

            entity.Property(e => e.CreatedAtUtc).IsRequired();
            entity.Property(e => e.ExpiresAtUtc).IsRequired();
            entity.Property(e => e.ConsumedAtUtc).IsRequired(false);
        });

        base.OnModelCreating(modelBuilder);
    }
}