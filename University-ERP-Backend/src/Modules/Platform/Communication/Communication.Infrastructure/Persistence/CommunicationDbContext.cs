namespace Communication.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Communication.Domain.Aggregates;

public sealed class CommunicationDbContext : DbContext
{
    public CommunicationDbContext(DbContextOptions<CommunicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<DirectMessage> DirectMessages => Set<DirectMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("platform_communication");

        modelBuilder.Entity<DirectMessage>(entity =>
        {
            entity.ToTable("DirectMessages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SenderId).IsRequired();
            entity.Property(e => e.ReceiverId).IsRequired();
            entity.Property(e => e.Content).IsRequired();
        });

        base.OnModelCreating(modelBuilder);
    }
}