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
using LearningManagement.Infrastructure.Persistence;
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
        var connectionString = context.Configuration.GetConnectionString("DefaultConnection");

        // [Local Native Dev Fallback] Dynamically construct DefaultConnection from .env variables
        if (string.IsNullOrEmpty(connectionString))
        {
            var dbHost = context.Configuration["DB_HOST"] ?? "localhost";
            var dbPort = context.Configuration["DB_PORT"] ?? "5432";
            var dbName = context.Configuration["DB_NAME"];
            var dbUser = context.Configuration["DB_USER"];
            var dbPass = context.Configuration["DB_PASSWORD"];

            if (!string.IsNullOrEmpty(dbName))
            {
                connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";
            }
        }

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("ConnectionStrings__DefaultConnection environment variable is not set and could not be dynamically constructed.");
        }

        services.AddDbContext<StudentInformationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddDbContext<IdentityAccessDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddDbContext<AdmissionsDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddDbContext<LearningManagementDbContext>(options =>
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
    await CreateLearningManagementSchemaAsync(host.Services, logger);
    await CreateAcademicSchedulingSchemaAsync(host.Services, logger);
    await CreateExaminationSchemaAsync(host.Services, logger);
    await CreateAdvisingSchemaAsync(host.Services, logger);
    await CreatePlatformSchemaAsync(host.Services, logger);

    await SeedDefaultUsersAsync(host.Services, logger);

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

static async Task CreateLearningManagementSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring lms schema and tables exist via raw SQL...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS lms;

        CREATE TABLE IF NOT EXISTS lms."Assessments" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "Title" VARCHAR(200) NOT NULL,
            "DueDateUtc" TIMESTAMPTZ NOT NULL,
            "MaxScore" INT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS lms."ClassPerformance" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "FacultyId" UUID NOT NULL,
            "CourseCode" VARCHAR(50) NOT NULL,
            "AverageGrade" DECIMAL(5,2) NOT NULL,
            "PassRate" DECIMAL(5,2) NOT NULL,
            "AtRiskCount" INT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS lms."OfflineAssessmentSubmissions" (
            "AssessmentId" UUID NOT NULL PRIMARY KEY,
            "StudentId" UUID NOT NULL,
            "CourseCode" VARCHAR(20) NOT NULL,
            "ModuleTitle" VARCHAR(200) NOT NULL,
            "AnswersJson" JSONB NOT NULL,
            "SubmittedAtUtc" TIMESTAMPTZ NOT NULL,
            "IngestedAtUtc" TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS lms."OfflineAssignmentSubmissions" (
            "AssignmentId" UUID NOT NULL PRIMARY KEY,
            "StudentId" UUID NOT NULL,
            "CourseCode" VARCHAR(20) NOT NULL,
            "AssignmentTitle" VARCHAR(200) NOT NULL,
            "EssayContent" TEXT NOT NULL,
            "SubmittedAtUtc" TIMESTAMPTZ NOT NULL,
            "IngestedAtUtc" TIMESTAMPTZ NOT NULL
        );
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("lms schema and tables are ready.");
}

static async Task CreateAcademicSchedulingSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring academic_scheduling schema and tables exist via raw SQL...");
    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS academic_scheduling;
        CREATE TABLE IF NOT EXISTS academic_scheduling."CourseSections" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "CourseCode" VARCHAR(20) NOT NULL,
            "CourseName" VARCHAR(200) NOT NULL,
            "SectionName" VARCHAR(50) NOT NULL,
            "FacultyId" UUID NOT NULL,
            "Schedule" VARCHAR(100) NOT NULL,
            "Room" VARCHAR(50) NOT NULL,
            "EnrolledCount" INT NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS academic_scheduling."AttendanceRecords" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "SectionId" VARCHAR(50) NOT NULL,
            "Data" JSONB NOT NULL,
            "SubmittedAtUtc" TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS academic_scheduling."RoomAllocations" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "RoomNumber" VARCHAR(50) NOT NULL,
            "CourseCode" VARCHAR(20) NOT NULL,
            "DayOfWeek" VARCHAR(20) NOT NULL,
            "StartTime" TIME NOT NULL,
            "EndTime" TIME NOT NULL,
            "ExpectedCapacity" INT NOT NULL
        );
        """;
    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();
}

static async Task CreateExaminationSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring examination schema and tables exist via raw SQL...");
    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS examination;
        CREATE TABLE IF NOT EXISTS examination."GradebookRecords" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "SectionId" VARCHAR(50) NOT NULL,
            "StudentId" VARCHAR(50) NOT NULL,
            "StudentName" VARCHAR(200) NOT NULL,
            "Prelim" DECIMAL(5,2),
            "Midterm" DECIMAL(5,2),
            "Final" DECIMAL(5,2),
            "Status" VARCHAR(50) NOT NULL
        );
        """;
    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();
}

static async Task CreateAdvisingSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring advising schema and tables exist via raw SQL...");
    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS advising;
        CREATE TABLE IF NOT EXISTS advising."FacultyAdvisees" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "FacultyId" UUID NOT NULL,
            "StudentId" VARCHAR(50) NOT NULL,
            "StudentName" VARCHAR(200) NOT NULL,
            "Program" VARCHAR(100) NOT NULL,
            "DegreeProgress" INT NOT NULL,
            "Status" VARCHAR(50) NOT NULL
        );
        """;
    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();
}

static async Task CreatePlatformSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring platform schema and tables exist via raw SQL...");
    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS platform;
        CREATE TABLE IF NOT EXISTS platform."DirectMessages" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "SenderId" VARCHAR(256) NOT NULL,
            "ReceiverId" VARCHAR(256) NOT NULL,
            "Content" TEXT NOT NULL,
            "SentOnUtc" TIMESTAMPTZ NOT NULL,
            "IsRead" BOOLEAN NOT NULL DEFAULT FALSE
        );
        """;
    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();
}

static async Task SeedDefaultUsersAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Seeding default admin and faculty credentials...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    // 1. Admin Credentials
    var adminEmail = "admin@university.edu";
    var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12);

    // 2. Faculty Credentials
    var facultyEmail = "faculty@university.edu";
    var facultyPasswordHash = BCrypt.Net.BCrypt.HashPassword("Faculty123!", 12);

    var sql = """
        INSERT INTO identity."Users" ("Id", "Email", "PasswordHash", "FirstName", "LastName", "IsActive", "CreatedOnUtc")
        VALUES 
            ('00000000-0000-0000-0000-000000000001', @AdminEmail, @AdminHash, 'System', 'Admin', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000002', @FacultyEmail, @FacultyHash, 'Dr. Sarah', 'Jenkins', TRUE, NOW())
        ON CONFLICT ("Email") DO NOTHING;
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("AdminEmail", adminEmail);
    cmd.Parameters.AddWithValue("AdminHash", adminPasswordHash);
    cmd.Parameters.AddWithValue("FacultyEmail", facultyEmail);
    cmd.Parameters.AddWithValue("FacultyHash", facultyPasswordHash);

    var rows = await cmd.ExecuteNonQueryAsync();
    Console.WriteLine($"Seeded {rows} new default user(s).");
}

// Simple wrapper to carry the connection string through DI
record RawConnectionString(string Value);
