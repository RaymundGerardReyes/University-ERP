using Scalar.AspNetCore;
using Serilog;
using UniversityErp.Api.ModuleRegistration;

// 1. Bootstrap Centralized Logging (Serilog)
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting University ERP API Monolith...");
    
    var builder = WebApplication.CreateBuilder(args);

    // Replace the default .NET console logger with Serilog
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        // This template creates the beautiful "[IdentityAccess] User Logged In" format!
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{SourceContext}] {Message:lj}{NewLine}{Exception}"));

    // =========================================================================
    // 2. Core Framework Services & Controllers
    // =========================================================================
    builder.Services.AddControllers()
        .AddApplicationPart(typeof(StudentInformation.Presentation.Endpoints.GetStudentInformationEndpoints).Assembly)
        .AddApplicationPart(typeof(LearningManagement.Presentation.Endpoints.DownloadModulePackageEndpoint).Assembly)
        .AddApplicationPart(typeof(Registrar.Presentation.Endpoints.RegisterCourseEndpoint).Assembly)
        .AddApplicationPart(typeof(Examination.Presentation.Endpoints.PublishExamResultEndpoint).Assembly)
        .AddApplicationPart(typeof(AcademicScheduling.Presentation.Endpoints.AllocateRoomEndpoint).Assembly)
        .AddApplicationPart(typeof(IdentityAccess.Presentation.Endpoints.RegisterUserEndpoint).Assembly)
        .AddApplicationPart(typeof(Alumni.Presentation.Endpoints.GetAlumniStatusEndpoint).Assembly)
        .AddApplicationPart(typeof(PlacementCareer.Presentation.Endpoints.GetJobPostingsEndpoint).Assembly)
        .AddApplicationPart(typeof(GuidanceCounseling.Presentation.Endpoints.GetGuidanceSessionsEndpoint).Assembly)
        .AddApplicationPart(typeof(HealthCenter.Presentation.Endpoints.GetHealthAppointmentsEndpoint).Assembly)
        .AddApplicationPart(typeof(Admissions.Presentation.Endpoints.GetApplicationStatusEndpoint).Assembly)
        .AddApplicationPart(typeof(Hostel.Presentation.Endpoints.GetRoomAllocationEndpoint).Assembly);

    builder.Services.AddOpenApi();

    // =========================================================================
    // 3. Self-Register Bounded Context Modules by Cluster
    // =========================================================================
    builder.Services.AddAcademicModules(builder.Configuration);
    builder.Services.AddAdministrationModules();
    builder.Services.AddGovernanceModules();
    builder.Services.AddPlatformModules(builder.Configuration);
    builder.Services.AddStudentLifecycleModules(builder.Configuration);

    var app = builder.Build();

    // 3. Replaces messy HTTP logs with a single, clean log per request
    app.UseSerilogRequestLogging();
    
    // Add global exception handling
    app.UseMiddleware<UniversityErp.Api.Middleware.GlobalExceptionMiddleware>();

    // =========================================================================
    // 4. HTTP Request Pipeline
    // =========================================================================
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference(options =>
        {
            options.Title = "University ERP Enterprise API Reference";
            options.Theme = ScalarTheme.Purple;
        });
    }

    app.UseAuthorization();
    app.MapControllers();

    // Expose a dedicated health check endpoint for Docker
    app.MapGet("/health", () => Microsoft.AspNetCore.Http.Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }));

    // Telemetry endpoint for frontend production logs
    app.MapPost("/api/v1/platform/telemetry/client-log", (ClientLogDto dto, ILogger<Program> logger) =>
    {
        logger.LogInformation("🖥️ [Frontend {Level}] {Prefix} {Message}", dto.Level, dto.Prefix, dto.Message);
        return Microsoft.AspNetCore.Http.Results.Ok();
    });

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "University ERP API Monolith terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public record ClientLogDto(string Level, string Prefix, string Message);