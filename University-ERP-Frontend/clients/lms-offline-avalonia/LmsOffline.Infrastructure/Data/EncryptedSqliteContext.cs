namespace LmsOffline.Infrastructure.Data;

using System;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;

#region Context
/// <summary>
/// Database context for the local Avalonia application using encrypted SQLite.
/// </summary>
public class EncryptedSqliteContext : DbContext
{
    private readonly string _databasePath;
    private readonly string _encryptionKey;

    public DbSet<OfflineAssessment> Assessments { get; set; } = null!;

    public EncryptedSqliteContext(string databasePath, string encryptionKey)
    {
        _databasePath = databasePath;
        _encryptionKey = encryptionKey;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Using SQLite with a password connection string for encryption
        var connectionString = $"Data Source={_databasePath};Password={_encryptionKey};";
        optionsBuilder.UseSqlite(connectionString);
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure the entity mapping for the database table
        modelBuilder.Entity<OfflineAssessment>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            // Configure the AvailabilityWindow Value Object as an owned type
            // This stores StartTimeUtc and EndTimeUtc in the same table as the Assessment
            entity.OwnsOne(e => e.Window, window =>
            {
                window.Property(w => w.StartTimeUtc).IsRequired();
                window.Property(w => w.EndTimeUtc).IsRequired();
            });

            entity.Property(e => e.SyncState)
                .HasConversion<string>()
                .IsRequired();
        });
    }
}
#endregion
