namespace LmsOffline.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;

public sealed class EncryptedSqliteContext : DbContext
{
    private readonly string _databasePath;
    private readonly string _encryptionKey;

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
        // Enforce SQLCipher AES-256 encryption via connection string
        optionsBuilder.UseSqlite($"Data Source={_databasePath};Password={_encryptionKey};");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OfflineModule>().HasKey(e => e.Id);

        modelBuilder.Entity<OfflineAssessment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.OwnsOne(e => e.Window); // Flattens Start/End time into the table
            entity.Property(e => e.SyncState).HasConversion<string>();
        });

        modelBuilder.Entity<OfflineAssignment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.OwnsOne(e => e.Window);
            entity.Property(e => e.SyncState).HasConversion<string>();
        });
    }
}