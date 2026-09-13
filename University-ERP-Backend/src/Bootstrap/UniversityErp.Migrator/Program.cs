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
    await CreateFinanceSchemaAsync(host.Services, logger);

    await SeedDefaultUsersAsync(host.Services, logger);
    await SeedProgramOfferingsAsync(host.Services, logger);
    await CreateCurriculumSchemaAsync(host.Services, logger);
    await SeedCurriculumDataAsync(host.Services, logger);
    await SeedBaselineEnrolledStudentAsync(host.Services, logger);

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

        CREATE TABLE IF NOT EXISTS admissions."AdmissionApplications" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "ApplicantId" VARCHAR(256) NOT NULL,
            "ProgramId" VARCHAR(50) NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "SubmittedDate" TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS admissions."AdmissionDocuments" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "AdmissionApplicationId" VARCHAR(50) NOT NULL,
            "Name" VARCHAR(256) NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "Feedback" TEXT,
            "UploadedAt" TIMESTAMPTZ,
            CONSTRAINT "FK_AdmissionDocument_Applications" FOREIGN KEY ("AdmissionApplicationId") REFERENCES admissions."AdmissionApplications" ("Id") ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS admissions."ApplicationTimelineEvents" (
            "Id" VARCHAR(50) NOT NULL PRIMARY KEY,
            "AdmissionApplicationId" VARCHAR(50) NOT NULL,
            "Title" VARCHAR(256) NOT NULL,
            "Description" TEXT NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "DateCompleted" TIMESTAMPTZ,
            CONSTRAINT "FK_ApplicationTimelineEvent_Applications" FOREIGN KEY ("AdmissionApplicationId") REFERENCES admissions."AdmissionApplications" ("Id") ON DELETE CASCADE
        );

        -- Add new columns dynamically if they don't exist
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "SubmittedDate" TIMESTAMPTZ NOT NULL DEFAULT NOW();
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "FacultyRemarks" TEXT NOT NULL DEFAULT '';
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "OfficialStudentId" TEXT NOT NULL DEFAULT '';
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "InterviewDate" TEXT NOT NULL DEFAULT '';
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "InterviewTime" TEXT NOT NULL DEFAULT '';
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "ApplicationFeeStatus" TEXT NOT NULL DEFAULT 'Pending';
        ALTER TABLE admissions."AdmissionApplications" ADD COLUMN IF NOT EXISTS "ApplicationFeeTransactionId" TEXT;
        ALTER TABLE admissions."AdmissionDocuments" ADD COLUMN IF NOT EXISTS "FilePath" TEXT;
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

        CREATE TABLE IF NOT EXISTS examination."ExamSessions" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "AssessmentId" UUID NOT NULL,
            "RoomNumber" VARCHAR(50) NOT NULL,
            "InvigilatorId" UUID NOT NULL,
            "StartTimeUtc" TIMESTAMPTZ NOT NULL,
            "Incidents" JSONB
        );

        -- Add Incidents if missing for legacy databases
        ALTER TABLE examination."ExamSessions" ADD COLUMN IF NOT EXISTS "Incidents" JSONB NOT NULL DEFAULT '[]'::jsonb;

        INSERT INTO examination."ExamSessions" ("Id", "AssessmentId", "RoomNumber", "InvigilatorId", "StartTimeUtc", "Incidents")
        VALUES 
            (gen_random_uuid(), gen_random_uuid(), 'Room 101', '00000000-0000-0000-0000-000000000002', NOW() + INTERVAL '1 day', '[]'::jsonb),
            (gen_random_uuid(), gen_random_uuid(), 'Room 102', '00000000-0000-0000-0000-000000000002', NOW() + INTERVAL '2 days', '[]'::jsonb)
        ON CONFLICT ("Id") DO NOTHING;
        """;
    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();
}

static async Task CreateFinanceSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring finance schema and tables exist via raw SQL...");
    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS finance;
        CREATE TABLE IF NOT EXISTS finance."StudentBillings" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "StudentId" UUID NOT NULL,
            "TotalAmount" DECIMAL(18,2) NOT NULL,
            "PaidAmount" DECIMAL(18,2) NOT NULL,
            "Description" TEXT NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "IssuedOnUtc" TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS finance."CashTransactions" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "TransactionToken" VARCHAR(50) NOT NULL,
            "ReferenceId" VARCHAR(100) NOT NULL,
            "Amount" NUMERIC(18,2) NOT NULL,
            "Status" VARCHAR(30) NOT NULL DEFAULT 'Pending',
            "CreatedOnUtc" TIMESTAMPTZ NOT NULL,
            "CompletedOnUtc" TIMESTAMPTZ
        );

        CREATE UNIQUE INDEX IF NOT EXISTS "IX_CashTransactions_TransactionToken" ON finance."CashTransactions" ("TransactionToken");

        CREATE TABLE IF NOT EXISTS finance."PaymentSessions" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "SessionId" VARCHAR(100) NOT NULL,
            "InvoiceId" VARCHAR(100) NOT NULL,
            "ApplicantId" VARCHAR(100) NOT NULL,
            "Amount" NUMERIC(18,2) NOT NULL,
            "Currency" VARCHAR(10) NOT NULL DEFAULT 'PHP',
            "Purpose" VARCHAR(100) NOT NULL,
            "Status" VARCHAR(30) NOT NULL DEFAULT 'Active',
            "CreatedAtUtc" TIMESTAMPTZ NOT NULL,
            "ExpiresAtUtc" TIMESTAMPTZ NOT NULL,
            "ConsumedAtUtc" TIMESTAMPTZ
        );

        CREATE UNIQUE INDEX IF NOT EXISTS "IX_PaymentSessions_SessionId" ON finance."PaymentSessions" ("SessionId");

        -- Add new columns dynamically if they don't exist
        ALTER TABLE finance."PaymentSessions" ADD COLUMN IF NOT EXISTS "BankReference" TEXT;
        ALTER TABLE finance."PaymentSessions" ADD COLUMN IF NOT EXISTS "GatewayTransactionId" TEXT;
        ALTER TABLE finance."PaymentSessions" ADD COLUMN IF NOT EXISTS "IdempotencyKey" TEXT;

        INSERT INTO finance."StudentBillings" ("Id", "StudentId", "TotalAmount", "PaidAmount", "Description", "Status", "IssuedOnUtc")
        VALUES 
            (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 4500.00, 0.00, 'Fall 2026 Tuition', 'Pending', NOW()),
            (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', 50.00, 50.00, 'Application Fee', 'Paid', NOW() - INTERVAL '5 days')
        ON CONFLICT ("Id") DO NOTHING;
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
        CREATE SCHEMA IF NOT EXISTS platform_communication;
        CREATE TABLE IF NOT EXISTS platform_communication."DirectMessages" (
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
    Console.WriteLine("Seeding default credentials...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var adminEmail = "admin@university.edu";
    var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12);

    var facultyEmail = "faculty@university.edu";
    var facultyPasswordHash = BCrypt.Net.BCrypt.HashPassword("Faculty123!", 12);

    var admissionsEmail = "admissions@university.edu";
    var admissionsPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admissions123!", 12);

    var applicantEmail = "applicant@university.edu";
    var applicantPasswordHash = BCrypt.Net.BCrypt.HashPassword("Applicant123!", 12);

    var financeEmail = "finance@university.edu";
    var financePasswordHash = BCrypt.Net.BCrypt.HashPassword("Finance123!", 12);

    var registrarEmail = "registrar@university.edu";
    var registrarPasswordHash = BCrypt.Net.BCrypt.HashPassword("Registrar123!", 12);

    var alexEmail = "alex.rivera@university.edu";
    var alexPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123", 12);

    var studentEmail = "student@university.edu";
    var studentPasswordHash = BCrypt.Net.BCrypt.HashPassword("Student123!", 12);

    var sql = """
        INSERT INTO identity."Users" ("Id", "Email", "PasswordHash", "FirstName", "LastName", "IsActive", "CreatedOnUtc")
        VALUES 
            ('00000000-0000-0000-0000-000000000001', @AdminEmail, @AdminHash, 'System', 'Admin', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000002', @FacultyEmail, @FacultyHash, 'Dr. Sarah', 'Jenkins', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000003', @AdmissionsEmail, @AdmissionsHash, 'Admissions', 'Officer', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000004', @ApplicantEmail, @ApplicantHash, 'John', 'Doe', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000005', @FinanceEmail, @FinanceHash, 'Finance', 'Cashier', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000006', @RegistrarEmail, @RegistrarHash, 'Registrar', 'Admin', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000007', @AlexEmail, @AlexHash, 'Alex', 'Rivera', TRUE, NOW()),
            ('00000000-0000-0000-0000-000000000008', @StudentEmail, @StudentHash, 'Alexandria', 'Vance', TRUE, NOW())
        ON CONFLICT ("Email") DO NOTHING;
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("AdminEmail", adminEmail);
    cmd.Parameters.AddWithValue("AdminHash", adminPasswordHash);
    cmd.Parameters.AddWithValue("FacultyEmail", facultyEmail);
    cmd.Parameters.AddWithValue("FacultyHash", facultyPasswordHash);
    cmd.Parameters.AddWithValue("AdmissionsEmail", admissionsEmail);
    cmd.Parameters.AddWithValue("AdmissionsHash", admissionsPasswordHash);
    cmd.Parameters.AddWithValue("ApplicantEmail", applicantEmail);
    cmd.Parameters.AddWithValue("ApplicantHash", applicantPasswordHash);
    cmd.Parameters.AddWithValue("FinanceEmail", financeEmail);
    cmd.Parameters.AddWithValue("FinanceHash", financePasswordHash);
    cmd.Parameters.AddWithValue("RegistrarEmail", registrarEmail);
    cmd.Parameters.AddWithValue("RegistrarHash", registrarPasswordHash);
    cmd.Parameters.AddWithValue("AlexEmail", alexEmail);
    cmd.Parameters.AddWithValue("AlexHash", alexPasswordHash);
    cmd.Parameters.AddWithValue("StudentEmail", studentEmail);
    cmd.Parameters.AddWithValue("StudentHash", studentPasswordHash);

    var rows = await cmd.ExecuteNonQueryAsync();
    Console.WriteLine($"Seeded {rows} new default user(s).");
}

static async Task SeedBaselineEnrolledStudentAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Seeding baseline enrolled student STU-2026-0042...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var studentUserId = Guid.Parse("00000000-0000-0000-0000-000000000008");
    var studentEntityId = Guid.Parse("00000000-0000-0000-0000-000000000042");

    var sql = """
        CREATE SCHEMA IF NOT EXISTS academic;
        CREATE TABLE IF NOT EXISTS academic."Students" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "IdentityUserId" UUID NOT NULL,
            "EnrollmentNumber" VARCHAR(20) NOT NULL,
            "Status" VARCHAR(50) NOT NULL,
            "EnrolledOnUtc" TIMESTAMPTZ NOT NULL
        );

        CREATE UNIQUE INDEX IF NOT EXISTS "IX_Students_EnrollmentNumber" ON academic."Students" ("EnrollmentNumber");

        CREATE TABLE IF NOT EXISTS academic."StudentAcademicRecords" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "StudentId" VARCHAR(50) NOT NULL,
            "CumulativeGpa" NUMERIC(5,2) NOT NULL DEFAULT 0.00,
            "TotalEarnedUnits" INT NOT NULL DEFAULT 0,
            "AcademicStanding" VARCHAR(50) NOT NULL DEFAULT 'GOOD',
            "GraduationStatus" VARCHAR(50) NOT NULL DEFAULT 'Not Eligible'
        );

        CREATE TABLE IF NOT EXISTS academic."CourseGradeRecords" (
            "Id" UUID NOT NULL PRIMARY KEY,
            "StudentAcademicRecordId" UUID NOT NULL,
            "SectionId" VARCHAR(100) NOT NULL,
            "CourseCode" VARCHAR(50) NOT NULL,
            "Credits" INT NOT NULL,
            "Grade" NUMERIC(5,2)
        );

        INSERT INTO academic."Students" ("Id", "IdentityUserId", "EnrollmentNumber", "Status", "EnrolledOnUtc")
        VALUES (@StudentEntityId, @StudentUserId, 'STU-2026-0042', 'Active', NOW())
        ON CONFLICT ("EnrollmentNumber") DO NOTHING;

        INSERT INTO academic."StudentAcademicRecords" ("Id", "StudentId", "CumulativeGpa", "TotalEarnedUnits", "AcademicStanding", "GraduationStatus")
        VALUES (@StudentEntityId, 'STU-2026-0042', 3.85, 45, 'GOOD', 'Not Eligible')
        ON CONFLICT ("Id") DO NOTHING;

        INSERT INTO finance."StudentBillings" ("Id", "StudentId", "TotalAmount", "PaidAmount", "Description", "Status", "IssuedOnUtc")
        VALUES (@StudentEntityId, @StudentEntityId, 3500.00, 3500.00, 'AY 2026-2027 Fall Tuition & Fees', 'Cleared', NOW() - INTERVAL '30 days')
        ON CONFLICT ("Id") DO NOTHING;
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("StudentEntityId", studentEntityId);
    cmd.Parameters.AddWithValue("StudentUserId", studentUserId);

    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Baseline enrolled student STU-2026-0042 seeded successfully.");
}

static async Task SeedProgramOfferingsAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Seeding program offerings...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        INSERT INTO admissions."ProgramOfferings" ("Id", "College", "Degree", "Major", "Duration", "Intake", "TuitionEstimate", "Tags")
        VALUES 
            ('BSCS',    'College of Computer Studies',         'B.S.', 'Computer Science',                                    '4 Years', 'Fall / Spring', '₱45,000 / sem', '["STEM", "Computing", "AI", "Software"]'::jsonb),
            ('BSMA',    'College of Business and Accountancy', 'B.S.', 'Management Accounting',                               '4 Years', 'Fall / Spring', '₱42,000 / sem', '["Business", "Accounting", "Management"]'::jsonb),
            ('BSBA-FM', 'College of Business and Accountancy', 'B.S.', 'Business Administration major in Financial Management','4 Years', 'Fall / Spring', '₱42,000 / sem', '["Business", "Finance", "Banking"]'::jsonb),
            ('BSA',     'College of Business and Accountancy', 'B.S.', 'Accountancy',                                         '4 Years', 'Fall / Spring', '₱45,000 / sem', '["Business", "Accountancy", "CPA"]'::jsonb),
            ('BSIT',    'College of Computer Studies',         'B.S.', 'Information Technology',                              '4 Years', 'Fall / Spring', '₱43,000 / sem', '["IT", "Technology", "Web"]'::jsonb),
            ('BSBA-MM', 'College of Business and Accountancy', 'B.S.', 'Business Administration major in Marketing Management','4 Years', 'Fall / Spring', '₱42,000 / sem', '["Business", "Marketing", "Management"]'::jsonb),
            ('BSBA-OM', 'College of Business and Accountancy', 'B.S.', 'Business Administration major in Operations Management','4 Years', 'Fall / Spring', '₱42,000 / sem', '["Business", "Operations", "Logistics"]'::jsonb),
            ('BSAIS',   'College of Business and Accountancy', 'B.S.', 'Accounting Information Systems',                       '4 Years', 'Fall / Spring', '₱44,000 / sem', '["Business", "Accounting", "AIS", "IT"]'::jsonb),
            ('BSN',     'College of Nursing and Allied Health','B.S.', 'Nursing',                                             '4 Years', 'Fall / Spring', '₱52,000 / sem', '["Nursing", "Healthcare", "Clinical"]'::jsonb),
            ('BSMLS',   'College of Allied Health Sciences',   'B.S.', 'Medical Laboratory Science',                          '4 Years', 'Fall / Spring', '₱50,000 / sem', '["MedicalLab", "Pathology", "Healthcare"]'::jsonb),
            ('BSRT',    'College of Allied Health Sciences',   'B.S.', 'Radiologic Technology',                               '4 Years', 'Fall / Spring', '₱48,000 / sem', '["RadTech", "Radiology", "Imaging"]'::jsonb),
            ('BSBIO',   'College of Science',                  'B.S.', 'Biology',                                             '4 Years', 'Fall / Spring', '₱40,000 / sem', '["Science", "Biology", "Genetics"]'::jsonb),
            ('BSMB',    'College of Science',                  'B.S.', 'Marine Biology',                                      '4 Years', 'Fall / Spring', '₱41,000 / sem', '["Science", "MarineBiology", "Oceanography"]'::jsonb),
            ('BSDSA',   'College of Computer Studies',         'B.S.', 'Data Science and Analytics',                          '4 Years', 'Fall / Spring', '₱46,000 / sem', '["DataScience", "Analytics", "AI", "Statistics"]'::jsonb),
            ('BSGE',    'College of Engineering',              'B.S.', 'Geodetic Engineering',                                '4 Years', 'Fall / Spring', '₱45,000 / sem', '["Engineering", "Geodesy", "Surveying", "GIS"]'::jsonb),
            ('BSMATH',  'College of Science',                  'B.S.', 'Mathematics',                                         '4 Years', 'Fall / Spring', '₱39,000 / sem', '["Science", "Mathematics", "Analysis", "Algebra"]'::jsonb),
            ('BSSTAT',  'College of Science',                  'B.S.', 'Statistics',                                          '4 Years', 'Fall / Spring', '₱40,000 / sem', '["Science", "Statistics", "Probability", "Data"]'::jsonb),
            ('BSM',     'College of Nursing and Allied Health','B.S.', 'Midwifery',                                           '4 Years', 'Fall / Spring', '₱42,000 / sem', '["Midwifery", "Healthcare", "Obstetrics", "Clinical"]'::jsonb),
            ('BSAGRI',  'College of Agriculture',              'B.S.', 'Agriculture',                                         '4 Years', 'Fall / Spring', '₱38,000 / sem', '["Agriculture", "Farming", "Crops", "Soil"]'::jsonb),
            ('BSARCH',  'College of Architecture',             'B.S.', 'Architecture',                                        '5 Years', 'Fall / Spring', '₱50,000 / sem', '["Architecture", "Design", "Drafting", "Building"]'::jsonb),
            ('BSECE',   'College of Engineering',              'B.S.', 'Electronics Engineering',                             '4 Years', 'Fall / Spring', '₱47,000 / sem', '["Engineering", "Electronics", "Telecom", "Circuits"]'::jsonb),
            ('BSCpE',   'College of Computer Studies',         'B.S.', 'Computer Engineering',                                '4 Years', 'Fall / Spring', '₱46,000 / sem', '["Engineering", "Hardware", "Embedded", "Computing"]'::jsonb),
            ('BSCE',    'College of Engineering',              'B.S.', 'Civil Engineering',                                   '4 Years', 'Fall / Spring', '₱46,000 / sem', '["Engineering", "Structures", "Surveying", "Construction"]'::jsonb),
            ('BSME',    'College of Engineering',              'B.S.', 'Mechanical Engineering',                              '4 Years', 'Fall / Spring', '₱46,000 / sem', '["Engineering", "Thermodynamics", "Machinery", "Thermal"]'::jsonb)
            ('BSME',    'College of Engineering',              'B.S.', 'Mechanical Engineering',                              '4 Years', 'Fall / Spring', '₱46,000 / sem', '["Engineering", "Thermodynamics", "Machinery", "Thermal"]'::jsonb),
            ('BSPHYS',  'College of Science',                  'B.S.', 'Physics',                                             '4 Years', 'Fall / Spring', '₱42,000 / sem', '["Science", "Physics", "Thermodynamics", "Quantum"]'::jsonb),
            ('BSAPHY',  'College of Science',                  'B.S.', 'Applied Physics',                                     '4 Years', 'Fall / Spring', '₱43,000 / sem', '["Science", "AppliedPhysics", "Instrumentation", "Electronics"]'::jsonb),
            ('BSAPMATH','College of Science',                  'B.S.', 'Applied Mathematics',                                 '4 Years', 'Fall / Spring', '₱41,000 / sem', '["Science", "AppliedMathematics", "Calculus", "Analysis"]'::jsonb),
            ('JD',      'College of Law',                      'J.D.','Juris Doctor',                                         '4 Years', 'Fall / Spring', '₱65,000 / sem', '["Law", "JurisDoctor", "Legal", "Litigation"]'::jsonb),
            ('LLM',     'Graduate School of Law',              'LL.M.','Master of Laws',                                       '2 Years', 'Fall / Spring', '₱75,000 / sem', '["Graduate", "Law", "InternationalLaw", "Legal"]'::jsonb),
            ('MSCYBER', 'College of Computer Studies',         'M.S.', 'Information Security and Cybersecurity',               '2 Years', 'Fall / Spring', '₱58,000 / sem', '["Graduate", "Cybersecurity", "InfoSec", "Networks"]'::jsonb),
            ('MSCS',    'College of Computer Studies',         'M.S.', 'Computer Science',                                    '2 Years', 'Fall / Spring', '₱55,000 / sem', '["Graduate", "ComputerScience", "Algorithms", "AI"]'::jsonb),
            ('MSDS',    'College of Computer Studies',         'M.S.', 'Data Science',                                        '2 Years', 'Fall / Spring', '₱60,000 / sem', '["Graduate", "DataScience", "MachineLearning", "BigData"]'::jsonb),
            ('MD',      'Faculty of Medicine and Surgery',     'M.D.', 'Doctor of Medicine',                                  '4 Years', 'Fall',          '₱95,000 / sem', '["Medicine", "Healthcare", "Clinical", "Anatomy", "Surgery"]'::jsonb),
            ('BSPSYCH', 'College of Arts and Sciences',        'B.S.', 'Psychology',                                          '4 Years', 'Fall / Spring', '₱42,000 / sem', '["Psychology", "Behavior", "Clinical", "Assessment"]'::jsonb)
        ON CONFLICT ("Id") DO NOTHING;
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    var rows = await cmd.ExecuteNonQueryAsync();
    Console.WriteLine($"Seeded {rows} program offering(s).");
}

static async Task CreateCurriculumSchemaAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Ensuring curriculum schema and normalized tables exist via raw SQL...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    var sql = """
        CREATE SCHEMA IF NOT EXISTS curriculum;

        -- Subject catalog (mirrors CourseDefinition in EF Core)
        CREATE TABLE IF NOT EXISTS curriculum."Courses" (
            "Id"          UUID         NOT NULL PRIMARY KEY,
            "Code"        VARCHAR(20)  NOT NULL,
            "Title"       VARCHAR(256) NOT NULL,
            "Units"       INT          NOT NULL DEFAULT 3,
            "Department"  VARCHAR(256) NOT NULL DEFAULT '',
            "Status"      VARCHAR(50)  NOT NULL DEFAULT 'Active',
            "Description" TEXT         NOT NULL DEFAULT '',
            CONSTRAINT "UQ_Courses_Code" UNIQUE ("Code")
        );

        -- Prerequisite rules (child of CourseDefinition)
        CREATE TABLE IF NOT EXISTS curriculum."PrerequisiteRules" (
            "Id"                   UUID        NOT NULL PRIMARY KEY,
            "CourseDefinitionId"   UUID        NOT NULL,
            "RequiredCourseCode"   VARCHAR(20) NOT NULL,
            "MinimumGrade"         VARCHAR(10) NOT NULL DEFAULT '75',
            "IsEnforced"           BOOLEAN     NOT NULL DEFAULT TRUE,
            CONSTRAINT "FK_PrerequisiteRules_Courses" FOREIGN KEY ("CourseDefinitionId")
                REFERENCES curriculum."Courses" ("Id") ON DELETE CASCADE
        );

        -- Academic programs
        CREATE TABLE IF NOT EXISTS curriculum."AcademicPrograms" (
            "Id"              UUID         NOT NULL PRIMARY KEY,
            "Code"            VARCHAR(20)  NOT NULL,
            "Name"            VARCHAR(256) NOT NULL,
            "College"         VARCHAR(256) NOT NULL,
            "TotalUnits"      INT          NOT NULL,
            "YearsToComplete" INT          NOT NULL DEFAULT 4,
            "IsActive"        BOOLEAN      NOT NULL DEFAULT TRUE,
            CONSTRAINT "UQ_AcademicPrograms_Code" UNIQUE ("Code")
        );

        -- Versioned curriculum plans
        CREATE TABLE IF NOT EXISTS curriculum."AcademicCurricula" (
            "Id"           UUID        NOT NULL PRIMARY KEY,
            "ProgramId"    UUID        NOT NULL,
            "ProgramCode"  VARCHAR(20) NOT NULL,
            "AcademicYear" VARCHAR(20) NOT NULL,
            "Version"      VARCHAR(10) NOT NULL DEFAULT '1.0',
            "Status"       VARCHAR(20) NOT NULL DEFAULT 'Active',
            "TotalUnits"   INT         NOT NULL,
            CONSTRAINT "FK_AcademicCurricula_Programs" FOREIGN KEY ("ProgramId")
                REFERENCES curriculum."AcademicPrograms" ("Id") ON DELETE CASCADE
        );

        -- Join: curriculum ↔ subjects with year/semester placement
        CREATE TABLE IF NOT EXISTS curriculum."CurriculumSubjects" (
            "Id"           UUID        NOT NULL PRIMARY KEY,
            "CurriculumId" UUID        NOT NULL,
            "SubjectId"    UUID        NOT NULL,
            "SubjectCode"  VARCHAR(20) NOT NULL,
            "YearLevel"    INT         NOT NULL,
            "Semester"     VARCHAR(20) NOT NULL,
            "Units"        INT         NOT NULL,
            "IsElective"   BOOLEAN     NOT NULL DEFAULT FALSE,
            CONSTRAINT "FK_CurriculumSubjects_Curricula" FOREIGN KEY ("CurriculumId")
                REFERENCES curriculum."AcademicCurricula" ("Id") ON DELETE CASCADE,
            CONSTRAINT "FK_CurriculumSubjects_Courses" FOREIGN KEY ("SubjectId")
                REFERENCES curriculum."Courses" ("Id") ON DELETE RESTRICT
        );

        CREATE INDEX IF NOT EXISTS "IX_CurriculumSubjects_CurriculumId"
            ON curriculum."CurriculumSubjects" ("CurriculumId");
        CREATE INDEX IF NOT EXISTS "IX_AcademicCurricula_ProgramCode_Status"
            ON curriculum."AcademicCurricula" ("ProgramCode", "Status");
        """;

    await using var cmd = new NpgsqlCommand(sql, conn);
    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("curriculum schema and normalized tables are ready.");
}

static async Task SeedCurriculumDataAsync(IServiceProvider services, ILogger logger)
{
    var rawConn = services.GetRequiredService<RawConnectionString>();
    Console.WriteLine("Seeding normalized curriculum data (BSA, BSCS, BSIT)...");

    await using var conn = new NpgsqlConnection(rawConn.Value);
    await conn.OpenAsync();

    // ─── GUIDs: Programs ──────────────────────────────────────────────────────
    var pgmBSA    = Guid.Parse("10000000-0000-0000-0000-000000000001");
    var pgmBSCS   = Guid.Parse("10000000-0000-0000-0000-000000000002");
    var pgmBSIT   = Guid.Parse("10000000-0000-0000-0000-000000000003");
    var pgmBSMA   = Guid.Parse("10000000-0000-0000-0000-000000000004");
    var pgmBSBAFM = Guid.Parse("10000000-0000-0000-0000-000000000005");
    var pgmBSBAMM = Guid.Parse("10000000-0000-0000-0000-000000000006");
    var pgmBSBAOM = Guid.Parse("10000000-0000-0000-0000-000000000007");
    var pgmBSAIS  = Guid.Parse("10000000-0000-0000-0000-000000000008");
    var pgmBSN    = Guid.Parse("10000000-0000-0000-0000-000000000009");
    var pgmBSMLS  = Guid.Parse("10000000-0000-0000-0000-000000000010");
    var pgmBSRT   = Guid.Parse("10000000-0000-0000-0000-000000000011");
    var pgmBSBIO  = Guid.Parse("10000000-0000-0000-0000-000000000012");
    var pgmBSMB   = Guid.Parse("10000000-0000-0000-0000-000000000013");
    var pgmBSDSA  = Guid.Parse("10000000-0000-0000-0000-000000000014");
    var pgmBSGE   = Guid.Parse("10000000-0000-0000-0000-000000000015");
    var pgmBSMATH = Guid.Parse("10000000-0000-0000-0000-000000000016");
    var pgmBSSTAT = Guid.Parse("10000000-0000-0000-0000-000000000017");
    var pgmBSM    = Guid.Parse("10000000-0000-0000-0000-000000000018");
    var pgmBSAGRI = Guid.Parse("10000000-0000-0000-0000-000000000019");
    var pgmBSARCH = Guid.Parse("10000000-0000-0000-0000-000000000020");
    var pgmBSECE  = Guid.Parse("10000000-0000-0000-0000-000000000021");
    var pgmBSCpE  = Guid.Parse("10000000-0000-0000-0000-000000000022");
    var pgmBSCE   = Guid.Parse("10000000-0000-0000-0000-000000000023");
    var pgmBSME   = Guid.Parse("10000000-0000-0000-0000-000000000024");
    var pgmBSPHYS = Guid.Parse("10000000-0000-0000-0000-000000000025");
    var pgmBSAPHY = Guid.Parse("10000000-0000-0000-0000-000000000026");
    var pgmBSAPMATH = Guid.Parse("10000000-0000-0000-0000-000000000027");
    var pgmJD     = Guid.Parse("10000000-0000-0000-0000-000000000028");
    var pgmLLM    = Guid.Parse("10000000-0000-0000-0000-000000000029");
    var pgmMSCYBER = Guid.Parse("10000000-0000-0000-0000-000000000030");
    var pgmMSCS   = Guid.Parse("10000000-0000-0000-0000-000000000031");
    var pgmMSDS   = Guid.Parse("10000000-0000-0000-0000-000000000032");
    var pgmMD     = Guid.Parse("10000000-0000-0000-0000-000000000033");
    var pgmBSPSYCH = Guid.Parse("10000000-0000-0000-0000-000000000034");

    // ─── GUIDs: Curricula ─────────────────────────────────────────────────────
    var curBSA    = Guid.Parse("20000000-0000-0000-0000-000000000001");
    var curBSCS   = Guid.Parse("20000000-0000-0000-0000-000000000002");
    var curBSIT   = Guid.Parse("20000000-0000-0000-0000-000000000003");
    var curBSMA   = Guid.Parse("20000000-0000-0000-0000-000000000004");
    var curBSBAFM = Guid.Parse("20000000-0000-0000-0000-000000000005");
    var curBSBAMM = Guid.Parse("20000000-0000-0000-0000-000000000006");
    var curBSBAOM = Guid.Parse("20000000-0000-0000-0000-000000000007");
    var curBSAIS  = Guid.Parse("20000000-0000-0000-0000-000000000008");
    var curBSN    = Guid.Parse("20000000-0000-0000-0000-000000000009");
    var curBSMLS  = Guid.Parse("20000000-0000-0000-0000-000000000010");
    var curBSRT   = Guid.Parse("20000000-0000-0000-0000-000000000011");
    var curBSBIO  = Guid.Parse("20000000-0000-0000-0000-000000000012");
    var curBSMB   = Guid.Parse("20000000-0000-0000-0000-000000000013");
    var curBSDSA  = Guid.Parse("20000000-0000-0000-0000-000000000014");
    var curBSGE   = Guid.Parse("20000000-0000-0000-0000-000000000015");
    var curBSMATH = Guid.Parse("20000000-0000-0000-0000-000000000016");
    var curBSSTAT = Guid.Parse("20000000-0000-0000-0000-000000000017");
    var curBSM    = Guid.Parse("20000000-0000-0000-0000-000000000018");
    var curBSAGRI = Guid.Parse("20000000-0000-0000-0000-000000000019");
    var curBSARCH = Guid.Parse("20000000-0000-0000-0000-000000000020");
    var curBSECE  = Guid.Parse("20000000-0000-0000-0000-000000000021");
    var curBSCpE  = Guid.Parse("20000000-0000-0000-0000-000000000022");
    var curBSCE   = Guid.Parse("20000000-0000-0000-0000-000000000023");
    var curBSME   = Guid.Parse("20000000-0000-0000-0000-000000000024");
    var curBSPHYS = Guid.Parse("20000000-0000-0000-0000-000000000025");
    var curBSAPHY = Guid.Parse("20000000-0000-0000-0000-000000000026");
    var curBSAPMATH = Guid.Parse("20000000-0000-0000-0000-000000000027");
    var curJD     = Guid.Parse("20000000-0000-0000-0000-000000000028");
    var curLLM    = Guid.Parse("20000000-0000-0000-0000-000000000029");
    var curMSCYBER = Guid.Parse("20000000-0000-0000-0000-000000000030");
    var curMSCS   = Guid.Parse("20000000-0000-0000-0000-000000000031");
    var curMSDS   = Guid.Parse("20000000-0000-0000-0000-000000000032");
    var curMD     = Guid.Parse("20000000-0000-0000-0000-000000000033");
    var curBSPSYCH = Guid.Parse("20000000-0000-0000-0000-000000000034");

    // ─── Helper: deterministic GUID from subject code ─────────────────────────
    // We use a consistent seed so re-runs produce the same UUIDs.
    var subjectIds = new Dictionary<string, Guid>();
    Guid SubjectId(string code)
    {
        if (!subjectIds.TryGetValue(code, out var id))
        {
            // Build a v5-style deterministic guid from the code bytes
            var bytes = new byte[16];
            var codeBytes = System.Text.Encoding.UTF8.GetBytes(code.PadRight(16).Substring(0, 16));
            Array.Copy(codeBytes, bytes, 16);
            bytes[6] = (byte)((bytes[6] & 0x0f) | 0x50); // version 5
            id = new Guid(bytes);
            subjectIds[code] = id;
        }
        return id;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SHARED GE / NSTP / PE subjects (used across all programs)
    // ═════════════════════════════════════════════════════════════════════════
    var sharedSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("GE101",   "Understanding the Self",                3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE102",   "Readings in Philippine History",        3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE103",   "The Contemporary World",                3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE104",   "Mathematics in the Modern World",       3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE105",   "Purposive Communication",               3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE106",   "Art Appreciation",                      3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE107",   "Science, Technology and Society",       3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE108",   "Ethics",                                3, "General Education", "GE",   "Core GE per CMO No. 20 s.2013"),
        ("GE201",   "Life and Works of Rizal",               3, "General Education", "GE",   "Required per RA 1425"),
        ("GE202",   "GE Elective 1",                         3, "General Education", "GE",   "GE Elective per CMO No. 20"),
        ("GE301",   "GE Elective 2",                         3, "General Education", "GE",   "GE Elective per CMO No. 20"),
        ("GE401",   "GE Elective 3",                         3, "General Education", "GE",   "GE Elective per CMO No. 20"),
        ("PE101",   "Physical Education 1",                  2, "Physical Education","PE",   "Physical fitness and wellness"),
        ("PE201",   "Physical Education 2",                  2, "Physical Education","PE",   "Individual/dual sports"),
        ("PE301",   "Physical Education 3",                  2, "Physical Education","PE",   "Team sports"),
        ("PE401",   "Physical Education 4",                  2, "Physical Education","PE",   "Dance and rhythmic activities"),
        ("NSTP101", "National Service Training Program 1",   3, "NSTP",              "NSTP", "NSTP per RA 9163"),
        ("NSTP102", "National Service Training Program 2",   3, "NSTP",              "NSTP", "NSTP per RA 9163"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSA-specific subjects
    // ═════════════════════════════════════════════════════════════════════════
    var bsaSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("BMA101", "Introduction to Business",              3, "Business",     "Common",       "Overview of business and management concepts"),
        ("BMA201", "Business Law",                          3, "Business",     "Common",       "Legal environment of business"),
        ("BMA202", "Business Statistics",                   3, "Business",     "Common",       "Statistical methods for business decisions"),
        ("BMA203", "Economics",                             3, "Business",     "Common",       "Micro and macroeconomic principles"),
        ("ACC101", "Financial Accounting and Reporting 1",  3, "Accountancy",  "Core",         "Introduction to financial accounting"),
        ("ACC102", "Financial Accounting and Reporting 2",  3, "Accountancy",  "Core",         "Partnership and corporate accounting"),
        ("ACC201", "Financial Accounting and Reporting 3",  3, "Accountancy",  "Core",         "Advanced topics in financial accounting"),
        ("ACC202", "Financial Accounting and Reporting 4",  3, "Accountancy",  "Core",         "PFRS standards and applications"),
        ("ACC203", "Cost Accounting and Management",        3, "Accountancy",  "Core",         "Cost concepts, job order, process costing"),
        ("ACC204", "Intermediate Accounting",               3, "Accountancy",  "Core",         "Assets, liabilities, and equity"),
        ("ACC205", "Accounting Information Systems",        3, "Accountancy",  "Core",         "AIS design and internal controls"),
        ("ACC206", "Auditing and Assurance 1",              3, "Accountancy",  "Core",         "Audit planning and evidence gathering"),
        ("ACC301", "Auditing and Assurance 2",              3, "Accountancy",  "Core",         "Audit procedures and reporting"),
        ("ACC302", "Auditing and Assurance 3",              3, "Accountancy",  "Core",         "Advanced auditing and assurance services"),
        ("ACC303", "Taxation",                              3, "Accountancy",  "Core",         "Philippine tax law and practice"),
        ("ACC304", "Financial Management",                  3, "Accountancy",  "Core",         "Capital budgeting and financial analysis"),
        ("ACC305", "Advanced Financial Accounting",         3, "Accountancy",  "Core",         "Business combinations and consolidations"),
        ("ACC306", "Government Accounting",                 3, "Accountancy",  "Core",         "New government accounting system (NGAS)"),
        ("ACC307", "Accounting Research",                   3, "Accountancy",  "Professional", "Research methodology for accountancy"),
        ("ACC308", "Accounting Theory",                     3, "Accountancy",  "Professional", "Conceptual frameworks and accounting standards"),
        ("ACC309", "Business Finance",                      3, "Accountancy",  "Professional", "Financial planning and treasury management"),
        ("ACC310", "Accounting Internship Preparation",     3, "Accountancy",  "Professional", "Pre-internship seminar and portfolio"),
        ("ACC401", "Advanced Financial Accounting 2",       3, "Accountancy",  "Professional", "Foreign operations and partnership liquidation"),
        ("ACC402", "Advanced Auditing",                     3, "Accountancy",  "Professional", "Forensic accounting and fraud examination"),
        ("ACC403", "Advanced Taxation",                     3, "Accountancy",  "Professional", "Estate and donor's tax, VAT advanced topics"),
        ("ACC404", "Accounting Internship / Practicum",     6, "Accountancy",  "Professional", "On-the-job training in accounting firm"),
        ("ACC405", "Financial Reporting and Analysis",      3, "Accountancy",  "Professional", "Financial statement analysis and valuation"),
        ("ACC406", "Strategic Management",                  3, "Accountancy",  "Professional", "Strategic planning and competitive analysis"),
        ("ACC407", "Accounting Information Systems 2",      3, "Accountancy",  "Professional", "Advanced AIS and enterprise systems"),
        ("ACC408", "Professional Ethics for Accountants",   3, "Accountancy",  "Professional", "Code of ethics for CPAs"),
        ("ACC409", "Accountancy Comprehensive Review",      3, "Accountancy",  "Professional", "CPA board exam review integration"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSCS-specific subjects (Batangas State University AY 2025-2026 / CHED CMO 25)
    // ═════════════════════════════════════════════════════════════════════════
    var bscsSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("CC 100",    "Introduction to Computing",                                                3, "Computer Science", "Core",         "Overview of computing systems and concepts"),
        ("CC 101",    "Computer Programming",                                                     3, "Computer Science", "Core",         "Structured programming principles and practice"),
        ("CC 102",    "Advanced Computer Programming",                                            3, "Computer Science", "Core",         "Advanced problem solving and data abstraction"),
        ("CC 103",    "Data Structures and Algorithms",                                           3, "Computer Science", "Core",         "Arrays, linked lists, stacks, queues, trees, and graphs"),
        ("CC 104",    "Information Management",                                                   3, "Computer Science", "Core",         "Database modeling, SQL, and database systems"),
        ("CC 105",    "Applications Development and Emerging Technologies",                       3, "Computer Science", "Core",         "Modern full-stack and mobile app development"),
        ("GEd 101",   "Understanding the Self",                                                   3, "General Education","GE",           "Personal identity and human development"),
        ("GEd 102",   "Mathematics in the Modern World",                                          3, "General Education","GE",           "Mathematical nature and practical tools"),
        ("GEd 103",   "The Life and Works of Rizal",                                              3, "General Education","GE",           "Life, works, and writings of Jose Rizal"),
        ("GEd 104",   "The Contemporary World",                                                   3, "General Education","GE",           "Globalization and global systems"),
        ("GEd 105",   "Readings in Philippine History",                                           3, "General Education","GE",           "Primary source analysis of Philippine history"),
        ("GEd 106",   "Purposive Communication",                                                  3, "General Education","GE",           "Multimodal communication in diverse contexts"),
        ("GEd 107",   "Ethics",                                                                   3, "General Education","GE",           "Moral principles and ethical decision making"),
        ("GEd 108",   "Art Appreciation",                                                         3, "General Education","GE",           "Aesthetic analysis and creative expression"),
        ("GEd 109",   "Science, Technology and Society",                                          3, "General Education","GE",           "Impact of science and technology on human culture"),
        ("GEd 110",   "Advanced Technical Writing",                                               3, "General Education","GE",           "Professional and technical documentation"),
        ("GEd 111",   "Advanced Oral Communication",                                              3, "General Education","GE",           "Public speaking and professional presentations"),
        ("MATH 101",  "Differential Calculus",                                                    4, "Mathematics",      "Core",         "Limits, continuity, and differentiation"),
        ("MATH 102",  "Integral Calculus",                                                        4, "Mathematics",      "Core",         "Integration techniques and applications"),
        ("PATHFit 1", "Movement Competency Training",                                             2, "Physical Education","PE",           "Physical fitness and movement foundations"),
        ("PATHFit 2", "Exercise-Based Fitness Activities",                                        2, "Physical Education","PE",           "Structured fitness and exercise programs"),
        ("PATHFit 3", "Dance, Sports, Martial Arts, Group Exercise 1",                            2, "Physical Education","PE",           "Physical activity and sport specialization 1"),
        ("PATHFit 4", "Dance, Sports, Martial Arts, Group Exercise 2",                            2, "Physical Education","PE",           "Physical activity and sport specialization 2"),
        ("NSTP 111",  "National Service Training Program 1",                                      3, "NSTP",             "NSTP",         "Civic welfare / military training 1"),
        ("NSTP 121",  "National Service Training Program 2",                                      3, "NSTP",             "NSTP",         "Civic welfare / military training 2"),
        ("OOP 101",   "Object-Oriented Programming",                                              3, "Computer Science", "Core",         "Encapsulation, inheritance, polymorphism, design patterns"),
        ("OOP 102",   "Advanced Object-Oriented Programming",                                     3, "Computer Science", "Core",         "GUI frameworks, multi-threading, and enterprise OOP"),
        ("AI 101",    "Linear Algebra for AI",                                                    3, "Computer Science", "Core",         "Vector spaces, matrices, eigenvalues, and SVD for AI"),
        ("AI 102",    "Probability and Statistics for AI",                                        3, "Computer Science", "Core",         "Probability distributions, estimation, and Bayesian inference"),
        ("AI 103",    "Machine Learning and Neural Networks",                                     3, "Computer Science", "Core",         "Supervised/unsupervised learning, deep neural nets"),
        ("CpE 405",   "Discrete Mathematics",                                                     3, "Computer Science", "Core",         "Logic, graph theory, combinatorics, proof techniques"),
        ("PHYS 111",  "General Physics 1",                                                        3, "Physics",          "Core",         "Mechanics, heat, thermodynamics"),
        ("PHYS 112",  "General Physics 2",                                                        3, "Physics",          "Core",         "Electricity, magnetism, wave optics"),
        ("AL 101",    "Design and Analysis of Algorithms",                                        3, "Computer Science", "Core",         "Asymptotic analysis, divide & conquer, greedy, DP"),
        ("AL 102",    "Automata Theory and Formal Languages",                                     3, "Computer Science", "Core",         "Finite automata, regular expressions, CFGs, Turing machines"),
        ("NET 101",   "Fundamentals of Computer Networking",                                      3, "Computer Science", "Core",         "OSI layers, TCP/IP, IP addressing, LAN topologies"),
        ("NET 102",   "Advanced Computer Networking",                                             3, "Computer Science", "Core",         "Routing protocols, network security, cloud networking"),
        ("AR 101",    "Computer Architecture and Organization",                                   3, "Computer Science", "Core",         "Logic gates, processor architecture, memory hierarchy"),
        ("SC 101",    "Secure Computing",                                                         3, "Computer Science", "Core",         "Cryptography, software security, network defenses"),
        ("CSAI 100",  "Artificial Intelligence",                                                  3, "Computer Science", "Core",         "State space search, knowledge graphs, decision trees"),
        ("DS 101",    "Data Science",                                                             3, "Computer Science", "Core",         "Data cleaning, exploratory data analysis, data pipelines"),
        ("CS ELEC 1", "Professional Elective 1",                                                  3, "Computer Science", "Elective",     "Specialized Computer Science topic"),
        ("CS ELEC 2", "Professional Elective 2",                                                  3, "Computer Science", "Elective",     "Specialized Computer Science topic"),
        ("CS ELEC 3", "Professional Elective 3",                                                  3, "Computer Science", "Elective",     "Specialized Computer Science topic"),
        ("PL 101",    "Programming Languages",                                                    3, "Computer Science", "Core",         "Syntax, semantics, type systems, and compilers"),
        ("SE 101",    "Software Engineering",                                                     3, "Computer Science", "Core",         "Agile SDLC, requirements engineering, software architecture"),
        ("SE 102",    "Advanced Software Engineering",                                            3, "Computer Science", "Core",         "DevOps, microservices, continuous integration/delivery"),
        ("HCI 101",   "Human-Computer Interaction",                                               3, "Computer Science", "Core",         "User-centered design, prototyping, usability testing"),
        ("QM 101",    "Quantitative Methods",                                                     3, "Computer Science", "Core",         "Linear programming, simulation, optimization models"),
        ("WS 101",    "Web Systems and Technologies",                                             3, "Computer Science", "Core",         "RESTful APIs, reactive client frameworks, web security"),
        ("CSP 100",   "Computer Science Internship",                                              3, "Computer Science", "Professional", "Industry immersion (min. 70% completed units)"),
        ("THS 101",   "CS Thesis 1",                                                              3, "Computer Science", "Professional", "Research methodology and proposal defense"),
        ("THS 102",   "CS Thesis 2",                                                              3, "Computer Science", "Professional", "Thesis prototype implementation and final defense"),
        ("OS 101",    "Principles of Operating System",                                           3, "Computer Science", "Core",         "Processes, concurrency, virtual memory, file systems"),
        ("PD 101",    "Parallel and Distributed Computing",                                       3, "Computer Science", "Core",         "MPI, OpenMP, CUDA, distributed consensus"),
        ("SIP 101",   "Social Issues and Professional Practice",                                  3, "Computer Science", "Core",         "Ethics, intellectual property, tech regulation"),
        ("ENGG 105",  "Technopreneurship",                                                        3, "Engineering",      "Core",         "Technology startup creation, business models, funding"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSMA-specific subjects (Holy Cross of Davao College / UST AY 2025-2026 / CHED CMO 28)
    // ═════════════════════════════════════════════════════════════════════════
    var bsmaSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("FAR 101",      "Financial Accounting and Reporting (A & B)",                            6, "Accountancy", "Core",         "Financial accounting principles, journalizing, financial statements"),
        ("OM 101",       "Operations Management and Total Quality Management",                    3, "Management",  "Core",         "Operations processes, capacity planning, TQM frameworks"),
        ("CFAS 101",     "Conceptual Framework and Accounting Standards",                         6, "Accountancy", "Core",         "IFRS/PFRS conceptual framework and standard evaluation"),
        ("MANECO 101",   "Managerial Economics",                                                  3, "Economics",    "Core",         "Microeconomic analysis for business decision making"),
        ("IT 100",       "Living in the IT Era",                                                  3, "Information Tech", "GE",       "Digital literacy and technological impact on society"),
        ("IA 101",       "Intermediate Accounting 1",                                             3, "Accountancy", "Core",         "Assets, inventory, and receivables valuation"),
        ("CAC 101",      "Cost Accounting and Control",                                           3, "Accountancy", "Core",         "Job order, process costing, cost allocation models"),
        ("AIS 101",      "Accounting Information Systems",                                        3, "Accountancy", "Core",         "Transaction cycles, AIS architecture, internal controls"),
        ("MS 101",       "Management Science",                                                    3, "Management",  "Core",         "Quantitative decision models, linear optimization"),
        ("STAT 101",     "Business Statistics",                                                   3, "Statistics",  "Core",         "Descriptive/inferential statistics for business analytics"),
        ("BLAW 101",     "Business Law (Obligations and Contracts)",                              3, "Law",         "Core",         "Civil Code provisions on obligations and contracts"),
        ("IA 102",       "Intermediate Accounting 2",                                             3, "Accountancy", "Core",         "Liabilities, equity, and income taxes accounting"),
        ("MA 101",       "Cost Accounting and Management",                                        3, "Accountancy", "Core",         "Cost-volume-profit analysis and budgeting"),
        ("TAX 101",      "Income Taxation",                                                       3, "Taxation",    "Core",         "Philippine NIRC income taxation laws and filing"),
        ("BFIN 101",     "Business Finance",                                                      3, "Finance",     "Core",         "Financial planning, capital structure, working capital"),
        ("AUD 101",      "Auditing Fundamentals",                                                 3, "Accountancy", "Core",         "Principles of auditing, internal controls, risk assessment"),
        ("BUSRES 101",   "Business Research",                                                     3, "Management",  "Core",         "Research design, survey methods, statistical analysis"),
        ("SCM 101",      "Strategic Cost Management",                                             3, "Accountancy", "Professional", "Activity-based management, target costing, balanced scorecard"),
        ("MA 201",       "Management Accounting 1",                                               3, "Accountancy", "Professional", "Performance evaluation, responsibility accounting, transfer pricing"),
        ("FINMAN 101",   "Financial Management",                                                  3, "Finance",     "Professional", "Corporate capital budgeting, cost of capital, valuation"),
        ("ADV-AIS 101",  "Advanced Accounting Information Systems",                               3, "Accountancy", "Professional", "ERP systems, database queries, AIS security audit"),
        ("BUSAN 101",    "Business Analytics",                                                    3, "Statistics",  "Professional", "Predictive analytics, data visualization, business intelligence"),
        ("CORPGOV 101",  "Corporate Governance and Business Ethics",                              3, "Management",  "Professional", "OECD principles, SEC corporate governance codes, ethics"),
        ("MA-ELEC 1",    "Professional Elective 1",                                               3, "Accountancy", "Elective",     "Specialized Management Accounting elective 1"),
        ("SBA 101",      "Strategic Business Analysis",                                           3, "Accountancy", "Professional", "Business strategy formulation and financial analysis"),
        ("ADV-CAC 101",  "Advanced Cost Accounting",                                              3, "Accountancy", "Professional", "Standard costing, joint products, byproduct costing"),
        ("FSA 101",      "Financial Statement Analysis",                                          3, "Accountancy", "Professional", "Ratio analysis, cash flow evaluation, financial health"),
        ("TAX 102",      "Taxation 2 (Business & Transfer Taxes)",                                3, "Taxation",    "Professional", "VAT, percentage tax, estate and donor's taxes"),
        ("ACCRES 101",   "Accounting Research",                                                   3, "Accountancy", "Professional", "Accounting methodology, literature review, empirical design"),
        ("BLAW 102",     "Regulatory Framework for Business Transactions",                        3, "Law",         "Professional", "Corporation code, partnership law, consumer protection"),
        ("MA-ELEC 2",    "Professional Elective 2",                                               3, "Accountancy", "Elective",     "Specialized Management Accounting elective 2"),
        ("ADV-MA 101",   "Advanced Management Accounting",                                        3, "Accountancy", "Professional", "Advanced managerial decision tools, risk management"),
        ("MCS 101",      "Management Control Systems",                                            3, "Accountancy", "Professional", "Designing organizational control and incentive structures"),
        ("MA-RES 1",     "Accounting Research / Thesis 1",                                        3, "Accountancy", "Professional", "Thesis proposal defense and research execution"),
        ("MA-PRACT 1",   "Internship / Practicum Preparation",                                    3, "Accountancy", "Professional", "Pre-internship skills and corporate readiness seminar"),
        ("MA-CAP 101",   "Management Accounting Capstone Course",                                 3, "Accountancy", "Professional", "Comprehensive case analysis and integrated synthesis"),
        ("MA-RES 2",     "Accounting Research / Thesis 2",                                        3, "Accountancy", "Professional", "Thesis completion, empirical defense, publication"),
        ("MA-PRACT 2",   "Internship / Practicum",                                                6, "Accountancy", "Professional", "Industry immersion in corporate management accounting"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSBA-FM-specific subjects (Batangas State University / HCDC AY 2025-2026 / CHED CMO 17 & 39)
    // ═════════════════════════════════════════════════════════════════════════
    var bsbafmSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("ECO 101",   "Basic Microeconomics",                                                    3, "Economics",    "Core",         "Supply and demand, consumer behavior, market structures"),
        ("MGT 101",   "Human Resource Management",                                               3, "Management",  "Core",         "Talent acquisition, performance management, labor laws"),
        ("FM 101",    "Financial Management",                                                    3, "Finance",     "Core",         "Principles of corporate financial planning and analysis"),
        ("FM 102",    "Financial Controllership",                                                3, "Finance",     "Core",         "Internal control systems, financial policy, corporate treasury"),
        ("LAW 201",   "Law on Obligations and Contracts",                                        3, "Law",         "Core",         "Legal frameworks governing commercial obligations"),
        ("TAX 301",   "Income Taxation",                                                         3, "Taxation",    "Core",         "Principles of individual and corporate income taxation"),
        ("FILI 101",  "Kontekstwalisadong Komunikasyon sa Filipino",                             3, "Filipino",    "GE",           "Filipino communication in modern contextual environments"),
        ("LITR 102",  "ASEAN Literature",                                                        3, "Literature",  "GE",           "Literary works across ASEAN member nations"),
        ("FM 203",    "Financial Analysis and Reporting",                                        3, "Finance",     "Core",         "Financial statement analysis, cash flow forecasting, liquidity"),
        ("FILI 102",  "Filipino sa Iba't-ibang Disiplina",                                       3, "Filipino",    "GE",           "Filipino language applications across technical disciplines"),
        ("MGT 202",   "Good Governance and Social Responsibility",                               3, "Management",  "Core",         "Ethical governance, corporate CSR, sustainability"),
        ("FM 204",    "Banking and Financial Institutions",                                      3, "Finance",     "Core",         "Central banking, commercial banks, money market operations"),
        ("BPO 201",   "Fundamentals of Business Process Outsourcing",                            3, "BPO",         "Core",         "Global business services, IT-BPM industry dynamics"),
        ("MGT 303",   "Operations Management with TQM",                                          3, "Management",  "Core",         "Supply chain, quality management, process optimization"),
        ("MGT 304",   "International Business and Trade",                                        3, "Management",  "Core",         "Global trade policies, foreign exchange markets, tariffs"),
        ("BPO 302",   "Business Communication",                                                  3, "BPO",         "Core",         "Corporate writing, executive presentations, client relations"),
        ("FM 305",    "Monetary Policy and Central Banking",                                     3, "Finance",     "Professional", "BSP monetary tools, inflation targeting, interest rates"),
        ("FM 306",    "Credit and Collection",                                                   3, "Finance",     "Professional", "Credit scoring, risk assessment, receivables management"),
        ("FM 310",    "Research Methods Applied in Financial Management",                        3, "Finance",     "Professional", "Financial econometrics, quantitative research methods"),
        ("MGT 305",   "Entrepreneurial Management",                                              3, "Management",  "Core",         "Venture creation, business plan development, innovation"),
        ("BPO 303",   "Service Culture",                                                         3, "BPO",         "Core",         "Customer experience, service excellence frameworks"),
        ("FM 307",    "Investment and Portfolio Management",                                     3, "Finance",     "Professional", "Security analysis, CAPM, portfolio diversification, mutual funds"),
        ("FM 308",    "Capital Market",                                                          3, "Finance",     "Professional", "Stock exchanges, bond markets, derivatives, financial instruments"),
        ("FM 309",    "Public Finance",                                                          3, "Finance",     "Professional", "Government budgeting, fiscal policy, public debt management"),
        ("FM 413",    "Special Topics in Financial Management with Seminar",                     3, "Finance",     "Professional", "Current trends, fintech, ESG investing, financial seminars"),
        ("FM 412",    "Global Finance with Electronic Banking",                                  3, "Finance",     "Professional", "Cross-border payments, digital banking, forex risk"),
        ("ANA 401",   "Business Analytics",                                                      3, "Statistics",  "Professional", "Financial modelling, forecasting algorithms, Excel/Python analytics"),
        ("FM 411",    "Financial Management Thesis Writing",                                     3, "Finance",     "Professional", "Financial thesis defense and empirical study completion"),
        ("MGT 406",   "Strategic Management",                                                    3, "Management",  "Core",         "Competitive strategy, SWOT, balanced scorecard execution"),
        ("FM 414",    "Practicum / Work Integrated Learning for Financial Management",           6, "Finance",     "Professional", "Industry internship in financial institutions / corporate finance"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSIT-specific subjects
    // ═════════════════════════════════════════════════════════════════════════
    var bsitSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("IT101",  "Introduction to Information Technology", 3, "Information Technology", "Core",         "IT overview and emerging technologies"),
        ("IT102",  "Computer Programming 1",                3, "Information Technology", "Core",         "Fundamentals of programming using Python"),
        ("IT103",  "Web Development Fundamentals",          3, "Information Technology", "Core",         "HTML, CSS, JavaScript basics"),
        ("IT104",  "IT Mathematics",                        3, "Information Technology", "Core",         "Number theory, logic, and discrete math for IT"),
        ("IT201",  "Computer Programming 2",                3, "Information Technology", "Core",         "Advanced programming with OOP"),
        ("IT202",  "Database Administration",               3, "Information Technology", "Core",         "Database design, SQL, and administration"),
        ("IT203",  "Web Development Advanced",              3, "Information Technology", "Core",         "PHP, frameworks, and full-stack web dev"),
        ("IT204",  "Network Fundamentals",                  3, "Information Technology", "Core",         "OSI model, LAN/WAN, basic routing"),
        ("IT205",  "Information Assurance and Security",    3, "Information Technology", "Core",         "CIA triad, encryption, and network security"),
        ("IT206",  "Object-Oriented Programming",           3, "Information Technology", "Core",         "Java/C# OOP principles and design patterns"),
        ("IT301",  "Systems Integration and Architecture",  3, "Information Technology", "Core",         "Enterprise systems, APIs, and integration"),
        ("IT302",  "Network Administration",                3, "Information Technology", "Core",         "Network management, Windows/Linux servers"),
        ("IT303",  "IT Project Management",                 3, "Information Technology", "Core",         "PMBOK, Agile methodologies for IT projects"),
        ("IT304",  "Application Development",               3, "Information Technology", "Core",         "Mobile and desktop app development"),
        ("IT305",  "Data Analytics",                        3, "Information Technology", "Core",         "Data processing, visualization, and reporting"),
        ("IT306",  "Systems Administration and Maintenance",3, "Information Technology", "Core",         "IT infrastructure management"),
        ("IT307",  "IT Service Management",                 3, "Information Technology", "Professional", "ITIL framework and service desk operations"),
        ("IT401",  "Capstone Project 1",                    3, "Information Technology", "Professional", "Project proposal and feasibility study"),
        ("IT402",  "Capstone Project 2",                    3, "Information Technology", "Professional", "System design and development"),
        ("IT403",  "Capstone Project 3",                    3, "Information Technology", "Professional", "System deployment and defense"),
        ("IT404",  "On-the-Job Training / Internship",      6, "Information Technology", "Professional", "Industry immersion in IT setting"),
        ("IT405",  "IT Elective 1",                         3, "Information Technology", "Elective",     "Specialized IT topic (e.g., Cloud Computing)"),
        ("IT406",  "IT Elective 2",                         3, "Information Technology", "Elective",     "Specialized IT topic (e.g., IoT)"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSBA-MM-specific subjects (Batangas State University AY 2018-2019 / CHED CMO 17)
    // ═════════════════════════════════════════════════════════════════════════
    var bsbammSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MKT 101", "Principles of Marketing",               3, "Marketing", "Core",         "Core marketing principles, mix, and consumer environment"),
        ("MKT 201", "Professional Salesmanship",              3, "Marketing", "Core",         "Personal selling process, negotiation, and sales techniques"),
        ("MKT 202", "Consumer Behavior",                     3, "Marketing", "Core",         "Psychological, social, and cultural factors in buying behavior"),
        ("MKT 203", "Retail Management",                     3, "Marketing", "Core",         "Retailing strategy, store operations, and merchandising"),
        ("MKT 301", "Marketing Management",                  3, "Marketing", "Core",         "Marketing planning, execution, and control systems"),
        ("MKT 302", "Pricing Strategy",                      3, "Marketing", "Core",         "Pricing mechanics, elasticity, and competitive positioning"),
        ("MKT 303", "Advertising and Sales Promotion",       3, "Marketing", "Core",         "Integrated marketing communications, media, and promotion"),
        ("MKT 304", "International Marketing",               3, "Marketing", "Core",         "Global trade, cross-cultural marketing strategies"),
        ("MKT 305", "Distribution Management",               3, "Marketing", "Core",         "Channel management, supply logistics, and wholesale"),
        ("MKT 306", "Strategic Marketing Management",        3, "Marketing", "Core",         "Market analysis, competitive strategy, and growth planning"),
        ("MKT 307", "Marketing Research",                    3, "Marketing", "Core",         "Research design, data collection, and market analysis"),
        ("MKT 401", "Digital Marketing and E-Commerce",      3, "Marketing", "Professional", "SEO, social media, online funnel, and e-commerce platforms"),
        ("MKT 402", "Product and Brand Management",          3, "Marketing", "Professional", "Brand equity, brand architecture, and product lifecycle"),
        ("MKT 403", "Services Marketing",                    3, "Marketing", "Professional", "Service quality models, customer relationship management"),
        ("MKT 404", "Marketing Management Seminar",          3, "Marketing", "Professional", "Seminars on contemporary trends and industry cases"),
        ("MKT 405", "Marketing Internship / Practicum",      6, "Marketing", "Professional", "Industry immersion in marketing department/agency"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSBA-OM-specific subjects (Batangas State University AY 2018-2019 / CHED CMO 17)
    // ═════════════════════════════════════════════════════════════════════════
    var bsbaomSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("OM 201",  "Inventory Management and Control",       3, "Operations", "Core",         "Inventory systems, EOQ, ABC analysis, JIT"),
        ("OM 202",  "Total Quality Management",               3, "Operations", "Core",         "TQM principles, Six Sigma, ISO standards"),
        ("OM 203",  "Facilities Management",                  3, "Operations", "Core",         "Facility layout, location selection, space planning"),
        ("OM 301",  "Supply Chain Management",                3, "Operations", "Core",         "Supply chain integration, logistics, procurement"),
        ("OM 302",  "Project Management",                     3, "Operations", "Core",         "CPM/PERT, project scheduling, resource allocation"),
        ("OM 303",  "Productivity and Quality Tools",         3, "Operations", "Core",         "Kaizen, 5S, lean operations, SPC charts"),
        ("OM 304",  "Materials Management",                   3, "Operations", "Core",         "Materials handling, storage systems, warehousing"),
        ("OM 305",  "Purchasing and Materials Management",    3, "Operations", "Core",         "Vendor selection, contract negotiation, sourcing"),
        ("OM 306",  "Strategic Operations Management",        3, "Operations", "Core",         "Capacity planning, operational strategy, aggregate planning"),
        ("OM 307",  "Operations Research",                    3, "Operations", "Core",         "Linear programming, queuing theory, decision trees"),
        ("OM 401",  "Logistics Management",                   3, "Operations", "Professional", "Transportation networks, distribution, freight operations"),
        ("OM 402",  "Operations Management Seminar",          3, "Operations", "Professional", "Specialized seminars on emerging industrial trends"),
        ("OM 403",  "Operations Management Practicum",        6, "Operations", "Professional", "Industry immersion in operations/logistics setting"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSAIS-specific subjects (UST General Santos AY 2024-2025 / CHED CMO 30)
    // ═════════════════════════════════════════════════════════════════════════
    var bsaisSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("AIS 102", "Database Management Systems for Accounting", 3, "AIS",    "Core",         "Relational DBMS, SQL, data modeling for accounting"),
        ("AIS 201", "Accounting Information Systems 2",           3, "AIS",    "Core",         "Advanced AIS architecture, revenue/expenditure cycles"),
        ("AIS 202", "Business Process Management",                3, "AIS",    "Core",         "Process mapping, BPMN, workflow optimization"),
        ("AIS 203", "Enterprise Resource Planning Systems",       3, "AIS",    "Core",         "ERP modules, SAP/NetSuite concepts, enterprise data"),
        ("AIS 301", "IT Security and Risk Management",            3, "AIS",    "Core",         "Information security frameworks, COBIT, risk assessment"),
        ("AIS 302", "Information Systems Audit and Control",      3, "AIS",    "Core",         "ISACA auditing standards, IT controls, general controls"),
        ("AIS 303", "Business Analytics for Accountants",         3, "AIS",    "Core",         "Financial modeling, PowerBI/Tableau, predictive analytics"),
        ("AIS 304", "Systems Analysis and Design for AIS",        3, "AIS",    "Core",         "SDLC, requirements gathering, system specification"),
        ("AIS 305", "AIS Research Methodology",                   3, "AIS",    "Core",         "Research design and empirical methods in AIS"),
        ("AIS 401", "AIS Capstone Project 1",                     3, "AIS",    "Professional", "System specification and architectural design proposal"),
        ("AIS 402", "AIS Capstone Project 2",                     3, "AIS",    "Professional", "Prototype implementation, testing, and final defense"),
        ("AIS 403", "AIS Internship / Practicum",                 6, "AIS",    "Professional", "Industry immersion in AIS/IT audit environment"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSN-specific subjects (LPU Batangas / Davao Doctors SY 2023-2024 / CHED CMO 15)
    // ═════════════════════════════════════════════════════════════════════════
    var bsnSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("ANAT 101", "Anatomy and Physiology with Lab",              4, "Nursing", "Core",         "Human anatomical structures and physiological functions"),
        ("CHEM 101", "Biochemistry for Health Sciences",             3, "Nursing", "Core",         "Chemical processes and biomolecules in human body"),
        ("MICRO 101","Microbiology and Parasitology",                3, "Nursing", "Core",         "Pathogenic microorganisms, immunity, parasites"),
        ("NCM 100",  "Theoretical Foundations in Nursing",           3, "Nursing", "Core",         "Nursing theories, metaparadigm concepts"),
        ("NCM 101",  "Health Assessment",                            3, "Nursing", "Core",         "Physical assessment skills, health history taking"),
        ("NCM 102",  "Health Education",                             3, "Nursing", "Core",         "Teaching-learning principles in healthcare"),
        ("NCM 103",  "Fundamentals of Nursing Practice",             5, "Nursing", "Core",         "Basic nursing procedures, hygiene, vital signs, skills lab"),
        ("NCM 104",  "Community Health Nursing 1",                   4, "Nursing", "Core",         "Individual and family health in community setting"),
        ("NCM 105",  "Nutrition and Diet Therapy",                   3, "Nursing", "Core",         "Nutritional requirements, therapeutic diets"),
        ("NCM 106",  "Pharmacology in Nursing",                      3, "Nursing", "Core",         "Drug classifications, dosage calculation, administration"),
        ("NCM 107",  "Care of Mother, Child and Adolescent",         9, "Nursing", "Core",         "Maternal and child nursing care with RLE clinicals"),
        ("NCM 108",  "Health Care Ethics and Law",                   3, "Nursing", "Core",         "Bioethics, nursing jurisprudence, patient rights"),
        ("NCM 109",  "Care of Adult 1 (Medical-Surgical Nursing)",   8, "Nursing", "Core",         "Med-Surg alterations in oxygenation, fluid & electrolytes"),
        ("NCM 110",  "Nursing Informatics",                          3, "Nursing", "Core",         "Healthcare technology, electronic health records"),
        ("NCM 111",  "Care of Adult 2 (Advanced Med-Surg)",         8, "Nursing", "Core",         "Complex Med-Surg conditions, surgical interventions"),
        ("NCM 112",  "Care of Patients with Maladaptive Behavior",   5, "Nursing", "Core",         "Psychiatric nursing, mental health care with RLE"),
        ("NCM 113",  "Community Health Nursing 2 (Population)",      5, "Nursing", "Core",         "Community organizing, public health administration"),
        ("NCM 114",  "Nursing Research 1",                           3, "Nursing", "Core",         "Research design, problem statement, proposal defense"),
        ("NCM 115",  "Care of Older Adult",                          3, "Nursing", "Core",         "Gerontological nursing principles and care"),
        ("NCM 116",  "Care of Clients with Life-Threatening Conditions", 5, "Nursing", "Core",      "Intensive care, emergency, and critical care nursing"),
        ("NCM 117",  "Nursing Research 2 (Thesis)",                  3, "Nursing", "Core",         "Data collection, statistical analysis, final defense"),
        ("NCM 118",  "Disaster Nursing and Emergency Care",          3, "Nursing", "Core",         "Triage, emergency response, mass casualty management"),
        ("NCM 119",  "Nursing Leadership and Management",            5, "Nursing", "Core",         "Ward management, supervision, quality improvement"),
        ("NCM 120",  "Intensive Nursing Practicum",                  8, "Nursing", "Professional", "Hospital-wide clinical rotation and internship"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSMLS-specific subjects (Davao Doctors College SY 2023-2024 / CHED CMO 13)
    // ═════════════════════════════════════════════════════════════════════════
    var bsmlsSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MLS 101",  "Principles of Medical Laboratory Science 1",    3, "MLS",     "Core",         "Introduction to MLS profession, laboratory safety"),
        ("MLS 102",  "Principles of Medical Laboratory Science 2",    3, "MLS",     "Core",         "Phlebotomy, specimen handling, laboratory math"),
        ("ANAT 102", "Human Anatomy and Physiology for MLS",         4, "MLS",     "Core",         "Anatomy & physiology tailored for med lab science"),
        ("CHEM 102", "Inorganic and Organic Chemistry for MLS",       4, "Chemistry", "Core",       "General and organic chemistry for laboratory science"),
        ("CHEM 103", "Analytical Chemistry for MLS",                  4, "Chemistry", "Core",       "Qualitative and quantitative chemical analysis"),
        ("CHEM 104", "Biochemistry for MLS",                          4, "Chemistry", "Core",       "Structure and function of biomolecules"),
        ("MT 201",   "Human Histology",                               3, "MLS",     "Core",         "Microscopic anatomy of human tissues and organs"),
        ("MT 202",   "Clinical Parasitology",                         3, "MLS",     "Core",         "Human parasites, diagnostic procedures, morphology"),
        ("MT 203",   "Pathology",                                     3, "MLS",     "Core",         "General disease mechanisms and cellular pathology"),
        ("MT 204",   "Health Information Systems for MLS",            3, "MLS",     "Core",         "Laboratory information systems (LIS) and HIPAA"),
        ("MT 301",   "Clinical Chemistry 1",                          4, "MLS",     "Core",         "Carbohydrates, lipids, proteins, enzymatic testing"),
        ("MT 302",   "Clinical Chemistry 2",                          4, "MLS",     "Core",         "Endocrinology, toxicology, therapeutic drug monitoring"),
        ("MT 303",   "Microbiology 1 (Bacteriology)",                 4, "MLS",     "Core",         "Isolation, culture, and identification of bacteria"),
        ("MT 304",   "Microbiology 2 (Mycology and Virology)",        3, "MLS",     "Core",         "Pathogenic fungi, viruses, and viral diagnostics"),
        ("MT 305",   "Hematology 1",                                  3, "MLS",     "Core",         "Formation, morphology, and disorders of blood cells"),
        ("MT 306",   "Hematology 2",                                  3, "MLS",     "Core",         "Hemostasis, coagulation pathways, specialized blood tests"),
        ("MT 307",   "Clinical Microscopy (Urinalysis)",              3, "MLS",     "Core",         "Physical, chemical, microscopic urinalysis and body fluids"),
        ("MT 308",   "Immunohematology and Blood Banking",            4, "MLS",     "Core",         "Blood group systems, crossmatching, donor screening"),
        ("MT 309",   "Immunology and Serology",                       4, "MLS",     "Core",         "Antigen-antibody reactions, serological testing"),
        ("MT 310",   "Molecular Diagnostics",                         3, "MLS",     "Core",         "PCR, nucleic acid amplification, DNA sequencing in lab"),
        ("MT 311",   "MLS Seminar 1 (Diagnostic Molecular Bio)",      2, "MLS",     "Core",         "Current developments in diagnostic molecular testing"),
        ("MT 312",   "Medical Technology Laws and Bioethics",         3, "MLS",     "Core",         "RA 5527 (MT Law), bioethics, professional practice"),
        ("MT 401",   "Medical Technology Assessment Program 1",       3, "MLS",     "Professional", "Comprehensive review of clinical subjects phase 1"),
        ("MT 402",   "Medical Technology Assessment Program 2",       3, "MLS",     "Professional", "Comprehensive review of clinical subjects phase 2"),
        ("MT 403",   "Clinical Internship 1",                         12,"MLS",     "Professional", "Hospital laboratory rotation phase 1 (6 months)"),
        ("MT 404",   "Clinical Internship 2",                         12,"MLS",     "Professional", "Hospital laboratory rotation phase 2 (6 months)"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSRT-specific subjects (GSDMSFI / CHED CMO 07 s. 2018)
    // ═════════════════════════════════════════════════════════════════════════
    var bsrtSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("RAD 101", "Introduction to Radiologic Technology",         3, "Radiology", "Core",         "History of radiology, professional ethics, safety"),
        ("RAD 102", "Anatomy and Physiology for Radiologic Tech",    4, "Radiology", "Core",         "Anatomical landmarks and skeletal structure for imaging"),
        ("RAD 103", "Radiological Physics",                          3, "Radiology", "Core",         "Atomic structure, X-ray production, electrodynamics"),
        ("RAD 201", "Radiographic Positioning and Procedures 1",      4, "Radiology", "Core",         "Chest, abdomen, and upper/lower extremity positioning"),
        ("RAD 202", "Radiographic Positioning and Procedures 2",      4, "Radiology", "Core",         "Spine, skull, and contrast radiographic positioning"),
        ("RAD 203", "Radiation Physics, Radiobiology & Protection",  3, "Radiology", "Core",         "Biological effects of radiation, shielding, dosimetry"),
        ("RAD 204", "Radiographic Image Production & Evaluation 1",  3, "Radiology", "Core",         "X-ray film, exposure factors, density, contrast"),
        ("RAD 205", "Radiographic Image Production & Evaluation 2",  3, "Radiology", "Core",         "Digital radiography, PACS, image artifacts, CR/DR"),
        ("RAD 301", "Radiologic Contrast Media & Special Procedures",3, "Radiology", "Core",         "Angiography, fluoroscopy, contrast agents"),
        ("RAD 302", "Computed Tomography (CT Scan)",                 3, "Radiology", "Core",         "CT physics, instrumentation, protocol selection"),
        ("RAD 303", "Magnetic Resonance Imaging (MRI)",              3, "Radiology", "Core",         "MRI physics, pulse sequences, safety protocols"),
        ("RAD 304", "Ultrasonography",                               3, "Radiology", "Core",         "Ultrasound physics, transducers, abdominal/OB imaging"),
        ("RAD 305", "Radiation Therapy and Nuclear Medicine",        3, "Radiology", "Core",         "Linear accelerators, radioisotopes, SPECT/PET imaging"),
        ("RAD 306", "Radiologic Pathology",                          3, "Radiology", "Core",         "Pathological manifestations on radiographic images"),
        ("RAD 307", "Quality Assurance & Quality Control in Rad",    3, "Radiology", "Core",         "Equipment calibration, quality control protocols"),
        ("RAD 308", "Radiologic Technology Research 1",              3, "Radiology", "Core",         "Research proposal development in diagnostic imaging"),
        ("RAD 309", "Radiologic Technology Research 2",              3, "Radiology", "Core",         "Data analysis, thesis defense, paper submission"),
        ("RAD 401", "Clinical Education 1 (Practicum 1)",           12, "Radiology", "Professional", "Hospital clinical rotation in general radiography"),
        ("RAD 402", "Clinical Education 2 (Practicum 2)",           12, "Radiology", "Professional", "Hospital clinical rotation in CT/MRI/Ultrasound"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSBIO-specific subjects (MMSU AY 2024-2025 / CHED CMO 49 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsbioSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("BIO 101", "General Botany",                                4, "Biology",   "Core",         "Plant anatomy, morphology, physiology, and taxonomy"),
        ("BIO 102", "General Zoology",                               4, "Biology",   "Core",         "Animal structure, function, diversity, and evolution"),
        ("BIO 103", "Systematic Biology",                            3, "Biology",   "Core",         "Principles of taxonomy, phylogenetics, classification"),
        ("BIO 201", "Genetics",                                      4, "Biology",   "Core",         "Mendelian principles, molecular genetics, population genetics"),
        ("BIO 202", "Microbiology",                                  4, "Biology",   "Core",         "Bacterial, viral, and fungal biology with lab"),
        ("BIO 203", "Cell and Molecular Biology",                    4, "Biology",   "Core",         "Cell structure, signaling, gene expression, recombinant DNA"),
        ("BIO 204", "Ecology",                                       4, "Biology",   "Core",         "Ecosystem dynamics, population ecology, conservation"),
        ("BIO 301", "Evolutionary Biology",                          3, "Biology",   "Core",         "Mechanisms of evolution, speciation, macroevolution"),
        ("BIO 302", "Developmental Biology",                         4, "Biology",   "Core",         "Embryology, morphogenesis, cellular differentiation"),
        ("BIO 303", "General Physiology",                            4, "Biology",   "Core",         "Organ system function, homeostasis in animals & plants"),
        ("BIO 304", "Biostatistics",                                 3, "Biology",   "Core",         "Statistical methods applied to biological research"),
        ("BIO 305", "Biochemistry for Biology",                      4, "Biology",   "Core",         "Metabolic pathways, enzymes, molecular structures"),
        ("BIO 306", "Biology Seminar / Special Topics",              2, "Biology",   "Core",         "Seminars on advances in biological research"),
        ("BIO 307", "Undergraduate Thesis 1",                        3, "Biology",   "Core",         "Research proposal and experimental design"),
        ("BIO 401", "Undergraduate Thesis 2",                        3, "Biology",   "Core",         "Data collection, thesis writing, oral defense"),
        ("BIO 402", "Biology Practicum / Industry Immersion",        3, "Biology",   "Professional", "Laboratory / field immersion in research institution"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSMB-specific subjects (VSU / CHED CMO 46 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsmbSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MBIO 101", "Introduction to Marine Biology",               3, "Marine Bio","Core",         "Overview of ocean life, marine environments, habitats"),
        ("MBIO 102", "Marine Botany",                                4, "Marine Bio","Core",         "Algae, seagrasses, mangroves, marine flora"),
        ("MBIO 103", "Invertebrate Zoology",                         4, "Marine Bio","Core",         "Taxonomy, anatomy, physiology of marine invertebrates"),
        ("MBIO 201", "Vertebrate Zoology",                           4, "Marine Bio","Core",         "Marine fishes, reptiles, birds, mammals"),
        ("MBIO 202", "Physical and Chemical Oceanography",           4, "Marine Bio","Core",         "Waves, tides, currents, salinity, seawater chemistry"),
        ("MBIO 203", "Biological Oceanography",                      4, "Marine Bio","Core",         "Plankton dynamics, primary productivity, food webs"),
        ("MBIO 204", "Marine Ecology",                               4, "Marine Bio","Core",         "Coral reefs, estuaries, deep sea ecosystem dynamics"),
        ("MBIO 301", "Marine Microbiology",                          4, "Marine Bio","Core",         "Marine bacteria, archaea, viral loop, biogeochemistry"),
        ("MBIO 302", "Marine Genetics",                              3, "Marine Bio","Core",         "Population genetics of marine species, DNA barcoding"),
        ("MBIO 303", "Chemical Ecology of Marine Organisms",         3, "Marine Bio","Core",         "Secondary metabolites, chemical defense, natural products"),
        ("MBIO 304", "Aquaculture and Fisheries Management",         3, "Marine Bio","Core",         "Fish farming, stock assessment, sustainable fisheries"),
        ("MBIO 305", "Marine Conservation & Resource Mgt",           3, "Marine Bio","Core",         "MPAs, coastal resource management, climate impacts"),
        ("MBIO 306", "Marine Biology Research Methods",              3, "Marine Bio","Core",         "Sampling techniques, diving methodology, data analysis"),
        ("MBIO 401", "Marine Biology Senior Thesis 1",               3, "Marine Bio","Core",         "Thesis proposal, field survey design"),
        ("MBIO 402", "Marine Biology Senior Thesis 2",               3, "Marine Bio","Core",         "Field data collection, laboratory work, oral defense"),
        ("MBIO 403", "Field Practicum / Coastal Station Immersion",  6, "Marine Bio","Professional", "Hands-on immersion at marine research station"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSDSA-specific subjects (TIP QC / UST AY 2022-2024 / CHED)
    // ═════════════════════════════════════════════════════════════════════════
    var bsdsaSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("DS 011",  "Introduction to Data Science and Analytics",            3, "Data Science", "Core",         "Data science lifecycle, Python/R tools, and ethics"),
        ("DS 012",  "Data Mining and Warehousing",                           3, "Data Science", "Core",         "ETL pipelines, dimensional modeling, association rules"),
        ("DS 013",  "Machine Learning for Analytics",                        3, "Data Science", "Core",         "Supervised, unsupervised, and ensemble algorithms"),
        ("DS 014",  "Big Data Architecture and Ecosystems",                  3, "Data Science", "Core",         "Hadoop, Spark, distributed data processing"),
        ("DS 015",  "Data Visualization and Storytelling",                   3, "Data Science", "Core",         "Dashboard design, visual cognition, PowerBI/Tableau"),
        ("DS 016",  "Deep Learning and Neural Networks",                     3, "Data Science", "Core",         "CNNs, RNNs, Transformers, and PyTorch applications"),
        ("DS 017",  "Natural Language Processing and LLMs",                  3, "Data Science", "Core",         "Tokenization, sentiment analysis, fine-tuning LLMs"),
        ("DS 018",  "Data Science Capstone / Research 1",                    3, "Data Science", "Professional", "Research proposal and data acquisition methodology"),
        ("DS 019",  "Data Science Capstone / Research 2",                    3, "Data Science", "Professional", "Model deployment, verification, and capstone defense"),
        ("DS 020",  "Data Science Industry Internship",                      6, "Data Science", "Professional", "Industry immersion in data science / analytics role"),
        ("STAT 111","Probability Theory and Statistical Inference",          3, "Statistics",   "Core",         "Probability distributions, point estimation, hypothesis testing"),
        ("STAT 112","Regression Analysis and Time Series Forecasting",       3, "Statistics",   "Core",         "Multiple linear regression, ARIMA models, forecasting"),
        ("MATH 115","Linear Algebra and Matrix Computations",                3, "Mathematics",  "Core",         "Eigenvalues, SVD, matrix factorizations for data science"),
        ("MATH 116","Multivariate Calculus for Optimization",                3, "Mathematics",  "Core",         "Partial derivatives, gradients, convex optimization"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSGE-specific subjects (EVSU / UP Diliman / CHED CMO 89 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsgeSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("GE 111",  "Introduction to Geodetic Engineering",                 3, "Geodesy",     "Core",         "History, professional scope, and career pathways in geodesy"),
        ("GE 121",  "Surveying 1 (Plane Surveying)",                         4, "Geodesy",     "Core",         "Distance and angle measurement, traversing, leveling"),
        ("GE 122",  "Surveying 2 (Topographic and Control Surveying)",       4, "Geodesy",     "Core",         "Triangulation, trilateration, topographic mapping"),
        ("GE 131",  "Geodetic Astronomy",                                    3, "Geodesy",     "Core",         "Spherical astronomy, celestial coordinates, azimuth determination"),
        ("GE 141",  "Cartography and Map Projection",                        3, "Geodesy",     "Core",         "Map design, coordinate systems, Mercator and UTM projections"),
        ("GE 151",  "Photogrammetry 1",                                      3, "Geodesy",     "Core",         "Aerial photography, stereoscopy, parallax measurement"),
        ("GE 152",  "Photogrammetry 2 and UAV Mapping",                      3, "Geodesy",     "Core",         "Digital photogrammetry, drone survey, orthophoto generation"),
        ("GE 161",  "Geographic Information Systems (GIS)",                  3, "Geodesy",     "Core",         "Spatial vector/raster data, geodatabases, QGIS/ArcGIS"),
        ("GE 162",  "Advanced GIS and Spatial Modeling",                     3, "Geodesy",     "Core",         "Spatial interpolation, terrain modeling, network analysis"),
        ("GE 170",  "Remote Sensing Principles",                             3, "Geodesy",     "Core",         "Multispectral satellite imagery, spectral signatures, classification"),
        ("GE 171",  "Satellite Positioning and GNSS",                        3, "Geodesy",     "Core",         "GPS/GNSS theory, RTK surveys, baseline processing"),
        ("GE 181",  "Cadastral Surveying and Land Laws",                     3, "Geodesy",     "Core",         "DENR land survey regulations, property titling laws"),
        ("GE 190",  "Hydrographic Surveying",                                3, "Geodesy",     "Core",         "Bathymetry, echo sounding, tidal observation"),
        ("GE 198",  "Geodetic Engineering Research 1",                       3, "Geodesy",     "Professional", "Research methodology and proposal defense"),
        ("GE 199",  "Geodetic Engineering Research 2",                       3, "Geodesy",     "Professional", "Data processing, thesis writing, and final oral defense"),
        ("GE 200",  "Geodetic Engineering Field Practicum",                  6, "Geodesy",     "Professional", "Field surveying immersion with licensed geodetic engineer"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSMATH-specific subjects (UP Baguio / CLSU / CHED CMO 19 s. 2007)
    // ═════════════════════════════════════════════════════════════════════════
    var bsmathSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MATH 121","Fundamental Concepts of Mathematics",                    3, "Mathematics",  "Core",         "Logic, set theory, relations, functions, mathematical proofs"),
        ("MATH 122","Elementary Analysis 1",                                 4, "Mathematics",  "Core",         "Differential calculus of single variable functions"),
        ("MATH 123","Elementary Analysis 2",                                 4, "Mathematics",  "Core",         "Integral calculus and infinite series"),
        ("MATH 124","Elementary Analysis 3",                                 4, "Mathematics",  "Core",         "Multivariable calculus and vector analysis"),
        ("MATH 131","Linear Algebra",                                        3, "Mathematics",  "Core",         "Vector spaces, linear transformations, matrices, determinants"),
        ("MATH 141","Abstract Algebra 1",                                    3, "Mathematics",  "Core",         "Group theory, homomorphisms, cyclic groups"),
        ("MATH 142","Abstract Algebra 2",                                    3, "Mathematics",  "Core",         "Rings, integral domains, fields, Galois theory"),
        ("MATH 151","Real Analysis 1",                                       3, "Mathematics",  "Core",         "Topology of R, sequences, limits, continuity, derivative"),
        ("MATH 152","Real Analysis 2",                                       3, "Mathematics",  "Core",         "Riemann integration, sequences of functions, metric spaces"),
        ("MATH 161","Complex Analysis",                                      3, "Mathematics",  "Core",         "Complex numbers, analytic functions, Cauchy integral theorem"),
        ("MATH 171","Differential Equations",                                3, "Mathematics",  "Core",         "First and second order ODEs, Laplace transforms, systems"),
        ("MATH 181","Numerical Analysis",                                    3, "Mathematics",  "Core",         "Numerical solutions of equations, interpolation, quad methods"),
        ("MATH 191","Topology",                                              3, "Mathematics",  "Core",         "Topological spaces, connectedness, compactness"),
        ("MATH 198","Undergraduate Mathematics Research 1",                  3, "Mathematics",  "Professional", "Research topic formulation and literature survey"),
        ("MATH 199","Undergraduate Mathematics Research 2",                  3, "Mathematics",  "Professional", "Proof development, thesis defense, paper completion"),
        ("MATH 200","Mathematics Practicum",                                 3, "Mathematics",  "Professional", "Applied mathematics immersion in industry/research lab"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSSTAT-specific subjects (VSU / CHED CMO 42 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsstatSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("STAT 121","Statistical Methods 1",                                 3, "Statistics",   "Core",         "Descriptive statistics, basic probability, z/t tests"),
        ("STAT 122","Statistical Methods 2",                                 3, "Statistics",   "Core",         "ANOVA, chi-square, correlation, non-parametric tests"),
        ("STAT 131","Probability Theory 1",                                  3, "Statistics",   "Core",         "Random variables, joint distributions, expectation"),
        ("STAT 132","Probability Theory 2",                                  3, "Statistics",   "Core",         "Limit theorems, moment generating functions, stochastic concepts"),
        ("STAT 141","Mathematical Statistics 1",                             3, "Statistics",   "Core",         "Point estimation, maximum likelihood, sufficiency"),
        ("STAT 142","Mathematical Statistics 2",                             3, "Statistics",   "Core",         "Hypothesis testing theory, Neyman-Pearson, UMP tests"),
        ("STAT 151","Linear Models and Regression Analysis",                 3, "Statistics",   "Core",         "Simple and multiple linear regression, residual diagnostics"),
        ("STAT 152","Design and Analysis of Experiments",                    3, "Statistics",   "Core",         "CRD, RCBD, Latin Square, factorial designs"),
        ("STAT 161","Sampling Techniques",                                   3, "Statistics",   "Core",         "Simple random, stratified, cluster, systematic sampling"),
        ("STAT 171","Time Series Analysis",                                  3, "Statistics",   "Core",         "Stationarity, AR, MA, ARIMA, seasonal forecasting"),
        ("STAT 181","Multivariate Statistical Analysis",                     3, "Statistics",   "Core",         "PCA, factor analysis, discriminant analysis, MANOVA"),
        ("STAT 182","Nonparametric Statistics",                              3, "Statistics",   "Core",         "Rank tests, Wilcoxon, Kruskal-Wallis, Kolmogorov-Smirnov"),
        ("STAT 191","Statistical Computing with R/Python",                   3, "Statistics",   "Core",         "Data manipulation, Monte Carlo simulations, R/Python programming"),
        ("STAT 198","Statistical Research / Thesis 1",                       3, "Statistics",   "Professional", "Research problem formulation and methodology design"),
        ("STAT 199","Statistical Research / Thesis 2",                       3, "Statistics",   "Professional", "Data analysis, thesis manuscript, and oral defense"),
        ("STAT 200","Statistical Internship / Practicum",                    3, "Statistics",   "Professional", "Industry immersion in statistical agency / analytics firm"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSM-specific subjects (IMCC / Palawan State U / CHED CMO 3 s. 2023)
    // ═════════════════════════════════════════════════════════════════════════
    var bsmSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MID 101", "Fundamentals of Midwifery Practice",                    4, "Midwifery",    "Core",         "History of midwifery, basic clinical skills, vital signs"),
        ("MID 102", "Anatomy and Physiology for Midwifery",                  4, "Midwifery",    "Core",         "Human anatomy with emphasis on female reproductive system"),
        ("MID 103", "Primary Health Care and Community Midwifery",           3, "Midwifery",    "Core",         "Community health assessment, PHC principles, maternal care"),
        ("MID 104", "Normal Childbirth and Postpartum Care",                 5, "Midwifery",    "Core",         "Antenatal, intrapartum, and postpartum care of mother and newborn"),
        ("MID 201", "High-Risk Pregnancy and Complications",                 4, "Midwifery",    "Core",         "Obstetric emergencies, hypertensive disorders, hemorrhage"),
        ("MID 202", "Care of Infant and Child",                              3, "Midwifery",    "Core",         "Pediatric care, immunization, child nutrition"),
        ("MID 203", "Midwifery Pharmacology",                                3, "Midwifery",    "Core",         "Uterotonics, antibiotics, analgesics in midwifery"),
        ("MID 204", "Family Planning and Reproductive Health",               3, "Midwifery",    "Core",         "Contraceptive methods, RH law, adolescent health"),
        ("MID 301", "Midwifery Ethics, Jurisprudence and Leadership",        3, "Midwifery",    "Core",         "RA 7392 (Midwifery Law), ethics, clinic management"),
        ("MID 302", "Clinical Midwifery Practicum 1",                        6, "Midwifery",    "Professional", "RLE clinical rotation in birthing centers (actual deliveries)"),
        ("MID 303", "Clinical Midwifery Practicum 2",                        6, "Midwifery",    "Professional", "Advanced clinical rotation in hospital OB wards"),
        ("MID 401", "Advanced Community Midwifery & Health Management",      4, "Midwifery",    "Professional", "Rural health unit management, community organizing"),
        ("MID 402", "Midwifery Research and Seminar",                        3, "Midwifery",    "Professional", "Research design, maternal health studies, seminars"),
        ("MID 403", "Intensive Midwifery Internship",                       12, "Midwifery",    "Professional", "Full hospital and birthing clinic clinical internship"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSAGRI-specific subjects (MMSU SY 2024-2025 / CHED CMO 23 s. 2021)
    // ═════════════════════════════════════════════════════════════════════════
    var bsagriSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("AGRI 10",   "Introduction to Agriculture",                             3, "Agriculture", "Core",         "Overview of Philippine agricultural systems and food security"),
        ("ENGL 01",   "Intensive English",                                       3, "English",     "GE",           "Academic writing, vocabulary, and technical reading"),
        ("ANSC 20",   "Introduction to Animal Science",                          3, "Animal Sci",  "Core",         "Anatomy, physiology, and breeding of farm animals"),
        ("CHEM 30",   "Fundamentals of Organic Chemistry",                       3, "Chemistry",   "Core",         "Structure, functional groups, and organic reactions"),
        ("MATH 01",   "Mathematics in the Modern World",                         3, "Mathematics",  "GE",           "Quantitative reasoning and mathematical tools"),
        ("CRPSC 20",  "Principles of Crop Production",                           3, "Crop Science", "Core",         "Botany, crop physiology, and cultivation principles"),
        ("NSTP 01",   "CWTS 1 / ROTC 1",                                         4, "NSTP",        "NSTP",         "National Service Training Program 1"),
        ("CRPSC 21",  "Practices of Crop Science and Management",                3, "Crop Science", "Core",         "Field crop establishment, management, and harvesting"),
        ("CHEM 41",   "General Biochemistry",                                    3, "Chemistry",   "Core",         "Biomolecules, enzymes, and metabolic pathways"),
        ("ANSC 21",   "Introduction to Livestock and Poultry Production",        3, "Animal Sci",  "Core",         "Livestock and poultry housing, nutrition, and care"),
        ("COMM 01",   "Purposive Communication",                                 3, "English",     "GE",           "Communication in technical and professional contexts"),
        ("SSCI 20",   "Principles of Soil Science",                              3, "Soil Science", "Core",         "Physical, chemical, and biological properties of soil"),
        ("STS 01",    "Science, Technology and Society",                         3, "General Ed",  "GE",           "Interplay of science, tech, and society"),
        ("NSTP 02",   "CWTS 2 / ROTC 2",                                         3, "NSTP",        "NSTP",         "National Service Training Program 2"),
        ("AGRI 100",  "Practicum (Skills Development - 240 hrs)",                6, "Agriculture", "Professional", "Field practicum immersion in agricultural operations"),
        ("SOCSC 01",  "Readings in Philippine History",                          3, "Social Sci",  "GE",           "Primary sources in Philippine history"),
        ("CPROT 20",  "Principles of Crop Protection",                           3, "Crop Prot",   "Core",         "Insect pests, plant pathogens, weeds, and management"),
        ("AGRI 21",   "Principles of Genetics",                                  3, "Agriculture", "Core",         "Mendelian inheritance, molecular genetics, breeding"),
        ("IT 11",     "Living in the IT Era",                                    3, "Information Tech","GE",      "Digital technology and information processing"),
        ("SOCSC 11",  "Gender and Society",                                      3, "Social Sci",  "GE",           "Gender theories and social development"),
        ("SOCSC 02",  "Understanding the Self",                                  3, "Social Sci",  "GE",           "Self-identity, psychology, and personal growth"),
        ("SOCSC 12",  "The Entrepreneurial Mind",                                3, "Management",  "GE",           "Innovation and entrepreneurial venture creation"),
        ("SSCI 21",   "Soil Fertility, Conservation and Management",             3, "Soil Science", "Core",         "Nutrient management, fertilizers, and soil conservation"),
        ("PHILO 1",   "Ethics",                                                  3, "Philosophy",  "GE",           "Moral philosophy and ethical frameworks"),
        ("SOCSC 03",  "The Contemporary World",                                  3, "Social Sci",  "GE",           "Globalization and international economic systems"),
        ("AGEXT 20",  "Principles of Agricultural Extension and Communication",  3, "Extension",   "Core",         "Extension models, adult learning, and communication"),
        ("PI 01",     "Life and Works of Rizal",                                 3, "Social Sci",  "GE",           "Life and writings of Jose Rizal"),
        ("AGRI 40",   "Introduction to Organic Agriculture",                     3, "Agriculture", "Core",         "Organic farming principles and certification"),
        ("AGRI 62",   "Introduction to Agricultural Commodity System",           3, "Agriculture", "Core",         "Agribusiness value chains and commodity marketing"),
        ("CPROT 21",  "Approaches and Practices in Pest Management",             3, "Crop Prot",   "Core",         "Integrated Pest Management (IPM) implementation"),
        ("AGRI 30",   "Methods of Agricultural Research",                        3, "Agriculture", "Core",         "Experimental design and statistical analysis"),
        ("AGRI 63",   "Principles of Agricultural Entrepreneurship and Marketing",3,"Agriculture","Core",        "Agribusiness planning and marketing management"),
        ("AGRI 195",  "Technical Report Writing for Agriculture",                3, "Agriculture", "Core",         "Scientific writing and proposal preparation"),
        ("BIO 198",   "Basic / Agricultural Biotechnology",                      3, "Biology",     "Core",         "Tissue culture, recombinant DNA, agricultural biotech"),
        ("AGRI 200A", "Thesis / Major Farm Practice - Proposal Writing",         2, "Agriculture", "Professional", "Research thesis proposal formulation"),
        ("AGRI 199A", "Seminar A",                                               1, "Agriculture", "Professional", "Seminars on current agricultural innovations"),
        ("CPROT 100", "General Physiology and Toxicology",                       3, "Crop Prot",   "Core",         "Pesticide mode of action and toxicology"),
        ("ANSC 110",  "Slaughter of Animal and Animal Products Processing",     3, "Animal Sci",  "Core",         "Meat processing, dairy technology, and hygiene"),
        ("AGRI 70",   "Introduction to Agricultural Policy and Development",     3, "Agriculture", "Core",         "Agrarian reform, trade policies, agricultural laws"),
        ("CRPSC 110", "Postharvest Handling and Seed Technology",                3, "Crop Science", "Core",         "Postharvest physiology and seed production"),
        ("AGRI 200B", "Thesis / Major Farm Practice - Experimental Conduct",     2, "Agriculture", "Professional", "Conduct of experimental field research"),
        ("AGRI 207",  "Colloquium",                                              1, "Agriculture", "Professional", "Colloquium presentation of research findings"),
        ("AGRI 81",   "Basic Farm Machineries, Mechanization and Water Mgt",     3, "Agriculture", "Core",         "Tractors, irrigation, and farm mechanization"),
        ("CPROT 110", "Beneficial Arthropods and Microorganism",                 3, "Crop Prot",   "Core",         "Biological control agents and pollinators"),
        ("ENSCI 132", "Natural Resources and Environmental Management",          3, "Env Science", "Core",         "Sustainable resource management and conservation"),
        ("HUM 01",    "Art Appreciation",                                        3, "Humanities",  "GE",           "Visual arts, music, and aesthetic analysis"),
        ("AGRI 197A", "TCEP in Agriculture 1",                                   3, "Agriculture", "Professional", "Technology Commercialization Enterprise Program 1"),
        ("AGRI 197B", "TCEP in Agriculture 2",                                   3, "Agriculture", "Professional", "Technology Commercialization Enterprise Program 2"),
        ("AGRI 200C", "Thesis / Major Farm Practice - Manuscript and Defense",   2, "Agriculture", "Professional", "Final thesis manuscript, report, and oral defense"),
        ("AGRI 198",  "Apprenticeship (240 hrs)",                                3, "Agriculture", "Professional", "Agribusiness / farm industry apprenticeship"),
        ("AGRI 199B", "Seminar B",                                               1, "Agriculture", "Professional", "Terminal seminar and career orientation"),
        ("CRPSC 120", "Introduction to Ecological Agriculture",                  3, "Crop Science", "Elective",     "Agroecology and sustainable cropping systems"),
        ("CRPSC 130", "Plant Growth and Development",                            3, "Crop Science", "Elective",     "Plant hormones, photoperiodism, morphogenesis"),
        ("CRPSC 140", "Plant Breeding",                                          3, "Crop Science", "Elective",     "Crop selection, hybridization, and variety release"),
        ("AGRO 110",  "Farming Systems",                                         3, "Agronomy",    "Elective",     "Multiple cropping, agroforestry, cropping patterns"),
        ("AGRO 120",  "Annual Industrial Crops",                                 3, "Agronomy",    "Elective",     "Sugarcane, tobacco, cotton, fiber crop production"),
        ("AGRO 130",  "Grain Legumes and Root Crops",                            3, "Agronomy",    "Elective",     "Peanuts, mungbean, cassava, sweet potato production"),
        ("AGRO 140",  "Cereal Crops",                                            3, "Agronomy",    "Elective",     "Rice, corn, sorghum cultivation and management"),
        ("AGRO 150",  "Weeds and their Control",                                 3, "Agronomy",    "Elective",     "Weed biology, herbicidal control, weed management"),
        ("AGEXT 110", "Community Development",                                   3, "Extension",   "Elective",     "Rural community organization and development"),
        ("AGEXT 120", "Rural Leadership and Group Dynamics",                     3, "Extension",   "Elective",     "Leadership skills in agricultural cooperatives"),
        ("AGEXT 130", "Adult Education",                                         3, "Extension",   "Elective",     "Adult learning theory and non-formal training"),
        ("AGEXT 140", "Methods of Teaching in Agriculture",                      3, "Extension",   "Elective",     "Instructional methods for agricultural extension"),
        ("AGEXT 150", "Audio Visual Education",                                  3, "Extension",   "Elective",     "AV media, broadcasting, and extension materials"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSARCH-specific subjects (Holy Angel University 2018 / CHED CMO 61 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsarchSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("ARDESIGN1",  "Architectural Design 1 – Introduction to Design",        3, "Architecture", "Core",         "Basic design elements, principles, and spatial composition"),
        ("AGRAPHICS1", "Architectural Visual Communications 1 – Graphics 1",      2, "Architecture", "Core",         "Architectural drafting, lettering, geometric construction"),
        ("AVISTECH1",  "Architectural Visual Communications 2 – Visual Tech 1",  2, "Architecture", "Core",         "Freehand drawing, rendering, pencil and ink techniques"),
        ("ARHISTORY1", "History of Architecture 1",                              3, "Architecture", "Core",         "Ancient, Classical, and Early Christian architecture"),
        ("ARORDES",    "Orientation to Architecture with Design Build",          3, "Architecture", "Core",         "Overview of architectural profession and design-build"),
        ("ARTHEORY1",  "Theory of Architecture 1",                               3, "Architecture", "Core",         "Architectural elements, spatial order, function, form"),
        ("SOLIDMEN",   "Solid Mensuration",                                      3, "Mathematics",  "Core",         "Surface areas, volumes, and geometric spatial calculations"),
        ("4FYE1",      "Big History 1: Big Bang to the Future",                  3, "General Ed",  "GE",           "Interdisciplinary view of cosmic and human history"),
        ("THEOLOGY101","Theological Foundations: Judeo-Christian Tradition",     3, "Theology",    "GE",           "Biblical studies and theological foundations"),
        ("CWTS1",      "Civic Welfare Training Services 1",                      3, "NSTP",        "NSTP",         "Community service and civic involvement 1"),
        ("ARDESIGN2",  "Architectural Design 2 – Creative Design Fundamentals",  3, "Architecture", "Core",         "Human scale, anthropometrics, small structure design"),
        ("AINTERIORS", "Architectural Interiors 1",                              3, "Architecture", "Core",         "Interior space planning, furniture layout, finishes"),
        ("AGRAPHICS2", "Architectural Visual Communications 3 – Graphics 2",      2, "Architecture", "Core",         "Orthographic projection, axonometric, perspective drawing"),
        ("AVISTECH2",  "Architectural Visual Communications 4 – Visual Tech 2",  2, "Architecture", "Core",         "Color theory, watercolor, marker rendering techniques"),
        ("ARTHEORY2",  "Theory of Architecture 2",                               3, "Architecture", "Core",         "Design processes, architectural concepts, space syntax"),
        ("DIFFINTCALC","Differential and Integral Calculus",                     3, "Mathematics",  "Core",         "Calculus applications in engineering and architecture"),
        ("4FYE2",      "Big History 2: Looking through Big History Lens",        3, "General Ed",  "GE",           "Humanity, technology, and global futures"),
        ("THEOLOGY102","Special Issues in Catholic Theology",                    3, "Theology",    "GE",           "Contemporary Catholic moral and social teachings"),
        ("CWTS2",      "Civic Welfare Training Services 2",                      3, "NSTP",        "NSTP",         "Community service and civic involvement 2"),
        ("4ARTAPP",    "Art Appreciation",                                       3, "Humanities",  "GE",           "Aesthetic judgment and visual art forms"),
        ("4UNDERSELF", "Understanding the Self",                                 3, "Social Sci",  "GE",           "Identity, self-concept, and personal development"),
        ("ARDESIGN3",  "Architectural Design 3 – Creative Design in Interiors",  3, "Architecture", "Core",         "Residential design and detailed interior architecture"),
        ("AVISTECH3",  "Architectural Visual Communications 5 – Visual Tech 3",  2, "Architecture", "Core",         "Advanced presentation rendering and digital graphics"),
        ("BILDTECH1",  "Building Technology 1 – Building Materials",             3, "Architecture", "Core",         "Wood, masonry, concrete, steel, and composite materials"),
        ("BILDUTIL1",  "Building Utilities 1 – Plumbing and Sanitary Systems",   3, "Architecture", "Core",         "Water supply, drainage, sewage disposal, plumbing codes"),
        ("ARHISTORY2", "History of Architecture 2",                              3, "Architecture", "Core",         "Medieval, Renaissance, and Baroque architecture"),
        ("ENVISCI",    "Environment, Science and Society",                       3, "Science",      "GE",           "Ecology, climate change, environmental sustainability"),
        ("4READPHILHIS","Readings in Philippine History",                        3, "Social Sci",  "GE",           "Primary historical documents of the Philippines"),
        ("ARDESIGN4",  "Architectural Design 4 – Space Planning 1",              3, "Architecture", "Core",         "Medium-rise commercial and public building design"),
        ("BILDTECH2",  "Building Technology 2 – Construction Drawings (1-Storey)",3,"Architecture","Core",        "Wood/masonry working drawings and construction details"),
        ("ARHISTORY3", "History of Architecture 3",                              3, "Architecture", "Core",         "19th & 20th century, Modernism, Post-Modernism"),
        ("TROPICDES",  "Tropical Design",                                        3, "Architecture", "Core",         "Passive cooling, solar shading, tropical microclimates"),
        ("STATICS-AR", "Statics of Rigid Bodies",                                3, "Engineering",  "Core",         "Force vectors, equilibrium, trusses, shear/moment diagrams"),
        ("SURVEYING",  "Surveying",                                              3, "Engineering",  "Core",         "Land surveying, leveling, contour mapping for site planning"),
        ("THEOLOGY103","Christian Spirituality in the Contemporary World",       3, "Theology",    "GE",           "Spiritual life, social justice, Christian witness"),
        ("4CONWORLD",  "The Contemporary World",                                 3, "Social Sci",  "GE",           "Global economy, governance, and cultural integration"),
        ("ARDESIGN5",  "Architectural Design 5 – Space Planning 2",              3, "Architecture", "Core",         "Complex multi-story commercial and mixed-use structures"),
        ("BILDTECH3",  "Building Technology 3 – Construction Drawings (2-Storey)",3,"Architecture","Core",        "Reinforced concrete working drawings and details"),
        ("BILDUTIL2",  "Building Utilities 2 – Electrical, Electronics & Mech",  3, "Architecture", "Core",         "Wiring, HVAC, vertical transportation, fire protection"),
        ("CADD-AR1",   "Computer-Aided Design and Drafting for Architecture 1",   3, "Architecture", "Core",         "2D AutoCAD drafting, layers, blocks, layout sheets"),
        ("ARHISTORY4", "History of Architecture 4",                              3, "Architecture", "Core",         "Vernacular and contemporary Philippine architecture"),
        ("PROPRAC1",   "Professional Practice 1 – Laws Affecting Architecture",  3, "Architecture", "Core",         "RA 9266 (Architecture Act), National Building Code, BP 344"),
        ("STRENGTH",   "Strength of Materials",                                  3, "Engineering",  "Core",         "Stress, strain, torsion, beam deflection, column buckling"),
        ("ARDESIGN6",  "Architectural Design 6 – Site Planning & Landscaping 1", 3, "Architecture", "Core",         "Site analysis, slope grading, landscape design"),
        ("BILDTECH4",  "Building Technology 4 – Specification Writing & Costing",3, "Architecture", "Core",         "CSI specifications, quantity surveying, cost estimating"),
        ("BILDUTIL3",  "Building Utilities 3 – Acoustics and Lighting Systems",  3, "Architecture", "Core",         "Architectural acoustics, noise control, lighting design"),
        ("CADD-AR2",   "Computer-Aided Design 2 / Building Information Modeling",3,"Architecture", "Core",         "3D Revit/BIM modeling, parametric family creation"),
        ("HOUSE",      "Housing",                                                3, "Architecture", "Core",         "Socialized housing, urban shelter policy, subdivision design"),
        ("ARPLAN1",    "Planning 1 – Site Planning and Landscape Architecture",  3, "Architecture", "Core",         "Subdivision planning, site grading, open space systems"),
        ("PROPRAC2",   "Professional Practice 2 – Administering Regular Services",3,"Architecture", "Core",        "Architectural fee structures, contracts, project administration"),
        ("STRUCTURES", "Theory of Structures",                                   3, "Engineering",  "Core",         "Statically determinate and indeterminate structure analysis"),
        ("3FIL1",      "Kontekswalisadong Komunikasyon sa Filipino",              3, "Filipino",     "GE",           "Filipino in contextual communication"),
        ("1PURCOMM",   "Purposive Communication",                                3, "English",     "GE",           "Multimodal communication and public speech"),
        ("9STS",       "Science, Technology and Society",                        3, "Science",      "GE",           "Societal implications of scientific developments"),
        ("ARDESIGN7",  "Architectural Design 7 – Community Architecture & Urban",4, "Architecture", "Core",         "Urban design, community redevelopment, transport nodes"),
        ("BILDTECH5",  "Building Technology 5 – Alternative Construction System",3,"Architecture","Core",        "Pre-cast concrete, curtain walls, tension structures"),
        ("ARPLAN2",    "Planning 2 – Fundamentals of Urban Design & Community",  3, "Architecture", "Core",         "Urban spatial morphology, zoning, master planning"),
        ("PROPRAC3",   "Professional Practice 3 – Global Practice in 21st Century",3,"Architecture","Core",       "Global practice, international codes, AIA/UAP ethics"),
        ("STEELTIMB",  "Steel and Timber Design",                                3, "Engineering",  "Core",         "Structural steel member design, timber trusses, connections"),
        ("3FIL2",      "Filipino sa Iba't Ibang Disiplina",                       3, "Filipino",     "GE",           "Filipino research writing across academic fields"),
        ("ARDESIGN8",  "Architectural Design 8 – Design of Complex Structures",  4, "Architecture", "Core",         "High-rise towers, airports, stadium design"),
        ("RESMETHAR",  "Research Methods for Architecture",                      3, "Architecture", "Core",         "Research methodologies, data gathering, thesis proposal"),
        ("ARSTRUCTS",  "Architectural Structures",                               3, "Engineering",  "Core",         "Advanced structural systems, seismic & wind load design"),
        ("ARPLAN3",    "Planning 3 – Introduction to Urban & Regional Planning",  3, "Architecture", "Core",         "Regional land use planning, GIS in planning"),
        ("COMPRE",     "Architecture Comprehensive Course",                      3, "Architecture", "Core",         "Integrative review for Architecture licensure exam"),
        ("AROJT",      "Architecture On-the-Job Training (320 hours)",           5, "Architecture", "Professional", "Practicum immersion in architectural firm"),
        ("1LIT12",     "Great Books",                                            3, "Literature",   "GE",           "Masterpieces of world literature"),
        ("4ETHICS",    "Ethics",                                                 3, "Philosophy",  "GE",           "Moral philosophy and social responsibility"),
        ("4RIZAL",     "Life and Works of Rizal",                                3, "Social Sci",  "GE",           "Rizal's life, essays, and novels"),
        ("ARDESIGN9",  "Architectural Design 9 – Thesis Research Writing 1",     5, "Architecture", "Professional", "Architecture thesis research manuscript, book 1"),
        ("BMGMTAPP1",  "Business Management & Application for Architecture 1",   3, "Management",  "Core",         "Architectural firm management, marketing, accounting"),
        ("SPCIALIZN1", "Specialization 1 (Heritage Conservation / Urban Design)", 3, "Architecture", "Elective",     "Architectural heritage conservation or urban design"),
        ("SPCIALIZN2", "Specialization 2 (Construction Mgt / Community Plan)",   3, "Architecture", "Elective",     "Construction management or community development"),
        ("ARDESIGN10", "Architectural Design 10 – Thesis Research Application",  5, "Architecture", "Professional", "Architectural thesis final design execution & defense"),
        ("BMGMTAPP2",  "Business Management & Application for Architecture 2",   3, "Management",  "Core",         "Project management, feasibility studies, firm operations"),
        ("SPCIALIZN3", "Specialization 3 (Facilities Mgt / GIS / Proj Mgt)",    3, "Architecture", "Elective",     "Building facilities administration, GIS, or project mgt"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSECE-specific subjects (EVSU SY 2018-2019 / CHED CMO 101 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bseceSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("GEN ED 001", "Purposive Communication",                                3, "General Ed",  "GE",           "Multimodal communication in academic/professional contexts"),
        ("GEN ED 004", "Mathematics in Modern World",                            3, "Mathematics",  "GE",           "Mathematical nature and quantitative decision tools"),
        ("MATH 114",   "Calculus 1",                                             4, "Mathematics",  "Core",         "Limits, continuity, derivatives, and applications"),
        ("MATH ENHANCE 1","College Algebra & Calculus Enhancement",             3, "Mathematics",  "Core",         "Algebraic manipulation, trigonometry, calculus bridge"),
        ("PHYS 1",     "Physics for Engineers 1",                                4, "Physics",      "Core",         "Mechanics, fluids, wave motion with lab"),
        ("CHEM 11",    "Chemistry for Engineers",                                4, "Chemistry",   "Core",         "General chemistry, electrochemistry, materials chemistry"),
        ("CAD 111",    "Computer-Aided Drafting",                                1, "Engineering",  "Core",         "2D/3D CAD drawing for electronics engineering"),
        ("PE 112",     "PATHFIT: Movement Competency Training",                  2, "Physical Ed",  "PE",           "Physical fitness and movement foundations"),
        ("NSTP 113",   "NSTP 1",                                                 3, "NSTP",        "NSTP",         "Civic welfare / military training 1"),
        ("GEN ED 002", "Understanding the Self",                                 3, "General Ed",  "GE",           "Personal identity and psychological development"),
        ("GEN ED 008", "Science, Technology & Society",                          3, "General Ed",  "GE",           "Impact of science and tech on human culture"),
        ("MATH 124",   "Calculus 2",                                             4, "Mathematics",  "Core",         "Integration techniques, series, multivariable calculus"),
        ("MATH ENHANCE 2","Analytic Geometry & Solid Mensuration",               3, "Mathematics",  "Core",         "Conic sections, spatial geometry, vector algebra"),
        ("PHYS 2",     "Physics 2",                                              4, "Physics",      "Core",         "Electricity, magnetism, optics, modern physics"),
        ("MSE 123",    "Materials Science and Engineering",                      3, "Engineering",  "Core",         "Atomic bonding, crystal structures, semiconductor physics"),
        ("MGT 122",    "Engineering Management",                                 2, "Management",  "Core",         "Planning, organizing, and managing engineering teams"),
        ("PE 122",     "PATHFIT: Fitness Training",                              2, "Physical Ed",  "PE",           "Structured exercise and physical fitness 2"),
        ("NSTP 123",   "NSTP 2",                                                 3, "NSTP",        "NSTP",         "Civic welfare / military training 2"),
        ("GEN ED 007", "The Contemporary World",                                 3, "General Ed",  "GE",           "Global systems, economic markets, international trends"),
        ("GEN ED 003", "Readings in Philippine History",                         3, "General Ed",  "GE",           "Primary source analysis of Philippine history"),
        ("MATH 213",   "Differential Equations",                                 3, "Mathematics",  "Core",         "First/higher order ODEs, Laplace transforms, Fourier series"),
        ("ECE 214",    "Circuits 1",                                             4, "Electronics",  "Core",         "DC/AC circuit analysis, Kirchhoff laws, network theorems"),
        ("ECE 234",    "Electronics 1: Electronic Devices & Circuits",           4, "Electronics",  "Core",         "Diodes, BJTs, FETs, biasing, small-signal amplifiers"),
        ("COMP 212",   "Computer Programming",                                   2, "Computer Eng", "Core",         "C++/Python programming for engineering problem solving"),
        ("PE 212",     "PATHFIT: Dance/Sports/Outdoor Activities",               2, "Physical Ed",  "PE",           "Physical activity and sport specialization 3"),
        ("EDA 213",    "Engineering Data Analysis",                              4, "Statistics",   "Core",         "Probability, hypothesis testing, ANOVA, regression"),
        ("GEN ED 005", "Art Appreciation",                                       3, "General Ed",  "GE",           "Visual arts, music, and aesthetic analysis"),
        ("GEN ED 006", "Ethics",                                                 3, "General Ed",  "GE",           "Moral philosophy and professional ethics"),
        ("ECE 223",    "Advanced Engineering Mathematics for ECE",               4, "Electronics",  "Core",         "Complex variables, partial differential eq, matrices"),
        ("ECE 224",    "Circuits 2",                                             4, "Electronics",  "Core",         "Transient analysis, resonant circuits, two-port networks"),
        ("ECE 244",    "Electronics 2: Electronic Circuit Analysis and Design",  4, "Electronics",  "Core",         "Op-amps, power amplifiers, frequency response, feedback"),
        ("ECE 264",    "Communications 1: Principles of Comm Systems",           4, "Electronics",  "Core",         "Signals, AM, FM, phase modulation, receivers/transmitters"),
        ("ECE 284",    "Electromagnetics",                                       4, "Electronics",  "Core",         "Vector calculus, Electrostatics, Magnetostatics, Maxwell eq"),
        ("PE 222",     "PATHFIT 4",                                              2, "Physical Ed",  "PE",           "Physical activity and sport specialization 4"),
        ("FIL 001",    "Akademiko sa Wikang Filipino",                           3, "Filipino",     "GE",           "Filipino in academic contexts"),
        ("ECE 314",    "Digital Electronics 1: Logic Circuits & Switching",      4, "Electronics",  "Core",         "Boolean algebra, combinational & sequential logic, PLDs"),
        ("ECE 334",    "Electronics 3: Electronic Systems and Design",           4, "Electronics",  "Core",         "Power electronics, oscillators, IC regulators, timers"),
        ("ECE 354",    "Signals, Spectra, Signal Processing",                    4, "Electronics",  "Core",         "Continuous/discrete Fourier transforms, Z-transform, FIR/IIR"),
        ("ECE 374",    "Communications 2: Modulation & Coding Techniques",       4, "Electronics",  "Core",         "PCM, ASK, FSK, PSK, QAM, channel coding, multiplexing"),
        ("ECON 313",   "Engineering Economics",                                  3, "Economics",    "Core",         "Money-time relationships, cash flows, depreciation, ROI"),
        ("FIL 002",    "Pagbasa at Pagsulat sa Iba’t-Ibang Disciplina",           3, "Filipino",     "GE",           "Filipino research writing across disciplines"),
        ("ECE 324",    "Communications 3: Transmission Media & Antennas",        4, "Electronics",  "Core",         "Transmission lines, waveguides, antenna parameters, radio wave"),
        ("ECE 344",    "Communications 4: Data Communications",                  4, "Electronics",  "Core",         "OSI layers, data link protocols, IP routing, LAN/WAN"),
        ("ECE 364",    "Digital Electronics 2: Microprocessor/Microcontrollers", 4, "Electronics",  "Core",         "Architecture, assembly language, GPIO, timers, interrupts"),
        ("ECE 384",    "Feedback and Control Systems",                           4, "Electronics",  "Core",         "Block diagrams, transfer functions, root locus, Bode plot"),
        ("ECE 383",    "Methods of Research",                                    3, "Electronics",  "Core",         "Research design, literature review, technical proposal"),
        ("ECE 303",    "On-the-Job Training (240 hours)",                        3, "Electronics",  "Professional", "Industry immersion in telecommunications/electronics firm"),
        ("RIZAL 001",  "Rizal's Life and Works",                                 3, "General Ed",  "GE",           "Life, works, and writings of Jose Rizal"),
        ("ECE 413",    "Technopreneurship 101 for ECE",                          3, "Engineering",  "Core",         "Tech startup business models, pitching, intellectual property"),
        ("ECE 411",    "Design 1 / Capstone Project 1",                          1, "Electronics",  "Professional", "Capstone engineering project proposal & initial design"),
        ("ECE 414",    "ECE Elective 1",                                         4, "Electronics",  "Elective",     "Specialized ECE elective (e.g. VLSI, Robotics, RF)"),
        ("ENV 413",    "Environmental Science and Engineering",                  3, "Env Science",  "Core",         "Environmental impact assessment, pollution control"),
        ("ECE 433",    "ECE Laws, Contracts, Ethics, Standards & Safety",        3, "Electronics",  "Core",         "RA 9292 (ECE Law), NTC rules, PEC, professional ethics"),
        ("LIT 001",    "Panitikang Filipino",                                    3, "Literature",   "GE",           "Philippine literary traditions"),
        ("ECE 401",    "Seminars / Colloquium",                                  1, "Electronics",  "Professional", "Industry seminars and technical paper presentation"),
        ("ECE 421",    "Design 2 / Capstone Project 2",                          1, "Electronics",  "Professional", "Capstone prototype build, testing, and final defense"),
        ("ECE 424",    "ECE Elective 2",                                         4, "Electronics",  "Elective",     "Specialized ECE elective 2"),
        ("ECE 422",    "Special Topics",                                         2, "Electronics",  "Professional", "Emerging technologies in electronics engineering"),
        ("DRR 113",    "Disaster Risk Reduction & Education in Emergencies",     3, "General Ed",  "GE",           "Disaster preparedness, risk reduction, emergency mgmt"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSCpE-specific subjects (UP Diliman AY 2018-2019 / CHED CMO 87 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bscpeSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("PHILO 1",    "Philosophy",                                             3, "Philosophy",  "GE",           "Critical thinking, logic, and epistemological frameworks"),
        ("EEE 111",    "Circuit Analysis 1",                                     3, "EEE",         "Core",         "Resistive circuits, Kirchhoff laws, Nodal/Mesh analysis"),
        ("EEE 113",    "Digital Elements and Circuits",                          3, "EEE",         "Core",         "Logic gates, Boolean algebra, combinational circuit design"),
        ("EEE 118",    "Circuit Analysis Laboratory 1",                          1, "EEE",         "Core",         "Breadboarding, multimeters, oscilloscopes, DC circuits"),
        ("Math 21",    "Elementary Analysis I",                                  5, "Mathematics",  "Core",         "Functions, limits, continuity, differential calculus"),
        ("Physics 71", "Elementary Physics I",                                   4, "Physics",      "Core",         "Mechanics, work, energy, rotational dynamics"),
        ("ENG 13",     "Writing in the Discipline",                              3, "English",     "GE",           "Academic writing, argumentation, research synthesis"),
        ("Speech 30",  "Speech Communication",                                   3, "Speech",      "GE",           "Public speaking, interpersonal, and group speech"),
        ("EEE 121",    "Circuit Analysis 2",                                     3, "EEE",         "Core",         "RLC circuits, sinusoidal steady-state, AC power, transformers"),
        ("EEE 123",    "Electronic Circuits",                                    3, "EEE",         "Core",         "Semiconductors, diodes, transistors, amplifiers"),
        ("EEE 128",    "Electronic Circuits Laboratory",                         1, "EEE",         "Core",         "Diode clippers, BJT/FET amplifiers, AC measurements"),
        ("Math 22",    "Elementary Analysis II",                                 5, "Mathematics",  "Core",         "Techniques of integration, parametric equations, series"),
        ("Physics 72", "Elementary Physics II",                                  4, "Physics",      "Core",         "Electricity, magnetism, electromagnetic waves"),
        ("EEE 131",    "Signals and Systems",                                    3, "EEE",         "Core",         "Continuous and discrete-time signals, Fourier/Laplace"),
        ("EEE 133",    "Microprocessor Systems",                                 3, "EEE",         "Core",         "Microprocessor architecture, bus systems, assembly programming"),
        ("EEE 135",    "Data Structures and Algorithms for EEE",                 3, "EEE",         "Core",         "Arrays, trees, graphs, sorting, searching in C++"),
        ("EEE 137",    "Electromagnetics 1",                                     3, "EEE",         "Core",         "Vector calculus, electrostatics, magnetostatics"),
        ("EEE 138",    "Microprocessor Systems Laboratory",                      1, "EEE",         "Core",         "Assembly language programming, microcontroller interfacing"),
        ("Math 23",    "Elementary Analysis III",                                5, "Mathematics",  "Core",         "Multivariable calculus, line/surface integrals, Stokes thm"),
        ("Math 40",    "Linear Algebra for Engineers",                           3, "Mathematics",  "Core",         "Vector spaces, matrices, linear transformations, eigenvalues"),
        ("EEE 141",    "Communication Systems",                                  3, "EEE",         "Core",         "Analog and digital modulation, noise, multiplexing"),
        ("EEE 143",    "Control Systems",                                        3, "EEE",         "Core",         "Linear feedback control, stability, frequency response"),
        ("EEE 145",    "Computer Architecture",                                  3, "EEE",         "Core",         "Pipelining, memory hierarchy, cache, instruction set arch"),
        ("EEE 147",    "Power Systems",                                          3, "EEE",         "Core",         "Three-phase systems, transformers, power flow analysis"),
        ("EEE 148",    "Communication Systems Laboratory",                       1, "EEE",         "Core",         "Modulation experiments, RF measurements, spectrum analyzers"),
        ("ES 101",     "Mechanics of Particles and Rigid Bodies",                3, "Engineering",  "Core",         "Statics and dynamics of engineering structures"),
        ("EEE 151",    "Digital Signal Processing",                              3, "EEE",         "Core",         "Discrete-time Fourier transform, DFT, FFT, FIR/IIR filters"),
        ("EEE 153",    "Embedded Systems",                                       3, "EEE",         "Core",         "RTOS, embedded C, sensor/actuator interfacing"),
        ("EEE 155",    "Computer Networks",                                      3, "EEE",         "Core",         "TCP/IP protocol stack, routing, socket programming"),
        ("EEE 157",    "Integrated Circuit Design",                              3, "EEE",         "Core",         "CMOS digital IC design, layout, timing analysis"),
        ("EEE 158",    "Digital Signal Processing Laboratory",                   1, "EEE",         "Core",         "MATLAB/DSP hardware filter design implementation"),
        ("Physics 73", "Elementary Physics III",                                 4, "Physics",      "Core",         "Thermodynamics, optics, quantum physics"),
        ("CoE 161",    "Computer Engineering Fundamentals",                      3, "Computer Eng", "Core",         "Hardware-software interface, logic synthesis, hardware description"),
        ("CoE 163",    "Computing Architectures and Algorithms",                 3, "Computer Eng", "Core",         "High-performance software and microarchitectural optimizations"),
        ("CoE 164",    "Computing Platforms",                                    3, "Computer Eng", "Core",         "Parallel and heterogeneous computing platform lab"),
        ("EEE 192",    "Engineering Research Methods",                           3, "EEE",         "Core",         "Research ethics, proposal writing, experimental design"),
        ("CoE 165",    "Computer Organization and Embedded Systems II",          3, "Computer Eng", "Core",         "Advanced SOC design, FPGA synthesis, embedded Linux"),
        ("CoE 167",    "Computing Systems",                                      3, "Computer Eng", "Core",         "Distributed computer systems, virtualization, cloud computing"),
        ("CoE 168",    "Computing Solutions for Contemporary Issues",            3, "Computer Eng", "Core",         "Capstones laboratory applying computing to real problems"),
        ("EEE 196",    "Engineering Capstone Proposal",                          3, "EEE",         "Core",         "Project specification and architectural design proposal"),
        ("CoE 197",    "Computer Engineering Internship",                        3, "Computer Eng", "Professional", "Industry immersion in computer engineering setting"),
        ("CoE 198",    "Computer Engineering Project 1",                         3, "Computer Eng", "Professional", "Capstone prototype construction and laboratory testing"),
        ("CoE 199",    "Special Projects in Computer Engineering",               3, "Computer Eng", "Professional", "Final capstone project implementation and oral defense"),
        ("PI 100",     "The Life and Works of Rizal",                            3, "Social Sci",  "GE",           "Life, works, and writings of Jose Rizal"),
        ("CoE 133",    "Computer Systems Engineering I",                         3, "Computer Eng", "Core",         "Hardware description languages and computer design 1"),
        ("CoE 134",    "Computer Systems Engineering II",                        3, "Computer Eng", "Core",         "Hardware description languages and computer design 2"),
        ("CoE 135",    "Operating Systems for CpE",                              3, "Computer Eng", "Core",         "Process management, virtual memory, file systems for CpE"),
        ("CoE 111",    "Advanced Digital Design",                                3, "Computer Eng", "Core",         "FPGA design, VHDL/Verilog synthesis, timing closure"),
        ("CoE 23",     "Synthesis of Sequential Circuits",                       3, "Computer Eng", "Core",         "Finite state machines, asynchronous sequential circuits"),
        ("CoE 121",    "Digital Signal Processing Applications",                 3, "Computer Eng", "Core",         "DSP algorithm implementation on specialized hardware"),
        ("CoE 127",    "Audio and Speech Signal Processing",                     3, "Computer Eng", "Elective",     "Speech recognition, audio compression, acoustic modeling"),
        ("CoE 129",    "Real-Time Digital Signal Processing",                    3, "Computer Eng", "Elective",     "Real-time DSP architectures and DSP chip programming"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSCE-specific subjects (UP Diliman AY 2018-2019 / CHED CMO 92 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsceSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("Eng 13",     "Writing in the Discipline",                              3, "English",     "GE",           "Academic writing, research synthesis, technical prose"),
        ("Speech 30",  "Speech Communication",                                   3, "Speech",      "GE",           "Public speaking, presentation, and persuasion"),
        ("Chem 16",    "Chemistry",                                              3, "Chemistry",   "Core",         "General chemistry principles for engineers"),
        ("Chem 16.1",  "Chemistry Laboratory",                                   1, "Chemistry",   "Core",         "General chemistry laboratory experiments"),
        ("Math 21",    "Elementary Analysis I",                                  5, "Mathematics",  "Core",         "Differential calculus of single variable functions"),
        ("Physics 71", "Elementary Physics I",                                   4, "Physics",      "Core",         "Mechanics, energy, fluid dynamics, rotational motion"),
        ("Physics 71.1","Elementary Physics I Laboratory",                       1, "Physics",      "Core",         "Mechanics and physics laboratory experiments"),
        ("Math 22",    "Elementary Analysis II",                                 5, "Mathematics",  "Core",         "Integral calculus, series, polar coordinates"),
        ("Physics 72", "Elementary Physics II",                                  4, "Physics",      "Core",         "Electricity, magnetism, electromagnetic waves"),
        ("Physics 72.1","Elementary Physics II Laboratory",                      1, "Physics",      "Core",         "Electromagnetism laboratory experiments"),
        ("ES 1",       "Engineering Drawing",                                    1, "Engineering",  "Core",         "Orthographic projection, isometric drawing, CAD basics"),
        ("GE 10",      "Surveying-related GE requirement",                       3, "Geodetic Eng", "GE",           "General surveying and topographic principles"),
        ("CE 1",       "Introduction to Civil Engineering",                      1, "Civil Eng",    "Core",         "Overview of civil engineering sub-disciplines and profession"),
        ("CE 29",      "Probability and Statistics for Engineering",             3, "Civil Eng",    "Core",         "Probability distributions, statistical inference, risk analysis"),
        ("Math 23",    "Elementary Analysis III",                                5, "Mathematics",  "Core",         "Multivariable calculus and vector analysis"),
        ("ES 101",     "Mechanics of Particles and Rigid Bodies",                3, "Engineering",  "Core",         "Statics and dynamics of engineering structures"),
        ("GE 12",      "Surveying-related requirement",                          3, "Geodetic Eng", "Core",         "Engineering survey, route surveying, leveling"),
        ("CE 11",      "Engineering Geology / Geologic Engineering",             3, "Civil Eng",    "Core",         "Geological hazards, rocks, minerals, soil origin"),
        ("CE 24",      "Mathematical Methods in Civil Engineering I",            3, "Civil Eng",    "Core",         "Differential equations applied to civil engineering"),
        ("CE 43",      "General Civil Engineering Course",                       3, "Civil Eng",    "Core",         "Infrastructure systems and civil engineering concepts"),
        ("ES 102",     "Mechanics of Deformable Bodies",                         3, "Engineering",  "Core",         "Stress, strain, axial loads, torsion, flexure, deflection"),
        ("CE 17",      "Fluid Mechanics",                                        3, "Civil Eng",    "Core",         "Fluid statics, hydrodynamics, pipe flow, open channel flow"),
        ("CE 22",      "Engineering Economics",                                  3, "Civil Eng",    "Core",         "Cost estimation, time value of money, project evaluation"),
        ("CE 25",      "Mathematical Methods in Civil Engineering II",           3, "Civil Eng",    "Core",         "Numerical methods, partial differential eq, linear algebra"),
        ("CE 31",      "Construction Materials",                                 3, "Civil Eng",    "Core",         "Aggregates, concrete mix design, steel, asphalt, timber"),
        ("CE 130",     "Elements of Environmental and Energy Engineering",       3, "Civil Eng",    "Core",         "Water quality, air pollution, waste management, energy"),
        ("CE 18",      "Solid Mechanics",                                        3, "Civil Eng",    "Core",         "Advanced mechanics of deformable bodies, energy methods"),
        ("CE 115",     "Water Resources and Coastal Engineering I",              3, "Civil Eng",    "Core",         "Hydrology, rainfall-runoff, open channel hydraulics"),
        ("CE 123",     "Construction Engineering and Management I",              3, "Civil Eng",    "Core",         "Construction methods, CPM/PERT scheduling, equipment"),
        ("CE 141",     "Transportation Engineering I",                           3, "Civil Eng",    "Core",         "Highway geometric design, traffic engineering, pavements"),
        ("CE 151",     "Structural Engineering I",                               3, "Civil Eng",    "Core",         "Structural analysis, trusses, frames, influence lines"),
        ("CE 162",     "Geotechnical Engineering I",                             3, "Civil Eng",    "Core",         "Soil classification, compaction, permeability, seepage"),
        ("CE 116",     "Water Resources and Coastal Engineering II",             3, "Civil Eng",    "Core",         "Coastal hydraulics, wave mechanics, flood control"),
        ("CE 124",     "Construction Engineering and Management II",             3, "Civil Eng",    "Core",         "Cost estimating, bidding, safety, contracts"),
        ("CE 132",     "Sanitary Engineering I",                                 3, "Civil Eng",    "Core",         "Water treatment plant design, water distribution networks"),
        ("CE 142",     "Transportation Engineering II",                          3, "Civil Eng",    "Core",         "Transportation planning, public transit, airport/rail design"),
        ("CE 152",     "Structural Engineering II",                              3, "Civil Eng",    "Core",         "Reinforced concrete beam, column, and slab design"),
        ("CE 163",     "Geotechnical Engineering II",                            3, "Civil Eng",    "Core",         "Shallow/deep foundations, slope stability, retaining walls"),
        ("CE 190",     "Seminar and Research Methods in Civil Engineering",      3, "Civil Eng",    "Core",         "Research methodology, technical writing, seminar lectures"),
        ("CE 195",     "Civil Engineering Internship (200 hrs)",                 3, "Civil Eng",    "Professional", "Industry internship in civil engineering firm / site"),
        ("DRMAPS",     "Disaster Risk Mitigation, Adaptation and Preparedness",  3, "General Ed",  "GE",           "Natural hazard assessment and risk reduction strategies"),
        ("CE 199",     "Undergraduate Research Project",                         3, "Civil Eng",    "Professional", "CE thesis research execution, manuscript, and defense"),
        ("CE 196",     "Civil Engineering Design Project",                       3, "Civil Eng",    "Professional", "Integrative capstone design of major civil structure"),
        ("CE 117",     "Water Resources and Coastal Engineering III",            3, "Civil Eng",    "Elective",     "Advanced coastal engineering and hydraulic structures"),
        ("CE 118",     "Multipurpose Water Resources Development",               3, "Civil Eng",    "Elective",     "Dam engineering, reservoir operation, water resources"),
        ("CE 125",     "Construction Engineering and Management III",            3, "Civil Eng",    "Elective",     "Advanced project management, Lean construction, BIM"),
        ("CE 133",     "Sanitary Engineering II",                                3, "Civil Eng",    "Elective",     "Wastewater treatment design and sludge management"),
        ("CE 134",     "Hazardous Waste Minimization",                           3, "Civil Eng",    "Elective",     "Toxic waste remediation and industrial ecology"),
        ("CE 135",     "Environmental Geotechnology",                            3, "Civil Eng",    "Elective",     "Landfill liners, contaminant transport, soil remediation"),
        ("CE 143",     "Transportation Engineering III",                         3, "Civil Eng",    "Elective",     "Traffic simulation, intelligent transportation systems"),
        ("CE 153",     "Structural Engineering III",                             3, "Civil Eng",    "Elective",     "Structural steel design, seismic design of structures"),
        ("CE 164",     "Geotechnical Engineering III",                           3, "Civil Eng",    "Elective",     "Rock mechanics, soil dynamics, ground improvement"),
        ("CE 197",     "Special Topics in CE",                                   3, "Civil Eng",    "Elective",     "Specialized emerging topics in civil engineering"),
        ("CE 198",     "Special Problems in CE",                                 3, "Civil Eng",    "Elective",     "Independent study or special engineering problem"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSME-specific subjects (EVSU SY 2025-2026 / CHED CMO 97 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsmeSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("EO 111",     "Orientation to Mechanical Engineering",                  1, "Mechanical Eng","Core",         "Overview of mechanical engineering profession"),
        ("BOSH 113",   "Basic Occupational Safety and Health",                   3, "Safety Eng",   "Core",         "Industrial safety, hazard identification, OSHA/DOLE rules"),
        ("MGT 112",    "Engineering Management",                                 2, "Management",  "Core",         "Engineering administration, planning, decision models"),
        ("MATH 113",   "Calculus 1 (Differential Calculus)",                     3, "Mathematics",  "Core",         "Limits, derivatives, maxima/minima, rate problems"),
        ("DRAW 111 D", "Engineering Drawing",                                    1, "Engineering",  "Core",         "Orthographic projection, dimensioning, technical drawing"),
        ("COMP 111 L", "Computer Fundamentals and Programming for ME",           1, "Computer Eng", "Core",         "C++/Python programming for mechanical problems"),
        ("ECON 123",   "Engineering Economics",                                  3, "Economics",    "Core",         "Capital budgeting, cash flows, depreciation, breakeven"),
        ("MATH 123",   "Calculus 2 (Integral Calculus)",                         3, "Mathematics",  "Core",         "Integration techniques, areas, volumes, centroids"),
        ("PHYS 125",   "Physics for Engineers",                                  5, "Physics",      "Core",         "Calculus-based physics: mechanics, thermodynamics, waves"),
        ("CHEM 123",   "Chemistry for Engineers",                                3, "Chemistry",   "Core",         "General chemistry principles for engineering"),
        ("CHEM 121 L", "Chemistry for Engineers Laboratory",                     1, "Chemistry",   "Core",         "Chemistry laboratory experiments"),
        ("MATH 213",   "Differential Equations",                                 3, "Mathematics",  "Core",         "First and higher order ODEs, Laplace, applications"),
        ("CAD 211",    "Computer-Aided Drafting",                                1, "Engineering",  "Core",         "AutoCAD/SolidWorks 2D and 3D drafting for ME"),
        ("MECH 213",   "Statics of Rigid Bodies",                                3, "Engineering",  "Core",         "Resultants, equilibrium, trusses, friction, moments"),
        ("ME 213",     "Thermodynamics 1",                                       3, "Mechanical Eng","Core",         "Properties of pure substances, 1st & 2nd laws of thermo"),
        ("ME 211 L",   "Workshop Theory and Practice",                           1, "Mechanical Eng","Core",         "Hand tools, bench work, welding, basic fabrication"),
        ("MECH 222",   "Dynamics of Rigid Bodies",                               2, "Engineering",  "Core",         "Kinematics and kinetics of particles and rigid bodies"),
        ("MATH 223",   "Advanced Mathematics for Mechanical Engineering",        3, "Mathematics",  "Core",         "Complex numbers, linear algebra, vector analysis for ME"),
        ("ME 222",     "Heat Transfer",                                          2, "Mechanical Eng","Core",         "Conduction, convection, radiation, heat exchangers"),
        ("ME 243",     "Fluid Mechanics",                                        3, "Mechanical Eng","Core",         "Fluid statics, Bernoulli eq, pipe friction, dimensional analysis"),
        ("ME 222 L",   "Machine Shop Theory",                                    2, "Mechanical Eng","Core",         "Lathe machine, milling, shaping, benchwork operations"),
        ("COMP 221 L", "Computer Application for ME",                            1, "Mechanical Eng","Core",         "MATLAB/LabVIEW applications in thermal and mechanical design"),
        ("MECH 313",   "Mechanics of Deformable Bodies",                         3, "Engineering",  "Core",         "Stress, strain, torsion, beam deflections, thin-walled cylinders"),
        ("EDA 313",    "Engineering Data Analysis",                              3, "Statistics",   "Core",         "Probability distributions, regression, experimental design"),
        ("ME 333",     "Fluid Machineries",                                      3, "Mechanical Eng","Core",         "Pumps, fans, blowers, compressors, hydraulic turbines"),
        ("ME 353",     "Refrigeration System",                                   3, "Mechanical Eng","Core",         "Vapor compression, absorption refrigeration, psychrometrics"),
        ("ME 373",     "Thermodynamics 2",                                       3, "Mechanical Eng","Core",         "Vapor & gas power cycles, IC engine cycles, mixtures"),
        ("EE 313",     "Basic Electrical Engineering",                           5, "Electrical Eng","Core",        "DC/AC circuits, magnetic circuits, transformers"),
        ("IE 303",     "Technopreneurship 101",                                  3, "Engineering",  "Core",         "Technology startup creation, business models, funding"),
        ("ME 323",     "Machine Elements",                                       3, "Mechanical Eng","Core",         "Fasteners, keys, shafts, couplings, springs, belts"),
        ("ME 321",     "Methods of Research for Mechanical Engineering",         1, "Mechanical Eng","Core",         "Research formulation, technical literature, proposal"),
        ("ME 342",     "Combustion Engineering",                                 2, "Mechanical Eng","Core",         "Fuel chemistry, combustion stoichiometry, flame kinetics"),
        ("ME 362",     "Vibration Engineering",                                  2, "Mechanical Eng","Core",         "Single/multi DOF vibrations, harmonic motion, damping"),
        ("ME 343",     "Air-Conditioning and Ventilation Systems",               3, "Mechanical Eng","Core",         "Cooling load calculation, duct design, HVAC systems"),
        ("ME 311 L",   "Mechanical Engineering Laboratory 1",                    1, "Mechanical Eng","Core",         "Measurements of pressure, temperature, fluid flow, viscosity"),
        ("EE 323",     "Basic Electronics",                                      5, "Electrical Eng","Core",        "Semiconductor devices, diodes, transistors, power supplies"),
        ("ME 301",     "On-the-Job Training (240 hours)",                        3, "Mechanical Eng","Professional", "Industry immersion in manufacturing/power plant setting"),
        ("ME 412",     "ME Elective 1: Design of Building & Piping System",     2, "Mechanical Eng","Elective",     "Piping codes, building MEP design, pump selection"),
        ("ME 413",     "Control Engineering",                                    3, "Mechanical Eng","Core",         "Control loops, PID controllers, pneumatic/hydraulic controls"),
        ("ME 432",     "Machine Design 1",                                       3, "Mechanical Eng","Core",         "Design of shafts, gears, bearings, brakes, clutches"),
        ("ME 452",     "ME Laws, Ethics, Contracts, Codes and Industry",         2, "Mechanical Eng","Core",         "RA 8495 (ME Law), PSME Code, contracts, ethics"),
        ("ME 414",     "Power Plant Design with Renewable Energy",               4, "Mechanical Eng","Core",         "Steam, hydro, diesel, solar, wind power plant design"),
        ("ME 411 L",   "Mechanical Engineering Project Study 1",                 1, "Mechanical Eng","Professional", "Project study proposal and engineering simulation"),
        ("ME 412 L",   "Mechanical Engineering Laboratory 2",                    2, "Mechanical Eng","Core",         "Testing of IC engines, refrigeration, and fluid machinery"),
        ("EE 413",     "DC and AC Machineries",                                  3, "Electrical Eng","Core",        "DC motors, generators, induction & synchronous motors"),
        ("ME 473",     "Correlation Course for Mechanical Engineering I",        3, "Mechanical Eng","Professional", "Comprehensive review of ME mathematics & power plant"),
        ("ME 423",     "Material Science and Engineering for ME",                3, "Mechanical Eng","Core",         "Phase diagrams, heat treatment, alloy steel selection"),
        ("ME 424",     "Industrial Plant Engineering",                           4, "Mechanical Eng","Core",         "Plant layout, piping systems, compressed air, safety"),
        ("ME 421 L",   "Mechanical Engineering Project Study 2",                 1, "Mechanical Eng","Professional", "Prototype build, testing, final project report & defense"),
        ("ME 413 L",   "Mechanical Engineering Laboratory 3",                    2, "Mechanical Eng","Core",         "Power plant testing, steam boiler & turbine performance"),
        ("ME 422",     "ME Elective 2: Mechatronics",                            2, "Mechanical Eng","Elective",     "Robotics, sensors, microcontrollers in mechanical systems"),
        ("ME 442",     "Machine Design 2",                                       3, "Mechanical Eng","Core",         "Integrative machine design project and CAD synthesis"),
        ("ME 443",     "Manufacturing and Industrial Process with Plant Visit",  2, "Mechanical Eng","Core",         "Casting, forming, machining, automation, industrial visits"),
        ("ME 463",     "Correlation Course for Mechanical Engineering II",       3, "Mechanical Eng","Professional", "Comprehensive review of machine design & industrial plant"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSPHYS-specific subjects (UP Baguio / CHED CMO 13 s. 2024)
    // ═════════════════════════════════════════════════════════════════════════
    var bsphysSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("Physics 101",   "Fundamental Physics I: Mechanics and Thermodynamics",   4, "Physics",      "Core",         "Kinematics, dynamics, energy, momentum, fluid mechanics, heat"),
        ("Physics 101.1", "Fundamental Physics I Laboratory",                       1, "Physics",      "Core",         "Laboratory experiments in mechanics and thermodynamics"),
        ("Math 53",       "Elementary Analysis I: Differential Calculus",          5, "Mathematics",  "Core",         "Limits, continuity, derivatives, optimization, curve sketching"),
        ("Physics 102",   "Fundamental Physics II: Electromagnetism and Optics",   4, "Physics",      "Core",         "Electrostatics, electric currents, magnetic fields, induction, optics"),
        ("Physics 102.1", "Fundamental Physics II Laboratory",                      1, "Physics",      "Core",         "Laboratory experiments in electromagnetism and optics"),
        ("Physics 121",   "Mathematical Methods in Physics I",                     4, "Physics",      "Core",         "Vector analysis, complex numbers, matrices, differential equations"),
        ("Math 54",       "Elementary Analysis II: Integral Calculus",             5, "Mathematics",  "Core",         "Integration techniques, infinite series, parametric equations"),
        ("Physics 103",   "Fundamental Physics III: Waves, Fluids, and Optics",    4, "Physics",      "Core",         "Wave motion, acoustics, physical optics, interference, diffraction"),
        ("Physics 103.1", "Fundamental Physics III Laboratory",                     1, "Physics",      "Core",         "Laboratory experiments in wave optics and acoustics"),
        ("Physics 122",   "Mathematical Methods in Physics II",                    4, "Physics",      "Core",         "Partial differential equations, Fourier series, orthogonal functions"),
        ("Physics 131",   "Computational Physics",                                 4, "Physics",      "Core",         "Numerical methods, scientific simulation, computational modeling"),
        ("Physics 104",   "Modern Physics I: Relativity and Quantum Foundations",   4, "Physics",      "Core",         "Special relativity, photo-electric effect, atomic spectra, quantum intro"),
        ("Physics 104.1", "Modern Physics I Laboratory",                            1, "Physics",      "Core",         "Laboratory experiments in atomic physics and relativity"),
        ("Physics 123",   "Mathematical Methods in Physics III",                   4, "Physics",      "Core",         "Complex analysis, boundary value problems, tensor analysis"),
        ("Physics 161",   "Theoretical Mechanics I",                               3, "Physics",      "Core",         "Lagrangian mechanics, central force motion, rigid body dynamics"),
        ("Physics 171",   "Electromagnetic Theory I",                              3, "Physics",      "Core",         "Electrostatics, magnetostatics, Maxwell equations, dielectric media"),
        ("Physics 173",   "Electronic Physics",                                    4, "Physics",      "Core",         "Semiconductor physics, analog circuit design, op-amps, instrumentation"),
        ("Physics 172",   "Electromagnetic Theory II",                             3, "Physics",      "Core",         "Electromagnetic waves, waveguides, radiation, relativistic electrodynamics"),
        ("Physics 181",   "Quantum Physics I",                                     3, "Physics",      "Core",         "Schrodinger equation, wavepackets, operator algebra, harmonic oscillator"),
        ("Physics 162",   "Theoretical Mechanics II",                              3, "Physics",      "Core",         "Hamiltonian mechanics, canonical transformations, perturbation theory"),
        ("Physics 165",   "Statistical Physics I",                                 3, "Physics",      "Core",         "Ensemble theory, Maxwell-Boltzmann, Bose-Einstein, Fermi-Dirac statistics"),
        ("Physics 175",   "Optical Physics",                                       3, "Physics",      "Core",         "Laser physics, Fourier optics, coherence, non-linear optics"),
        ("Physics 182",   "Quantum Physics II",                                    3, "Physics",      "Core",         "Angular momentum, spin, hydrogen atom, perturbation techniques"),
        ("Physics 199",   "Undergraduate Research",                                3, "Physics",      "Professional", "Independent physics research and literature survey"),
        ("Chem 18",       "Introductory Physical Chemistry",                       4, "Chemistry",   "Core",         "Thermodynamics of chemical systems, kinetics, electrochemistry"),
        ("Chem 18.1",     "Introductory Physical Chemistry Laboratory",            1, "Chemistry",   "Core",         "Physical chemistry laboratory experiments"),
        ("Physics 183",   "Solid State Physics",                                   3, "Physics",      "Core",         "Crystal structure, phonon vibrations, band theory, semiconductors"),
        ("Physics 195",   "Special Topics in Physics and Applied Physics",         3, "Physics",      "Professional", "Advanced topics in contemporary physics"),
        ("Physics 196",   "Undergraduate Seminar",                                 1, "Physics",      "Professional", "Presentation of physics research topics"),
        ("Physics 200",   "Undergraduate Thesis",                                  3, "Physics",      "Professional", "Final thesis execution, manuscript preparation, and defense"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSAPHY-specific subjects (UP Diliman Instrumentation / CHED CMO 13 s. 2024)
    // ═════════════════════════════════════════════════════════════════════════
    var bsaphySubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("Physics 106",   "Physics I: Mechanics and Heat for Applied Physics",     4, "Physics",      "Core",         "Mechanics, kinematics, thermodynamics for applied physics majors"),
        ("Physics 106.1", "Physics I Laboratory",                                  1, "Physics",      "Core",         "Physics I laboratory experiments"),
        ("Geol 11",       "Principles of Geology",                                 3, "Geology",      "Core",         "Earth materials, plate tectonics, geological processes"),
        ("Geol 11.1",     "Geology Laboratory",                                    1, "Geology",      "Core",         "Mineral and rock identification, topographic map reading"),
        ("Chem 16",       "General Chemistry",                                     3, "Chemistry",   "Core",         "Chemical principles, atomic structure, stoichiometry"),
        ("Chem 16.1",     "General Chemistry Laboratory",                          1, "Chemistry",   "Core",         "General chemistry experiments"),
        ("Physics 10",    "Physics and Astronomy for Pedestrians",                 3, "Physics",      "GE",           "Conceptual overview of classical & modern astronomy"),
        ("Physics 107",   "Physics II: Electromagnetism and Optics",               4, "Physics",      "Core",         "Electrostatics, circuits, magnetism, waves, optics"),
        ("Physics 107.1", "Physics II Laboratory",                                 1, "Physics",      "Core",         "Electromagnetism and optics laboratory experiments"),
        ("Physics 116",   "Mathematical Physics I",                                3, "Physics",      "Core",         "Differential equations, linear algebra, vector calculus"),
        ("Math 122",      "Differential Equations and Applications",              3, "Mathematics",  "Core",         "First and higher order ODEs, Laplace transforms"),
        ("Physics 108",   "Physics III: Modern Physics and Quantum Intro",         4, "Physics",      "Core",         "Special relativity, quantum concepts, atomic structure"),
        ("Physics 117",   "Mathematical Physics II",                               3, "Physics",      "Core",         "Partial differential equations and special functions"),
        ("Physics 126",   "Electrodynamics I for Applied Physics",                 3, "Physics",      "Core",         "Electrostatics, magnetostatics, boundary value problems"),
        ("App Physics 181","Physical Electronics I: Circuits and Semiconductors",  3, "Applied Physics","Core",       "Diode/transistor circuits, operational amplifiers, sensors"),
        ("App Physics 155","Computer Methods in Physics I",                        3, "Applied Physics","Core",       "C++/Python programming for scientific data processing"),
        ("Physics 131",   "Electrodynamics II",                                    3, "Physics",      "Core",         "Maxwell equations, electromagnetic waves, radiation"),
        ("Physics 141",   "Quantum Physics I",                                     3, "Physics",      "Core",         "Wavefunctions, Schrodinger equation, quantum states"),
        ("Physics 132",   "Classical Mechanics for Applied Physics",               3, "Physics",      "Core",         "Lagrangian formulation, rigid bodies, central force"),
        ("Physics 142",   "Quantum Physics II",                                    3, "Physics",      "Core",         "Angular momentum, hydrogen atom, perturbation theory"),
        ("Physics 165",   "Statistical Physics I",                                 3, "Physics",      "Core",         "Thermodynamic potentials, kinetic theory, quantum statistics"),
        ("Physics 191",   "Experimental Physics I",                                3, "Physics",      "Professional", "Advanced measurement techniques, vacuum systems, optics"),
        ("App Physics 157","Computer Methods in Physics II",                       3, "Applied Physics","Core",       "Microcontroller programming, embedded systems, FPGA"),
        ("Physics 170",   "Advanced Physics Laboratory / Optics",                  3, "Physics",      "Core",         "Lasers, interferometry, spectroscopy experiments"),
        ("Physics 192",   "Experimental Physics II",                               3, "Physics",      "Professional", "Advanced physical measurements and system calibration"),
        ("App Physics 167","Data Acquisition and Digital Signal Processing",       3, "Applied Physics","Core",       "ADCs, Fourier transforms, digital filtering, DAQ boards"),
        ("App Physics 184","Instrumentation Physics",                              3, "Applied Physics","Core",       "Sensor design, signal conditioning, industrial instrumentation"),
        ("App Physics 199","Undergraduate Research",                               3, "Applied Physics","Professional", "Applied physics research project formulation"),
        ("Physics 151",   "Statistical Physics II",                                3, "Physics",      "Core",         "Phase transitions, critical phenomena, non-equilibrium stat phys"),
        ("Physics 161",   "Introductory Laser Physics",                            3, "Physics",      "Core",         "Laser cavities, stimulated emission, optical resonators"),
        ("App Physics 200","Undergraduate Thesis",                                 3, "Applied Physics","Professional", "Applied physics thesis execution and final defense"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSAPMATH-specific subjects (UP Diliman / CHED CMO 48 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bsapmathSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("Math 20",       "Precalculus",                                           3, "Mathematics",  "Core",         "Algebraic functions, trigonometry, analytic geometry"),
        ("Math 108",      "Foundations of Abstract Mathematics",                   3, "Mathematics",  "Core",         "Logic, set theory, proof techniques, relations, functions"),
        ("Math 110.1",    "Abstract Algebra I",                                    3, "Mathematics",  "Core",         "Groups, subgroups, homomorphisms, quotient groups"),
        ("Math 110.2",    "Abstract Algebra II",                                   3, "Mathematics",  "Core",         "Rings, ideals, polynomial rings, field extensions"),
        ("Math 110.3",    "Abstract Algebra III",                                  3, "Mathematics",  "Core",         "Galois theory, module theory, advanced algebra"),
        ("Math 123.1",    "Advanced Calculus I",                                   3, "Mathematics",  "Core",         "Metric spaces, sequences, continuity, compactness"),
        ("Math 123.2",    "Advanced Calculus II",                                   3, "Mathematics",  "Core",         "Multivariable differentiation, inverse function theorem, integration"),
        ("Math 126",      "Real Analysis",                                         3, "Mathematics",  "Core",         "Measure theory, Lebesgue integration, L^p spaces"),
        ("Math 128",      "Complex Analysis",                                      3, "Mathematics",  "Core",         "Analytic functions, Cauchy integral theorem, residue calculus"),
        ("Math 117",      "Elementary Theory of Numbers",                          3, "Mathematics",  "Core",         "Divisibility, congruences, quadratic reciprocity, prime numbers"),
        ("Math 199",      "Undergraduate Thesis / Special Problem",                3, "Mathematics",  "Professional", "Applied mathematics research paper and oral defense"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // JD-specific subjects (LEB MO 24 s. 2021 Model Curriculum)
    // ═════════════════════════════════════════════════════════════════════════
    var jdSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("JD 101", "Philosophy of Law",                                          2, "Law",          "Core",         "Schools of legal thought, jurisprudence, natural law"),
        ("JD 102", "Legal Research and Writing",                                 2, "Law",          "Core",         "Legal citations, statutory construction, brief writing"),
        ("JD 103", "Legal Methods",                                              3, "Law",          "Core",         "Case analysis, judicial reasoning, legal logic"),
        ("JD 104", "Constitutional Law I",                                       3, "Law",          "Core",         "Structure of Philippine government, sovereignty, separation of powers"),
        ("JD 105", "Criminal Law I",                                             3, "Law",          "Core",         "General principles of criminal liability, penalties"),
        ("JD 106", "Persons and Family Relations",                               3, "Law",          "Core",         "Civil Code provisions on persons, marriage, family relationships"),
        ("JD 107", "Basic Legal and Judicial Ethics",                            3, "Law",          "Core",         "Code of Professional Responsibility, Judicial Ethics"),
        ("JD 108", "Obligations and Contracts",                                  5, "Law",          "Core",         "Nature, sources, effects of obligations, contracts, quasi-contracts"),
        ("JD 109", "Constitutional Law II",                                      4, "Law",          "Core",         "Bill of Rights, citizenship, fundamental freedoms"),
        ("JD 110", "Criminal Law II",                                            4, "Law",          "Core",         "Specific crimes defined under the Revised Penal Code"),
        ("JD 201", "Property",                                                   4, "Law",          "Core",         "Ownership, possession, usufruct, easements, land titles"),
        ("JD 202", "Criminal Procedure",                                         4, "Law",          "Core",         "Rules of Court on prosecution of offenses, arrest, search, bail"),
        ("JD 203", "Sales",                                                      3, "Law",          "Core",         "Law on sales, lease, barter, assignment of credit"),
        ("JD 204", "Labor Law I",                                                3, "Law",          "Core",         "Labor standards, conditions of employment, minimum wage"),
        ("JD 205", "Civil Procedure",                                            4, "Law",          "Core",         "Actions, jurisdiction, pleadings, trial, judgment, execution"),
        ("JD 206", "Credit Transactions",                                        3, "Law",          "Core",         "Loans, mortgages, pledge, antichresis, guaranty, concurrence of credits"),
        ("JD 207", "Labor Law II",                                               3, "Law",          "Core",         "Labor relations, unions, collective bargaining, strike law"),
        ("JD 208", "Public International Law",                                   3, "Law",          "Core",         "Law of nations, treaties, state responsibility, international tribunals"),
        ("JD 209", "Special Penal Laws",                                         3, "Law",          "Core",         "Anti-graft law, dangerous drugs act, cybercrime law, special penal legislation"),
        ("JD 301", "Evidence",                                                   4, "Law",          "Core",         "Rules of evidence, admissibility, burden of proof, examination of witnesses"),
        ("JD 302", "Partnerships, Agency and Trusts",                            3, "Law",          "Core",         "Civil law rules on partnerships, agency contracts, express & implied trusts"),
        ("JD 303", "Wills and Succession",                                       4, "Law",          "Core",         "Testamentary & intestate succession, compulsory heirs, legitimes"),
        ("JD 304", "Taxation I",                                                 3, "Law",          "Core",         "General principles of taxation, National Internal Revenue Code, income tax"),
        ("JD 305", "Intellectual Property Law",                                  3, "Law",          "Core",         "Patents, trademarks, copyright, IP code of the Philippines"),
        ("JD 306", "Corporation and Securities Law",                             4, "Law",          "Core",         "Revised Corporation Code, SEC rules, corporate governance, SRC"),
        ("JD 307", "Legal Forms",                                                2, "Law",          "Core",         "Drafting of deeds, contracts, judicial pleadings, affidavits"),
        ("JD 308", "Special Proceedings",                                        3, "Law",          "Core",         "Settlement of estates, guardianship, habeas corpus, adoption"),
        ("JD 309", "Taxation II",                                                3, "Law",          "Core",         "Transfer taxes, VAT, local taxation, tariff and customs code"),
        ("JD 310", "Torts and Damages",                                          3, "Law",          "Core",         "Quasi-delicts, strict liability, damages under the Civil Code"),
        ("JD 311", "Clinical Legal Education Program (CLEP)",                    4, "Law",          "Professional", "Practical legal aid, client counseling, court appearance under Rule 138-A"),
        ("JD 401", "Civil Law Review and Integration I",                         3, "Law",          "Professional", "Comprehensive bar review & integration of Persons, Property, Wills"),
        ("JD 402", "Commercial Law Review and Integration I",                    3, "Law",          "Professional", "Comprehensive bar review of Corporations, Securities, Banking laws"),
        ("JD 403", "Political and International Law Review and Integration",     3, "Law",          "Professional", "Comprehensive bar review of Constitutional Law, Admin Law, Intl Law"),
        ("JD 404", "Remedial Law Review and Integration I",                      3, "Law",          "Professional", "Comprehensive bar review of Civil Procedure & Criminal Procedure"),
        ("JD 405", "Labor Law Review and Integration",                           3, "Law",          "Professional", "Comprehensive bar review of Labor Standards & Labor Relations"),
        ("JD 406", "Criminal Law Review and Integration",                        3, "Law",          "Professional", "Comprehensive bar review of Criminal Law I, II, & Special Penal Laws"),
        ("JD 407", "Civil Law Review and Integration II",                        3, "Law",          "Professional", "Comprehensive bar review of Obligations, Contracts, Torts, Sales"),
        ("JD 408", "Commercial Law Review and Integration II",                   3, "Law",          "Professional", "Comprehensive bar review of IP Law, Insurance, Credit Transactions"),
        ("JD 409", "Remedial Law Review and Integration II",                     3, "Law",          "Professional", "Comprehensive bar review of Evidence, Special Proceedings, Rules of Court"),
        ("JD 410", "Taxation Law Review and Integration",                        3, "Law",          "Professional", "Comprehensive bar review of NIRC, Local Tax, Tariff laws"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // LLM-specific subjects (UST Graduate School of Law / LEB)
    // ═════════════════════════════════════════════════════════════════════════
    var llmSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("GS 500",    "St. Thomas and Critical Thinking",                        3, "Law",          "Graduate",     "Thomistic philosophy, logic, legal epistemology"),
        ("GS 501",    "Research Methods in Law",                                 3, "Law",          "Graduate",     "Legal research methodology, comparative law research"),
        ("LAW 600",   "Foundations of Public and Private Law",                   3, "Law",          "Graduate",     "Advanced analysis of constitutional theory, jurisprudence, civil law"),
        ("LAW 601",   "Philosophy of Law",                                       3, "Law",          "Graduate",     "Contemporary legal philosophy, human rights theory, justice"),
        ("LAW 603",   "Issues in Legal and Judicial Ethics",                     3, "Law",          "Graduate",     "Professional ethics in global legal practice, judicial integrity"),
        ("LAW 701",   "Labor and Social Legislations",                           3, "Law",          "Graduate",     "Comparative labor law, international labor standards, social security"),
        ("LAW 702",   "Corporate Law and Corporate Rehabilitation",              3, "Law",          "Graduate",     "Corporate governance, FRIA insolvency, corporate restructuring"),
        ("LAW 703",   "Legal and Tax Aspects of Business Organizations",         3, "Law",          "Graduate",     "Tax structuring, corporate taxation, cross-border business law"),
        ("GSLAW 724", "Competition Law and Antitrust",                           3, "Law",          "Graduate",     "Philippine Competition Act, anti-competitive agreements, merger control"),
        ("LAW 790",   "Cognate / Thesis-Related Elective",                       3, "Law",          "Graduate",     "Specialized legal seminar aligned with student thesis topic"),
        ("TW I",      "Thesis Writing I – Proposal Writing",                     3, "Law",          "Graduate",     "Formulation and defense of LL.M. thesis proposal"),
        ("TW II",     "Thesis Writing II – Research Colloquium",                 3, "Law",          "Graduate",     "Presentation of preliminary LL.M. research findings at faculty colloquium"),
        ("TW III",    "Thesis Writing III – Manuscript & Final Oral Defense",    3, "Law",          "Graduate",     "Final LL.M. thesis manuscript submission and oral defense"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MSCYBER-specific subjects (DLSU / HAU / CHED CMO 07 s. 2010)
    // ═════════════════════════════════════════════════════════════════════════
    var mscyberSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("SEC 501",   "IT Foundations: Networks, Database & System Administration", 3, "Info Security", "Graduate", "Operating system internals, TCP/IP networks, relational databases"),
        ("SEC 502",   "Introduction to Information Security",                    3, "Info Security", "Graduate", "CIA triad, threat modeling, security architecture, cryptography intro"),
        ("SEC 503",   "Technical Writing for IT Security",                       2, "Info Security", "Graduate", "Technical reporting, security policy drafting, incident documentation"),
        ("SEC 601",   "Application and Data Security",                           3, "Info Security", "Graduate", "Secure coding, OWASP top 10, database encryption, API security"),
        ("SEC 602",   "Network Security and Cryptography",                       3, "Info Security", "Graduate", "Firewalls, IDS/IPS, VPNs, AES/RSA cryptography, PKI infrastructure"),
        ("SEC 603",   "IT Security Project 1",                                   2, "Info Security", "Graduate", "Formulation of cybersecurity project specification & architectural blueprint"),
        ("SEC 701",   "Vulnerability Assessment and Penetration Testing",        3, "Info Security", "Graduate", "Ethical hacking, Kali Linux tools, exploit development, VA scanners"),
        ("SEC 702",   "Cybersecurity Operations and Incident Response",          3, "Info Security", "Graduate", "SIEM management, digital forensics, malware analysis, SOC procedures"),
        ("SEC 801",   "System Continuity and Disaster Recovery",                 3, "Info Security", "Graduate", "Business continuity planning, BCP/DRP standards, backup strategies"),
        ("SEC 802",   "Governance, Risk Management, and Compliance",             3, "Info Security", "Graduate", "ISO 27001, NIST framework, Data Privacy Act of 2012, risk assessment"),
        ("SEC 803",   "IT Security Project 2 – Capstone Defense",                2, "Info Security", "Graduate", "Execution, prototype demonstration, and defense of IT security project"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MSCS-specific subjects (UP Diliman DCS)
    // ═════════════════════════════════════════════════════════════════════════
    var mscsSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("CS 204",    "Theory of Computation",                                   3, "Computer Science", "Graduate", "Automata theory, formal languages, Turing machines, decidability"),
        ("CS 208",    "Complexity Theory",                                       3, "Computer Science", "Graduate", "P vs NP, NP-completeness, space complexity, randomized complexity"),
        ("CS 210",    "Advanced Algorithms and Data Structures",                 3, "Computer Science", "Graduate", "Amortized analysis, advanced tree structures, approximation algorithms"),
        ("CS 214",    "Parallel Algorithms",                                     3, "Computer Science", "Graduate", "PRAM models, parallel sorting/searching, GPU computing algorithms"),
        ("CS 233",    "Probabilistic Methods in Computer Science",               3, "Computer Science", "Graduate", "Markov chains, randomized algorithms, probabilistic analysis"),
        ("CS 236",    "Scientific Computing",                                    3, "Computer Science", "Graduate", "Numerical linear algebra, matrix decompositions, differential eq solvers"),
        ("CS 239",    "Parallel Computing",                                      3, "Computer Science", "Graduate", "MPI/OpenMP programming, distributed memory architectures"),
        ("CS 240",    "Computer Graphics and Visualization",                     3, "Computer Science", "Graduate", "Ray tracing, OpenGL/Vulkan rendering, volume rendering"),
        ("CS 242",    "Data Visualization Techniques",                           3, "Computer Science", "Graduate", "Visual encoding, perception, interactive data dashboards"),
        ("CS 245",    "Network Optimization",                                    3, "Computer Science", "Graduate", "Flow networks, shortest path algorithms, network design problems"),
        ("CS 300",    "Master's Thesis in Computer Science",                     6, "Computer Science", "Graduate", "Independent MS research, manuscript preparation, and oral defense"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MSDS-specific subjects (Batangas State University)
    // ═════════════════════════════════════════════════════════════════════════
    var msdsSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MSDS 500",  "Fundamentals of Data Science",                            3, "Data Science", "Graduate",     "Data science lifecycle, Python/R environment, data wrangling"),
        ("MSDS 501",  "Big Data and Cloud Computing",                            3, "Data Science", "Graduate",     "Hadoop, Spark, AWS/GCP cloud architectures, distributed storage"),
        ("MSDS 502",  "Data Visualization and Storytelling",                     3, "Data Science", "Graduate",     "Exploratory data analysis, Tableau/Seaborn dashboards, presentation"),
        ("MSDS 503",  "Machine Learning and Neural Networks",                    3, "Data Science", "Graduate",     "Supervised & unsupervised learning, deep learning, PyTorch"),
        ("MSDS 504",  "Mathematical and Computational Theories for Data Science",3, "Data Science", "Graduate",     "Linear algebra, multivariate calculus, optimization, probability"),
        ("MSDS 505",  "Seminars in Data Science",                                3, "Data Science", "Graduate",     "Research seminars on emerging data science applications"),
        ("MSDS 510",  "Advanced Data Mining and Predictive Analytics",           3, "Data Science", "Elective",     "Association rules, time series forecasting, feature engineering"),
        ("MSDS 511",  "Deep Learning and Natural Language Processing",           3, "Data Science", "Elective",     "Transformers, LLMs, BERT, computer vision, attention mechanisms"),
        ("MSDS 520",  "Thesis 1 – Proposal",                                     3, "Data Science", "Graduate",     "Formulation and defense of MSDS research proposal"),
        ("MSDS 521",  "Thesis 2 – Defense",                                      3, "Data Science", "Graduate",     "Final thesis manuscript preparation, research output, and oral defense"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // MD-specific subjects (UST Faculty of Medicine & Surgery / CHED CMO 18 s. 2016)
    // ═════════════════════════════════════════════════════════════════════════
    var mdSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("MED 101",   "Gross and Clinical Anatomy",                              6, "Anatomy",      "Core",         "Cadaver dissection, regional anatomy, clinical anatomical correlations"),
        ("MED 102",   "Medical Biochemistry",                                    5, "Biochemistry", "Core",         "Biomolecules, metabolic pathways, molecular genetics, enzymology"),
        ("MED 103",   "Medical Physiology",                                      5, "Physiology",   "Core",         "Cellular, cardiovascular, respiratory, renal, and endocrine physiology"),
        ("MED 104",   "Histology and Cell Biology",                              4, "Anatomy",      "Core",         "Microscopic structure of tissues and organ systems"),
        ("MED 105",   "Basic Neuroscience I",                                    3, "Neurosciences","Core",         "Neuroanatomy, neurophysiology, neural pathways"),
        ("MED 106",   "Preventive, Family and Community Medicine I",             3, "Preventive Med","Core",        "Primary health care, community diagnosis, family medicine principles"),
        ("MED 107",   "Clinical Epidemiology I",                                 2, "Preventive Med","Core",        "Biostatistics, study designs, evidence-based medicine intro"),
        ("MED 108",   "Medical Ethics I",                                        2, "Ethics",       "Core",         "Bioethics, patient rights, physician-patient relationship"),
        ("MED 201",   "General and Systemic Pathology",                          6, "Pathology",    "Core",         "Cellular injury, inflammation, neoplasia, organ systemic pathology"),
        ("MED 202",   "Medicine I: Clinical Physical Diagnosis",                 5, "Medicine",     "Core",         "History taking, physical examination skills, clinical reasoning"),
        ("MED 203",   "Pharmacology and Therapeutics",                           5, "Pharmacology", "Core",         "Pharmacokinetics, pharmacodynamics, clinical drug therapeutics"),
        ("MED 204",   "Medical Microbiology and Immunology",                     4, "Microbiology", "Core",         "Bacteriology, virology, mycology, immunology principles"),
        ("MED 205",   "Surgery I: Principles of Surgery",                        4, "Surgery",      "Core",         "Asepsis, wound healing, surgical infections, pre/post-op care"),
        ("MED 206",   "Clinical Pathology",                                      3, "Pathology",    "Core",         "Hematology, clinical chemistry, urinalysis, blood banking"),
        ("MED 207",   "Medical Parasitology",                                    3, "Microbiology", "Core",         "Protozoology, helminthology, medical entomology"),
        ("MED 208",   "Obstetrics I: Fundamentals of Obstetrics",                4, "Obstetrics",   "Core",         "Maternal physiology, normal labor, prenatal care"),
        ("MED 209",   "Medical Ethics II",                                       2, "Ethics",       "Core",         "Ethical dilemmas in clinical practice and organ transplantation"),
        ("MED 210",   "Preventive, Family and Community Medicine II",            3, "Preventive Med","Core",        "Environmental health, occupational medicine, health programs"),
        ("MED 211",   "Basic Neuroscience II",                                   3, "Neurosciences","Core",         "Clinical neurophysiology, neuropathology intro"),
        ("MED 212",   "Behavioral Medicine I",                                   2, "Psychiatry",   "Core",         "Human behavior, doctor-patient communication, psychopathology"),
        ("MED 213",   "Clinical Epidemiology II",                                2, "Preventive Med","Core",        "Critical appraisal of medical literature, diagnostic tests"),
        ("MED 214",   "Pediatrics I: Growth and Development",                    4, "Pediatrics",   "Core",         "Child development, infant nutrition, immunization"),
        ("MED 215",   "Anesthesiology",                                          2, "Anesthesiology","Core",        "General & local anesthesia, airway management, resuscitation"),
        ("MED 301",   "Medicine II: Clinical Internal Medicine",                 6, "Medicine",     "Core",         "Cardiology, pulmonology, gastroenterology, nephrology, endocrinology"),
        ("MED 302",   "Surgery II: Surgical Specialties",                        5, "Surgery",      "Core",         "Orthopedics, urology, neurosurgery, TCVS, pediatric surgery"),
        ("MED 303",   "Pediatrics II: Clinical Pediatrics",                      5, "Pediatrics",   "Core",         "Pediatric infectious diseases, neonatology, pediatric ICU"),
        ("MED 304",   "Obstetrics II: High Risk Obstetrics",                     4, "Obstetrics",   "Core",         "Complications of pregnancy, operative obstetrics"),
        ("MED 305",   "Gynecology",                                              3, "Obstetrics",   "Core",         "Gynecologic disorders, pelvic surgery, gynecologic oncology"),
        ("MED 306",   "Clinical Neurology",                                      3, "Neurology",    "Core",         "Stroke, epilepsy, neuromuscular disorders, dementia"),
        ("MED 307",   "Behavioral Medicine II",                                  2, "Psychiatry",   "Core",         "Clinical psychiatry, mood disorders, psychopharmacology"),
        ("MED 308",   "Legal Medicine and Medical Jurisprudence",                2, "Legal Med",    "Core",         "Medical malpractice, forensic pathology, expert testimony"),
        ("MED 309",   "Ophthalmology",                                           2, "Ophthalmology","Core",         "Ocular diseases, refraction, cataracts, glaucoma"),
        ("MED 310",   "Otorhinolaryngology",                                     2, "ORL",          "Core",         "ENT disorders, head and neck surgery, audiology"),
        ("MED 311",   "Rehabilitation Medicine",                                 2, "Rehabilitation","Core",        "Physical medicine, disability evaluation, stroke rehab"),
        ("MED 312",   "Dermatology",                                             2, "Dermatology",  "Core",         "Skin diseases, dermatopathology, cutaneous manifestations"),
        ("MED 313",   "Radiology",                                               3, "Radiology",    "Core",         "X-ray, CT scan, MRI, ultrasound, interventional radiology"),
        ("MED 314",   "Preventive, Family and Community Medicine III",            3, "Preventive Med","Core",        "Health administration, public health policy, community clerkship prep"),
        ("MED 315",   "Medical Ethics III",                                      2, "Ethics",       "Core",         "End-of-life decision making, clinical ethics consultation"),
        ("MED 316",   "Medical Nutrition",                                       2, "Nutrition",    "Core",         "Clinical nutrition, enteral/parenteral nutrition"),
        ("MED 317",   "Clinical Epidemiology III",                               2, "Preventive Med","Core",        "Research protocol development, health technology assessment"),
        ("MED 401",   "Clinical Clerkship – Internal Medicine",                  10,"Clinical Clerkship","Professional","Ward & ICU rotation, patient management in Internal Medicine"),
        ("MED 402",   "Clinical Clerkship – Surgery",                            10,"Clinical Clerkship","Professional","OR & ER rotation, surgical patient management"),
        ("MED 403",   "Clinical Clerkship – Pediatrics",                         10,"Clinical Clerkship","Professional","Pediatric ward, ER, and nursery rotation"),
        ("MED 404",   "Clinical Clerkship – Obstetrics & Gynecology",            10,"Clinical Clerkship","Professional","Delivery room, OB ward, and OB-GYN clinic rotation"),
        ("MED 405",   "Clinical Clerkship – Community Medicine",                 5, "Clinical Clerkship","Professional","Rural health unit immersion & community health project"),
        ("MED 406",   "Clinical Revalida and Comprehensive Integration",         5, "Clinical Clerkship","Professional","Oral Revalida examination & integrative clinical evaluation"),
    };

    // ═════════════════════════════════════════════════════════════════════════
    // BSPSYCH-specific subjects (HAU / UP Baguio / CHED CMO 34 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    var bspsychSubjects = new List<(string Code, string Title, int Units, string Dept, string Type, string Desc)>
    {
        ("PSYCH 101", "General Psychology",                                      3, "Psychology",   "Core",         "Introduction to psychological concepts, perception, learning, cognition"),
        ("PSYCH 110", "Developmental Psychology",                                3, "Psychology",   "Core",         "Human development across lifespan: prenatal to gerontology"),
        ("PSYCH 115", "Experimental Psychology",                                 3, "Psychology",   "Core",         "Experimental design, lab manipulation, psychological experiments"),
        ("PSYCH 140", "Behavior Analysis",                                       3, "Psychology",   "Core",         "Operant & classical conditioning, behavior modification"),
        ("PSYCH 150", "Personality Theories",                                    3, "Psychology",   "Core",         "Psychoanalytic, trait, humanistic, and cognitive personality theories"),
        ("PSYCH 155", "Abnormal Behavior and Psychopathology",                   3, "Psychology",   "Core",         "DSM-5 diagnostic criteria, psychological disorders, therapies"),
        ("PSYCH 162", "Psychological Measurement and Assessment",                4, "Psychology",   "Core",         "Psychometrics, test construction, reliability, validity, scoring"),
        ("PSYCH 163", "Psychological Interviewing and Report Writing",           3, "Psychology",   "Core",         "Clinical interview techniques, behavioral observation, report drafting"),
        ("PSYCH 171", "Child Psychology",                                        3, "Psychology",   "Core",         "Cognitive, emotional, and social development in childhood"),
        ("PSYCH 172", "Adolescent Psychology",                                   3, "Psychology",   "Core",         "Identity formation, peer dynamics, adolescent development"),
        ("PSYCH 180", "Social Psychology",                                       3, "Psychology",   "Core",         "Social perception, attitudes, group dynamics, prejudice"),
        ("PSYCH 182", "Sikolohiyang Pilipino / Filipino Psychology",             3, "Psychology",   "Core",         "Indigenous Filipino concepts, values (kapwa), research methods"),
        ("PSYCH 190", "Psychological Statistics",                                3, "Psychology",   "Core",         "Descriptive & inferential statistics for behavioral research"),
        ("PSYCH 195", "Research Methods in Psychology",                          3, "Psychology",   "Core",         "Research design, quantitative & qualitative methodologies"),
        ("PSYCH 198", "Psychology Practicum / Field Immersion (300 hrs)",        5, "Psychology",   "Professional", "Supervised clinical/industrial/educational practicum"),
        ("PSYCH 200", "Undergraduate Thesis in Psychology",                      3, "Psychology",   "Professional", "Psychology empirical research thesis manuscript and defense"),
    };

    // ─── Insert all subjects idempotently ────────────────────────────────────
    async Task InsertSubjects(IEnumerable<(string Code, string Title, int Units, string Dept, string Type, string Desc)> subjects)
    {
        foreach (var (code, title, units, dept, type, desc) in subjects)
        {
            var subjectSql = """
                INSERT INTO curriculum."Courses" ("Id", "Code", "Title", "Units", "Department", "Status", "Description")
                VALUES (@Id, @Code, @Title, @Units, @Dept, @Type, @Desc)
                ON CONFLICT ("Code") DO NOTHING;
                """;
            await using var c = new NpgsqlCommand(subjectSql, conn);
            c.Parameters.AddWithValue("Id", SubjectId(code));
            c.Parameters.AddWithValue("Code", code);
            c.Parameters.AddWithValue("Title", title);
            c.Parameters.AddWithValue("Units", units);
            c.Parameters.AddWithValue("Dept", dept);
            c.Parameters.AddWithValue("Type", type);
            c.Parameters.AddWithValue("Desc", desc);
            await c.ExecuteNonQueryAsync();
        }
    }

    await InsertSubjects(sharedSubjects);
    await InsertSubjects(bsaSubjects);
    await InsertSubjects(bscsSubjects);
    await InsertSubjects(bsmaSubjects);
    await InsertSubjects(bsbafmSubjects);
    await InsertSubjects(bsitSubjects);
    await InsertSubjects(bsbammSubjects);
    await InsertSubjects(bsbaomSubjects);
    await InsertSubjects(bsaisSubjects);
    await InsertSubjects(bsnSubjects);
    await InsertSubjects(bsmlsSubjects);
    await InsertSubjects(bsrtSubjects);
    await InsertSubjects(bsbioSubjects);
    await InsertSubjects(bsmbSubjects);
    await InsertSubjects(bsdsaSubjects);
    await InsertSubjects(bsgeSubjects);
    await InsertSubjects(bsmathSubjects);
    await InsertSubjects(bsstatSubjects);
    await InsertSubjects(bsmSubjects);
    await InsertSubjects(bsagriSubjects);
    await InsertSubjects(bsarchSubjects);
    await InsertSubjects(bseceSubjects);
    await InsertSubjects(bscpeSubjects);
    await InsertSubjects(bsceSubjects);
    await InsertSubjects(bsmeSubjects);
    await InsertSubjects(bsphysSubjects);
    await InsertSubjects(bsaphySubjects);
    await InsertSubjects(bsapmathSubjects);
    await InsertSubjects(jdSubjects);
    await InsertSubjects(llmSubjects);
    await InsertSubjects(mscyberSubjects);
    await InsertSubjects(mscsSubjects);
    await InsertSubjects(msdsSubjects);
    await InsertSubjects(mdSubjects);
    await InsertSubjects(bspsychSubjects);

    // ─── Insert Academic Programs ─────────────────────────────────────────────
    var programSql = """
        INSERT INTO curriculum."AcademicPrograms" ("Id", "Code", "Name", "College", "TotalUnits", "YearsToComplete", "IsActive")
        VALUES
            (@BsaId,    'BSA',     'Bachelor of Science in Accountancy',                             'College of Business and Accountancy', 173, 4, TRUE),
            (@BscsId,   'BSCS',    'Bachelor of Science in Computer Science',                        'College of Computer Studies',         145, 4, TRUE),
            (@BsitId,   'BSIT',    'Bachelor of Science in Information Technology',                   'College of Computer Studies',         143, 4, TRUE),
            (@BsmaId,   'BSMA',    'Bachelor of Science in Management Accounting',                    'College of Business and Accountancy', 167, 4, TRUE),
            (@BsbafmId, 'BSBA-FM', 'Bachelor of Science in Business Administration (Financial Mgt)', 'College of Business and Accountancy', 148, 4, TRUE),
            (@BsbammId, 'BSBA-MM', 'Bachelor of Science in Business Administration (Marketing Mgt)',   'College of Business and Accountancy', 148, 4, TRUE),
            (@BsbaomId, 'BSBA-OM', 'Bachelor of Science in Business Administration (Operations Mgt)',  'College of Business and Accountancy', 148, 4, TRUE),
            (@BsaisId,  'BSAIS',   'Bachelor of Science in Accounting Information Systems',           'College of Business and Accountancy', 156, 4, TRUE),
            (@BsnId,    'BSN',     'Bachelor of Science in Nursing',                                  'College of Nursing and Allied Health',168, 4, TRUE),
            (@BsmlsId,  'BSMLS',   'Bachelor of Science in Medical Laboratory Science',               'College of Allied Health Sciences',   162, 4, TRUE),
            (@BsrtId,   'BSRT',    'Bachelor of Science in Radiologic Technology',                    'College of Allied Health Sciences',   158, 4, TRUE),
            (@BsbioId,  'BSBIO',   'Bachelor of Science in Biology',                                  'College of Science',                  146, 4, TRUE),
            (@BsmbId,   'BSMB',    'Bachelor of Science in Marine Biology',                           'College of Science',                  148, 4, TRUE),
            (@BsdsaId,  'BSDSA',   'Bachelor of Science in Data Science and Analytics',               'College of Computer Studies',         156, 4, TRUE),
            (@BsgeId,   'BSGE',    'Bachelor of Science in Geodetic Engineering',                    'College of Engineering',              162, 4, TRUE),
            (@BsmathId, 'BSMATH',  'Bachelor of Science in Mathematics',                             'College of Science',                  144, 4, TRUE),
            (@BsstatId, 'BSSTAT',  'Bachelor of Science in Statistics',                              'College of Science',                  146, 4, TRUE),
            (@BsmId,    'BSM',     'Bachelor of Science in Midwifery',                               'College of Nursing and Allied Health',152, 4, TRUE),
            (@BsagriId, 'BSAGRI',  'Bachelor of Science in Agriculture',                             'College of Agriculture',              154, 4, TRUE),
            (@BsarchId, 'BSARCH',  'Bachelor of Science in Architecture',                            'College of Architecture',             172, 5, TRUE),
            (@BseceId,  'BSECE',   'Bachelor of Science in Electronics Engineering',                'College of Engineering',              168, 4, TRUE),
            (@BscpeId,  'BSCpE',   'Bachelor of Science in Computer Engineering',                  'College of Computer Studies',         145, 4, TRUE),
            (@BsceId,   'BSCE',    'Bachelor of Science in Civil Engineering',                     'College of Engineering',              155, 4, TRUE),
            (@BsmeId,   'BSME',    'Bachelor of Science in Mechanical Engineering',                'College of Engineering',              182, 4, TRUE)
            (@BsaId,      'BSA',      'Bachelor of Science in Accountancy',                             'College of Business and Accountancy', 173, 4, TRUE),
            (@BscsId,     'BSCS',     'Bachelor of Science in Computer Science',                        'College of Computer Studies',         145, 4, TRUE),
            (@BsitId,     'BSIT',     'Bachelor of Science in Information Technology',                   'College of Computer Studies',         143, 4, TRUE),
            (@BsmaId,     'BSMA',     'Bachelor of Science in Management Accounting',                    'College of Business and Accountancy', 167, 4, TRUE),
            (@BsbafmId,   'BSBA-FM',  'Bachelor of Science in Business Administration (Financial Mgt)', 'College of Business and Accountancy', 148, 4, TRUE),
            (@BsbammId,   'BSBA-MM',  'Bachelor of Science in Business Administration (Marketing Mgt)',   'College of Business and Accountancy', 148, 4, TRUE),
            (@BsbaomId,   'BSBA-OM',  'Bachelor of Science in Business Administration (Operations Mgt)',  'College of Business and Accountancy', 148, 4, TRUE),
            (@BsaisId,    'BSAIS',    'Bachelor of Science in Accounting Information Systems',           'College of Business and Accountancy', 156, 4, TRUE),
            (@BsnId,      'BSN',      'Bachelor of Science in Nursing',                                  'College of Nursing and Allied Health',168, 4, TRUE),
            (@BsmlsId,    'BSMLS',    'Bachelor of Science in Medical Laboratory Science',               'College of Allied Health Sciences',   162, 4, TRUE),
            (@BsrtId,     'BSRT',     'Bachelor of Science in Radiologic Technology',                    'College of Allied Health Sciences',   158, 4, TRUE),
            (@BsbioId,    'BSBIO',    'Bachelor of Science in Biology',                                  'College of Science',                  146, 4, TRUE),
            (@BsmbId,     'BSMB',     'Bachelor of Science in Marine Biology',                           'College of Science',                  148, 4, TRUE),
            (@BsdsaId,    'BSDSA',    'Bachelor of Science in Data Science and Analytics',               'College of Computer Studies',         156, 4, TRUE),
            (@BsgeId,     'BSGE',     'Bachelor of Science in Geodetic Engineering',                    'College of Engineering',              162, 4, TRUE),
            (@BsmathId,   'BSMATH',   'Bachelor of Science in Mathematics',                             'College of Science',                  144, 4, TRUE),
            (@BsstatId,   'BSSTAT',   'Bachelor of Science in Statistics',                              'College of Science',                  146, 4, TRUE),
            (@BsmId,      'BSM',      'Bachelor of Science in Midwifery',                               'College of Nursing and Allied Health',152, 4, TRUE),
            (@BsagriId,   'BSAGRI',   'Bachelor of Science in Agriculture',                             'College of Agriculture',              154, 4, TRUE),
            (@BsarchId,   'BSARCH',   'Bachelor of Science in Architecture',                            'College of Architecture',             172, 5, TRUE),
            (@BseceId,    'BSECE',    'Bachelor of Science in Electronics Engineering',                'College of Engineering',              168, 4, TRUE),
            (@BscpeId,    'BSCpE',    'Bachelor of Science in Computer Engineering',                  'College of Computer Studies',         145, 4, TRUE),
            (@BsceId,     'BSCE',     'Bachelor of Science in Civil Engineering',                     'College of Engineering',              155, 4, TRUE),
            (@BsmeId,     'BSME',     'Bachelor of Science in Mechanical Engineering',                'College of Engineering',              182, 4, TRUE),
            (@BsphysId,   'BSPHYS',   'Bachelor of Science in Physics',                                 'College of Science',                  143, 4, TRUE),
            (@BsaphyId,   'BSAPHY',   'Bachelor of Science in Applied Physics',                         'College of Science',                  148, 4, TRUE),
            (@BsapmathId, 'BSAPMATH', 'Bachelor of Science in Applied Mathematics',                     'College of Science',                  145, 4, TRUE),
            (@JdId,       'JD',       'Juris Doctor',                                                   'College of Law',                      135, 4, TRUE),
            (@LlmId,      'LLM',      'Master of Laws',                                                 'Graduate School of Law',               42, 2, TRUE),
            (@MscyberId,  'MSCYBER',  'Master in Information Security and Cybersecurity',               'College of Computer Studies',          30, 2, TRUE),
            (@MscsId,     'MSCS',     'Master of Science in Computer Science',                          'College of Computer Studies',          31, 2, TRUE),
            (@MsdsId,     'MSDS',     'Master of Science in Data Science',                              'College of Computer Studies',          30, 2, TRUE),
            (@MdId,       'MD',       'Doctor of Medicine',                                             'Faculty of Medicine and Surgery',     160, 4, TRUE),
            (@BspsychId,  'BSPSYCH',  'Bachelor of Science in Psychology',                              'College of Arts and Sciences',        145, 4, TRUE)
        ON CONFLICT ("Code") DO NOTHING;
        """;
    await using var pgmCmd = new NpgsqlCommand(programSql, conn);
    pgmCmd.Parameters.AddWithValue("BsaId",    pgmBSA);
    pgmCmd.Parameters.AddWithValue("BscsId",   pgmBSCS);
    pgmCmd.Parameters.AddWithValue("BsitId",   pgmBSIT);
    pgmCmd.Parameters.AddWithValue("BsmaId",   pgmBSMA);
    pgmCmd.Parameters.AddWithValue("BsbafmId", pgmBSBAFM);
    pgmCmd.Parameters.AddWithValue("BsbammId", pgmBSBAMM);
    pgmCmd.Parameters.AddWithValue("BsbaomId", pgmBSBAOM);
    pgmCmd.Parameters.AddWithValue("BsaisId",  pgmBSAIS);
    pgmCmd.Parameters.AddWithValue("BsnId",    pgmBSN);
    pgmCmd.Parameters.AddWithValue("BsmlsId",  pgmBSMLS);
    pgmCmd.Parameters.AddWithValue("BsrtId",   pgmBSRT);
    pgmCmd.Parameters.AddWithValue("BsbioId",  pgmBSBIO);
    pgmCmd.Parameters.AddWithValue("BsmbId",   pgmBSMB);
    pgmCmd.Parameters.AddWithValue("BsdsaId",  pgmBSDSA);
    pgmCmd.Parameters.AddWithValue("BsgeId",   pgmBSGE);
    pgmCmd.Parameters.AddWithValue("BsmathId", pgmBSMATH);
    pgmCmd.Parameters.AddWithValue("BsstatId", pgmBSSTAT);
    pgmCmd.Parameters.AddWithValue("BsmId",    pgmBSM);
    pgmCmd.Parameters.AddWithValue("BsagriId", pgmBSAGRI);
    pgmCmd.Parameters.AddWithValue("BsarchId", pgmBSARCH);
    pgmCmd.Parameters.AddWithValue("BseceId",  pgmBSECE);
    pgmCmd.Parameters.AddWithValue("BscpeId",  pgmBSCpE);
    pgmCmd.Parameters.AddWithValue("BsceId",   pgmBSCE);
    pgmCmd.Parameters.AddWithValue("BsmeId",   pgmBSME);
    pgmCmd.Parameters.AddWithValue("BsaId",      pgmBSA);
    pgmCmd.Parameters.AddWithValue("BscsId",     pgmBSCS);
    pgmCmd.Parameters.AddWithValue("BsitId",     pgmBSIT);
    pgmCmd.Parameters.AddWithValue("BsmaId",     pgmBSMA);
    pgmCmd.Parameters.AddWithValue("BsbafmId",   pgmBSBAFM);
    pgmCmd.Parameters.AddWithValue("BsbammId",   pgmBSBAMM);
    pgmCmd.Parameters.AddWithValue("BsbaomId",   pgmBSBAOM);
    pgmCmd.Parameters.AddWithValue("BsaisId",    pgmBSAIS);
    pgmCmd.Parameters.AddWithValue("BsnId",      pgmBSN);
    pgmCmd.Parameters.AddWithValue("BsmlsId",    pgmBSMLS);
    pgmCmd.Parameters.AddWithValue("BsrtId",     pgmBSRT);
    pgmCmd.Parameters.AddWithValue("BsbioId",    pgmBSBIO);
    pgmCmd.Parameters.AddWithValue("BsmbId",     pgmBSMB);
    pgmCmd.Parameters.AddWithValue("BsdsaId",    pgmBSDSA);
    pgmCmd.Parameters.AddWithValue("BsgeId",     pgmBSGE);
    pgmCmd.Parameters.AddWithValue("BsmathId",   pgmBSMATH);
    pgmCmd.Parameters.AddWithValue("BsstatId",   pgmBSSTAT);
    pgmCmd.Parameters.AddWithValue("BsmId",      pgmBSM);
    pgmCmd.Parameters.AddWithValue("BsagriId",   pgmBSAGRI);
    pgmCmd.Parameters.AddWithValue("BsarchId",   pgmBSARCH);
    pgmCmd.Parameters.AddWithValue("BseceId",    pgmBSECE);
    pgmCmd.Parameters.AddWithValue("BscpeId",    pgmBSCpE);
    pgmCmd.Parameters.AddWithValue("BsceId",     pgmBSCE);
    pgmCmd.Parameters.AddWithValue("BsmeId",     pgmBSME);
    pgmCmd.Parameters.AddWithValue("BsphysId",   pgmBSPHYS);
    pgmCmd.Parameters.AddWithValue("BsaphyId",   pgmBSAPHY);
    pgmCmd.Parameters.AddWithValue("BsapmathId", pgmBSAPMATH);
    pgmCmd.Parameters.AddWithValue("JdId",       pgmJD);
    pgmCmd.Parameters.AddWithValue("LlmId",      pgmLLM);
    pgmCmd.Parameters.AddWithValue("MscyberId",  pgmMSCYBER);
    pgmCmd.Parameters.AddWithValue("MscsId",     pgmMSCS);
    pgmCmd.Parameters.AddWithValue("MsdsId",     pgmMSDS);
    pgmCmd.Parameters.AddWithValue("MdId",       pgmMD);
    pgmCmd.Parameters.AddWithValue("BspsychId",  pgmBSPSYCH);
    await pgmCmd.ExecuteNonQueryAsync();

    // ─── Insert Curricula ─────────────────────────────────────────────────────
    var curriculaSql = """
        INSERT INTO curriculum."AcademicCurricula" ("Id", "ProgramId", "ProgramCode", "AcademicYear", "Version", "Status", "TotalUnits")
        VALUES
            (@CurBsaId,    @BsaId,    'BSA',     '2025-2026', '1.0', 'Active', 173),
            (@CurBscsId,   @BscsId,   'BSCS',    '2025-2026', '1.0', 'Active', 145),
            (@CurBsitId,   @BsitId,   'BSIT',    '2025-2026', '1.0', 'Active', 143),
            (@CurBsmaId,   @BsmaId,   'BSMA',    '2025-2026', '1.0', 'Active', 167),
            (@CurBsbafmId, @BsbafmId, 'BSBA-FM', '2025-2026', '1.0', 'Active', 148),
            (@CurBsbammId, @BsbammId, 'BSBA-MM', '2025-2026', '1.0', 'Active', 148),
            (@CurBsbaomId, @BsbaomId, 'BSBA-OM', '2025-2026', '1.0', 'Active', 148),
            (@CurBsaisId,  @BsaisId,  'BSAIS',   '2025-2026', '1.0', 'Active', 156),
            (@CurBsnId,    @BsnId,    'BSN',     '2025-2026', '1.0', 'Active', 168),
            (@CurBsmlsId,  @BsmlsId,  'BSMLS',   '2025-2026', '1.0', 'Active', 162),
            (@CurBsrtId,   @BsrtId,   'BSRT',    '2025-2026', '1.0', 'Active', 158),
            (@CurBsbioId,  @BsbioId,  'BSBIO',   '2025-2026', '1.0', 'Active', 146),
            (@CurBsmbId,   @BsmbId,   'BSMB',    '2025-2026', '1.0', 'Active', 148),
            (@CurBsdsaId,  @BsdsaId,  'BSDSA',   '2025-2026', '1.0', 'Active', 156),
            (@CurBsgeId,   @BsgeId,   'BSGE',    '2025-2026', '1.0', 'Active', 162),
            (@CurBsmathId, @BsmathId, 'BSMATH',  '2025-2026', '1.0', 'Active', 144),
            (@CurBsstatId, @BsstatId, 'BSSTAT',  '2025-2026', '1.0', 'Active', 146),
            (@CurBsmId,    @BsmId,    'BSM',     '2025-2026', '1.0', 'Active', 152),
            (@CurBsagriId, @BsagriId, 'BSAGRI',  '2025-2026', '1.0', 'Active', 154),
            (@CurBsarchId, @BsarchId, 'BSARCH',  '2025-2026', '1.0', 'Active', 172),
            (@CurBseceId,  @BseceId,  'BSECE',   '2025-2026', '1.0', 'Active', 168),
            (@CurBscpeId,  @BscpeId,  'BSCpE',   '2025-2026', '1.0', 'Active', 145),
            (@CurBsceId,   @BsceId,   'BSCE',    '2025-2026', '1.0', 'Active', 155),
            (@CurBsmeId,   @BsmeId,   'BSME',    '2025-2026', '1.0', 'Active', 182)
            (@CurBsaId,      @BsaId,      'BSA',      '2025-2026', '1.0', 'Active', 173),
            (@CurBscsId,     @BscsId,     'BSCS',     '2025-2026', '1.0', 'Active', 145),
            (@CurBsitId,     @BsitId,     'BSIT',     '2025-2026', '1.0', 'Active', 143),
            (@CurBsmaId,     @BsmaId,     'BSMA',     '2025-2026', '1.0', 'Active', 167),
            (@CurBsbafmId,   @BsbafmId,   'BSBA-FM',  '2025-2026', '1.0', 'Active', 148),
            (@CurBsbammId,   @BsbammId,   'BSBA-MM',  '2025-2026', '1.0', 'Active', 148),
            (@CurBsbaomId,   @BsbaomId,   'BSBA-OM',  '2025-2026', '1.0', 'Active', 148),
            (@CurBsaisId,    @BsaisId,    'BSAIS',    '2025-2026', '1.0', 'Active', 156),
            (@CurBsnId,      @BsnId,      'BSN',      '2025-2026', '1.0', 'Active', 168),
            (@CurBsmlsId,    @BsmlsId,    'BSMLS',    '2025-2026', '1.0', 'Active', 162),
            (@CurBsrtId,     @BsrtId,     'BSRT',     '2025-2026', '1.0', 'Active', 158),
            (@CurBsbioId,    @BsbioId,    'BSBIO',    '2025-2026', '1.0', 'Active', 146),
            (@CurBsmbId,     @BsmbId,     'BSMB',     '2025-2026', '1.0', 'Active', 148),
            (@CurBsdsaId,    @BsdsaId,    'BSDSA',    '2025-2026', '1.0', 'Active', 156),
            (@CurBsgeId,     @BsgeId,     'BSGE',     '2025-2026', '1.0', 'Active', 162),
            (@CurBsmathId,   @BsmathId,   'BSMATH',   '2025-2026', '1.0', 'Active', 144),
            (@CurBsstatId,   @BsstatId,   'BSSTAT',   '2025-2026', '1.0', 'Active', 146),
            (@CurBsmId,      @BsmId,      'BSM',      '2025-2026', '1.0', 'Active', 152),
            (@CurBsagriId,   @BsagriId,   'BSAGRI',   '2025-2026', '1.0', 'Active', 154),
            (@CurBsarchId,   @BsarchId,   'BSARCH',   '2025-2026', '1.0', 'Active', 172),
            (@CurBseceId,    @BseceId,    'BSECE',    '2025-2026', '1.0', 'Active', 168),
            (@CurBscpeId,    @BscpeId,    'BSCpE',    '2025-2026', '1.0', 'Active', 145),
            (@CurBsceId,     @BsceId,     'BSCE',     '2025-2026', '1.0', 'Active', 155),
            (@CurBsmeId,     @BsmeId,     'BSME',     '2025-2026', '1.0', 'Active', 182),
            (@CurBsphysId,   @BsphysId,   'BSPHYS',   '2025-2026', '1.0', 'Active', 143),
            (@CurBsaphyId,   @BsaphyId,   'BSAPHY',   '2025-2026', '1.0', 'Active', 148),
            (@CurBsapmathId, @BsapmathId, 'BSAPMATH', '2025-2026', '1.0', 'Active', 145),
            (@CurJdId,       @JdId,       'JD',       '2025-2026', '1.0', 'Active', 135),
            (@CurLlmId,      @LlmId,      'LLM',      '2025-2026', '1.0', 'Active',  42),
            (@CurMscyberId,  @MscyberId,  'MSCYBER',  '2025-2026', '1.0', 'Active',  30),
            (@CurMscsId,     @MscsId,     'MSCS',     '2025-2026', '1.0', 'Active',  31),
            (@CurMsdsId,     @MsdsId,     'MSDS',     '2025-2026', '1.0', 'Active',  30),
            (@CurMdId,       @MdId,       'MD',       '2025-2026', '1.0', 'Active', 160),
            (@CurBspsychId,  @BspsychId,  'BSPSYCH',  '2025-2026', '1.0', 'Active', 145)
        ON CONFLICT ("Id") DO NOTHING;
        """;
    await using var curCmd = new NpgsqlCommand(curriculaSql, conn);
    curCmd.Parameters.AddWithValue("CurBsaId",    curBSA);
    curCmd.Parameters.AddWithValue("CurBscsId",   curBSCS);
    curCmd.Parameters.AddWithValue("CurBsitId",   curBSIT);
    curCmd.Parameters.AddWithValue("CurBsmaId",   curBSMA);
    curCmd.Parameters.AddWithValue("CurBsbafmId", curBSBAFM);
    curCmd.Parameters.AddWithValue("CurBsbammId", curBSBAMM);
    curCmd.Parameters.AddWithValue("CurBsbaomId", curBSBAOM);
    curCmd.Parameters.AddWithValue("CurBsaisId",  curBSAIS);
    curCmd.Parameters.AddWithValue("CurBsnId",    curBSN);
    curCmd.Parameters.AddWithValue("CurBsmlsId",  curBSMLS);
    curCmd.Parameters.AddWithValue("CurBsrtId",   curBSRT);
    curCmd.Parameters.AddWithValue("CurBsbioId",  curBSBIO);
    curCmd.Parameters.AddWithValue("CurBsmbId",   curBSMB);
    curCmd.Parameters.AddWithValue("CurBsdsaId",  curBSDSA);
    curCmd.Parameters.AddWithValue("CurBsgeId",   curBSGE);
    curCmd.Parameters.AddWithValue("CurBsmathId", curBSMATH);
    curCmd.Parameters.AddWithValue("CurBsstatId", curBSSTAT);
    curCmd.Parameters.AddWithValue("CurBsmId",    curBSM);
    curCmd.Parameters.AddWithValue("CurBsagriId", curBSAGRI);
    curCmd.Parameters.AddWithValue("CurBsarchId", curBSARCH);
    curCmd.Parameters.AddWithValue("CurBseceId",  curBSECE);
    curCmd.Parameters.AddWithValue("CurBscpeId",  curBSCpE);
    curCmd.Parameters.AddWithValue("CurBsceId",   curBSCE);
    curCmd.Parameters.AddWithValue("CurBsmeId",   curBSME);
    curCmd.Parameters.AddWithValue("BsaId",    pgmBSA);
    curCmd.Parameters.AddWithValue("BscsId",   pgmBSCS);
    curCmd.Parameters.AddWithValue("BsitId",   pgmBSIT);
    curCmd.Parameters.AddWithValue("BsmaId",   pgmBSMA);
    curCmd.Parameters.AddWithValue("BsbafmId", pgmBSBAFM);
    curCmd.Parameters.AddWithValue("BsbammId", pgmBSBAMM);
    curCmd.Parameters.AddWithValue("BsbaomId", pgmBSBAOM);
    curCmd.Parameters.AddWithValue("BsaisId",  pgmBSAIS);
    curCmd.Parameters.AddWithValue("BsnId",    pgmBSN);
    curCmd.Parameters.AddWithValue("BsmlsId",  pgmBSMLS);
    curCmd.Parameters.AddWithValue("BsrtId",   pgmBSRT);
    curCmd.Parameters.AddWithValue("BsbioId",  pgmBSBIO);
    curCmd.Parameters.AddWithValue("BsmbId",   pgmBSMB);
    curCmd.Parameters.AddWithValue("BsdsaId",  pgmBSDSA);
    curCmd.Parameters.AddWithValue("BsgeId",   pgmBSGE);
    curCmd.Parameters.AddWithValue("BsmathId", pgmBSMATH);
    curCmd.Parameters.AddWithValue("BsstatId", pgmBSSTAT);
    curCmd.Parameters.AddWithValue("BsmId",    pgmBSM);
    curCmd.Parameters.AddWithValue("BsagriId", pgmBSAGRI);
    curCmd.Parameters.AddWithValue("BsarchId", pgmBSARCH);
    curCmd.Parameters.AddWithValue("BseceId",  pgmBSECE);
    curCmd.Parameters.AddWithValue("BscpeId",  pgmBSCpE);
    curCmd.Parameters.AddWithValue("BsceId",   pgmBSCE);
    curCmd.Parameters.AddWithValue("BsmeId",   pgmBSME);
    curCmd.Parameters.AddWithValue("CurBsaId",      curBSA);
    curCmd.Parameters.AddWithValue("CurBscsId",     curBSCS);
    curCmd.Parameters.AddWithValue("CurBsitId",     curBSIT);
    curCmd.Parameters.AddWithValue("CurBsmaId",     curBSMA);
    curCmd.Parameters.AddWithValue("CurBsbafmId",   curBSBAFM);
    curCmd.Parameters.AddWithValue("CurBsbammId",   curBSBAMM);
    curCmd.Parameters.AddWithValue("CurBsbaomId",   curBSBAOM);
    curCmd.Parameters.AddWithValue("CurBsaisId",    curBSAIS);
    curCmd.Parameters.AddWithValue("CurBsnId",      curBSN);
    curCmd.Parameters.AddWithValue("CurBsmlsId",    curBSMLS);
    curCmd.Parameters.AddWithValue("CurBsrtId",     curBSRT);
    curCmd.Parameters.AddWithValue("CurBsbioId",    curBSBIO);
    curCmd.Parameters.AddWithValue("CurBsmbId",     curBSMB);
    curCmd.Parameters.AddWithValue("CurBsdsaId",    curBSDSA);
    curCmd.Parameters.AddWithValue("CurBsgeId",     curBSGE);
    curCmd.Parameters.AddWithValue("CurBsmathId",   curBSMATH);
    curCmd.Parameters.AddWithValue("CurBsstatId",   curBSSTAT);
    curCmd.Parameters.AddWithValue("CurBsmId",      curBSM);
    curCmd.Parameters.AddWithValue("CurBsagriId",   curBSAGRI);
    curCmd.Parameters.AddWithValue("CurBsarchId",   curBSARCH);
    curCmd.Parameters.AddWithValue("CurBseceId",    curBSECE);
    curCmd.Parameters.AddWithValue("CurBscpeId",    curBSCpE);
    curCmd.Parameters.AddWithValue("CurBsceId",     curBSCE);
    curCmd.Parameters.AddWithValue("CurBsmeId",     curBSME);
    curCmd.Parameters.AddWithValue("CurBsphysId",   curBSPHYS);
    curCmd.Parameters.AddWithValue("CurBsaphyId",   curBSAPHY);
    curCmd.Parameters.AddWithValue("CurBsapmathId", curBSAPMATH);
    curCmd.Parameters.AddWithValue("CurJdId",       curJD);
    curCmd.Parameters.AddWithValue("CurLlmId",      curLLM);
    curCmd.Parameters.AddWithValue("CurMscyberId",  curMSCYBER);
    curCmd.Parameters.AddWithValue("CurMscsId",     curMSCS);
    curCmd.Parameters.AddWithValue("CurMsdsId",     curMSDS);
    curCmd.Parameters.AddWithValue("CurMdId",       curMD);
    curCmd.Parameters.AddWithValue("CurBspsychId",  curBSPSYCH);
    curCmd.Parameters.AddWithValue("BsaId",      pgmBSA);
    curCmd.Parameters.AddWithValue("BscsId",     pgmBSCS);
    curCmd.Parameters.AddWithValue("BsitId",     pgmBSIT);
    curCmd.Parameters.AddWithValue("BsmaId",     pgmBSMA);
    curCmd.Parameters.AddWithValue("BsbafmId",   pgmBSBAFM);
    curCmd.Parameters.AddWithValue("BsbammId",   pgmBSBAMM);
    curCmd.Parameters.AddWithValue("BsbaomId",   pgmBSBAOM);
    curCmd.Parameters.AddWithValue("BsaisId",    pgmBSAIS);
    curCmd.Parameters.AddWithValue("BsnId",      pgmBSN);
    curCmd.Parameters.AddWithValue("BsmlsId",    pgmBSMLS);
    curCmd.Parameters.AddWithValue("BsrtId",     pgmBSRT);
    curCmd.Parameters.AddWithValue("BsbioId",    pgmBSBIO);
    curCmd.Parameters.AddWithValue("BsmbId",     pgmBSMB);
    curCmd.Parameters.AddWithValue("BsdsaId",    pgmBSDSA);
    curCmd.Parameters.AddWithValue("BsgeId",     pgmBSGE);
    curCmd.Parameters.AddWithValue("BsmathId",   pgmBSMATH);
    curCmd.Parameters.AddWithValue("BsstatId",   pgmBSSTAT);
    curCmd.Parameters.AddWithValue("BsmId",      pgmBSM);
    curCmd.Parameters.AddWithValue("BsagriId",   pgmBSAGRI);
    curCmd.Parameters.AddWithValue("BsarchId",   pgmBSARCH);
    curCmd.Parameters.AddWithValue("BseceId",    pgmBSECE);
    curCmd.Parameters.AddWithValue("BscpeId",    pgmBSCpE);
    curCmd.Parameters.AddWithValue("BsceId",     pgmBSCE);
    curCmd.Parameters.AddWithValue("BsmeId",     pgmBSME);
    curCmd.Parameters.AddWithValue("BsphysId",   pgmBSPHYS);
    curCmd.Parameters.AddWithValue("BsaphyId",   pgmBSAPHY);
    curCmd.Parameters.AddWithValue("BsapmathId", pgmBSAPMATH);
    curCmd.Parameters.AddWithValue("JdId",       pgmJD);
    curCmd.Parameters.AddWithValue("LlmId",      pgmLLM);
    curCmd.Parameters.AddWithValue("MscyberId",  pgmMSCYBER);
    curCmd.Parameters.AddWithValue("MscsId",     pgmMSCS);
    curCmd.Parameters.AddWithValue("MsdsId",     pgmMSDS);
    curCmd.Parameters.AddWithValue("MdId",       pgmMD);
    curCmd.Parameters.AddWithValue("BspsychId",  pgmBSPSYCH);
    await curCmd.ExecuteNonQueryAsync();

    // ─── Helper: Insert a CurriculumSubject row idempotently ─────────────────
    async Task InsertCS(Guid curriculumId, string subjectCode, int yearLevel, string semester, int units, bool isElective = false)
    {
        var rowId = Guid.NewGuid();
        var sql2 = """
            INSERT INTO curriculum."CurriculumSubjects" ("Id", "CurriculumId", "SubjectId", "SubjectCode", "YearLevel", "Semester", "Units", "IsElective")
            SELECT gen_random_uuid(), @CurriculumId, "Id", @SubjectCode, @YearLevel, @Semester, @Units, @IsElective
            FROM curriculum."Courses"
            WHERE "Code" = @SubjectCode
              AND NOT EXISTS (
                SELECT 1 FROM curriculum."CurriculumSubjects"
                WHERE "CurriculumId" = @CurriculumId AND "SubjectCode" = @SubjectCode
              )
            LIMIT 1;
            """;
        await using var cs = new NpgsqlCommand(sql2, conn);
        cs.Parameters.AddWithValue("CurriculumId", curriculumId);
        cs.Parameters.AddWithValue("SubjectCode", subjectCode);
        cs.Parameters.AddWithValue("YearLevel", yearLevel);
        cs.Parameters.AddWithValue("Semester", semester);
        cs.Parameters.AddWithValue("Units", units);
        cs.Parameters.AddWithValue("IsElective", isElective);
        await cs.ExecuteNonQueryAsync();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // BSA Curriculum Subjects
    // ═════════════════════════════════════════════════════════════════════════
    await InsertCS(curBSA, "GE101",   1, "First",  3);
    await InsertCS(curBSA, "GE102",   1, "First",  3);
    await InsertCS(curBSA, "GE103",   1, "First",  3);
    await InsertCS(curBSA, "GE104",   1, "First",  3);
    await InsertCS(curBSA, "GE105",   1, "First",  3);
    await InsertCS(curBSA, "ACC101",  1, "First",  3);
    await InsertCS(curBSA, "BMA101",  1, "First",  3);
    await InsertCS(curBSA, "PE101",   1, "First",  2);
    await InsertCS(curBSA, "GE106",   1, "Second", 3);
    await InsertCS(curBSA, "GE107",   1, "Second", 3);
    await InsertCS(curBSA, "GE108",   1, "Second", 3);
    await InsertCS(curBSA, "ACC102",  1, "Second", 3);
    await InsertCS(curBSA, "NSTP101", 1, "Second", 3);
    await InsertCS(curBSA, "PE201",   1, "Second", 2);
    await InsertCS(curBSA, "NSTP102", 1, "Summer", 3);
    await InsertCS(curBSA, "ACC201",  2, "First",  3);
    await InsertCS(curBSA, "ACC202",  2, "First",  3);
    await InsertCS(curBSA, "ACC203",  2, "First",  3);
    await InsertCS(curBSA, "BMA201",  2, "First",  3);
    await InsertCS(curBSA, "GE201",   2, "First",  3);
    await InsertCS(curBSA, "PE301",   2, "First",  2);
    await InsertCS(curBSA, "ACC204",  2, "Second", 3);
    await InsertCS(curBSA, "ACC205",  2, "Second", 3);
    await InsertCS(curBSA, "ACC206",  2, "Second", 3);
    await InsertCS(curBSA, "BMA202",  2, "Second", 3);
    await InsertCS(curBSA, "BMA203",  2, "Second", 3);
    await InsertCS(curBSA, "GE202",   2, "Second", 3, isElective: true);
    await InsertCS(curBSA, "PE401",   2, "Second", 2);
    await InsertCS(curBSA, "ACC301",  3, "First",  3);
    await InsertCS(curBSA, "ACC302",  3, "First",  3);
    await InsertCS(curBSA, "ACC303",  3, "First",  3);
    await InsertCS(curBSA, "ACC304",  3, "First",  3);
    await InsertCS(curBSA, "GE301",   3, "First",  3, isElective: true);
    await InsertCS(curBSA, "ACC305",  3, "Second", 3);
    await InsertCS(curBSA, "ACC306",  3, "Second", 3);
    await InsertCS(curBSA, "ACC307",  3, "Second", 3);
    await InsertCS(curBSA, "ACC308",  3, "Second", 3);
    await InsertCS(curBSA, "ACC309",  3, "Second", 3);
    await InsertCS(curBSA, "ACC310",  3, "Second", 3);
    await InsertCS(curBSA, "ACC401",  4, "First",  3);
    await InsertCS(curBSA, "ACC402",  4, "First",  3);
    await InsertCS(curBSA, "ACC403",  4, "First",  3);
    await InsertCS(curBSA, "ACC405",  4, "First",  3);
    await InsertCS(curBSA, "ACC406",  4, "First",  3);
    await InsertCS(curBSA, "GE401",   4, "First",  3, isElective: true);
    await InsertCS(curBSA, "ACC404",  4, "Second", 6);
    await InsertCS(curBSA, "ACC407",  4, "Second", 3);
    await InsertCS(curBSA, "ACC408",  4, "Second", 3);
    await InsertCS(curBSA, "ACC409",  4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSCS Curriculum Subjects (Batangas State University AY 2025-2026 / CHED CMO 25)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSCS, "CC 100",    1, "First",  3);
    await InsertCS(curBSCS, "CC 101",    1, "First",  3);
    await InsertCS(curBSCS, "GEd 101",   1, "First",  3);
    await InsertCS(curBSCS, "GEd 102",   1, "First",  3);
    await InsertCS(curBSCS, "GEd 103",   1, "First",  3);
    await InsertCS(curBSCS, "MATH 101",  1, "First",  4);
    await InsertCS(curBSCS, "PATHFit 1", 1, "First",  2);
    await InsertCS(curBSCS, "NSTP 111",  1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSCS, "CC 102",    1, "Second", 3);
    await InsertCS(curBSCS, "CC 103",    1, "Second", 3);
    await InsertCS(curBSCS, "GEd 104",   1, "Second", 3);
    await InsertCS(curBSCS, "GEd 108",   1, "Second", 3);
    await InsertCS(curBSCS, "GEd 106",   1, "Second", 3);
    await InsertCS(curBSCS, "MATH 102",  1, "Second", 4);
    await InsertCS(curBSCS, "PATHFit 2", 1, "Second", 2);
    await InsertCS(curBSCS, "NSTP 121",  1, "Second", 3);

    // Year 2 — First Semester
    await InsertCS(curBSCS, "OOP 101",   2, "First",  3);
    await InsertCS(curBSCS, "CC 104",    2, "First",  3);
    await InsertCS(curBSCS, "GEd 105",   2, "First",  3);
    await InsertCS(curBSCS, "AI 101",    2, "First",  3);
    await InsertCS(curBSCS, "GEd 107",   2, "First",  3);
    await InsertCS(curBSCS, "CpE 405",   2, "First",  3);
    await InsertCS(curBSCS, "PHYS 111",  2, "First",  3);
    await InsertCS(curBSCS, "PATHFit 3", 2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSCS, "AL 101",    2, "Second", 3);
    await InsertCS(curBSCS, "OOP 102",   2, "Second", 3);
    await InsertCS(curBSCS, "NET 101",   2, "Second", 3);
    await InsertCS(curBSCS, "AR 101",    2, "Second", 3);
    await InsertCS(curBSCS, "AI 102",    2, "Second", 3);
    await InsertCS(curBSCS, "PHYS 112",  2, "Second", 3);
    await InsertCS(curBSCS, "PATHFit 4", 2, "Second", 2);

    // Year 3 — First Semester
    await InsertCS(curBSCS, "AL 102",    3, "First",  3);
    await InsertCS(curBSCS, "SC 101",    3, "First",  3);
    await InsertCS(curBSCS, "NET 102",   3, "First",  3);
    await InsertCS(curBSCS, "CSAI 100",  3, "First",  3);
    await InsertCS(curBSCS, "DS 101",    3, "First",  3);
    await InsertCS(curBSCS, "CS ELEC 1", 3, "First",  3, isElective: true);
    await InsertCS(curBSCS, "PL 101",    3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSCS, "AI 103",    3, "Second", 3);
    await InsertCS(curBSCS, "SE 101",    3, "Second", 3);
    await InsertCS(curBSCS, "HCI 101",   3, "Second", 3);
    await InsertCS(curBSCS, "CC 105",    3, "Second", 3);
    await InsertCS(curBSCS, "QM 101",    3, "Second", 3);
    await InsertCS(curBSCS, "WS 101",    3, "Second", 3);
    await InsertCS(curBSCS, "CS ELEC 2", 3, "Second", 3, isElective: true);
    // Year 3 — Summer
    await InsertCS(curBSCS, "CSP 100",   3, "Summer", 3);

    // Year 4 — First Semester
    await InsertCS(curBSCS, "THS 101",   4, "First",  3);
    await InsertCS(curBSCS, "SE 102",    4, "First",  3);
    await InsertCS(curBSCS, "OS 101",    4, "First",  3);
    await InsertCS(curBSCS, "CS ELEC 3", 4, "First",  3, isElective: true);
    await InsertCS(curBSCS, "GEd 110",   4, "First",  3);
    await InsertCS(curBSCS, "GEd 111",   4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSCS, "THS 102",   4, "Second", 3);
    await InsertCS(curBSCS, "PD 101",    4, "Second", 3);
    await InsertCS(curBSCS, "SIP 101",   4, "Second", 3);
    await InsertCS(curBSCS, "GEd 109",   4, "Second", 3);
    await InsertCS(curBSCS, "ENGG 105",  4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSMA Curriculum Subjects (Holy Cross of Davao College / UST AY 2025-2026)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSMA, "FAR 101",     1, "First",  6);
    await InsertCS(curBSMA, "OM 101",      1, "First",  3);
    await InsertCS(curBSMA, "GE105",       1, "First",  3);
    await InsertCS(curBSMA, "GE108",       1, "First",  3);
    await InsertCS(curBSMA, "GE101",       1, "First",  3);
    await InsertCS(curBSMA, "GE104",       1, "First",  3);
    await InsertCS(curBSMA, "NSTP 111",    1, "First",  3);
    await InsertCS(curBSMA, "PATHFit 1",   1, "First",  2);
    // Year 1 — Second Semester
    await InsertCS(curBSMA, "CFAS 101",    1, "Second", 6);
    await InsertCS(curBSMA, "MANECO 101",  1, "Second", 3);
    await InsertCS(curBSMA, "IT 100",      1, "Second", 3);
    await InsertCS(curBSMA, "GE106",       1, "Second", 3);
    await InsertCS(curBSMA, "NSTP 121",    1, "Second", 3);
    await InsertCS(curBSMA, "PATHFit 2",   1, "Second", 2);
    await InsertCS(curBSMA, "GE201",       1, "Second", 3);

    // Year 2 — First Semester
    await InsertCS(curBSMA, "IA 101",      2, "First",  3);
    await InsertCS(curBSMA, "CAC 101",     2, "First",  3);
    await InsertCS(curBSMA, "AIS 101",     2, "First",  3);
    await InsertCS(curBSMA, "MS 101",      2, "First",  3);
    await InsertCS(curBSMA, "STAT 101",    2, "First",  3);
    await InsertCS(curBSMA, "BLAW 101",    2, "First",  3);
    await InsertCS(curBSMA, "PATHFit 3",   2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSMA, "IA 102",      2, "Second", 3);
    await InsertCS(curBSMA, "MA 101",      2, "Second", 3);
    await InsertCS(curBSMA, "TAX 101",     2, "Second", 3);
    await InsertCS(curBSMA, "BFIN 101",    2, "Second", 3);
    await InsertCS(curBSMA, "AUD 101",     2, "Second", 3);
    await InsertCS(curBSMA, "BUSRES 101",  2, "Second", 3);
    await InsertCS(curBSMA, "PATHFit 4",   2, "Second", 2);

    // Year 3 — First Semester
    await InsertCS(curBSMA, "SCM 101",     3, "First",  3);
    await InsertCS(curBSMA, "MA 201",      3, "First",  3);
    await InsertCS(curBSMA, "FINMAN 101",  3, "First",  3);
    await InsertCS(curBSMA, "ADV-AIS 101", 3, "First",  3);
    await InsertCS(curBSMA, "BUSAN 101",   3, "First",  3);
    await InsertCS(curBSMA, "CORPGOV 101", 3, "First",  3);
    await InsertCS(curBSMA, "MA-ELEC 1",   3, "First",  3, isElective: true);
    // Year 3 — Second Semester
    await InsertCS(curBSMA, "SBA 101",     3, "Second", 3);
    await InsertCS(curBSMA, "ADV-CAC 101", 3, "Second", 3);
    await InsertCS(curBSMA, "FSA 101",     3, "Second", 3);
    await InsertCS(curBSMA, "TAX 102",     3, "Second", 3);
    await InsertCS(curBSMA, "ACCRES 101",  3, "Second", 3);
    await InsertCS(curBSMA, "BLAW 102",    3, "Second", 3);
    await InsertCS(curBSMA, "MA-ELEC 2",   3, "Second", 3, isElective: true);

    // Year 4 — First Semester
    await InsertCS(curBSMA, "ADV-MA 101",  4, "First",  3);
    await InsertCS(curBSMA, "MCS 101",     4, "First",  3);
    await InsertCS(curBSMA, "MA-RES 1",    4, "First",  3);
    await InsertCS(curBSMA, "MA-PRACT 1",  4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSMA, "MA-CAP 101",  4, "Second", 3);
    await InsertCS(curBSMA, "MA-RES 2",    4, "Second", 3);
    await InsertCS(curBSMA, "MA-PRACT 2",  4, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // BSBA-FM Curriculum Subjects (Batangas State University / HCDC AY 2025-2026)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSBAFM, "GE104",    1, "First",  3);
    await InsertCS(curBSBAFM, "GE106",    1, "First",  3);
    await InsertCS(curBSBAFM, "ECO 101",  1, "First",  3);
    await InsertCS(curBSBAFM, "MGT 101",  1, "First",  3);
    await InsertCS(curBSBAFM, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSBAFM, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSBAFM, "FM 101",   1, "Second", 3);
    await InsertCS(curBSBAFM, "FM 102",   1, "Second", 3);
    await InsertCS(curBSBAFM, "GE101",   1, "Second", 3);
    await InsertCS(curBSBAFM, "GE107",   1, "Second", 3);
    await InsertCS(curBSBAFM, "PE 102",   1, "Second", 2);
    await InsertCS(curBSBAFM, "NSTP 121", 1, "Second", 3);

    // Year 2 — First Semester
    await InsertCS(curBSBAFM, "LAW 201",  2, "First",  3);
    await InsertCS(curBSBAFM, "TAX 301",  2, "First",  3);
    await InsertCS(curBSBAFM, "FILI 101", 2, "First",  3);
    await InsertCS(curBSBAFM, "LITR 102", 2, "First",  3);
    await InsertCS(curBSBAFM, "GE103",   2, "First",  3);
    await InsertCS(curBSBAFM, "FM 203",   2, "First",  3);
    await InsertCS(curBSBAFM, "PE 103",   2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSBAFM, "FILI 102", 2, "Second", 3);
    await InsertCS(curBSBAFM, "GE105",   2, "Second", 3);
    await InsertCS(curBSBAFM, "GE201",   2, "Second", 3);
    await InsertCS(curBSBAFM, "MGT 202",  2, "Second", 3);
    await InsertCS(curBSBAFM, "FM 204",   2, "Second", 3);
    await InsertCS(curBSBAFM, "BPO 201",  2, "Second", 3);
    await InsertCS(curBSBAFM, "PE 104",   2, "Second", 2);

    // Year 3 — First Semester
    await InsertCS(curBSBAFM, "MGT 303",  3, "First",  3);
    await InsertCS(curBSBAFM, "GE108",   3, "First",  3);
    await InsertCS(curBSBAFM, "MGT 304",  3, "First",  3);
    await InsertCS(curBSBAFM, "BPO 302",  3, "First",  3);
    await InsertCS(curBSBAFM, "FM 305",   3, "First",  3);
    await InsertCS(curBSBAFM, "FM 306",   3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSBAFM, "FM 310",   3, "Second", 3);
    await InsertCS(curBSBAFM, "MGT 305",  3, "Second", 3);
    await InsertCS(curBSBAFM, "BPO 303",  3, "Second", 3);
    await InsertCS(curBSBAFM, "FM 307",   3, "Second", 3);
    await InsertCS(curBSBAFM, "FM 308",   3, "Second", 3);
    await InsertCS(curBSBAFM, "FM 309",   3, "Second", 3);

    // Year 4 — First Semester
    await InsertCS(curBSBAFM, "FM 413",   4, "First",  3);
    await InsertCS(curBSBAFM, "FM 412",   4, "First",  3);
    await InsertCS(curBSBAFM, "ANA 401",  4, "First",  3);
    await InsertCS(curBSBAFM, "FM 411",   4, "First",  3);
    await InsertCS(curBSBAFM, "MGT 406",  4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSBAFM, "FM 414",   4, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // BSIT Curriculum Subjects
    // ═════════════════════════════════════════════════════════════════════════
    await InsertCS(curBSIT, "GE101",  1, "First",  3);
    await InsertCS(curBSIT, "GE104",  1, "First",  3);
    await InsertCS(curBSIT, "GE105",  1, "First",  3);
    await InsertCS(curBSIT, "IT101",  1, "First",  3);
    await InsertCS(curBSIT, "IT102",  1, "First",  3);
    await InsertCS(curBSIT, "IT103",  1, "First",  3);
    await InsertCS(curBSIT, "PE101",  1, "First",  2);
    await InsertCS(curBSIT, "GE102",  1, "Second", 3);
    await InsertCS(curBSIT, "GE106",  1, "Second", 3);
    await InsertCS(curBSIT, "IT104",  1, "Second", 3);
    await InsertCS(curBSIT, "IT201",  1, "Second", 3);
    await InsertCS(curBSIT, "NSTP101",1, "Second", 3);
    await InsertCS(curBSIT, "PE201",  1, "Second", 2);
    await InsertCS(curBSIT, "NSTP102",1, "Summer", 3);
    await InsertCS(curBSIT, "GE103",  2, "First",  3);
    await InsertCS(curBSIT, "GE107",  2, "First",  3);
    await InsertCS(curBSIT, "IT202",  2, "First",  3);
    await InsertCS(curBSIT, "IT203",  2, "First",  3);
    await InsertCS(curBSIT, "IT204",  2, "First",  3);
    await InsertCS(curBSIT, "PE301",  2, "First",  2);
    await InsertCS(curBSIT, "GE108",  2, "Second", 3);
    await InsertCS(curBSIT, "GE201",  2, "Second", 3);
    await InsertCS(curBSIT, "IT205",  2, "Second", 3);
    await InsertCS(curBSIT, "IT206",  2, "Second", 3);
    await InsertCS(curBSIT, "PE401",  2, "Second", 2);
    await InsertCS(curBSIT, "GE202",  3, "First",  3, isElective: true);
    await InsertCS(curBSIT, "IT301",  3, "First",  3);
    await InsertCS(curBSIT, "IT302",  3, "First",  3);
    await InsertCS(curBSIT, "IT303",  3, "First",  3);
    await InsertCS(curBSIT, "IT304",  3, "First",  3);
    await InsertCS(curBSIT, "GE301",  3, "Second", 3, isElective: true);
    await InsertCS(curBSIT, "IT305",  3, "Second", 3);
    await InsertCS(curBSIT, "IT306",  3, "Second", 3);
    await InsertCS(curBSIT, "IT307",  3, "Second", 3);
    await InsertCS(curBSIT, "IT405",  3, "Second", 3, isElective: true);
    await InsertCS(curBSIT, "GE401",  4, "First",  3, isElective: true);
    await InsertCS(curBSIT, "IT401",  4, "First",  3);
    await InsertCS(curBSIT, "IT406",  4, "First",  3, isElective: true);
    await InsertCS(curBSIT, "IT402",  4, "Second", 3);
    await InsertCS(curBSIT, "IT403",  4, "Second", 3);
    await InsertCS(curBSIT, "IT404",  4, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // BSBA-MM Curriculum Subjects (Batangas State University AY 2018-2019)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSBAMM, "GE104",    1, "First",  3);
    await InsertCS(curBSBAMM, "GE106",    1, "First",  3);
    await InsertCS(curBSBAMM, "ECO 101",  1, "First",  3);
    await InsertCS(curBSBAMM, "MGT 101",  1, "First",  3);
    await InsertCS(curBSBAMM, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSBAMM, "NSTP 111", 1, "First",  3);
    await InsertCS(curBSBAMM, "MKT 101",  1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSBAMM, "GE101",   1, "Second", 3);
    await InsertCS(curBSBAMM, "GE107",   1, "Second", 3);
    await InsertCS(curBSBAMM, "GE105",   1, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 201",  1, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 202",  1, "Second", 3);
    await InsertCS(curBSBAMM, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSBAMM, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSBAMM, "LAW 201",  2, "First",  3);
    await InsertCS(curBSBAMM, "TAX 301",  2, "First",  3);
    await InsertCS(curBSBAMM, "FILI 101", 2, "First",  3);
    await InsertCS(curBSBAMM, "LITR 102", 2, "First",  3);
    await InsertCS(curBSBAMM, "MKT 203",  2, "First",  3);
    await InsertCS(curBSBAMM, "MKT 301",  2, "First",  3);
    await InsertCS(curBSBAMM, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSBAMM, "FILI 102", 2, "Second", 3);
    await InsertCS(curBSBAMM, "GE103",   2, "Second", 3);
    await InsertCS(curBSBAMM, "GE201",   2, "Second", 3);
    await InsertCS(curBSBAMM, "MGT 202",  2, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 302",  2, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 303",  2, "Second", 3);
    await InsertCS(curBSBAMM, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSBAMM, "MGT 303",  3, "First",  3);
    await InsertCS(curBSBAMM, "GE108",   3, "First",  3);
    await InsertCS(curBSBAMM, "MGT 304",  3, "First",  3);
    await InsertCS(curBSBAMM, "MKT 304",  3, "First",  3);
    await InsertCS(curBSBAMM, "MKT 305",  3, "First",  3);
    await InsertCS(curBSBAMM, "MKT 307",  3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSBAMM, "MGT 305",  3, "Second", 3);
    await InsertCS(curBSBAMM, "BPO 201",  3, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 306",  3, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 401",  3, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 402",  3, "Second", 3);
    await InsertCS(curBSBAMM, "MKT 403",  3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSBAMM, "MKT 404",  4, "First",  3);
    await InsertCS(curBSBAMM, "ANA 401",  4, "First",  3);
    await InsertCS(curBSBAMM, "MGT 406",  4, "First",  3);
    await InsertCS(curBSBAMM, "GE202",    4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSBAMM, "MKT 405",  4, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // BSBA-OM Curriculum Subjects (Batangas State University AY 2018-2019)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSBAOM, "GE104",    1, "First",  3);
    await InsertCS(curBSBAOM, "GE106",    1, "First",  3);
    await InsertCS(curBSBAOM, "ECO 101",  1, "First",  3);
    await InsertCS(curBSBAOM, "MGT 101",  1, "First",  3);
    await InsertCS(curBSBAOM, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSBAOM, "NSTP 111", 1, "First",  3);
    await InsertCS(curBSBAOM, "OM 101",   1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSBAOM, "GE101",   1, "Second", 3);
    await InsertCS(curBSBAOM, "GE107",   1, "Second", 3);
    await InsertCS(curBSBAOM, "GE105",   1, "Second", 3);
    await InsertCS(curBSBAOM, "OM 201",   1, "Second", 3);
    await InsertCS(curBSBAOM, "OM 202",   1, "Second", 3);
    await InsertCS(curBSBAOM, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSBAOM, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSBAOM, "LAW 201",  2, "First",  3);
    await InsertCS(curBSBAOM, "TAX 301",  2, "First",  3);
    await InsertCS(curBSBAOM, "FILI 101", 2, "First",  3);
    await InsertCS(curBSBAOM, "LITR 102", 2, "First",  3);
    await InsertCS(curBSBAOM, "OM 203",   2, "First",  3);
    await InsertCS(curBSBAOM, "OM 301",   2, "First",  3);
    await InsertCS(curBSBAOM, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSBAOM, "FILI 102", 2, "Second", 3);
    await InsertCS(curBSBAOM, "GE103",   2, "Second", 3);
    await InsertCS(curBSBAOM, "GE201",   2, "Second", 3);
    await InsertCS(curBSBAOM, "MGT 202",  2, "Second", 3);
    await InsertCS(curBSBAOM, "OM 302",   2, "Second", 3);
    await InsertCS(curBSBAOM, "OM 303",   2, "Second", 3);
    await InsertCS(curBSBAOM, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSBAOM, "MGT 303",  3, "First",  3);
    await InsertCS(curBSBAOM, "GE108",   3, "First",  3);
    await InsertCS(curBSBAOM, "MGT 304",  3, "First",  3);
    await InsertCS(curBSBAOM, "OM 304",   3, "First",  3);
    await InsertCS(curBSBAOM, "OM 305",   3, "First",  3);
    await InsertCS(curBSBAOM, "OM 307",   3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSBAOM, "MGT 305",  3, "Second", 3);
    await InsertCS(curBSBAOM, "BPO 201",  3, "Second", 3);
    await InsertCS(curBSBAOM, "OM 306",   3, "Second", 3);
    await InsertCS(curBSBAOM, "OM 401",   3, "Second", 3);
    await InsertCS(curBSBAOM, "BPO 302",  3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSBAOM, "OM 402",   4, "First",  3);
    await InsertCS(curBSBAOM, "ANA 401",  4, "First",  3);
    await InsertCS(curBSBAOM, "MGT 406",  4, "First",  3);
    await InsertCS(curBSBAOM, "GE202",    4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSBAOM, "OM 403",   4, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // BSAIS Curriculum Subjects (UST General Santos AY 2024-2025)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSAIS, "FAR 101",     1, "First",  6);
    await InsertCS(curBSAIS, "OM 101",      1, "First",  3);
    await InsertCS(curBSAIS, "GE105",       1, "First",  3);
    await InsertCS(curBSAIS, "GE108",       1, "First",  3);
    await InsertCS(curBSAIS, "GE101",       1, "First",  3);
    await InsertCS(curBSAIS, "GE104",       1, "First",  3);
    await InsertCS(curBSAIS, "NSTP 111",    1, "First",  3);
    await InsertCS(curBSAIS, "PATHFit 1",   1, "First",  2);
    // Year 1 — Second Semester
    await InsertCS(curBSAIS, "CFAS 101",    1, "Second", 6);
    await InsertCS(curBSAIS, "MANECO 101",  1, "Second", 3);
    await InsertCS(curBSAIS, "AIS 101",     1, "Second", 3);
    await InsertCS(curBSAIS, "GE106",       1, "Second", 3);
    await InsertCS(curBSAIS, "NSTP 121",    1, "Second", 3);
    await InsertCS(curBSAIS, "PATHFit 2",   1, "Second", 2);
    await InsertCS(curBSAIS, "GE201",       1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSAIS, "IA 101",      2, "First",  3);
    await InsertCS(curBSAIS, "CAC 101",     2, "First",  3);
    await InsertCS(curBSAIS, "AIS 102",     2, "First",  3);
    await InsertCS(curBSAIS, "MS 101",      2, "First",  3);
    await InsertCS(curBSAIS, "STAT 101",    2, "First",  3);
    await InsertCS(curBSAIS, "BLAW 101",    2, "First",  3);
    await InsertCS(curBSAIS, "PATHFit 3",   2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSAIS, "IA 102",      2, "Second", 3);
    await InsertCS(curBSAIS, "MA 101",      2, "Second", 3);
    await InsertCS(curBSAIS, "TAX 101",     2, "Second", 3);
    await InsertCS(curBSAIS, "BFIN 101",    2, "Second", 3);
    await InsertCS(curBSAIS, "AUD 101",     2, "Second", 3);
    await InsertCS(curBSAIS, "AIS 201",     2, "Second", 3);
    await InsertCS(curBSAIS, "PATHFit 4",   2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSAIS, "AIS 202",     3, "First",  3);
    await InsertCS(curBSAIS, "AIS 203",     3, "First",  3);
    await InsertCS(curBSAIS, "FINMAN 101",  3, "First",  3);
    await InsertCS(curBSAIS, "AIS 301",     3, "First",  3);
    await InsertCS(curBSAIS, "BUSAN 101",   3, "First",  3);
    await InsertCS(curBSAIS, "CORPGOV 101", 3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSAIS, "AIS 302",     3, "Second", 3);
    await InsertCS(curBSAIS, "AIS 303",     3, "Second", 3);
    await InsertCS(curBSAIS, "AIS 304",     3, "Second", 3);
    await InsertCS(curBSAIS, "TAX 102",     3, "Second", 3);
    await InsertCS(curBSAIS, "AIS 305",     3, "Second", 3);
    await InsertCS(curBSAIS, "BLAW 102",    3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSAIS, "AIS 401",     4, "First",  3);
    await InsertCS(curBSAIS, "MCS 101",     4, "First",  3);
    await InsertCS(curBSAIS, "GEd 110",     4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSAIS, "AIS 402",     4, "Second", 3);
    await InsertCS(curBSAIS, "AIS 403",     4, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // BSN Curriculum Subjects (LPU Batangas / Davao Doctors SY 2023-2024)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSN, "ANAT 101", 1, "First",  4);
    await InsertCS(curBSN, "CHEM 101", 1, "First",  3);
    await InsertCS(curBSN, "GE101",    1, "First",  3);
    await InsertCS(curBSN, "GE104",    1, "First",  3);
    await InsertCS(curBSN, "GE105",    1, "First",  3);
    await InsertCS(curBSN, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSN, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSN, "MICRO 101",1, "Second", 3);
    await InsertCS(curBSN, "NCM 100",  1, "Second", 3);
    await InsertCS(curBSN, "NCM 101",  1, "Second", 3);
    await InsertCS(curBSN, "NCM 102",  1, "Second", 3);
    await InsertCS(curBSN, "GE102",    1, "Second", 3);
    await InsertCS(curBSN, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSN, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSN, "NCM 103",  2, "First",  5);
    await InsertCS(curBSN, "NCM 104",  2, "First",  4);
    await InsertCS(curBSN, "NCM 105",  2, "First",  3);
    await InsertCS(curBSN, "GE103",    2, "First",  3);
    await InsertCS(curBSN, "GE106",    2, "First",  3);
    await InsertCS(curBSN, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSN, "NCM 106",  2, "Second", 3);
    await InsertCS(curBSN, "NCM 107",  2, "Second", 9);
    await InsertCS(curBSN, "NCM 108",  2, "Second", 3);
    await InsertCS(curBSN, "GE107",    2, "Second", 3);
    await InsertCS(curBSN, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSN, "NCM 109",  3, "First",  8);
    await InsertCS(curBSN, "NCM 110",  3, "First",  3);
    await InsertCS(curBSN, "NCM 113",  3, "First",  5);
    await InsertCS(curBSN, "GE108",    3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSN, "NCM 111",  3, "Second", 8);
    await InsertCS(curBSN, "NCM 112",  3, "Second", 5);
    await InsertCS(curBSN, "NCM 114",  3, "Second", 3);
    await InsertCS(curBSN, "GE201",    3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSN, "NCM 115",  4, "First",  3);
    await InsertCS(curBSN, "NCM 116",  4, "First",  5);
    await InsertCS(curBSN, "NCM 117",  4, "First",  3);
    await InsertCS(curBSN, "NCM 118",  4, "First",  3);
    await InsertCS(curBSN, "NCM 119",  4, "First",  5);
    // Year 4 — Second Semester
    await InsertCS(curBSN, "NCM 120",  4, "Second", 8);

    // ═════════════════════════════════════════════════════════════════════════
    // BSMLS Curriculum Subjects (Davao Doctors College SY 2023-2024)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSMLS, "MLS 101",  1, "First",  3);
    await InsertCS(curBSMLS, "CHEM 102", 1, "First",  4);
    await InsertCS(curBSMLS, "GE101",    1, "First",  3);
    await InsertCS(curBSMLS, "GE104",    1, "First",  3);
    await InsertCS(curBSMLS, "GE105",    1, "First",  3);
    await InsertCS(curBSMLS, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSMLS, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSMLS, "MLS 102",  1, "Second", 3);
    await InsertCS(curBSMLS, "ANAT 102", 1, "Second", 4);
    await InsertCS(curBSMLS, "CHEM 103", 1, "Second", 4);
    await InsertCS(curBSMLS, "GE102",    1, "Second", 3);
    await InsertCS(curBSMLS, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSMLS, "NSTP 121", 1, "Second", 3);
    await InsertCS(curBSMLS, "GE106",    1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSMLS, "CHEM 104", 2, "First",  4);
    await InsertCS(curBSMLS, "MT 201",   2, "First",  3);
    await InsertCS(curBSMLS, "MT 202",   2, "First",  3);
    await InsertCS(curBSMLS, "GE103",    2, "First",  3);
    await InsertCS(curBSMLS, "GE107",    2, "First",  3);
    await InsertCS(curBSMLS, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSMLS, "MT 203",   2, "Second", 3);
    await InsertCS(curBSMLS, "MT 204",   2, "Second", 3);
    await InsertCS(curBSMLS, "GE108",    2, "Second", 3);
    await InsertCS(curBSMLS, "GE201",    2, "Second", 3);
    await InsertCS(curBSMLS, "PATHFit 4",2, "Second", 2);
    await InsertCS(curBSMLS, "MT 307",   2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curBSMLS, "MT 301",   3, "First",  4);
    await InsertCS(curBSMLS, "MT 303",   3, "First",  4);
    await InsertCS(curBSMLS, "MT 305",   3, "First",  3);
    await InsertCS(curBSMLS, "MT 309",   3, "First",  4);
    await InsertCS(curBSMLS, "MT 312",   3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSMLS, "MT 302",   3, "Second", 4);
    await InsertCS(curBSMLS, "MT 304",   3, "Second", 3);
    await InsertCS(curBSMLS, "MT 306",   3, "Second", 3);
    await InsertCS(curBSMLS, "MT 308",   3, "Second", 4);
    await InsertCS(curBSMLS, "MT 310",   3, "Second", 3);
    await InsertCS(curBSMLS, "MT 311",   3, "Second", 2);
    // Year 4 — First Semester
    await InsertCS(curBSMLS, "MT 401",   4, "First",  3);
    await InsertCS(curBSMLS, "MT 403",   4, "First", 12);
    // Year 4 — Second Semester
    await InsertCS(curBSMLS, "MT 402",   4, "Second", 3);
    await InsertCS(curBSMLS, "MT 404",   4, "Second",12);

    // ═════════════════════════════════════════════════════════════════════════
    // BSRT Curriculum Subjects (GSDMSFI / CHED CMO 07 s. 2018)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSRT, "RAD 101",  1, "First",  3);
    await InsertCS(curBSRT, "RAD 102",  1, "First",  4);
    await InsertCS(curBSRT, "GE101",    1, "First",  3);
    await InsertCS(curBSRT, "GE104",    1, "First",  3);
    await InsertCS(curBSRT, "GE105",    1, "First",  3);
    await InsertCS(curBSRT, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSRT, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSRT, "RAD 103",  1, "Second", 3);
    await InsertCS(curBSRT, "GE102",    1, "Second", 3);
    await InsertCS(curBSRT, "GE106",    1, "Second", 3);
    await InsertCS(curBSRT, "GE107",    1, "Second", 3);
    await InsertCS(curBSRT, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSRT, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSRT, "RAD 201",  2, "First",  4);
    await InsertCS(curBSRT, "RAD 203",  2, "First",  3);
    await InsertCS(curBSRT, "RAD 204",  2, "First",  3);
    await InsertCS(curBSRT, "GE103",    2, "First",  3);
    await InsertCS(curBSRT, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSRT, "RAD 202",  2, "Second", 4);
    await InsertCS(curBSRT, "RAD 205",  2, "Second", 3);
    await InsertCS(curBSRT, "RAD 306",  2, "Second", 3);
    await InsertCS(curBSRT, "GE108",    2, "Second", 3);
    await InsertCS(curBSRT, "GE201",    2, "Second", 3);
    await InsertCS(curBSRT, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSRT, "RAD 301",  3, "First",  3);
    await InsertCS(curBSRT, "RAD 302",  3, "First",  3);
    await InsertCS(curBSRT, "RAD 303",  3, "First",  3);
    await InsertCS(curBSRT, "RAD 307",  3, "First",  3);
    await InsertCS(curBSRT, "RAD 308",  3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSRT, "RAD 304",  3, "Second", 3);
    await InsertCS(curBSRT, "RAD 305",  3, "Second", 3);
    await InsertCS(curBSRT, "RAD 309",  3, "Second", 3);
    await InsertCS(curBSRT, "GEd 110",  3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSRT, "RAD 401",  4, "First", 12);
    // Year 4 — Second Semester
    await InsertCS(curBSRT, "RAD 402",  4, "Second",12);

    // ═════════════════════════════════════════════════════════════════════════
    // BSBIO Curriculum Subjects (MMSU AY 2024-2025)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSBIO, "BIO 101", 1, "First",  4);
    await InsertCS(curBSBIO, "GE101",   1, "First",  3);
    await InsertCS(curBSBIO, "GE104",   1, "First",  3);
    await InsertCS(curBSBIO, "GE105",   1, "First",  3);
    await InsertCS(curBSBIO, "PATHFit 1",1, "First", 2);
    await InsertCS(curBSBIO, "NSTP 111",1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSBIO, "BIO 102", 1, "Second", 4);
    await InsertCS(curBSBIO, "BIO 103", 1, "Second", 3);
    await InsertCS(curBSBIO, "GE102",   1, "Second", 3);
    await InsertCS(curBSBIO, "GE106",   1, "Second", 3);
    await InsertCS(curBSBIO, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSBIO, "NSTP 121",1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSBIO, "BIO 201", 2, "First",  4);
    await InsertCS(curBSBIO, "BIO 204", 2, "First",  4);
    await InsertCS(curBSBIO, "GE103",   2, "First",  3);
    await InsertCS(curBSBIO, "GE107",   2, "First",  3);
    await InsertCS(curBSBIO, "PATHFit 3",2, "First", 2);
    // Year 2 — Second Semester
    await InsertCS(curBSBIO, "BIO 202", 2, "Second", 4);
    await InsertCS(curBSBIO, "BIO 203", 2, "Second", 4);
    await InsertCS(curBSBIO, "GE108",   2, "Second", 3);
    await InsertCS(curBSBIO, "GE201",   2, "Second", 3);
    await InsertCS(curBSBIO, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSBIO, "BIO 301", 3, "First",  3);
    await InsertCS(curBSBIO, "BIO 303", 3, "First",  4);
    await InsertCS(curBSBIO, "BIO 304", 3, "First",  3);
    await InsertCS(curBSBIO, "BIO 305", 3, "First",  4);
    // Year 3 — Second Semester
    await InsertCS(curBSBIO, "BIO 302", 3, "Second", 4);
    await InsertCS(curBSBIO, "BIO 306", 3, "Second", 2);
    await InsertCS(curBSBIO, "BIO 307", 3, "Second", 3);
    await InsertCS(curBSBIO, "GEd 110", 3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSBIO, "BIO 401", 4, "First",  3);
    await InsertCS(curBSBIO, "BIO 402", 4, "First",  3);
    await InsertCS(curBSBIO, "GE202",   4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSBIO, "GE301",   4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSMB Curriculum Subjects (VSU / CHED CMO 46)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSMB, "MBIO 101", 1, "First",  3);
    await InsertCS(curBSMB, "GE101",    1, "First",  3);
    await InsertCS(curBSMB, "GE104",    1, "First",  3);
    await InsertCS(curBSMB, "GE105",    1, "First",  3);
    await InsertCS(curBSMB, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSMB, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSMB, "MBIO 102", 1, "Second", 4);
    await InsertCS(curBSMB, "MBIO 103", 1, "Second", 4);
    await InsertCS(curBSMB, "GE102",    1, "Second", 3);
    await InsertCS(curBSMB, "GE106",    1, "Second", 3);
    await InsertCS(curBSMB, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSMB, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSMB, "MBIO 201", 2, "First",  4);
    await InsertCS(curBSMB, "MBIO 202", 2, "First",  4);
    await InsertCS(curBSMB, "GE103",    2, "First",  3);
    await InsertCS(curBSMB, "GE107",    2, "First",  3);
    await InsertCS(curBSMB, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSMB, "MBIO 203", 2, "Second", 4);
    await InsertCS(curBSMB, "MBIO 204", 2, "Second", 4);
    await InsertCS(curBSMB, "GE108",    2, "Second", 3);
    await InsertCS(curBSMB, "GE201",    2, "Second", 3);
    await InsertCS(curBSMB, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSMB, "MBIO 301", 3, "First",  4);
    await InsertCS(curBSMB, "MBIO 302", 3, "First",  3);
    await InsertCS(curBSMB, "MBIO 303", 3, "First",  3);
    await InsertCS(curBSMB, "MBIO 306", 3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSMB, "MBIO 304", 3, "Second", 3);
    await InsertCS(curBSMB, "MBIO 305", 3, "Second", 3);
    await InsertCS(curBSMB, "MBIO 401", 3, "Second", 3);
    await InsertCS(curBSMB, "GEd 110",  3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSMB, "MBIO 402", 4, "First",  3);
    await InsertCS(curBSMB, "MBIO 403", 4, "First",  6);
    // Year 4 — Second Semester
    await InsertCS(curBSMB, "GE202",    4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSDSA Curriculum Subjects (TIP QC / UST AY 2022-2024 / CHED)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSDSA, "DS 011",    1, "First",  3);
    await InsertCS(curBSDSA, "CC 100",    1, "First",  3);
    await InsertCS(curBSDSA, "GEd 101",   1, "First",  3);
    await InsertCS(curBSDSA, "GEd 102",   1, "First",  3);
    await InsertCS(curBSDSA, "MATH 115",  1, "First",  3);
    await InsertCS(curBSDSA, "PATHFit 1", 1, "First",  2);
    await InsertCS(curBSDSA, "NSTP 111",  1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSDSA, "CC 101",    1, "Second", 3);
    await InsertCS(curBSDSA, "STAT 111",  1, "Second", 3);
    await InsertCS(curBSDSA, "MATH 116",  1, "Second", 3);
    await InsertCS(curBSDSA, "GEd 104",   1, "Second", 3);
    await InsertCS(curBSDSA, "GEd 106",   1, "Second", 3);
    await InsertCS(curBSDSA, "PATHFit 2", 1, "Second", 2);
    await InsertCS(curBSDSA, "NSTP 121",  1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSDSA, "DS 012",    2, "First",  3);
    await InsertCS(curBSDSA, "CC 103",    2, "First",  3);
    await InsertCS(curBSDSA, "STAT 112",  2, "First",  3);
    await InsertCS(curBSDSA, "GEd 105",   2, "First",  3);
    await InsertCS(curBSDSA, "GEd 107",   2, "First",  3);
    await InsertCS(curBSDSA, "PATHFit 3", 2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSDSA, "DS 013",    2, "Second", 3);
    await InsertCS(curBSDSA, "CC 104",    2, "Second", 3);
    await InsertCS(curBSDSA, "DS 015",    2, "Second", 3);
    await InsertCS(curBSDSA, "GEd 108",   2, "Second", 3);
    await InsertCS(curBSDSA, "GEd 103",   2, "Second", 3);
    await InsertCS(curBSDSA, "PATHFit 4", 2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSDSA, "DS 014",    3, "First",  3);
    await InsertCS(curBSDSA, "DS 016",    3, "First",  3);
    await InsertCS(curBSDSA, "NET 101",   3, "First",  3);
    await InsertCS(curBSDSA, "GEd 109",   3, "First",  3);
    await InsertCS(curBSDSA, "CS ELEC 1", 3, "First",  3, isElective: true);
    // Year 3 — Second Semester
    await InsertCS(curBSDSA, "DS 017",    3, "Second", 3);
    await InsertCS(curBSDSA, "DS 018",    3, "Second", 3);
    await InsertCS(curBSDSA, "GEd 110",   3, "Second", 3);
    await InsertCS(curBSDSA, "CS ELEC 2", 3, "Second", 3, isElective: true);
    // Year 3 — Summer
    await InsertCS(curBSDSA, "DS 020",    3, "Summer", 6);
    // Year 4 — First Semester
    await InsertCS(curBSDSA, "DS 019",    4, "First",  3);
    await InsertCS(curBSDSA, "GEd 111",   4, "First",  3);
    await InsertCS(curBSDSA, "ENGG 105",  4, "First",  3);
    await InsertCS(curBSDSA, "CS ELEC 3", 4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSDSA, "SIP 101",   4, "Second", 3);
    await InsertCS(curBSDSA, "GE201",     4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSGE Curriculum Subjects (EVSU / UP Diliman / CHED CMO 89 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSGE, "GE 111",   1, "First",  3);
    await InsertCS(curBSGE, "MATH 101", 1, "First",  4);
    await InsertCS(curBSGE, "GEd 101",  1, "First",  3);
    await InsertCS(curBSGE, "GEd 102",  1, "First",  3);
    await InsertCS(curBSGE, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSGE, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSGE, "GE 121",   1, "Second", 4);
    await InsertCS(curBSGE, "MATH 102", 1, "Second", 4);
    await InsertCS(curBSGE, "PHYS 111", 1, "Second", 3);
    await InsertCS(curBSGE, "GEd 104",  1, "Second", 3);
    await InsertCS(curBSGE, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSGE, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSGE, "GE 122",   2, "First",  4);
    await InsertCS(curBSGE, "GE 141",   2, "First",  3);
    await InsertCS(curBSGE, "PHYS 112", 2, "First",  3);
    await InsertCS(curBSGE, "GEd 105",  2, "First",  3);
    await InsertCS(curBSGE, "GEd 106",  2, "First",  3);
    await InsertCS(curBSGE, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSGE, "GE 131",   2, "Second", 3);
    await InsertCS(curBSGE, "GE 151",   2, "Second", 3);
    await InsertCS(curBSGE, "GE 161",   2, "Second", 3);
    await InsertCS(curBSGE, "GEd 107",  2, "Second", 3);
    await InsertCS(curBSGE, "GEd 108",  2, "Second", 3);
    await InsertCS(curBSGE, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSGE, "GE 152",   3, "First",  3);
    await InsertCS(curBSGE, "GE 162",   3, "First",  3);
    await InsertCS(curBSGE, "GE 170",   3, "First",  3);
    await InsertCS(curBSGE, "GE 181",   3, "First",  3);
    await InsertCS(curBSGE, "GEd 103",  3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSGE, "GE 171",   3, "Second", 3);
    await InsertCS(curBSGE, "GE 190",   3, "Second", 3);
    await InsertCS(curBSGE, "GE 198",   3, "Second", 3);
    await InsertCS(curBSGE, "GEd 109",  3, "Second", 3);
    await InsertCS(curBSGE, "GEd 110",  3, "Second", 3);
    // Year 3 — Summer
    await InsertCS(curBSGE, "GE 200",   3, "Summer", 6);
    // Year 4 — First Semester
    await InsertCS(curBSGE, "GE 199",   4, "First",  3);
    await InsertCS(curBSGE, "ENGG 105", 4, "First",  3);
    await InsertCS(curBSGE, "GEd 111",  4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSGE, "GE201",    4, "Second", 3);
    await InsertCS(curBSGE, "GE202",    4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSMATH Curriculum Subjects (UP Baguio / CLSU / CHED CMO 19 s. 2007)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSMATH, "MATH 121", 1, "First",  3);
    await InsertCS(curBSMATH, "MATH 122", 1, "First",  4);
    await InsertCS(curBSMATH, "GEd 101",  1, "First",  3);
    await InsertCS(curBSMATH, "GEd 102",  1, "First",  3);
    await InsertCS(curBSMATH, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSMATH, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSMATH, "MATH 123", 1, "Second", 4);
    await InsertCS(curBSMATH, "MATH 131", 1, "Second", 3);
    await InsertCS(curBSMATH, "GEd 104",  1, "Second", 3);
    await InsertCS(curBSMATH, "GEd 105",  1, "Second", 3);
    await InsertCS(curBSMATH, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSMATH, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSMATH, "MATH 124", 2, "First",  4);
    await InsertCS(curBSMATH, "MATH 141", 2, "First",  3);
    await InsertCS(curBSMATH, "PHYS 111", 2, "First",  3);
    await InsertCS(curBSMATH, "GEd 106",  2, "First",  3);
    await InsertCS(curBSMATH, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSMATH, "MATH 142", 2, "Second", 3);
    await InsertCS(curBSMATH, "MATH 171", 2, "Second", 3);
    await InsertCS(curBSMATH, "PHYS 112", 2, "Second", 3);
    await InsertCS(curBSMATH, "GEd 107",  2, "Second", 3);
    await InsertCS(curBSMATH, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSMATH, "MATH 151", 3, "First",  3);
    await InsertCS(curBSMATH, "MATH 181", 3, "First",  3);
    await InsertCS(curBSMATH, "STAT 111", 3, "First",  3);
    await InsertCS(curBSMATH, "GEd 108",  3, "First",  3);
    await InsertCS(curBSMATH, "GEd 103",  3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSMATH, "MATH 152", 3, "Second", 3);
    await InsertCS(curBSMATH, "MATH 161", 3, "Second", 3);
    await InsertCS(curBSMATH, "MATH 198", 3, "Second", 3);
    await InsertCS(curBSMATH, "GEd 109",  3, "Second", 3);
    await InsertCS(curBSMATH, "GEd 110",  3, "Second", 3);
    // Year 3 — Summer
    await InsertCS(curBSMATH, "MATH 200", 3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSMATH, "MATH 191", 4, "First",  3);
    await InsertCS(curBSMATH, "MATH 199", 4, "First",  3);
    await InsertCS(curBSMATH, "GEd 111",  4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSMATH, "GE201",    4, "Second", 3);
    await InsertCS(curBSMATH, "GE202",    4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSSTAT Curriculum Subjects (VSU / CHED CMO 42 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSSTAT, "STAT 121", 1, "First",  3);
    await InsertCS(curBSSTAT, "MATH 101", 1, "First",  4);
    await InsertCS(curBSSTAT, "GEd 101",  1, "First",  3);
    await InsertCS(curBSSTAT, "GEd 102",  1, "First",  3);
    await InsertCS(curBSSTAT, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSSTAT, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSSTAT, "STAT 122", 1, "Second", 3);
    await InsertCS(curBSSTAT, "STAT 131", 1, "Second", 3);
    await InsertCS(curBSSTAT, "MATH 102", 1, "Second", 4);
    await InsertCS(curBSSTAT, "GEd 104",  1, "Second", 3);
    await InsertCS(curBSSTAT, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSSTAT, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSSTAT, "STAT 132", 2, "First",  3);
    await InsertCS(curBSSTAT, "STAT 191", 2, "First",  3);
    await InsertCS(curBSSTAT, "MATH 115", 2, "First",  3);
    await InsertCS(curBSSTAT, "GEd 105",  2, "First",  3);
    await InsertCS(curBSSTAT, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSSTAT, "STAT 141", 2, "Second", 3);
    await InsertCS(curBSSTAT, "STAT 151", 2, "Second", 3);
    await InsertCS(curBSSTAT, "GEd 106",  2, "Second", 3);
    await InsertCS(curBSSTAT, "GEd 107",  2, "Second", 3);
    await InsertCS(curBSSTAT, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSSTAT, "STAT 142", 3, "First",  3);
    await InsertCS(curBSSTAT, "STAT 152", 3, "First",  3);
    await InsertCS(curBSSTAT, "STAT 161", 3, "First",  3);
    await InsertCS(curBSSTAT, "GEd 108",  3, "First",  3);
    await InsertCS(curBSSTAT, "GEd 103",  3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSSTAT, "STAT 171", 3, "Second", 3);
    await InsertCS(curBSSTAT, "STAT 181", 3, "Second", 3);
    await InsertCS(curBSSTAT, "STAT 182", 3, "Second", 3);
    await InsertCS(curBSSTAT, "STAT 198", 3, "Second", 3);
    await InsertCS(curBSSTAT, "GEd 110",  3, "Second", 3);
    // Year 3 — Summer
    await InsertCS(curBSSTAT, "STAT 200", 3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSSTAT, "STAT 199", 4, "First",  3);
    await InsertCS(curBSSTAT, "GEd 109",  4, "First",  3);
    await InsertCS(curBSSTAT, "GEd 111",  4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSSTAT, "GE201",    4, "Second", 3);
    await InsertCS(curBSSTAT, "GE202",    4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSM Curriculum Subjects (IMCC / Palawan State U / CHED CMO 3 s. 2023)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSM, "MID 101",  1, "First",  4);
    await InsertCS(curBSM, "MID 102",  1, "First",  4);
    await InsertCS(curBSM, "GEd 101",  1, "First",  3);
    await InsertCS(curBSM, "GEd 102",  1, "First",  3);
    await InsertCS(curBSM, "PATHFit 1",1, "First",  2);
    await InsertCS(curBSM, "NSTP 111", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSM, "MID 103",  1, "Second", 3);
    await InsertCS(curBSM, "MID 104",  1, "Second", 5);
    await InsertCS(curBSM, "GEd 104",  1, "Second", 3);
    await InsertCS(curBSM, "GEd 105",  1, "Second", 3);
    await InsertCS(curBSM, "PATHFit 2",1, "Second", 2);
    await InsertCS(curBSM, "NSTP 121", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSM, "MID 201",  2, "First",  4);
    await InsertCS(curBSM, "MID 202",  2, "First",  3);
    await InsertCS(curBSM, "MID 203",  2, "First",  3);
    await InsertCS(curBSM, "GEd 106",  2, "First",  3);
    await InsertCS(curBSM, "PATHFit 3",2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSM, "MID 204",  2, "Second", 3);
    await InsertCS(curBSM, "MID 301",  2, "Second", 3);
    await InsertCS(curBSM, "GEd 107",  2, "Second", 3);
    await InsertCS(curBSM, "GEd 108",  2, "Second", 3);
    await InsertCS(curBSM, "PATHFit 4",2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSM, "MID 302",  3, "First",  6);
    await InsertCS(curBSM, "MID 401",  3, "First",  4);
    await InsertCS(curBSM, "GEd 103",  3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSM, "MID 303",  3, "Second", 6);
    await InsertCS(curBSM, "MID 402",  3, "Second", 3);
    await InsertCS(curBSM, "GEd 109",  3, "Second", 3);
    // Year 4 — First & Second Semester
    await InsertCS(curBSM, "MID 403",  4, "First",  12);
    await InsertCS(curBSM, "GE201",    4, "Second", 3);
    await InsertCS(curBSM, "GE202",    4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSAGRI Curriculum Subjects (MMSU SY 2024-2025 / CHED CMO 23 s. 2021)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSAGRI, "AGRI 10",   1, "First",  3);
    await InsertCS(curBSAGRI, "ENGL 01",   1, "First",  3);
    await InsertCS(curBSAGRI, "ANSC 20",   1, "First",  3);
    await InsertCS(curBSAGRI, "CHEM 30",   1, "First",  3);
    await InsertCS(curBSAGRI, "MATH 01",   1, "First",  3);
    await InsertCS(curBSAGRI, "CRPSC 20",  1, "First",  3);
    await InsertCS(curBSAGRI, "NSTP 01",   1, "First",  4);
    // Year 1 — Second Semester
    await InsertCS(curBSAGRI, "CRPSC 21",  1, "Second", 3);
    await InsertCS(curBSAGRI, "CHEM 41",   1, "Second", 3);
    await InsertCS(curBSAGRI, "ANSC 21",   1, "Second", 3);
    await InsertCS(curBSAGRI, "COMM 01",   1, "Second", 3);
    await InsertCS(curBSAGRI, "SSCI 20",   1, "Second", 3);
    await InsertCS(curBSAGRI, "STS 01",    1, "Second", 3);
    await InsertCS(curBSAGRI, "NSTP 02",   1, "Second", 3);
    // Year 1 — Summer
    await InsertCS(curBSAGRI, "AGRI 100",  1, "Summer", 6);
    // Year 2 — First Semester
    await InsertCS(curBSAGRI, "SOCSC 01",  2, "First",  3);
    await InsertCS(curBSAGRI, "CPROT 20",  2, "First",  3);
    await InsertCS(curBSAGRI, "AGRI 21",   2, "First",  3);
    await InsertCS(curBSAGRI, "IT 11",     2, "First",  3);
    await InsertCS(curBSAGRI, "SOCSC 11",  2, "First",  3);
    await InsertCS(curBSAGRI, "SOCSC 02",  2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curBSAGRI, "SOCSC 12",  2, "Second", 3);
    await InsertCS(curBSAGRI, "SSCI 21",   2, "Second", 3);
    await InsertCS(curBSAGRI, "PHILO 1",   2, "Second", 3);
    await InsertCS(curBSAGRI, "SOCSC 03",  2, "Second", 3);
    await InsertCS(curBSAGRI, "AGEXT 20",  2, "Second", 3);
    await InsertCS(curBSAGRI, "PI 01",     2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curBSAGRI, "AGRI 40",   3, "First",  3);
    await InsertCS(curBSAGRI, "AGRI 62",   3, "First",  3);
    await InsertCS(curBSAGRI, "CPROT 21",  3, "First",  3);
    await InsertCS(curBSAGRI, "AGRI 30",   3, "First",  3);
    await InsertCS(curBSAGRI, "AGRI 63",   3, "First",  3);
    await InsertCS(curBSAGRI, "CRPSC 120", 3, "First",  3, isElective: true);
    // Year 3 — Second Semester
    await InsertCS(curBSAGRI, "AGRI 195",  3, "Second", 3);
    await InsertCS(curBSAGRI, "BIO 198",   3, "Second", 3);
    await InsertCS(curBSAGRI, "AGRI 200A", 3, "Second", 2);
    await InsertCS(curBSAGRI, "AGRI 199A", 3, "Second", 1);
    await InsertCS(curBSAGRI, "CPROT 100", 3, "Second", 3);
    await InsertCS(curBSAGRI, "ANSC 110",  3, "Second", 3);
    await InsertCS(curBSAGRI, "AGRO 110",  3, "Second", 3, isElective: true);
    // Year 3 — Summer
    await InsertCS(curBSAGRI, "AGRI 198",  3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSAGRI, "AGRI 70",   4, "First",  3);
    await InsertCS(curBSAGRI, "CRPSC 110", 4, "First",  3);
    await InsertCS(curBSAGRI, "AGRI 200B", 4, "First",  2);
    await InsertCS(curBSAGRI, "AGRI 207",  4, "First",  1);
    await InsertCS(curBSAGRI, "AGRI 81",   4, "First",  3);
    await InsertCS(curBSAGRI, "CPROT 110", 4, "First",  3);
    await InsertCS(curBSAGRI, "AGEXT 110", 4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSAGRI, "ENSCI 132", 4, "Second", 3);
    await InsertCS(curBSAGRI, "HUM 01",    4, "Second", 3);
    await InsertCS(curBSAGRI, "AGRI 197A", 4, "Second", 3);
    await InsertCS(curBSAGRI, "AGRI 197B", 4, "Second", 3);
    await InsertCS(curBSAGRI, "AGRI 200C", 4, "Second", 2);
    await InsertCS(curBSAGRI, "AGRI 199B", 4, "Second", 1);

    // ═════════════════════════════════════════════════════════════════════════
    // BSARCH Curriculum Subjects (Holy Angel U 2018 / CHED CMO 61 s. 2017 - 5 Years)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSARCH, "ARDESIGN1",  1, "First",  3);
    await InsertCS(curBSARCH, "AGRAPHICS1", 1, "First",  2);
    await InsertCS(curBSARCH, "AVISTECH1",  1, "First",  2);
    await InsertCS(curBSARCH, "ARHISTORY1", 1, "First",  3);
    await InsertCS(curBSARCH, "ARORDES",    1, "First",  3);
    await InsertCS(curBSARCH, "ARTHEORY1",  1, "First",  3);
    await InsertCS(curBSARCH, "SOLIDMEN",   1, "First",  3);
    await InsertCS(curBSARCH, "4FYE1",      1, "First",  3);
    await InsertCS(curBSARCH, "THEOLOGY101",1, "First",  3);
    await InsertCS(curBSARCH, "CWTS1",      1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSARCH, "ARDESIGN2",  1, "Second", 3);
    await InsertCS(curBSARCH, "AINTERIORS", 1, "Second", 3);
    await InsertCS(curBSARCH, "AGRAPHICS2", 1, "Second", 2);
    await InsertCS(curBSARCH, "AVISTECH2",  1, "Second", 2);
    await InsertCS(curBSARCH, "ARTHEORY2",  1, "Second", 3);
    await InsertCS(curBSARCH, "DIFFINTCALC",1, "Second", 3);
    await InsertCS(curBSARCH, "4FYE2",      1, "Second", 3);
    await InsertCS(curBSARCH, "THEOLOGY102",1, "Second", 3);
    await InsertCS(curBSARCH, "CWTS2",      1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSARCH, "ARDESIGN3",  2, "First",  3);
    await InsertCS(curBSARCH, "AVISTECH3",  2, "First",  2);
    await InsertCS(curBSARCH, "BILDTECH1",  2, "First",  3);
    await InsertCS(curBSARCH, "BILDUTIL1",  2, "First",  3);
    await InsertCS(curBSARCH, "ARHISTORY2", 2, "First",  3);
    await InsertCS(curBSARCH, "ENVISCI",    2, "First",  3);
    await InsertCS(curBSARCH, "4READPHILHIS",2,"First",  3);
    await InsertCS(curBSARCH, "4ARTAPP",    2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curBSARCH, "ARDESIGN4",  2, "Second", 3);
    await InsertCS(curBSARCH, "BILDTECH2",  2, "Second", 3);
    await InsertCS(curBSARCH, "ARHISTORY3", 2, "Second", 3);
    await InsertCS(curBSARCH, "TROPICDES",  2, "Second", 3);
    await InsertCS(curBSARCH, "STATICS-AR", 2, "Second", 3);
    await InsertCS(curBSARCH, "SURVEYING",  2, "Second", 3);
    await InsertCS(curBSARCH, "THEOLOGY103",2, "Second", 3);
    await InsertCS(curBSARCH, "4CONWORLD",  2, "Second", 3);
    await InsertCS(curBSARCH, "4UNDERSELF", 2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curBSARCH, "ARDESIGN5",  3, "First",  3);
    await InsertCS(curBSARCH, "BILDTECH3",  3, "First",  3);
    await InsertCS(curBSARCH, "BILDUTIL2",  3, "First",  3);
    await InsertCS(curBSARCH, "CADD-AR1",   3, "First",  3);
    await InsertCS(curBSARCH, "ARHISTORY4", 3, "First",  3);
    await InsertCS(curBSARCH, "PROPRAC1",   3, "First",  3);
    await InsertCS(curBSARCH, "STRENGTH",   3, "First",  3);
    await InsertCS(curBSARCH, "3FIL1",      3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSARCH, "ARDESIGN6",  3, "Second", 3);
    await InsertCS(curBSARCH, "BILDTECH4",  3, "Second", 3);
    await InsertCS(curBSARCH, "BILDUTIL3",  3, "Second", 3);
    await InsertCS(curBSARCH, "CADD-AR2",   3, "Second", 3);
    await InsertCS(curBSARCH, "HOUSE",      3, "Second", 3);
    await InsertCS(curBSARCH, "ARPLAN1",    3, "Second", 3);
    await InsertCS(curBSARCH, "PROPRAC2",   3, "Second", 3);
    await InsertCS(curBSARCH, "STRUCTURES", 3, "Second", 3);
    await InsertCS(curBSARCH, "1PURCOMM",   3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSARCH, "ARDESIGN7",  4, "First",  4);
    await InsertCS(curBSARCH, "BILDTECH5",  4, "First",  3);
    await InsertCS(curBSARCH, "ARPLAN2",    4, "First",  3);
    await InsertCS(curBSARCH, "PROPRAC3",   4, "First",  3);
    await InsertCS(curBSARCH, "STEELTIMB",  4, "First",  3);
    await InsertCS(curBSARCH, "9STS",       4, "First",  3);
    await InsertCS(curBSARCH, "3FIL2",      4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSARCH, "ARDESIGN8",  4, "Second", 4);
    await InsertCS(curBSARCH, "RESMETHAR",  4, "Second", 3);
    await InsertCS(curBSARCH, "ARSTRUCTS",  4, "Second", 3);
    await InsertCS(curBSARCH, "ARPLAN3",    4, "Second", 3);
    await InsertCS(curBSARCH, "COMPRE",     4, "Second", 3);
    await InsertCS(curBSARCH, "1LIT12",     4, "Second", 3);
    await InsertCS(curBSARCH, "4ETHICS",    4, "Second", 3);
    // Year 4 — Summer
    await InsertCS(curBSARCH, "AROJT",      4, "Summer", 5);
    // Year 5 — First Semester
    await InsertCS(curBSARCH, "ARDESIGN9",  5, "First",  5);
    await InsertCS(curBSARCH, "BMGMTAPP1",  5, "First",  3);
    await InsertCS(curBSARCH, "SPCIALIZN1", 5, "First",  3, isElective: true);
    await InsertCS(curBSARCH, "SPCIALIZN2", 5, "First",  3, isElective: true);
    await InsertCS(curBSARCH, "4RIZAL",     5, "First",  3);
    // Year 5 — Second Semester
    await InsertCS(curBSARCH, "ARDESIGN10", 5, "Second", 5);
    await InsertCS(curBSARCH, "BMGMTAPP2",  5, "Second", 3);
    await InsertCS(curBSARCH, "SPCIALIZN3", 5, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSECE Curriculum Subjects (EVSU SY 2018-2019 / CHED CMO 101 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSECE, "GEN ED 001",    1, "First",  3);
    await InsertCS(curBSECE, "GEN ED 004",    1, "First",  3);
    await InsertCS(curBSECE, "MATH 114",      1, "First",  4);
    await InsertCS(curBSECE, "MATH ENHANCE 1",1, "First",  3);
    await InsertCS(curBSECE, "PHYS 1",        1, "First",  4);
    await InsertCS(curBSECE, "CHEM 11",       1, "First",  4);
    await InsertCS(curBSECE, "CAD 111",       1, "First",  1);
    await InsertCS(curBSECE, "PE 112",        1, "First",  2);
    await InsertCS(curBSECE, "NSTP 113",      1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSECE, "GEN ED 002",    1, "Second", 3);
    await InsertCS(curBSECE, "GEN ED 008",    1, "Second", 3);
    await InsertCS(curBSECE, "MATH 124",      1, "Second", 4);
    await InsertCS(curBSECE, "MATH ENHANCE 2",1, "Second", 3);
    await InsertCS(curBSECE, "PHYS 2",        1, "Second", 4);
    await InsertCS(curBSECE, "MSE 123",       1, "Second", 3);
    await InsertCS(curBSECE, "MGT 122",       1, "Second", 2);
    await InsertCS(curBSECE, "PE 122",        1, "Second", 2);
    await InsertCS(curBSECE, "NSTP 123",      1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSECE, "GEN ED 007",    2, "First",  3);
    await InsertCS(curBSECE, "GEN ED 003",    2, "First",  3);
    await InsertCS(curBSECE, "MATH 213",      2, "First",  3);
    await InsertCS(curBSECE, "ECE 214",       2, "First",  4);
    await InsertCS(curBSECE, "ECE 234",       2, "First",  4);
    await InsertCS(curBSECE, "COMP 212",      2, "First",  2);
    await InsertCS(curBSECE, "PE 212",        2, "First",  2);
    await InsertCS(curBSECE, "EDA 213",       2, "First",  4);
    // Year 2 — Second Semester
    await InsertCS(curBSECE, "GEN ED 005",    2, "Second", 3);
    await InsertCS(curBSECE, "GEN ED 006",    2, "Second", 3);
    await InsertCS(curBSECE, "ECE 223",       2, "Second", 4);
    await InsertCS(curBSECE, "ECE 224",       2, "Second", 4);
    await InsertCS(curBSECE, "ECE 244",       2, "Second", 4);
    await InsertCS(curBSECE, "ECE 264",       2, "Second", 4);
    await InsertCS(curBSECE, "ECE 284",       2, "Second", 4);
    await InsertCS(curBSECE, "PE 222",        2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSECE, "FIL 001",       3, "First",  3);
    await InsertCS(curBSECE, "ECE 314",       3, "First",  4);
    await InsertCS(curBSECE, "ECE 334",       3, "First",  4);
    await InsertCS(curBSECE, "ECE 354",       3, "First",  4);
    await InsertCS(curBSECE, "ECE 374",       3, "First",  4);
    await InsertCS(curBSECE, "ECON 313",      3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSECE, "FIL 002",       3, "Second", 3);
    await InsertCS(curBSECE, "ECE 324",       3, "Second", 4);
    await InsertCS(curBSECE, "ECE 344",       3, "Second", 4);
    await InsertCS(curBSECE, "ECE 364",       3, "Second", 4);
    await InsertCS(curBSECE, "ECE 384",       3, "Second", 4);
    await InsertCS(curBSECE, "ECE 383",       3, "Second", 3);
    // Year 3 — Summer
    await InsertCS(curBSECE, "ECE 303",       3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSECE, "RIZAL 001",     4, "First",  3);
    await InsertCS(curBSECE, "ECE 413",       4, "First",  3);
    await InsertCS(curBSECE, "ECE 411",       4, "First",  1);
    await InsertCS(curBSECE, "ECE 414",       4, "First",  4, isElective: true);
    await InsertCS(curBSECE, "ENV 413",       4, "First",  3);
    await InsertCS(curBSECE, "ECE 433",       4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSECE, "LIT 001",       4, "Second", 3);
    await InsertCS(curBSECE, "ECE 401",       4, "Second", 1);
    await InsertCS(curBSECE, "ECE 421",       4, "Second", 1);
    await InsertCS(curBSECE, "ECE 424",       4, "Second", 4, isElective: true);
    await InsertCS(curBSECE, "ECE 422",       4, "Second", 2);
    await InsertCS(curBSECE, "DRR 113",       4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSCpE Curriculum Subjects (UP Diliman AY 2018-2019 / CHED CMO 87 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSCpE, "PHILO 1",    1, "First",  3);
    await InsertCS(curBSCpE, "EEE 111",    1, "First",  3);
    await InsertCS(curBSCpE, "EEE 113",    1, "First",  3);
    await InsertCS(curBSCpE, "EEE 118",    1, "First",  1);
    await InsertCS(curBSCpE, "Math 21",    1, "First",  5);
    await InsertCS(curBSCpE, "Physics 71", 1, "First",  4);
    // Year 1 — Second Semester
    await InsertCS(curBSCpE, "ENG 13",     1, "Second", 3);
    await InsertCS(curBSCpE, "Speech 30",  1, "Second", 3);
    await InsertCS(curBSCpE, "EEE 121",    1, "Second", 3);
    await InsertCS(curBSCpE, "EEE 123",    1, "Second", 3);
    await InsertCS(curBSCpE, "EEE 128",    1, "Second", 1);
    await InsertCS(curBSCpE, "Math 22",    1, "Second", 5);
    await InsertCS(curBSCpE, "Physics 72", 1, "Second", 4);
    // Year 2 — First Semester
    await InsertCS(curBSCpE, "EEE 131",    2, "First",  3);
    await InsertCS(curBSCpE, "EEE 133",    2, "First",  3);
    await InsertCS(curBSCpE, "EEE 135",    2, "First",  3);
    await InsertCS(curBSCpE, "EEE 137",    2, "First",  3);
    await InsertCS(curBSCpE, "EEE 138",    2, "First",  1);
    await InsertCS(curBSCpE, "Math 23",    2, "First",  5);
    await InsertCS(curBSCpE, "Math 40",    2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curBSCpE, "EEE 141",    2, "Second", 3);
    await InsertCS(curBSCpE, "EEE 143",    2, "Second", 3);
    await InsertCS(curBSCpE, "EEE 145",    2, "Second", 3);
    await InsertCS(curBSCpE, "EEE 147",    2, "Second", 3);
    await InsertCS(curBSCpE, "EEE 148",    2, "Second", 1);
    await InsertCS(curBSCpE, "ES 101",     2, "Second", 3);
    await InsertCS(curBSCpE, "CoE 111",    2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curBSCpE, "EEE 151",    3, "First",  3);
    await InsertCS(curBSCpE, "EEE 153",    3, "First",  3);
    await InsertCS(curBSCpE, "EEE 155",    3, "First",  3);
    await InsertCS(curBSCpE, "EEE 157",    3, "First",  3);
    await InsertCS(curBSCpE, "EEE 158",    3, "First",  1);
    await InsertCS(curBSCpE, "Physics 73", 3, "First",  4);
    await InsertCS(curBSCpE, "CoE 161",    3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSCpE, "CoE 163",    3, "Second", 3);
    await InsertCS(curBSCpE, "CoE 164",    3, "Second", 3);
    await InsertCS(curBSCpE, "EEE 192",    3, "Second", 3);
    await InsertCS(curBSCpE, "CoE 165",    3, "Second", 3);
    await InsertCS(curBSCpE, "CoE 167",    3, "Second", 3);
    await InsertCS(curBSCpE, "CoE 168",    3, "Second", 3);
    await InsertCS(curBSCpE, "CoE 133",    3, "Second", 3);
    // Year 3 — Summer
    await InsertCS(curBSCpE, "CoE 197",    3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSCpE, "EEE 196",    4, "First",  3);
    await InsertCS(curBSCpE, "CoE 198",    4, "First",  3);
    await InsertCS(curBSCpE, "PI 100",     4, "First",  3);
    await InsertCS(curBSCpE, "CoE 134",    4, "First",  3);
    await InsertCS(curBSCpE, "CoE 135",    4, "First",  3);
    await InsertCS(curBSCpE, "CoE 127",    4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSCpE, "CoE 199",    4, "Second", 3);
    await InsertCS(curBSCpE, "CoE 23",     4, "Second", 3);
    await InsertCS(curBSCpE, "CoE 121",    4, "Second", 3);
    await InsertCS(curBSCpE, "CoE 129",    4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSCE Curriculum Subjects (UP Diliman AY 2018-2019 / CHED CMO 92 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSCE, "Eng 13",      1, "First",  3);
    await InsertCS(curBSCE, "Speech 30",   1, "First",  3);
    await InsertCS(curBSCE, "Chem 16",     1, "First",  3);
    await InsertCS(curBSCE, "Chem 16.1",   1, "First",  1);
    await InsertCS(curBSCE, "Math 21",     1, "First",  5);
    await InsertCS(curBSCE, "Physics 71",  1, "First",  4);
    await InsertCS(curBSCE, "Physics 71.1",1, "First",  1);
    // Year 1 — Second Semester
    await InsertCS(curBSCE, "Math 22",     1, "Second", 5);
    await InsertCS(curBSCE, "Physics 72",  1, "Second", 4);
    await InsertCS(curBSCE, "Physics 72.1",1, "Second", 1);
    await InsertCS(curBSCE, "ES 1",        1, "Second", 1);
    await InsertCS(curBSCE, "GE 10",       1, "Second", 3);
    await InsertCS(curBSCE, "CE 1",        1, "Second", 1);
    await InsertCS(curBSCE, "CE 29",       1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSCE, "Math 23",     2, "First",  5);
    await InsertCS(curBSCE, "ES 101",      2, "First",  3);
    await InsertCS(curBSCE, "GE 12",       2, "First",  3);
    await InsertCS(curBSCE, "CE 11",       2, "First",  3);
    await InsertCS(curBSCE, "CE 24",       2, "First",  3);
    await InsertCS(curBSCE, "CE 43",       2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curBSCE, "ES 102",      2, "Second", 3);
    await InsertCS(curBSCE, "CE 17",       2, "Second", 3);
    await InsertCS(curBSCE, "CE 22",       2, "Second", 3);
    await InsertCS(curBSCE, "CE 25",       2, "Second", 3);
    await InsertCS(curBSCE, "CE 31",       2, "Second", 3);
    await InsertCS(curBSCE, "CE 130",      2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curBSCE, "CE 18",       3, "First",  3);
    await InsertCS(curBSCE, "CE 115",      3, "First",  3);
    await InsertCS(curBSCE, "CE 123",      3, "First",  3);
    await InsertCS(curBSCE, "CE 141",      3, "First",  3);
    await InsertCS(curBSCE, "CE 151",      3, "First",  3);
    await InsertCS(curBSCE, "CE 162",      3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSCE, "CE 116",      3, "Second", 3);
    await InsertCS(curBSCE, "CE 124",      3, "Second", 3);
    await InsertCS(curBSCE, "CE 132",      3, "Second", 3);
    await InsertCS(curBSCE, "CE 142",      3, "Second", 3);
    await InsertCS(curBSCE, "CE 152",      3, "Second", 3);
    await InsertCS(curBSCE, "CE 163",      3, "Second", 3);
    // Year 3 — Summer
    await InsertCS(curBSCE, "CE 195",      3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSCE, "CE 190",      4, "First",  3);
    await InsertCS(curBSCE, "DRMAPS",      4, "First",  3);
    await InsertCS(curBSCE, "CE 199",      4, "First",  3);
    await InsertCS(curBSCE, "CE 117",      4, "First",  3, isElective: true);
    await InsertCS(curBSCE, "CE 125",      4, "First",  3, isElective: true);
    await InsertCS(curBSCE, "CE 153",      4, "First",  3, isElective: true);
    // Year 4 — Second Semester
    await InsertCS(curBSCE, "CE 196",      4, "Second", 3);
    await InsertCS(curBSCE, "CE 133",      4, "Second", 3, isElective: true);
    await InsertCS(curBSCE, "CE 143",      4, "Second", 3, isElective: true);
    await InsertCS(curBSCE, "CE 164",      4, "Second", 3, isElective: true);

    // ═════════════════════════════════════════════════════════════════════════
    // BSME Curriculum Subjects (EVSU SY 2025-2026 / CHED CMO 97 s. 2017)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSME, "EO 111",     1, "First",  1);
    await InsertCS(curBSME, "BOSH 113",   1, "First",  3);
    await InsertCS(curBSME, "MGT 112",    1, "First",  2);
    await InsertCS(curBSME, "MATH 113",   1, "First",  3);
    await InsertCS(curBSME, "DRAW 111 D", 1, "First",  1);
    await InsertCS(curBSME, "COMP 111 L", 1, "First",  1);
    await InsertCS(curBSME, "ECON 123",   1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSME, "MATH 123",   1, "Second", 3);
    await InsertCS(curBSME, "PHYS 125",   1, "Second", 5);
    await InsertCS(curBSME, "CHEM 123",   1, "Second", 3);
    await InsertCS(curBSME, "CHEM 121 L", 1, "Second", 1);
    await InsertCS(curBSME, "CAD 211",    1, "Second", 1);
    await InsertCS(curBSME, "ME 211 L",   1, "Second", 1);
    // Year 2 — First Semester
    await InsertCS(curBSME, "MATH 213",   2, "First",  3);
    await InsertCS(curBSME, "MECH 213",   2, "First",  3);
    await InsertCS(curBSME, "ME 213",     2, "First",  3);
    await InsertCS(curBSME, "ME 222 L",   2, "First",  2);
    await InsertCS(curBSME, "COMP 221 L", 2, "First",  1);
    // Year 2 — Second Semester
    await InsertCS(curBSME, "MECH 222",   2, "Second", 2);
    await InsertCS(curBSME, "MATH 223",   2, "Second", 3);
    await InsertCS(curBSME, "ME 222",     2, "Second", 2);
    await InsertCS(curBSME, "ME 243",     2, "Second", 3);
    await InsertCS(curBSME, "MECH 313",   2, "Second", 3);
    await InsertCS(curBSME, "EDA 313",    2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curBSME, "ME 333",     3, "First",  3);
    await InsertCS(curBSME, "ME 353",     3, "First",  3);
    await InsertCS(curBSME, "ME 373",     3, "First",  3);
    await InsertCS(curBSME, "EE 313",     3, "First",  5);
    await InsertCS(curBSME, "IE 303",     3, "First",  3);
    await InsertCS(curBSME, "ME 323",     3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSME, "ME 321",     3, "Second", 1);
    await InsertCS(curBSME, "ME 342",     3, "Second", 2);
    await InsertCS(curBSME, "ME 362",     3, "Second", 2);
    await InsertCS(curBSME, "ME 343",     3, "Second", 3);
    await InsertCS(curBSME, "ME 311 L",   3, "Second", 1);
    await InsertCS(curBSME, "EE 323",     3, "Second", 5);
    // Year 3 — Summer
    await InsertCS(curBSME, "ME 301",     3, "Summer", 3);
    // Year 4 — First Semester
    await InsertCS(curBSME, "ME 412",     4, "First",  2, isElective: true);
    await InsertCS(curBSME, "ME 413",     4, "First",  3);
    await InsertCS(curBSME, "ME 432",     4, "First",  3);
    await InsertCS(curBSME, "ME 452",     4, "First",  2);
    await InsertCS(curBSME, "ME 414",     4, "First",  4);
    await InsertCS(curBSME, "ME 411 L",   4, "First",  1);
    await InsertCS(curBSME, "ME 412 L",   4, "First",  2);
    await InsertCS(curBSME, "EE 413",     4, "First",  3);
    await InsertCS(curBSME, "ME 473",     4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSME, "ME 423",     4, "Second", 3);
    await InsertCS(curBSME, "ME 424",     4, "Second", 4);
    await InsertCS(curBSME, "ME 421 L",   4, "Second", 1);
    await InsertCS(curBSME, "ME 413 L",   4, "Second", 2);
    await InsertCS(curBSME, "ME 422",     4, "Second", 2, isElective: true);
    await InsertCS(curBSME, "ME 442",     4, "Second", 3);
    await InsertCS(curBSME, "ME 443",     4, "Second", 2);
    await InsertCS(curBSME, "ME 463",     4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSPHYS Curriculum Subjects (UP Baguio / CHED CMO 13 s. 2024 - 143 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSPHYS, "Physics 101",   1, "First",  4);
    await InsertCS(curBSPHYS, "Physics 101.1", 1, "First",  1);
    await InsertCS(curBSPHYS, "Math 53",       1, "First",  5);
    await InsertCS(curBSPHYS, "GEd 101",       1, "First",  3);
    await InsertCS(curBSPHYS, "GEd 102",       1, "First",  3);
    await InsertCS(curBSPHYS, "PE 101",        1, "First",  2);
    await InsertCS(curBSPHYS, "NSTP 1",        1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSPHYS, "Physics 102",   1, "Second", 4);
    await InsertCS(curBSPHYS, "Physics 102.1", 1, "Second", 1);
    await InsertCS(curBSPHYS, "Physics 121",   1, "Second", 4);
    await InsertCS(curBSPHYS, "Math 54",       1, "Second", 5);
    await InsertCS(curBSPHYS, "GEd 103",       1, "Second", 3);
    await InsertCS(curBSPHYS, "PE 102",        1, "Second", 2);
    await InsertCS(curBSPHYS, "NSTP 2",        1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSPHYS, "Physics 103",   2, "First",  4);
    await InsertCS(curBSPHYS, "Physics 103.1", 2, "First",  1);
    await InsertCS(curBSPHYS, "Physics 122",   2, "First",  4);
    await InsertCS(curBSPHYS, "Physics 131",   2, "First",  4);
    await InsertCS(curBSPHYS, "GEd 104",       2, "First",  3);
    await InsertCS(curBSPHYS, "PE 103",        2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSPHYS, "Physics 104",   2, "Second", 4);
    await InsertCS(curBSPHYS, "Physics 104.1", 2, "Second", 1);
    await InsertCS(curBSPHYS, "Physics 123",   2, "Second", 4);
    await InsertCS(curBSPHYS, "Physics 161",   2, "Second", 3);
    await InsertCS(curBSPHYS, "GEd 105",       2, "Second", 3);
    await InsertCS(curBSPHYS, "PE 104",        2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSPHYS, "Physics 171",   3, "First",  3);
    await InsertCS(curBSPHYS, "Physics 173",   3, "First",  4);
    await InsertCS(curBSPHYS, "Physics 181",   3, "First",  3);
    await InsertCS(curBSPHYS, "Physics 162",   3, "First",  3);
    await InsertCS(curBSPHYS, "GEd 106",       3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSPHYS, "Physics 172",   3, "Second", 3);
    await InsertCS(curBSPHYS, "Physics 165",   3, "Second", 3);
    await InsertCS(curBSPHYS, "Physics 175",   3, "Second", 3);
    await InsertCS(curBSPHYS, "Physics 182",   3, "Second", 3);
    await InsertCS(curBSPHYS, "Physics 199",   3, "Second", 3);
    await InsertCS(curBSPHYS, "GEd 107",       3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSPHYS, "Chem 18",       4, "First",  4);
    await InsertCS(curBSPHYS, "Chem 18.1",     4, "First",  1);
    await InsertCS(curBSPHYS, "Physics 183",   4, "First",  3);
    await InsertCS(curBSPHYS, "Physics 195",   4, "First",  3, isElective: true);
    await InsertCS(curBSPHYS, "GEd 108",       4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSPHYS, "Physics 196",   4, "Second", 1);
    await InsertCS(curBSPHYS, "Physics 200",   4, "Second", 3);
    await InsertCS(curBSPHYS, "GEd 109",       4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSAPHY Curriculum Subjects (UP Diliman / CHED CMO 13 s. 2024 - 148 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSAPHY, "Physics 106",   1, "First",  4);
    await InsertCS(curBSAPHY, "Physics 106.1", 1, "First",  1);
    await InsertCS(curBSAPHY, "Geol 11",       1, "First",  3);
    await InsertCS(curBSAPHY, "Geol 11.1",     1, "First",  1);
    await InsertCS(curBSAPHY, "Chem 16",       1, "First",  3);
    await InsertCS(curBSAPHY, "Chem 16.1",     1, "First",  1);
    await InsertCS(curBSAPHY, "Math 53",       1, "First",  5);
    await InsertCS(curBSAPHY, "PE 101",        1, "First",  2);
    await InsertCS(curBSAPHY, "NSTP 1",        1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSAPHY, "Physics 107",   1, "Second", 4);
    await InsertCS(curBSAPHY, "Physics 107.1", 1, "Second", 1);
    await InsertCS(curBSAPHY, "Physics 116",   1, "Second", 3);
    await InsertCS(curBSAPHY, "Math 122",      1, "Second", 3);
    await InsertCS(curBSAPHY, "Physics 10",    1, "Second", 3);
    await InsertCS(curBSAPHY, "GEd 101",       1, "Second", 3);
    await InsertCS(curBSAPHY, "PE 102",        1, "Second", 2);
    await InsertCS(curBSAPHY, "NSTP 2",        1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSAPHY, "Physics 108",   2, "First",  4);
    await InsertCS(curBSAPHY, "Physics 117",   2, "First",  3);
    await InsertCS(curBSAPHY, "Physics 126",   2, "First",  3);
    await InsertCS(curBSAPHY, "App Physics 181", 2, "First", 3);
    await InsertCS(curBSAPHY, "App Physics 155", 2, "First", 3);
    await InsertCS(curBSAPHY, "PE 103",        2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSAPHY, "Physics 131",   2, "Second", 3);
    await InsertCS(curBSAPHY, "Physics 141",   2, "Second", 3);
    await InsertCS(curBSAPHY, "Physics 132",   2, "Second", 3);
    await InsertCS(curBSAPHY, "Physics 142",   2, "Second", 3);
    await InsertCS(curBSAPHY, "App Physics 157", 2, "Second", 3);
    await InsertCS(curBSAPHY, "PE 104",        2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSAPHY, "Physics 165",   3, "First",  3);
    await InsertCS(curBSAPHY, "Physics 191",   3, "First",  3);
    await InsertCS(curBSAPHY, "App Physics 167", 3, "First", 3);
    await InsertCS(curBSAPHY, "App Physics 184", 3, "First", 3);
    await InsertCS(curBSAPHY, "GEd 102",       3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSAPHY, "Physics 170",   3, "Second", 3);
    await InsertCS(curBSAPHY, "Physics 192",   3, "Second", 3);
    await InsertCS(curBSAPHY, "App Physics 199", 3, "Second", 3);
    await InsertCS(curBSAPHY, "Physics 151",   3, "Second", 3);
    await InsertCS(curBSAPHY, "GEd 103",       3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSAPHY, "Physics 161",   4, "First",  3, isElective: true);
    await InsertCS(curBSAPHY, "App Physics 200", 4, "First", 3);
    await InsertCS(curBSAPHY, "GEd 104",       4, "First",  3);
    await InsertCS(curBSAPHY, "GEd 105",       4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSAPHY, "GEd 106",       4, "Second", 3);
    await InsertCS(curBSAPHY, "GEd 107",       4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // BSAPMATH Curriculum Subjects (UP Diliman / CHED CMO 48 s. 2017 - 145 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSAPMATH, "Math 20",     1, "First",  3);
    await InsertCS(curBSAPMATH, "Math 53",     1, "First",  5);
    await InsertCS(curBSAPMATH, "GEd 101",     1, "First",  3);
    await InsertCS(curBSAPMATH, "GEd 102",     1, "First",  3);
    await InsertCS(curBSAPMATH, "PE 101",      1, "First",  2);
    await InsertCS(curBSAPMATH, "NSTP 1",      1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSAPMATH, "Math 54",     1, "Second", 5);
    await InsertCS(curBSAPMATH, "Math 108",    1, "Second", 3);
    await InsertCS(curBSAPMATH, "Math 40",     1, "Second", 3);
    await InsertCS(curBSAPMATH, "GEd 103",     1, "Second", 3);
    await InsertCS(curBSAPMATH, "PE 102",      1, "Second", 2);
    await InsertCS(curBSAPMATH, "NSTP 2",      1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSAPMATH, "Math 23",     2, "First",  5);
    await InsertCS(curBSAPMATH, "Math 110.1",  2, "First",  3);
    await InsertCS(curBSAPMATH, "Math 117",    2, "First",  3);
    await InsertCS(curBSAPMATH, "GEd 104",     2, "First",  3);
    await InsertCS(curBSAPMATH, "PE 103",      2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSAPMATH, "Math 110.2",  2, "Second", 3);
    await InsertCS(curBSAPMATH, "Math 123.1",  2, "Second", 3);
    await InsertCS(curBSAPMATH, "GEd 105",     2, "Second", 3);
    await InsertCS(curBSAPMATH, "GEd 106",     2, "Second", 3);
    await InsertCS(curBSAPMATH, "PE 104",      2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSAPMATH, "Math 110.3",  3, "First",  3);
    await InsertCS(curBSAPMATH, "Math 123.2",  3, "First",  3);
    await InsertCS(curBSAPMATH, "Math 126",    3, "First",  3);
    await InsertCS(curBSAPMATH, "GEd 107",     3, "First",  3);
    await InsertCS(curBSAPMATH, "GEd 108",     3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSAPMATH, "Math 128",    3, "Second", 3);
    await InsertCS(curBSAPMATH, "GEd 109",     3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSAPMATH, "Math 199",    4, "First",  3);
    // Year 4 — Second Semester
    await InsertCS(curBSAPMATH, "GEd 105",     4, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // JD Curriculum Subjects (LEB MO 24 s. 2021 Model Curriculum - 135 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curJD, "JD 101", 1, "First",  2);
    await InsertCS(curJD, "JD 102", 1, "First",  2);
    await InsertCS(curJD, "JD 103", 1, "First",  3);
    await InsertCS(curJD, "JD 104", 1, "First",  3);
    await InsertCS(curJD, "JD 105", 1, "First",  3);
    await InsertCS(curJD, "JD 106", 1, "First",  3);
    await InsertCS(curJD, "JD 107", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curJD, "JD 108", 1, "Second", 5);
    await InsertCS(curJD, "JD 109", 1, "Second", 4);
    await InsertCS(curJD, "JD 110", 1, "Second", 4);
    await InsertCS(curJD, "JD 201", 1, "Second", 4);
    await InsertCS(curJD, "JD 202", 1, "Second", 4);
    // Year 2 — First Semester
    await InsertCS(curJD, "JD 203", 2, "First",  3);
    await InsertCS(curJD, "JD 204", 2, "First",  3);
    await InsertCS(curJD, "JD 205", 2, "First",  4);
    await InsertCS(curJD, "JD 206", 2, "First",  3);
    await InsertCS(curJD, "JD 207", 2, "First",  3);
    await InsertCS(curJD, "JD 208", 2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curJD, "JD 209", 2, "Second", 3);
    await InsertCS(curJD, "JD 301", 2, "Second", 4);
    await InsertCS(curJD, "JD 302", 2, "Second", 3);
    await InsertCS(curJD, "JD 303", 2, "Second", 4);
    await InsertCS(curJD, "JD 304", 2, "Second", 3);
    await InsertCS(curJD, "JD 305", 2, "Second", 3);
    // Year 3 — First Semester
    await InsertCS(curJD, "JD 306", 3, "First",  4);
    await InsertCS(curJD, "JD 307", 3, "First",  2);
    await InsertCS(curJD, "JD 308", 3, "First",  3);
    await InsertCS(curJD, "JD 309", 3, "First",  3);
    await InsertCS(curJD, "JD 310", 3, "First",  3);
    await InsertCS(curJD, "JD 311", 3, "First",  4);
    // Year 3 — Second Semester
    await InsertCS(curJD, "JD 401", 3, "Second", 3);
    await InsertCS(curJD, "JD 402", 3, "Second", 3);
    await InsertCS(curJD, "JD 403", 3, "Second", 3);
    await InsertCS(curJD, "JD 404", 3, "Second", 3);
    await InsertCS(curJD, "JD 405", 3, "Second", 3);
    await InsertCS(curJD, "JD 406", 3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curJD, "JD 407", 4, "First",  3);
    await InsertCS(curJD, "JD 408", 4, "First",  3);
    await InsertCS(curJD, "JD 409", 4, "First",  3);
    await InsertCS(curJD, "JD 410", 4, "First",  3);

    // ═════════════════════════════════════════════════════════════════════════
    // LLM Curriculum Subjects (UST Graduate School of Law / LEB - 42 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curLLM, "GS 500",  1, "First",  3);
    await InsertCS(curLLM, "GS 501",  1, "First",  3);
    await InsertCS(curLLM, "LAW 600", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curLLM, "LAW 601", 1, "Second", 3);
    await InsertCS(curLLM, "LAW 603", 1, "Second", 3);
    await InsertCS(curLLM, "LAW 701", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curLLM, "LAW 702", 2, "First",  3);
    await InsertCS(curLLM, "LAW 703", 2, "First",  3);
    await InsertCS(curLLM, "GSLAW 724", 2, "First", 3);
    await InsertCS(curLLM, "LAW 790", 2, "First",  3, isElective: true);
    // Year 2 — Second Semester
    await InsertCS(curLLM, "TW I",    2, "Second", 3);
    await InsertCS(curLLM, "TW II",   2, "Second", 3);
    await InsertCS(curLLM, "TW III",  2, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // MSCYBER Curriculum Subjects (DLSU / HAU / CHED CMO 07 s. 2010 - 30 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curMSCYBER, "SEC 501", 1, "First",  3);
    await InsertCS(curMSCYBER, "SEC 502", 1, "First",  3);
    await InsertCS(curMSCYBER, "SEC 503", 1, "First",  2);
    // Year 1 — Second Semester
    await InsertCS(curMSCYBER, "SEC 601", 1, "Second", 3);
    await InsertCS(curMSCYBER, "SEC 602", 1, "Second", 3);
    await InsertCS(curMSCYBER, "SEC 603", 1, "Second", 2);
    // Year 2 — First Semester
    await InsertCS(curMSCYBER, "SEC 701", 2, "First",  3);
    await InsertCS(curMSCYBER, "SEC 702", 2, "First",  3);
    await InsertCS(curMSCYBER, "SEC 801", 2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curMSCYBER, "SEC 802", 2, "Second", 3);
    await InsertCS(curMSCYBER, "SEC 803", 2, "Second", 2);

    // ═════════════════════════════════════════════════════════════════════════
    // MSCS Curriculum Subjects (UP Diliman DCS - 31 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curMSCS, "CS 204", 1, "First",  3);
    await InsertCS(curMSCS, "CS 208", 1, "First",  3);
    await InsertCS(curMSCS, "CS 210", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curMSCS, "CS 214", 1, "Second", 3);
    await InsertCS(curMSCS, "CS 233", 1, "Second", 3);
    await InsertCS(curMSCS, "CS 236", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curMSCS, "CS 239", 2, "First",  3);
    await InsertCS(curMSCS, "CS 240", 2, "First",  3);
    await InsertCS(curMSCS, "CS 242", 2, "First",  3, isElective: true);
    // Year 2 — Second Semester
    await InsertCS(curMSCS, "CS 245", 2, "Second", 3, isElective: true);
    await InsertCS(curMSCS, "CS 300", 2, "Second", 6);

    // ═════════════════════════════════════════════════════════════════════════
    // MSDS Curriculum Subjects (Batangas State University - 30 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curMSDS, "MSDS 500", 1, "First",  3);
    await InsertCS(curMSDS, "MSDS 501", 1, "First",  3);
    await InsertCS(curMSDS, "MSDS 502", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curMSDS, "MSDS 503", 1, "Second", 3);
    await InsertCS(curMSDS, "MSDS 504", 1, "Second", 3);
    await InsertCS(curMSDS, "MSDS 505", 1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curMSDS, "MSDS 510", 2, "First",  3, isElective: true);
    await InsertCS(curMSDS, "MSDS 511", 2, "First",  3, isElective: true);
    await InsertCS(curMSDS, "MSDS 520", 2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curMSDS, "MSDS 521", 2, "Second", 3);

    // ═════════════════════════════════════════════════════════════════════════
    // MD Curriculum Subjects (UST Faculty of Medicine / CHED CMO 18 s. 2016 - 160 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curMD, "MED 101", 1, "First",  6);
    await InsertCS(curMD, "MED 102", 1, "First",  5);
    await InsertCS(curMD, "MED 104", 1, "First",  4);
    await InsertCS(curMD, "MED 106", 1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curMD, "MED 103", 1, "Second", 5);
    await InsertCS(curMD, "MED 105", 1, "Second", 3);
    await InsertCS(curMD, "MED 107", 1, "Second", 2);
    await InsertCS(curMD, "MED 108", 1, "Second", 2);
    // Year 2 — First Semester
    await InsertCS(curMD, "MED 201", 2, "First",  6);
    await InsertCS(curMD, "MED 202", 2, "First",  5);
    await InsertCS(curMD, "MED 203", 2, "First",  5);
    await InsertCS(curMD, "MED 204", 2, "First",  4);
    await InsertCS(curMD, "MED 205", 2, "First",  4);
    await InsertCS(curMD, "MED 206", 2, "First",  3);
    // Year 2 — Second Semester
    await InsertCS(curMD, "MED 207", 2, "Second", 3);
    await InsertCS(curMD, "MED 208", 2, "Second", 4);
    await InsertCS(curMD, "MED 209", 2, "Second", 2);
    await InsertCS(curMD, "MED 210", 2, "Second", 3);
    await InsertCS(curMD, "MED 211", 2, "Second", 3);
    await InsertCS(curMD, "MED 212", 2, "Second", 2);
    await InsertCS(curMD, "MED 213", 2, "Second", 2);
    await InsertCS(curMD, "MED 214", 2, "Second", 4);
    await InsertCS(curMD, "MED 215", 2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curMD, "MED 301", 3, "First",  6);
    await InsertCS(curMD, "MED 302", 3, "First",  5);
    await InsertCS(curMD, "MED 303", 3, "First",  5);
    await InsertCS(curMD, "MED 304", 3, "First",  4);
    await InsertCS(curMD, "MED 305", 3, "First",  3);
    await InsertCS(curMD, "MED 306", 3, "First",  3);
    await InsertCS(curMD, "MED 307", 3, "First",  2);
    await InsertCS(curMD, "MED 308", 3, "First",  2);
    // Year 3 — Second Semester
    await InsertCS(curMD, "MED 309", 3, "Second", 2);
    await InsertCS(curMD, "MED 310", 3, "Second", 2);
    await InsertCS(curMD, "MED 311", 3, "Second", 2);
    await InsertCS(curMD, "MED 312", 3, "Second", 2);
    await InsertCS(curMD, "MED 313", 3, "Second", 3);
    await InsertCS(curMD, "MED 314", 3, "Second", 3);
    await InsertCS(curMD, "MED 315", 3, "Second", 2);
    await InsertCS(curMD, "MED 316", 3, "Second", 2);
    await InsertCS(curMD, "MED 317", 3, "Second", 2);
    // Year 4 — First Semester
    await InsertCS(curMD, "MED 401", 4, "First", 10);
    await InsertCS(curMD, "MED 402", 4, "First", 10);
    await InsertCS(curMD, "MED 403", 4, "First", 10);
    // Year 4 — Second Semester
    await InsertCS(curMD, "MED 404", 4, "Second",10);
    await InsertCS(curMD, "MED 405", 4, "Second", 5);
    await InsertCS(curMD, "MED 406", 4, "Second", 5);

    // ═════════════════════════════════════════════════════════════════════════
    // BSPSYCH Curriculum Subjects (HAU / UP Baguio / CHED CMO 34 s. 2017 - 145 Units)
    // ═════════════════════════════════════════════════════════════════════════
    // Year 1 — First Semester
    await InsertCS(curBSPSYCH, "PSYCH 101", 1, "First",  3);
    await InsertCS(curBSPSYCH, "GEd 101",   1, "First",  3);
    await InsertCS(curBSPSYCH, "GEd 102",   1, "First",  3);
    await InsertCS(curBSPSYCH, "GEd 103",   1, "First",  3);
    await InsertCS(curBSPSYCH, "PE 101",    1, "First",  2);
    await InsertCS(curBSPSYCH, "NSTP 1",    1, "First",  3);
    // Year 1 — Second Semester
    await InsertCS(curBSPSYCH, "PSYCH 110", 1, "Second", 3);
    await InsertCS(curBSPSYCH, "GEd 104",   1, "Second", 3);
    await InsertCS(curBSPSYCH, "GEd 105",   1, "Second", 3);
    await InsertCS(curBSPSYCH, "GEd 106",   1, "Second", 3);
    await InsertCS(curBSPSYCH, "PE 102",    1, "Second", 2);
    await InsertCS(curBSPSYCH, "NSTP 2",    1, "Second", 3);
    // Year 2 — First Semester
    await InsertCS(curBSPSYCH, "PSYCH 115", 2, "First",  3);
    await InsertCS(curBSPSYCH, "PSYCH 140", 2, "First",  3);
    await InsertCS(curBSPSYCH, "PSYCH 190", 2, "First",  3);
    await InsertCS(curBSPSYCH, "GEd 107",   2, "First",  3);
    await InsertCS(curBSPSYCH, "PE 103",    2, "First",  2);
    // Year 2 — Second Semester
    await InsertCS(curBSPSYCH, "PSYCH 150", 2, "Second", 3);
    await InsertCS(curBSPSYCH, "PSYCH 171", 2, "Second", 3);
    await InsertCS(curBSPSYCH, "PSYCH 180", 2, "Second", 3);
    await InsertCS(curBSPSYCH, "GEd 108",   2, "Second", 3);
    await InsertCS(curBSPSYCH, "PE 104",    2, "Second", 2);
    // Year 3 — First Semester
    await InsertCS(curBSPSYCH, "PSYCH 155", 3, "First",  3);
    await InsertCS(curBSPSYCH, "PSYCH 162", 3, "First",  4);
    await InsertCS(curBSPSYCH, "PSYCH 172", 3, "First",  3);
    await InsertCS(curBSPSYCH, "PSYCH 182", 3, "First",  3);
    await InsertCS(curBSPSYCH, "GEd 109",   3, "First",  3);
    // Year 3 — Second Semester
    await InsertCS(curBSPSYCH, "PSYCH 163", 3, "Second", 3);
    await InsertCS(curBSPSYCH, "PSYCH 195", 3, "Second", 3);
    // Year 4 — First Semester
    await InsertCS(curBSPSYCH, "PSYCH 198", 4, "First",  5);
    // Year 4 — Second Semester
    await InsertCS(curBSPSYCH, "PSYCH 200", 4, "Second", 3);

    // ─── Seed prerequisite rules ──────────────────────────────────────────────
    async Task InsertPrereq(string subjectCode, string prereqCode)
    {
        var sql3 = """
            INSERT INTO curriculum."PrerequisiteRules" ("Id", "CourseDefinitionId", "RequiredCourseCode", "MinimumGrade", "IsEnforced")
            SELECT gen_random_uuid(), s."Id", @PrereqCode, '75', TRUE
            FROM curriculum."Courses" s
            WHERE s."Code" = @SubjectCode
              AND NOT EXISTS (
                SELECT 1 FROM curriculum."PrerequisiteRules"
                WHERE "CourseDefinitionId" = s."Id" AND "RequiredCourseCode" = @PrereqCode
              )
            LIMIT 1;
            """;
        await using var p = new NpgsqlCommand(sql3, conn);
        p.Parameters.AddWithValue("SubjectCode", subjectCode);
        p.Parameters.AddWithValue("PrereqCode", prereqCode);
        await p.ExecuteNonQueryAsync();
    }

    // BSA prerequisite chains
    await InsertPrereq("ACC102", "ACC101");
    await InsertPrereq("ACC201", "ACC102");
    await InsertPrereq("ACC202", "ACC102");
    await InsertPrereq("ACC203", "ACC201");
    await InsertPrereq("ACC204", "ACC202");
    await InsertPrereq("ACC205", "ACC204");
    await InsertPrereq("ACC206", "ACC204");
    await InsertPrereq("ACC301", "ACC206");
    await InsertPrereq("ACC302", "ACC301");
    await InsertPrereq("ACC303", "BMA201");
    await InsertPrereq("ACC304", "ACC203");
    await InsertPrereq("ACC305", "ACC204");
    await InsertPrereq("ACC306", "ACC201");
    await InsertPrereq("ACC401", "ACC305");
    await InsertPrereq("ACC402", "ACC302");
    await InsertPrereq("ACC403", "ACC303");
    await InsertPrereq("ACC407", "ACC205");

    // BSCS prerequisite chains (Batangas State University AY 2025-2026 / CHED CMO 25)
    await InsertPrereq("CC 102", "CC 101");
    await InsertPrereq("CC 103", "CC 100");
    await InsertPrereq("CC 103", "CC 101");
    await InsertPrereq("MATH 102", "MATH 101");
    await InsertPrereq("PATHFit 2", "PATHFit 1");
    await InsertPrereq("NSTP 121", "NSTP 111");
    await InsertPrereq("OOP 101", "CC 102");
    await InsertPrereq("OOP 101", "CC 103");
    await InsertPrereq("CC 104", "CC 103");
    await InsertPrereq("CpE 405", "MATH 101");
    await InsertPrereq("PHYS 111", "MATH 101");
    await InsertPrereq("PATHFit 3", "PATHFit 1");
    await InsertPrereq("PATHFit 3", "PATHFit 2");
    await InsertPrereq("AL 101", "CpE 405");
    await InsertPrereq("AL 101", "CC 103");
    await InsertPrereq("OOP 102", "OOP 101");
    await InsertPrereq("NET 101", "CC 100");
    await InsertPrereq("AR 101", "CpE 405");
    await InsertPrereq("AR 101", "OOP 101");
    await InsertPrereq("AI 102", "MATH 102");
    await InsertPrereq("PHYS 112", "PHYS 111");
    await InsertPrereq("PATHFit 4", "PATHFit 1");
    await InsertPrereq("PATHFit 4", "PATHFit 2");
    await InsertPrereq("AL 102", "AL 101");
    await InsertPrereq("AL 102", "CpE 405");
    await InsertPrereq("SC 101", "CC 104");
    await InsertPrereq("NET 102", "NET 101");
    await InsertPrereq("CSAI 100", "AI 101");
    await InsertPrereq("CSAI 100", "AI 102");
    await InsertPrereq("CSAI 100", "CpE 405");
    await InsertPrereq("DS 101", "AI 101");
    await InsertPrereq("DS 101", "AI 102");
    await InsertPrereq("DS 101", "CC 102");
    await InsertPrereq("PL 101", "OOP 101");
    await InsertPrereq("AI 103", "CSAI 100");
    await InsertPrereq("AI 103", "CC 102");
    await InsertPrereq("SE 101", "OOP 101");
    await InsertPrereq("SE 101", "CC 104");
    await InsertPrereq("HCI 101", "CC 102");
    await InsertPrereq("CC 105", "OOP 101");
    await InsertPrereq("QM 101", "AI 102");
    await InsertPrereq("QM 101", "CpE 405");
    await InsertPrereq("WS 101", "CC 104");
    await InsertPrereq("WS 101", "OOP 101");
    await InsertPrereq("SE 102", "SE 101");
    await InsertPrereq("OS 101", "AR 101");
    await InsertPrereq("THS 102", "THS 101");
    await InsertPrereq("PD 101", "OS 101");
    await InsertPrereq("PD 101", "AL 101");
    await InsertPrereq("SIP 101", "CC 100");

    // BSMA prerequisite chains (Holy Cross of Davao College / UST AY 2025-2026 / CHED CMO 28)
    await InsertPrereq("CFAS 101", "FAR 101");
    await InsertPrereq("MANECO 101", "FAR 101");
    await InsertPrereq("IA 101", "FAR 101");
    await InsertPrereq("CAC 101", "FAR 101");
    await InsertPrereq("AIS 101", "CFAS 101");
    await InsertPrereq("STAT 101", "GEd 102");
    await InsertPrereq("IA 102", "IA 101");
    await InsertPrereq("MA 101", "CAC 101");
    await InsertPrereq("TAX 101", "FAR 101");
    await InsertPrereq("BFIN 101", "FAR 101");
    await InsertPrereq("AUD 101", "FAR 101");
    await InsertPrereq("BUSRES 101", "STAT 101");
    await InsertPrereq("SCM 101", "MA 101");
    await InsertPrereq("MA 201", "CAC 101");
    await InsertPrereq("FINMAN 101", "FAR 101");
    await InsertPrereq("ADV-AIS 101", "AIS 101");
    await InsertPrereq("BUSAN 101", "STAT 101");
    await InsertPrereq("SBA 101", "MA 101");
    await InsertPrereq("ADV-CAC 101", "CAC 101");
    await InsertPrereq("FSA 101", "IA 101");
    await InsertPrereq("TAX 102", "TAX 101");
    await InsertPrereq("ACCRES 101", "BUSRES 101");
    await InsertPrereq("BLAW 102", "BLAW 101");
    await InsertPrereq("ADV-MA 101", "SCM 101");
    await InsertPrereq("ADV-MA 101", "MA 101");
    await InsertPrereq("MCS 101", "MA 201");
    await InsertPrereq("MA-RES 1", "ACCRES 101");
    await InsertPrereq("MA-RES 2", "MA-RES 1");

    // BSBA-FM prerequisite chains (Batangas State University / HCDC AY 2025-2026 / CHED CMO 17 & 39)
    await InsertPrereq("FM 101", "ECO 101");
    await InsertPrereq("FM 102", "ECO 101");
    await InsertPrereq("PE 102", "PE 101");
    await InsertPrereq("FM 203", "FM 101");
    await InsertPrereq("PE 103", "PE 101");
    await InsertPrereq("MGT 202", "GEd 107");
    await InsertPrereq("FM 204", "FM 203");
    await InsertPrereq("PE 104", "PE 101");
    await InsertPrereq("BPO 302", "BPO 201");
    await InsertPrereq("FM 305", "FM 204");
    await InsertPrereq("FM 306", "FM 204");
    await InsertPrereq("FM 310", "FM 305");
    await InsertPrereq("FM 310", "FM 306");
    await InsertPrereq("BPO 303", "BPO 302");
    await InsertPrereq("FM 307", "FM 305");
    await InsertPrereq("FM 307", "FM 306");
    await InsertPrereq("FM 308", "FM 305");
    await InsertPrereq("FM 308", "FM 306");
    await InsertPrereq("FM 413", "FM 307");
    await InsertPrereq("FM 413", "FM 308");
    await InsertPrereq("FM 411", "FM 310");
    await InsertPrereq("MGT 406", "MGT 303");

    // BSIT prerequisite chains
    await InsertPrereq("IT201", "IT102");
    await InsertPrereq("IT202", "IT201");
    await InsertPrereq("IT203", "IT103");
    await InsertPrereq("IT203", "IT201");
    await InsertPrereq("IT204", "IT104");
    await InsertPrereq("IT205", "IT204");
    await InsertPrereq("IT206", "IT201");
    await InsertPrereq("IT301", "IT206");
    await InsertPrereq("IT302", "IT204");
    await InsertPrereq("IT303", "IT201");
    await InsertPrereq("IT304", "IT203");
    await InsertPrereq("IT305", "IT202");
    await InsertPrereq("IT401", "IT305");
    await InsertPrereq("IT402", "IT401");
    await InsertPrereq("IT403", "IT402");

    // BSBA-MM prerequisite chains (Batangas State University AY 2018-2019 / CHED CMO 17)
    await InsertPrereq("MKT 201", "MKT 101");
    await InsertPrereq("MKT 202", "MKT 101");
    await InsertPrereq("MKT 203", "MKT 101");
    await InsertPrereq("MKT 301", "MKT 201");
    await InsertPrereq("MKT 301", "MKT 202");
    await InsertPrereq("MKT 302", "MKT 301");
    await InsertPrereq("MKT 303", "MKT 301");
    await InsertPrereq("MKT 304", "MKT 301");
    await InsertPrereq("MKT 305", "MKT 301");
    await InsertPrereq("MKT 306", "MKT 301");
    await InsertPrereq("MKT 307", "MKT 301");
    await InsertPrereq("MKT 401", "MKT 301");
    await InsertPrereq("MKT 402", "MKT 301");
    await InsertPrereq("MKT 403", "MKT 301");
    await InsertPrereq("MKT 404", "MKT 306");
    await InsertPrereq("MKT 405", "MKT 307");

    // BSBA-OM prerequisite chains (Batangas State University AY 2018-2019 / CHED CMO 17)
    await InsertPrereq("OM 201", "OM 101");
    await InsertPrereq("OM 202", "OM 101");
    await InsertPrereq("OM 203", "OM 101");
    await InsertPrereq("OM 301", "OM 201");
    await InsertPrereq("OM 302", "OM 101");
    await InsertPrereq("OM 303", "OM 202");
    await InsertPrereq("OM 304", "OM 201");
    await InsertPrereq("OM 305", "OM 201");
    await InsertPrereq("OM 306", "OM 301");
    await InsertPrereq("OM 307", "OM 101");
    await InsertPrereq("OM 401", "OM 301");
    await InsertPrereq("OM 402", "OM 306");
    await InsertPrereq("OM 403", "OM 307");

    // BSAIS prerequisite chains (UST General Santos AY 2024-2025 / CHED CMO 30)
    await InsertPrereq("AIS 102", "AIS 101");
    await InsertPrereq("AIS 201", "AIS 101");
    await InsertPrereq("AIS 202", "AIS 101");
    await InsertPrereq("AIS 203", "AIS 102");
    await InsertPrereq("AIS 203", "AIS 201");
    await InsertPrereq("AIS 301", "AIS 101");
    await InsertPrereq("AIS 302", "AIS 201");
    await InsertPrereq("AIS 303", "AIS 102");
    await InsertPrereq("AIS 304", "AIS 102");
    await InsertPrereq("AIS 304", "AIS 201");
    await InsertPrereq("AIS 305", "AIS 303");
    await InsertPrereq("AIS 401", "AIS 304");
    await InsertPrereq("AIS 401", "AIS 305");
    await InsertPrereq("AIS 402", "AIS 401");
    await InsertPrereq("AIS 403", "AIS 401");

    // BSN prerequisite chains (LPU Batangas / Davao Doctors SY 2023-2024 / CHED CMO 15)
    await InsertPrereq("MICRO 101", "ANAT 101");
    await InsertPrereq("NCM 101", "ANAT 101");
    await InsertPrereq("NCM 103", "NCM 100");
    await InsertPrereq("NCM 103", "NCM 101");
    await InsertPrereq("NCM 103", "ANAT 101");
    await InsertPrereq("NCM 104", "NCM 103");
    await InsertPrereq("NCM 105", "CHEM 101");
    await InsertPrereq("NCM 106", "ANAT 101");
    await InsertPrereq("NCM 106", "CHEM 101");
    await InsertPrereq("NCM 107", "NCM 103");
    await InsertPrereq("NCM 107", "ANAT 101");
    await InsertPrereq("NCM 109", "NCM 107");
    await InsertPrereq("NCM 109", "NCM 106");
    await InsertPrereq("NCM 111", "NCM 109");
    await InsertPrereq("NCM 112", "NCM 109");
    await InsertPrereq("NCM 113", "NCM 104");
    await InsertPrereq("NCM 114", "NCM 108");
    await InsertPrereq("NCM 116", "NCM 111");
    await InsertPrereq("NCM 117", "NCM 114");
    await InsertPrereq("NCM 119", "NCM 111");
    await InsertPrereq("NCM 120", "NCM 116");
    await InsertPrereq("NCM 120", "NCM 119");

    // BSMLS prerequisite chains (Davao Doctors College SY 2023-2024 / CHED CMO 13)
    await InsertPrereq("MLS 102", "MLS 101");
    await InsertPrereq("CHEM 103", "CHEM 102");
    await InsertPrereq("CHEM 104", "CHEM 102");
    await InsertPrereq("MT 201", "ANAT 102");
    await InsertPrereq("MT 202", "ANAT 102");
    await InsertPrereq("MT 203", "MT 201");
    await InsertPrereq("MT 301", "CHEM 104");
    await InsertPrereq("MT 301", "ANAT 102");
    await InsertPrereq("MT 302", "MT 301");
    await InsertPrereq("MT 303", "MLS 102");
    await InsertPrereq("MT 304", "MT 303");
    await InsertPrereq("MT 305", "ANAT 102");
    await InsertPrereq("MT 306", "MT 305");
    await InsertPrereq("MT 307", "ANAT 102");
    await InsertPrereq("MT 307", "CHEM 103");
    await InsertPrereq("MT 308", "MT 309");
    await InsertPrereq("MT 309", "ANAT 102");
    await InsertPrereq("MT 310", "CHEM 104");
    await InsertPrereq("MT 310", "MT 303");
    await InsertPrereq("MT 401", "MT 302");
    await InsertPrereq("MT 401", "MT 306");
    await InsertPrereq("MT 401", "MT 308");
    await InsertPrereq("MT 402", "MT 401");
    await InsertPrereq("MT 403", "MT 302");
    await InsertPrereq("MT 403", "MT 306");
    await InsertPrereq("MT 403", "MT 308");
    await InsertPrereq("MT 403", "MT 309");
    await InsertPrereq("MT 404", "MT 403");

    // BSRT prerequisite chains (GSDMSFI / CHED CMO 07 s. 2018)
    await InsertPrereq("RAD 103", "RAD 101");
    await InsertPrereq("RAD 201", "RAD 102");
    await InsertPrereq("RAD 202", "RAD 201");
    await InsertPrereq("RAD 203", "RAD 103");
    await InsertPrereq("RAD 204", "RAD 103");
    await InsertPrereq("RAD 205", "RAD 204");
    await InsertPrereq("RAD 301", "RAD 202");
    await InsertPrereq("RAD 302", "RAD 202");
    await InsertPrereq("RAD 302", "RAD 203");
    await InsertPrereq("RAD 303", "RAD 202");
    await InsertPrereq("RAD 303", "RAD 203");
    await InsertPrereq("RAD 304", "RAD 202");
    await InsertPrereq("RAD 305", "RAD 203");
    await InsertPrereq("RAD 306", "RAD 102");
    await InsertPrereq("RAD 307", "RAD 205");
    await InsertPrereq("RAD 309", "RAD 308");
    await InsertPrereq("RAD 401", "RAD 301");
    await InsertPrereq("RAD 401", "RAD 302");
    await InsertPrereq("RAD 401", "RAD 303");
    await InsertPrereq("RAD 402", "RAD 401");

    // BSBIO prerequisite chains (MMSU AY 2024-2025 / CHED CMO 49 s. 2017)
    await InsertPrereq("BIO 103", "BIO 101");
    await InsertPrereq("BIO 103", "BIO 102");
    await InsertPrereq("BIO 201", "BIO 102");
    await InsertPrereq("BIO 202", "BIO 101");
    await InsertPrereq("BIO 203", "BIO 201");
    await InsertPrereq("BIO 204", "BIO 101");
    await InsertPrereq("BIO 204", "BIO 102");
    await InsertPrereq("BIO 301", "BIO 201");
    await InsertPrereq("BIO 302", "BIO 102");
    await InsertPrereq("BIO 303", "BIO 101");
    await InsertPrereq("BIO 303", "BIO 102");
    await InsertPrereq("BIO 304", "GE104");
    await InsertPrereq("BIO 305", "BIO 203");
    await InsertPrereq("BIO 307", "BIO 304");
    await InsertPrereq("BIO 401", "BIO 307");
    await InsertPrereq("BIO 402", "BIO 307");

    // BSMB prerequisite chains (VSU / CHED CMO 46 s. 2017)
    await InsertPrereq("MBIO 102", "MBIO 101");
    await InsertPrereq("MBIO 103", "MBIO 101");
    await InsertPrereq("MBIO 201", "MBIO 103");
    await InsertPrereq("MBIO 202", "MBIO 101");
    await InsertPrereq("MBIO 203", "MBIO 202");
    await InsertPrereq("MBIO 204", "MBIO 102");
    await InsertPrereq("MBIO 204", "MBIO 103");
    await InsertPrereq("MBIO 301", "MBIO 101");
    await InsertPrereq("MBIO 302", "MBIO 201");
    await InsertPrereq("MBIO 304", "MBIO 204");
    await InsertPrereq("MBIO 305", "MBIO 204");
    await InsertPrereq("MBIO 306", "MBIO 203");
    await InsertPrereq("MBIO 401", "MBIO 306");
    await InsertPrereq("MBIO 402", "MBIO 401");
    await InsertPrereq("MBIO 403", "MBIO 306");

    // BSDSA prerequisite chains (TIP QC / UST AY 2022-2024 / CHED)
    await InsertPrereq("CC 101", "CC 100");
    await InsertPrereq("STAT 111", "GEd 102");
    await InsertPrereq("MATH 116", "MATH 115");
    await InsertPrereq("DS 012", "DS 011");
    await InsertPrereq("DS 012", "CC 101");
    await InsertPrereq("CC 103", "CC 101");
    await InsertPrereq("STAT 112", "STAT 111");
    await InsertPrereq("DS 013", "DS 012");
    await InsertPrereq("DS 013", "STAT 112");
    await InsertPrereq("CC 104", "CC 103");
    await InsertPrereq("DS 015", "DS 011");
    await InsertPrereq("DS 014", "DS 013");
    await InsertPrereq("DS 014", "CC 104");
    await InsertPrereq("DS 016", "DS 013");
    await InsertPrereq("DS 016", "MATH 116");
    await InsertPrereq("DS 017", "DS 016");
    await InsertPrereq("DS 018", "DS 013");
    await InsertPrereq("DS 018", "STAT 112");
    await InsertPrereq("DS 019", "DS 018");
    await InsertPrereq("DS 020", "DS 018");

    // BSGE prerequisite chains (EVSU / UP Diliman / CHED CMO 89 s. 2017)
    await InsertPrereq("GE 121", "GE 111");
    await InsertPrereq("GE 121", "MATH 101");
    await InsertPrereq("MATH 102", "MATH 101");
    await InsertPrereq("PHYS 111", "MATH 101");
    await InsertPrereq("GE 122", "GE 121");
    await InsertPrereq("GE 141", "GE 121");
    await InsertPrereq("PHYS 112", "PHYS 111");
    await InsertPrereq("GE 131", "GE 122");
    await InsertPrereq("GE 151", "GE 122");
    await InsertPrereq("GE 161", "GE 122");
    await InsertPrereq("GE 152", "GE 151");
    await InsertPrereq("GE 162", "GE 161");
    await InsertPrereq("GE 170", "GE 161");
    await InsertPrereq("GE 171", "GE 170");
    await InsertPrereq("GE 171", "GE 161");
    await InsertPrereq("GE 190", "GE 122");
    await InsertPrereq("GE 198", "GE 170");
    await InsertPrereq("GE 199", "GE 198");
    await InsertPrereq("GE 200", "GE 198");

    // BSMATH prerequisite chains (UP Baguio / CLSU / CHED CMO 19 s. 2007)
    await InsertPrereq("MATH 123", "MATH 122");
    await InsertPrereq("MATH 131", "MATH 121");
    await InsertPrereq("MATH 124", "MATH 123");
    await InsertPrereq("MATH 141", "MATH 121");
    await InsertPrereq("PHYS 111", "MATH 122");
    await InsertPrereq("MATH 142", "MATH 141");
    await InsertPrereq("MATH 171", "MATH 123");
    await InsertPrereq("PHYS 112", "PHYS 111");
    await InsertPrereq("MATH 151", "MATH 124");
    await InsertPrereq("MATH 181", "MATH 131");
    await InsertPrereq("MATH 181", "MATH 124");
    await InsertPrereq("MATH 152", "MATH 151");
    await InsertPrereq("MATH 161", "MATH 124");
    await InsertPrereq("MATH 198", "MATH 151");
    await InsertPrereq("MATH 191", "MATH 151");
    await InsertPrereq("MATH 199", "MATH 198");
    await InsertPrereq("MATH 200", "MATH 198");

    // BSSTAT prerequisite chains (VSU / CHED CMO 42 s. 2017)
    await InsertPrereq("STAT 122", "STAT 121");
    await InsertPrereq("STAT 131", "MATH 101");
    await InsertPrereq("MATH 102", "MATH 101");
    await InsertPrereq("STAT 132", "STAT 131");
    await InsertPrereq("STAT 132", "MATH 102");
    await InsertPrereq("STAT 191", "STAT 121");
    await InsertPrereq("STAT 141", "STAT 132");
    await InsertPrereq("STAT 151", "STAT 122");
    await InsertPrereq("STAT 151", "MATH 115");
    await InsertPrereq("STAT 142", "STAT 141");
    await InsertPrereq("STAT 152", "STAT 151");
    await InsertPrereq("STAT 161", "STAT 122");
    await InsertPrereq("STAT 171", "STAT 151");
    await InsertPrereq("STAT 181", "STAT 151");
    await InsertPrereq("STAT 181", "MATH 115");
    await InsertPrereq("STAT 182", "STAT 122");
    await InsertPrereq("STAT 198", "STAT 151");
    await InsertPrereq("STAT 199", "STAT 198");
    await InsertPrereq("STAT 200", "STAT 198");

    // BSM prerequisite chains (IMCC / Palawan State U / CHED CMO 3 s. 2023)
    await InsertPrereq("MID 103", "MID 101");
    await InsertPrereq("MID 104", "MID 101");
    await InsertPrereq("MID 104", "MID 102");
    await InsertPrereq("MID 201", "MID 104");
    await InsertPrereq("MID 202", "MID 104");
    await InsertPrereq("MID 203", "MID 102");
    await InsertPrereq("MID 204", "MID 103");
    await InsertPrereq("MID 301", "MID 101");
    await InsertPrereq("MID 302", "MID 104");
    await InsertPrereq("MID 302", "MID 201");
    await InsertPrereq("MID 401", "MID 103");
    await InsertPrereq("MID 303", "MID 302");
    await InsertPrereq("MID 402", "MID 301");
    await InsertPrereq("MID 403", "MID 303");

    // BSAGRI prerequisite chains (MMSU SY 2024-2025 / CHED CMO 23 s. 2021)
    await InsertPrereq("CRPSC 21", "CRPSC 20");
    await InsertPrereq("CHEM 41", "CHEM 30");
    await InsertPrereq("ANSC 21", "ANSC 20");
    await InsertPrereq("COMM 01", "ENGL 01");
    await InsertPrereq("AGRI 100", "CRPSC 20");
    await InsertPrereq("AGRI 100", "SSCI 20");
    await InsertPrereq("AGRI 100", "ANSC 20");
    await InsertPrereq("AGRI 100", "CRPSC 21");
    await InsertPrereq("AGRI 100", "ANSC 21");
    await InsertPrereq("AGRI 21", "CHEM 30");
    await InsertPrereq("SSCI 21", "SSCI 20");
    await InsertPrereq("CPROT 21", "CPROT 20");
    await InsertPrereq("AGRI 30", "MATH 01");
    await InsertPrereq("AGRI 195", "COMM 01");
    await InsertPrereq("BIO 198", "CHEM 41");
    await InsertPrereq("BIO 198", "AGRI 21");
    await InsertPrereq("AGRI 200A", "AGRI 30");
    await InsertPrereq("AGRI 199A", "COMM 01");
    await InsertPrereq("CPROT 100", "CHEM 30");
    await InsertPrereq("ANSC 110", "ANSC 21");
    await InsertPrereq("AGRI 198", "AGRI 100");
    await InsertPrereq("AGRI 200B", "AGRI 200A");
    await InsertPrereq("AGRI 207", "AGRI 199A");
    await InsertPrereq("AGRI 81", "MATH 01");
    await InsertPrereq("CPROT 110", "CPROT 20");
    await InsertPrereq("AGRI 197B", "AGRI 197A");
    await InsertPrereq("AGRI 200C", "AGRI 200B");
    await InsertPrereq("AGRI 199B", "AGRI 199A");

    // BSARCH prerequisite chains (Holy Angel U 2018 / CHED CMO 61 s. 2017)
    await InsertPrereq("ARDESIGN2", "ARDESIGN1");
    await InsertPrereq("AGRAPHICS2", "AGRAPHICS1");
    await InsertPrereq("AVISTECH2", "AVISTECH1");
    await InsertPrereq("ARTHEORY2", "ARTHEORY1");
    await InsertPrereq("DIFFINTCALC", "SOLIDMEN");
    await InsertPrereq("CWTS2", "CWTS1");
    await InsertPrereq("ARDESIGN3", "ARDESIGN2");
    await InsertPrereq("AVISTECH3", "AVISTECH2");
    await InsertPrereq("ARHISTORY2", "ARHISTORY1");
    await InsertPrereq("ARDESIGN4", "ARDESIGN3");
    await InsertPrereq("BILDTECH2", "BILDTECH1");
    await InsertPrereq("ARHISTORY3", "ARHISTORY2");
    await InsertPrereq("STATICS-AR", "DIFFINTCALC");
    await InsertPrereq("ARDESIGN5", "ARDESIGN4");
    await InsertPrereq("BILDTECH3", "BILDTECH2");
    await InsertPrereq("BILDUTIL2", "BILDUTIL1");
    await InsertPrereq("CADD-AR1", "AGRAPHICS2");
    await InsertPrereq("ARHISTORY4", "ARHISTORY3");
    await InsertPrereq("STRENGTH", "STATICS-AR");
    await InsertPrereq("ARDESIGN6", "ARDESIGN5");
    await InsertPrereq("BILDTECH4", "BILDTECH3");
    await InsertPrereq("BILDUTIL3", "BILDUTIL2");
    await InsertPrereq("CADD-AR2", "CADD-AR1");
    await InsertPrereq("ARPLAN1", "ARDESIGN4");
    await InsertPrereq("PROPRAC2", "PROPRAC1");
    await InsertPrereq("STRUCTURES", "STRENGTH");
    await InsertPrereq("ARDESIGN7", "ARDESIGN6");
    await InsertPrereq("BILDTECH5", "BILDTECH4");
    await InsertPrereq("ARPLAN2", "ARPLAN1");
    await InsertPrereq("PROPRAC3", "PROPRAC2");
    await InsertPrereq("STEELTIMB", "STRUCTURES");
    await InsertPrereq("ARDESIGN8", "ARDESIGN7");
    await InsertPrereq("RESMETHAR", "ARDESIGN6");
    await InsertPrereq("ARSTRUCTS", "STRUCTURES");
    await InsertPrereq("ARPLAN3", "ARPLAN2");
    await InsertPrereq("COMPRE", "ARDESIGN7");
    await InsertPrereq("AROJT", "ARDESIGN8");
    await InsertPrereq("AROJT", "BILDTECH5");
    await InsertPrereq("AROJT", "BILDUTIL3");
    await InsertPrereq("AROJT", "CADD-AR2");
    await InsertPrereq("ARDESIGN9", "ARDESIGN8");
    await InsertPrereq("ARDESIGN9", "RESMETHAR");
    await InsertPrereq("BMGMTAPP1", "PROPRAC3");
    await InsertPrereq("ARDESIGN10", "ARDESIGN9");
    await InsertPrereq("BMGMTAPP2", "BMGMTAPP1");

    // BSECE prerequisite chains (EVSU SY 2018-2019 / CHED CMO 101 s. 2017)
    await InsertPrereq("MATH 124", "MATH 114");
    await InsertPrereq("PHYS 2", "PHYS 1");
    await InsertPrereq("NSTP 123", "NSTP 113");
    await InsertPrereq("PE 122", "PE 112");
    await InsertPrereq("MATH 213", "MATH 124");
    await InsertPrereq("ECE 214", "MATH 124");
    await InsertPrereq("ECE 214", "PHYS 2");
    await InsertPrereq("ECE 234", "CHEM 11");
    await InsertPrereq("ECE 234", "PHYS 2");
    await InsertPrereq("EDA 213", "MATH 124");
    await InsertPrereq("ECE 223", "MATH 213");
    await InsertPrereq("ECE 224", "ECE 214");
    await InsertPrereq("ECE 244", "ECE 234");
    await InsertPrereq("ECE 244", "ECE 214");
    await InsertPrereq("ECE 264", "ECE 234");
    await InsertPrereq("ECE 284", "PHYS 2");
    await InsertPrereq("ECE 284", "MATH 213");
    await InsertPrereq("ECE 314", "ECE 234");
    await InsertPrereq("ECE 334", "ECE 244");
    await InsertPrereq("ECE 354", "ECE 223");
    await InsertPrereq("ECE 374", "ECE 264");
    await InsertPrereq("FIL 002", "FIL 001");
    await InsertPrereq("ECE 324", "ECE 284");
    await InsertPrereq("ECE 324", "ECE 374");
    await InsertPrereq("ECE 344", "ECE 374");
    await InsertPrereq("ECE 364", "ECE 314");
    await InsertPrereq("ECE 384", "ECE 354");
    await InsertPrereq("ECE 383", "EDA 213");
    await InsertPrereq("ECE 303", "ECE 374");
    await InsertPrereq("ECE 411", "ECE 383");
    await InsertPrereq("ECE 421", "ECE 411");

    // BSCpE prerequisite chains (UP Diliman AY 2018-2019 / CHED CMO 87 s. 2017)
    await InsertPrereq("EEE 118", "EEE 111");
    await InsertPrereq("Math 22", "Math 21");
    await InsertPrereq("Physics 72", "Physics 71");
    await InsertPrereq("EEE 121", "EEE 111");
    await InsertPrereq("EEE 123", "EEE 113");
    await InsertPrereq("EEE 128", "EEE 118");
    await InsertPrereq("EEE 128", "EEE 123");
    await InsertPrereq("Math 23", "Math 22");
    await InsertPrereq("Math 40", "Math 21");
    await InsertPrereq("EEE 131", "EEE 121");
    await InsertPrereq("EEE 133", "EEE 123");
    await InsertPrereq("EEE 135", "EEE 113");
    await InsertPrereq("EEE 137", "Physics 72");
    await InsertPrereq("EEE 137", "Math 23");
    await InsertPrereq("EEE 138", "EEE 128");
    await InsertPrereq("EEE 138", "EEE 133");
    await InsertPrereq("EEE 141", "EEE 131");
    await InsertPrereq("EEE 143", "EEE 131");
    await InsertPrereq("EEE 145", "EEE 133");
    await InsertPrereq("EEE 147", "EEE 121");
    await InsertPrereq("EEE 148", "EEE 141");
    await InsertPrereq("ES 101", "Physics 71");
    await InsertPrereq("ES 101", "Math 21");
    await InsertPrereq("CoE 111", "EEE 123");
    await InsertPrereq("Physics 73", "Physics 72");
    await InsertPrereq("EEE 151", "EEE 131");
    await InsertPrereq("EEE 153", "EEE 133");
    await InsertPrereq("EEE 155", "EEE 135");
    await InsertPrereq("EEE 157", "EEE 123");
    await InsertPrereq("EEE 158", "EEE 151");
    await InsertPrereq("CoE 161", "EEE 133");
    await InsertPrereq("CoE 163", "CoE 161");
    await InsertPrereq("CoE 164", "CoE 163");
    await InsertPrereq("EEE 192", "EEE 135");
    await InsertPrereq("CoE 165", "CoE 161");
    await InsertPrereq("CoE 167", "EEE 155");
    await InsertPrereq("CoE 168", "CoE 163");
    await InsertPrereq("CoE 133", "EEE 133");
    await InsertPrereq("CoE 197", "CoE 161");
    await InsertPrereq("EEE 196", "EEE 192");
    await InsertPrereq("CoE 198", "EEE 196");
    await InsertPrereq("CoE 134", "CoE 133");
    await InsertPrereq("CoE 135", "EEE 135");
    await InsertPrereq("CoE 199", "CoE 198");
    await InsertPrereq("CoE 23", "EEE 113");
    await InsertPrereq("CoE 121", "EEE 151");

    // BSCE prerequisite chains (UP Diliman AY 2018-2019 / CHED CMO 92 s. 2017)
    await InsertPrereq("Chem 16.1", "Chem 16");
    await InsertPrereq("Physics 71.1", "Physics 71");
    await InsertPrereq("Math 22", "Math 21");
    await InsertPrereq("Physics 72", "Physics 71");
    await InsertPrereq("Physics 72.1", "Physics 72");
    await InsertPrereq("CE 29", "Math 21");
    await InsertPrereq("Math 23", "Math 22");
    await InsertPrereq("ES 101", "Physics 71");
    await InsertPrereq("ES 101", "Math 21");
    await InsertPrereq("GE 12", "GE 10");
    await InsertPrereq("CE 11", "Chem 16");
    await InsertPrereq("CE 24", "Math 22");
    await InsertPrereq("ES 102", "ES 101");
    await InsertPrereq("CE 17", "ES 101");
    await InsertPrereq("CE 25", "CE 24");
    await InsertPrereq("CE 31", "Chem 16");
    await InsertPrereq("CE 130", "Chem 16");
    await InsertPrereq("CE 18", "ES 102");
    await InsertPrereq("CE 115", "CE 17");
    await InsertPrereq("CE 123", "CE 31");
    await InsertPrereq("CE 141", "GE 12");
    await InsertPrereq("CE 151", "CE 18");
    await InsertPrereq("CE 162", "CE 11");
    await InsertPrereq("CE 162", "ES 102");
    await InsertPrereq("CE 116", "CE 115");
    await InsertPrereq("CE 124", "CE 123");
    await InsertPrereq("CE 132", "CE 130");
    await InsertPrereq("CE 142", "CE 141");
    await InsertPrereq("CE 152", "CE 151");
    await InsertPrereq("CE 163", "CE 162");
    await InsertPrereq("CE 190", "CE 29");
    await InsertPrereq("CE 195", "CE 115");
    await InsertPrereq("CE 195", "CE 123");
    await InsertPrereq("CE 195", "CE 130");
    await InsertPrereq("CE 195", "CE 141");
    await InsertPrereq("CE 195", "CE 151");
    await InsertPrereq("CE 195", "CE 162");
    await InsertPrereq("CE 199", "CE 190");
    await InsertPrereq("CE 196", "CE 116");
    await InsertPrereq("CE 196", "CE 124");
    await InsertPrereq("CE 196", "CE 152");

    // BSME prerequisite chains (EVSU SY 2025-2026 / CHED CMO 97 s. 2017)
    await InsertPrereq("MATH 123", "MATH 113");
    await InsertPrereq("PHYS 125", "MATH 113");
    await InsertPrereq("CHEM 121 L", "CHEM 123");
    await InsertPrereq("CAD 211", "DRAW 111 D");
    await InsertPrereq("MATH 213", "MATH 123");
    await InsertPrereq("MECH 213", "PHYS 125");
    await InsertPrereq("ME 213", "PHYS 125");
    await InsertPrereq("ME 213", "MATH 123");
    await InsertPrereq("COMP 221 L", "COMP 111 L");
    await InsertPrereq("MECH 222", "MECH 213");
    await InsertPrereq("MATH 223", "MATH 213");
    await InsertPrereq("ME 222", "ME 213");
    await InsertPrereq("ME 243", "ME 213");
    await InsertPrereq("MECH 313", "MECH 213");
    await InsertPrereq("EDA 313", "MATH 123");
    await InsertPrereq("ME 333", "ME 243");
    await InsertPrereq("ME 353", "ME 213");
    await InsertPrereq("ME 373", "ME 213");
    await InsertPrereq("EE 313", "PHYS 125");
    await InsertPrereq("ME 323", "MECH 313");
    await InsertPrereq("ME 321", "EDA 313");
    await InsertPrereq("ME 342", "ME 213");
    await InsertPrereq("ME 362", "MECH 222");
    await InsertPrereq("ME 343", "ME 222");
    await InsertPrereq("ME 343", "ME 353");
    await InsertPrereq("ME 311 L", "ME 243");
    await InsertPrereq("EE 323", "EE 313");
    await InsertPrereq("ME 301", "ME 323");
    await InsertPrereq("ME 413", "MATH 213");
    await InsertPrereq("ME 432", "ME 323");
    await InsertPrereq("ME 414", "ME 373");
    await InsertPrereq("ME 411 L", "ME 321");
    await InsertPrereq("ME 412 L", "ME 311 L");
    await InsertPrereq("EE 413", "EE 313");
    await InsertPrereq("ME 473", "ME 373");
    await InsertPrereq("ME 423", "CHEM 123");
    await InsertPrereq("ME 424", "ME 414");
    await InsertPrereq("ME 421 L", "ME 411 L");
    await InsertPrereq("ME 413 L", "ME 412 L");
    await InsertPrereq("ME 442", "ME 432");
    await InsertPrereq("ME 463", "ME 442");

    Console.WriteLine("Curriculum data seeded successfully (BSA, BSCS, BSIT, BSMA, BSBA-FM, BSBA-MM, BSBA-OM, BSAIS, BSN, BSMLS, BSRT, BSBIO, BSMB, BSDSA, BSGE, BSMATH, BSSTAT, BSM, BSAGRI, BSARCH, BSECE, BSCpE, BSCE, BSME).");
    // BSPHYS prerequisite chains (UP Baguio / CHED CMO 13 s. 2024)
    await InsertPrereq("Physics 102", "Physics 101");
    await InsertPrereq("Physics 102", "Math 53");
    await InsertPrereq("Physics 102.1", "Physics 101.1");
    await InsertPrereq("Physics 121", "Math 53");
    await InsertPrereq("Math 54", "Math 53");
    await InsertPrereq("Physics 103", "Physics 102");
    await InsertPrereq("Physics 103.1", "Physics 102.1");
    await InsertPrereq("Physics 122", "Physics 121");
    await InsertPrereq("Physics 131", "Physics 121");
    await InsertPrereq("Physics 104", "Physics 103");
    await InsertPrereq("Physics 104.1", "Physics 103.1");
    await InsertPrereq("Physics 123", "Physics 122");
    await InsertPrereq("Physics 161", "Physics 101");
    await InsertPrereq("Physics 161", "Math 54");
    await InsertPrereq("Physics 171", "Physics 102");
    await InsertPrereq("Physics 171", "Physics 122");
    await InsertPrereq("Physics 173", "Physics 102");
    await InsertPrereq("Physics 181", "Physics 104");
    await InsertPrereq("Physics 181", "Physics 122");
    await InsertPrereq("Physics 162", "Physics 161");
    await InsertPrereq("Physics 172", "Physics 171");
    await InsertPrereq("Physics 165", "Physics 101");
    await InsertPrereq("Physics 165", "Physics 161");
    await InsertPrereq("Physics 175", "Physics 103");
    await InsertPrereq("Physics 175", "Physics 171");
    await InsertPrereq("Physics 182", "Physics 181");
    await InsertPrereq("Physics 199", "Physics 104");
    await InsertPrereq("Chem 18.1", "Chem 18");
    await InsertPrereq("Physics 183", "Physics 165");
    await InsertPrereq("Physics 183", "Physics 181");
    await InsertPrereq("Physics 196", "Physics 199");
    await InsertPrereq("Physics 200", "Physics 199");

    // BSAPHY prerequisite chains (UP Diliman / CHED CMO 13 s. 2024)
    await InsertPrereq("Physics 106.1", "Physics 106");
    await InsertPrereq("Geol 11.1", "Geol 11");
    await InsertPrereq("Chem 16.1", "Chem 16");
    await InsertPrereq("Physics 107", "Physics 106");
    await InsertPrereq("Physics 107", "Math 53");
    await InsertPrereq("Physics 107.1", "Physics 106.1");
    await InsertPrereq("Physics 116", "Math 53");
    await InsertPrereq("Math 122", "Math 53");
    await InsertPrereq("Physics 108", "Physics 107");
    await InsertPrereq("Physics 117", "Physics 116");
    await InsertPrereq("Physics 126", "Physics 107");
    await InsertPrereq("Physics 126", "Physics 116");
    await InsertPrereq("App Physics 181", "Physics 107.1");
    await InsertPrereq("App Physics 155", "Math 53");
    await InsertPrereq("Physics 131", "Physics 126");
    await InsertPrereq("Physics 141", "Physics 108");
    await InsertPrereq("Physics 141", "Physics 116");
    await InsertPrereq("Physics 132", "Physics 106");
    await InsertPrereq("Physics 132", "Physics 116");
    await InsertPrereq("Physics 142", "Physics 141");
    await InsertPrereq("App Physics 157", "App Physics 155");
    await InsertPrereq("Physics 191", "Physics 108");
    await InsertPrereq("App Physics 167", "App Physics 181");
    await InsertPrereq("App Physics 167", "App Physics 155");
    await InsertPrereq("App Physics 184", "App Physics 181");
    await InsertPrereq("Physics 170", "Physics 191");
    await InsertPrereq("Physics 192", "Physics 191");
    await InsertPrereq("App Physics 199", "App Physics 184");
    await InsertPrereq("Physics 151", "Physics 165");
    await InsertPrereq("App Physics 200", "App Physics 199");

    // BSAPMATH prerequisite chains (UP Diliman / CHED CMO 48 s. 2017)
    await InsertPrereq("Math 53", "Math 20");
    await InsertPrereq("Math 54", "Math 53");
    await InsertPrereq("Math 108", "Math 20");
    await InsertPrereq("Math 40", "Math 53");
    await InsertPrereq("Math 23", "Math 54");
    await InsertPrereq("Math 110.1", "Math 108");
    await InsertPrereq("Math 117", "Math 108");
    await InsertPrereq("Math 110.2", "Math 110.1");
    await InsertPrereq("Math 123.1", "Math 23");
    await InsertPrereq("Math 123.1", "Math 108");
    await InsertPrereq("Math 110.3", "Math 110.2");
    await InsertPrereq("Math 123.2", "Math 123.1");
    await InsertPrereq("Math 126", "Math 123.1");
    await InsertPrereq("Math 128", "Math 123.1");
    await InsertPrereq("Math 199", "Math 123.1");

    // JD prerequisite chains (LEB MO 24 s. 2021 Model Curriculum)
    await InsertPrereq("JD 108", "JD 106");
    await InsertPrereq("JD 109", "JD 104");
    await InsertPrereq("JD 110", "JD 105");
    await InsertPrereq("JD 201", "JD 108");
    await InsertPrereq("JD 202", "JD 110");
    await InsertPrereq("JD 203", "JD 108");
    await InsertPrereq("JD 205", "JD 202");
    await InsertPrereq("JD 207", "JD 204");
    await InsertPrereq("JD 209", "JD 110");
    await InsertPrereq("JD 301", "JD 205");
    await InsertPrereq("JD 303", "JD 201");
    await InsertPrereq("JD 304", "JD 104");
    await InsertPrereq("JD 306", "JD 108");
    await InsertPrereq("JD 308", "JD 205");
    await InsertPrereq("JD 309", "JD 304");
    await InsertPrereq("JD 310", "JD 108");
    await InsertPrereq("JD 311", "JD 205");
    await InsertPrereq("JD 311", "JD 301");
    await InsertPrereq("JD 401", "JD 201");
    await InsertPrereq("JD 401", "JD 303");
    await InsertPrereq("JD 402", "JD 306");
    await InsertPrereq("JD 403", "JD 109");
    await InsertPrereq("JD 404", "JD 205");
    await InsertPrereq("JD 404", "JD 202");
    await InsertPrereq("JD 405", "JD 207");
    await InsertPrereq("JD 406", "JD 110");
    await InsertPrereq("JD 406", "JD 209");
    await InsertPrereq("JD 407", "JD 108");
    await InsertPrereq("JD 407", "JD 310");
    await InsertPrereq("JD 408", "JD 305");
    await InsertPrereq("JD 408", "JD 206");
    await InsertPrereq("JD 409", "JD 301");
    await InsertPrereq("JD 409", "JD 308");
    await InsertPrereq("JD 410", "JD 309");

    // LLM prerequisite chains (UST Graduate School of Law / LEB)
    await InsertPrereq("LAW 600", "GS 500");
    await InsertPrereq("LAW 600", "GS 501");
    await InsertPrereq("LAW 601", "GS 500");
    await InsertPrereq("LAW 603", "GS 501");
    await InsertPrereq("LAW 701", "LAW 600");
    await InsertPrereq("LAW 702", "LAW 600");
    await InsertPrereq("LAW 703", "LAW 600");
    await InsertPrereq("GSLAW 724", "LAW 702");
    await InsertPrereq("TW I", "GS 501");
    await InsertPrereq("TW I", "LAW 600");
    await InsertPrereq("TW II", "TW I");
    await InsertPrereq("TW III", "TW II");

    // MSCYBER prerequisite chains (DLSU / HAU / CHED CMO 07 s. 2010)
    await InsertPrereq("SEC 601", "SEC 501");
    await InsertPrereq("SEC 602", "SEC 502");
    await InsertPrereq("SEC 603", "SEC 503");
    await InsertPrereq("SEC 701", "SEC 602");
    await InsertPrereq("SEC 702", "SEC 601");
    await InsertPrereq("SEC 801", "SEC 502");
    await InsertPrereq("SEC 802", "SEC 502");
    await InsertPrereq("SEC 803", "SEC 603");
    await InsertPrereq("SEC 803", "SEC 701");

    // MSCS prerequisite chains (UP Diliman DCS)
    await InsertPrereq("CS 208", "CS 204");
    await InsertPrereq("CS 214", "CS 210");
    await InsertPrereq("CS 236", "CS 210");
    await InsertPrereq("CS 239", "CS 214");
    await InsertPrereq("CS 245", "CS 210");
    await InsertPrereq("CS 300", "CS 204");
    await InsertPrereq("CS 300", "CS 210");

    // MSDS prerequisite chains (Batangas State University)
    await InsertPrereq("MSDS 503", "MSDS 500");
    await InsertPrereq("MSDS 503", "MSDS 504");
    await InsertPrereq("MSDS 505", "MSDS 500");
    await InsertPrereq("MSDS 510", "MSDS 503");
    await InsertPrereq("MSDS 511", "MSDS 503");
    await InsertPrereq("MSDS 520", "MSDS 500");
    await InsertPrereq("MSDS 521", "MSDS 520");

    // MD prerequisite chains (UST Faculty of Medicine / CHED CMO 18 s. 2016)
    await InsertPrereq("MED 201", "MED 101");
    await InsertPrereq("MED 201", "MED 104");
    await InsertPrereq("MED 202", "MED 101");
    await InsertPrereq("MED 202", "MED 103");
    await InsertPrereq("MED 203", "MED 102");
    await InsertPrereq("MED 203", "MED 103");
    await InsertPrereq("MED 204", "MED 102");
    await InsertPrereq("MED 205", "MED 101");
    await InsertPrereq("MED 206", "MED 102");
    await InsertPrereq("MED 206", "MED 201");
    await InsertPrereq("MED 207", "MED 104");
    await InsertPrereq("MED 208", "MED 101");
    await InsertPrereq("MED 208", "MED 103");
    await InsertPrereq("MED 210", "MED 106");
    await InsertPrereq("MED 211", "MED 105");
    await InsertPrereq("MED 212", "MED 108");
    await InsertPrereq("MED 213", "MED 107");
    await InsertPrereq("MED 214", "MED 103");
    await InsertPrereq("MED 215", "MED 103");
    await InsertPrereq("MED 215", "MED 203");
    await InsertPrereq("MED 301", "MED 202");
    await InsertPrereq("MED 301", "MED 203");
    await InsertPrereq("MED 302", "MED 205");
    await InsertPrereq("MED 303", "MED 214");
    await InsertPrereq("MED 304", "MED 208");
    await InsertPrereq("MED 305", "MED 208");
    await InsertPrereq("MED 306", "MED 211");
    await InsertPrereq("MED 307", "MED 212");
    await InsertPrereq("MED 308", "MED 209");
    await InsertPrereq("MED 309", "MED 202");
    await InsertPrereq("MED 310", "MED 202");
    await InsertPrereq("MED 311", "MED 202");
    await InsertPrereq("MED 312", "MED 201");
    await InsertPrereq("MED 313", "MED 201");
    await InsertPrereq("MED 313", "MED 202");
    await InsertPrereq("MED 314", "MED 210");
    await InsertPrereq("MED 315", "MED 209");
    await InsertPrereq("MED 316", "MED 102");
    await InsertPrereq("MED 316", "MED 203");
    await InsertPrereq("MED 317", "MED 213");
    await InsertPrereq("MED 401", "MED 301");
    await InsertPrereq("MED 402", "MED 302");
    await InsertPrereq("MED 403", "MED 303");
    await InsertPrereq("MED 404", "MED 304");
    await InsertPrereq("MED 404", "MED 305");
    await InsertPrereq("MED 405", "MED 314");
    await InsertPrereq("MED 406", "MED 401");
    await InsertPrereq("MED 406", "MED 402");
    await InsertPrereq("MED 406", "MED 403");
    await InsertPrereq("MED 406", "MED 404");

    // BSPSYCH prerequisite chains (HAU / UP Baguio / CHED CMO 34 s. 2017)
    await InsertPrereq("PSYCH 110", "PSYCH 101");
    await InsertPrereq("PSYCH 115", "PSYCH 101");
    await InsertPrereq("PSYCH 140", "PSYCH 101");
    await InsertPrereq("PSYCH 190", "PSYCH 101");
    await InsertPrereq("PSYCH 150", "PSYCH 110");
    await InsertPrereq("PSYCH 171", "PSYCH 110");
    await InsertPrereq("PSYCH 180", "PSYCH 101");
    await InsertPrereq("PSYCH 155", "PSYCH 150");
    await InsertPrereq("PSYCH 162", "PSYCH 190");
    await InsertPrereq("PSYCH 172", "PSYCH 171");
    await InsertPrereq("PSYCH 182", "PSYCH 180");
    await InsertPrereq("PSYCH 163", "PSYCH 162");
    await InsertPrereq("PSYCH 195", "PSYCH 115");
    await InsertPrereq("PSYCH 195", "PSYCH 190");
    await InsertPrereq("PSYCH 198", "PSYCH 155");
    await InsertPrereq("PSYCH 198", "PSYCH 163");
    await InsertPrereq("PSYCH 200", "PSYCH 195");

    Console.WriteLine("Curriculum data seeded successfully (BSA, BSCS, BSIT, BSMA, BSBA-FM, BSBA-MM, BSBA-OM, BSAIS, BSN, BSMLS, BSRT, BSBIO, BSMB, BSDSA, BSGE, BSMATH, BSSTAT, BSM, BSAGRI, BSARCH, BSECE, BSCpE, BSCE, BSME, BSPHYS, BSAPHY, BSAPMATH, JD, LLM, MSCYBER, MSCS, MSDS, MD, BSPSYCH).");
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple wrapper to carry the connection string through DI
// ─────────────────────────────────────────────────────────────────────────────
record RawConnectionString(string Value);

