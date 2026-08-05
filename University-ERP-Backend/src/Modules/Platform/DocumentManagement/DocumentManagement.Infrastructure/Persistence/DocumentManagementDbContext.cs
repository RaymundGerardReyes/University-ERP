namespace DocumentManagement.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using DocumentManagement.Domain.Aggregates;

public sealed class DocumentManagementDbContext : DbContext
{
    public DocumentManagementDbContext(DbContextOptions<DocumentManagementDbContext> options)
        : base(options)
    {
    }

    public DbSet<CorporateDocument> Documents => Set<CorporateDocument>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("platform");

        modelBuilder.Entity<CorporateDocument>(entity =>
        {
            entity.ToTable("Documents");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.FilePath).IsRequired();
        });

        base.OnModelCreating(modelBuilder);
    }
}