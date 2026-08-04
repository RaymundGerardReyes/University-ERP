namespace IdentityAccess.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

/// <summary>
/// Provides a design-time instance of IdentityAccessDbContext for EF Core tooling.
/// This is used by `dotnet ef migrations add` and is NEVER invoked at runtime.
/// The connection string here is only used locally for migration generation.
/// </summary>
public sealed class IdentityAccessDbContextDesignTimeFactory
    : IDesignTimeDbContextFactory<IdentityAccessDbContext>
{
    public IdentityAccessDbContext CreateDbContext(string[] args)
    {
        // Read the connection string from the environment (injected by dotenvx)
        // or fall back to a sensible local default for developers who run migrations
        // without dotenvx (e.g., via a direct local Postgres instance).
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=university_erp;Username=erp_admin;Password=dev_password";

        var options = new DbContextOptionsBuilder<IdentityAccessDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new IdentityAccessDbContext(options);
    }
}
