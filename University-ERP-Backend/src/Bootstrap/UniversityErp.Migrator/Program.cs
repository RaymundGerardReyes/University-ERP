using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StudentInformation.Infrastructure;
using StudentInformation.Infrastructure.Persistence;

// ─────────────────────────────────────────────────────────────────────────────
// University ERP – Database Migrator Entry Point
// Applies EF Core migrations for all module DbContexts in sequence.
// Runs once and exits (restart: "no" in docker-compose.yml).
// ─────────────────────────────────────────────────────────────────────────────

var host = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration(config =>
    {
        config.AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        var connectionString = context.Configuration
            .GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "ConnectionStrings__DefaultConnection environment variable is not set.");

        // Register each module's DbContext for migration.
        // Uses Npgsql (PostgreSQL) for all module databases.
        services.AddDbContext<StudentInformationDbContext>(options =>
            options.UseNpgsql(connectionString));
    })
    .Build();

var logger = host.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("University ERP Migrator starting...");

try
{
    await RunMigrationsAsync<StudentInformationDbContext>(host.Services, logger);

    logger.LogInformation("All migrations applied successfully. Migrator exiting.");
}
catch (Exception ex)
{
    Console.WriteLine("CRITICAL ERROR DURING MIGRATION:");
    Console.WriteLine(ex.ToString());
    Environment.Exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: migrate a single DbContext
// ─────────────────────────────────────────────────────────────────────────────
static async Task RunMigrationsAsync<TContext>(IServiceProvider services, ILogger logger)
    where TContext : DbContext
{
    await using var scope = services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<TContext>();
    Console.WriteLine($"Ensuring database schema exists for {typeof(TContext).Name}...");
    await db.Database.EnsureCreatedAsync();
    Console.WriteLine($"Schema ready for {typeof(TContext).Name}.");
}
