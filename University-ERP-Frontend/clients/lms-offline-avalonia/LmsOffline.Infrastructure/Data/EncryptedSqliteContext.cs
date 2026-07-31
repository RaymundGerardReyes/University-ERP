namespace LmsOffline.Infrastructure.Data;

using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;

public class EncryptedSqliteContext : DbContext
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
        optionsBuilder.UseSqlite($"Data Source={_databasePath};Password={_encryptionKey};");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OfflineAssessment>().OwnsOne(e => e.Window);
        modelBuilder.Entity<OfflineAssignment>().OwnsOne(e => e.Window);
    }
}
