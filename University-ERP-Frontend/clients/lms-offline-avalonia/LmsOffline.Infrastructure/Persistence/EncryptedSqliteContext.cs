namespace LmsOffline.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;

/// <summary>
/// Database context for the local Avalonia application using encrypted SQLite (SQLCipher).
/// Handles the mapping of Domain Aggregates to the secure local device storage.
/// </summary>
public sealed class EncryptedSqliteContext : DbContext
{
    private readonly string _databasePath;
    private readonly string _encryptionKey;

    // Aggregate Roots
    public DbSet<OfflineModule> Modules { get; set; } = null!;
    public DbSet<OfflineAssessment> Assessments { get; set; } = null!;
    public DbSet<OfflineAssignment> Assignments { get; set; } = null!;

    public EncryptedSqliteContext(string databasePath, string encryptionKey)
    {
        _databasePath = databasePath;
        _encryptionKey = encryptionKey;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Using SQLite with a Password parameter strictly enforces SQLCipher encryption
        var connectionString = $"Data Source={_databasePath};Password={_encryptionKey};";
        optionsBuilder.UseSqlite(connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Configure OfflineModule Table
        modelBuilder.Entity<OfflineModule>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CourseName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ModuleTitle).IsRequired().HasMaxLength(200);
        });

        // 2. Configure OfflineAssessment Table
        modelBuilder.Entity<OfflineAssessment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            
            // Map the AvailabilityWindow Value Object as an owned type (flattened into columns)
            entity.OwnsOne(e => e.Window, window =>
            {
                window.Property(w => w.StartTimeUtc).HasColumnName("WindowStartUtc").IsRequired();
                window.Property(w => w.EndTimeUtc).HasColumnName("WindowEndUtc").IsRequired();
            });

            entity.Property(e => e.SyncState)
                .HasConversion<string>()
                .IsRequired();
        });

        // 3. Configure OfflineAssignment Table
        modelBuilder.Entity<OfflineAssignment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            
            // Map the AvailabilityWindow Value Object
            entity.OwnsOne(e => e.Window, window =>
            {
                window.Property(w => w.StartTimeUtc).HasColumnName("WindowStartUtc").IsRequired();
                window.Property(w => w.EndTimeUtc).HasColumnName("WindowEndUtc").IsRequired();
            });
            
            // Map the SyncStatus Enum explicitly to strings for database readability
            entity.Property(e => e.SyncState)
                .HasConversion<string>()
                .IsRequired();
        });
    }
}
