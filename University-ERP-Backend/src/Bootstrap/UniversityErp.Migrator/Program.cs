using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using StudentInformation.Infrastructure;
using StudentInformation.Infrastructure.Persistence;
using IdentityAccess.Infrastructure.Persistence;
using Admissions.Infrastructure.Persistence;

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

        services.AddDbContext<StudentInformationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddDbContext<IdentityAccessDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddDbContext<AdmissionsDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Store the connection string for raw SQL usage
        services.AddSingleton(new RawConnectionString(connectionString));
    })
    .Build();

var logger = host.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("University ERP Migrator starting...");

try
{
    await RunMigrationsAsync<StudentInformationDbContext>(host.Services, logger);

    // IdentityAccess: use raw SQL to guarantee the identity schema and Users table
    // are created. EnsureCreatedAsync() is unreliable when other tables already exist.
    await CreateIdentitySchemaAsync(host.Services, logger);

    await CreateAdmissionsSchemaAsync(host.Services, logger);

    logger.LogInformation("All migrations applied successfully. Migrator exiting.");
}
catch (Exception ex)
{
    Console.WriteLine("CRITICAL ERROR DURING MIGRATION:");
    Console.WriteLine(ex.ToString());
    Environment.Exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: apply EF migration files (requires migration files in assembly)
// ─────────────────────────────────────────────────────────────────────────────
static async Task RunMigrationsAsync<TContext>(IServiceProvider services, ILogger logger)
    where TContext : DbContext
{
    await using var scope = services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<TContext>();

    Console.WriteLine($"Applying pending EF migrations for {typeof(TContext).Name}...");
    await db.Database.MigrateAsync();
    Console.WriteLine($"All migrations applied for {typeof(TContext).Name}.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: directly create identity schema and Users table via raw SQL.
// EnsureCreatedAsync() is skipped when ANY tables exist in the DB — so we
// use explicit DDL instead. All statements are idempotent (IF NOT EXISTS).
// ─────────────────────────────────────────────────────────────────────────────
static async Task CreateIdentitySchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring identity schema and Users table exist via raw SQL...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        -- 1. Create the identity schema if it doesn't already exist
        CREATE SCHEMA IF NOT EXISTS identity;

        -- 2. Create the Users table if it doesn't already exist
        CREATE TABLE IF NOT EXISTS identity."Users" (
            "Id"           UUID         NOT NULL DEFAULT gen_random_uuid(),
            "Email"        VARCHAR(256) NOT NULL,
            "PasswordHash" TEXT         NOT NULL,
            "FirstName"    VARCHAR(100) NOT NULL,
            "LastName"     VARCHAR(100) NOT NULL,
            "IsActive"     BOOLEAN      NOT NULL DEFAULT TRUE,
            "CreatedOnUtc" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
            CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
        );

        -- 3. Unique index on Email
        CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Email"
            ON identity."Users" ("Email");
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("identity.\"Users\" table is ready.");
}

static async Task CreateAdmissionsSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring admissions schema and tables exist via raw SQL...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS admissions;

        CREATE TABLE IF NOT EXISTS admissions."ProgramOfferings" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "College" VARCHAR(256) NOT NULL,
            "Degree" VARCHAR(256) NOT NULL,
            "Major" VARCHAR(256) NOT NULL,
            "Duration" VARCHAR(100) NOT NULL,
            "Intake" VARCHAR(100) NOT NULL,
            "TuitionEstimate" VARCHAR(100) NOT NULL,
            "Tags" JSONB
        );

        CREATE TABLE IF NOT EXISTS admissions."Applications" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "ApplicantId" VARCHAR(256) NOT NULL,
            "ProgramId" VARCHAR(50) NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "SubmittedDate" TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS admissions."AdmissionDocument" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "AdmissionApplicationId" VARCHAR(50) NOT NULL,
            "Name" VARCHAR(256) NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "Feedback" TEXT,
            "UploadedAt" TIMESTAMPTZ,
            CONSTRAINT "FK_AdmissionDocument_Applications" FOREIGN KEY ("AdmissionApplicationId") REFERENCES admissions."Applications" ("Id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS admissions."ApplicationTimelineEvent" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "AdmissionApplicationId" VARCHAR(50) NOT NULL,
            "Title" VARCHAR(256) NOT NULL,
            "Description" TEXT NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "DateCompleted" TIMESTAMPTZ,
            CONSTRAINT "FK_ApplicationTimelineEvent_Applications" FOREIGN KEY ("AdmissionApplicationId") REFERENCES admissions."Applications" ("Id") ON DELETE CASCADE
        );
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("admissions schema and tables are ready.");
}

// Simple wrapper to carry the connection string through DI
record RawConnectionString(string Value);
