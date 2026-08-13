namespace Finance.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

/// <summary>
/// Provides a design-time instance of FinanceDbContext for EF Core tooling.
/// </summary>
public sealed class FinanceDbContextDesignTimeFactory : IDesignTimeDbContextFactory<FinanceDbContext>
{
    public FinanceDbContext CreateDbContext(string[] args)
    {
        var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
        var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
        var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "university_erp";
        var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "erp_admin";
        var dbPass = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "dev_password";

        // Fall back to a dynamically constructed string from .env for developers generating migrations locally
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";

        var options = new DbContextOptionsBuilder<FinanceDbContext>()
            .UseNpgsql(connectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory", "finance"))
            .Options;

        return new FinanceDbContext(options);
    }
}