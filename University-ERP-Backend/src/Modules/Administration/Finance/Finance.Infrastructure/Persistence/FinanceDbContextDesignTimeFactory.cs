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
        // Fall back to a local default for developers generating migrations locally
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=university_erp;Username=erp_admin;Password=dev_password";

        var options = new DbContextOptionsBuilder<FinanceDbContext>()
            .UseNpgsql(connectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory", "finance"))
            .Options;

        return new FinanceDbContext(options);
    }
}