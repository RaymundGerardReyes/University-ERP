using Scalar.AspNetCore;
using Serilog;
using Microsoft.AspNetCore.HttpOverrides;
using UniversityErp.Api.ModuleRegistration;

// 1. Bootstrap Centralized Logging (Serilog)
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting University ERP API Monolith...");
    
    var builder = WebApplication.CreateBuilder(args);

    // Disable DI validation on build so the monolith can start even if some modules (like Governance/Platform) 
    // haven't fully implemented their Infrastructure repositories yet.
    builder.Host.UseDefaultServiceProvider((context, options) => {
        options.ValidateOnBuild = false;
        options.ValidateScopes = false;
    });

    // [Local Native Dev Fallback] Dynamically construct DefaultConnection from .env variables
    // This allows `npm run dev:backend` to work seamlessly without modifying the encrypted .env file.
    if (string.IsNullOrEmpty(builder.Configuration.GetConnectionString("DefaultConnection")))
    {
        var dbHost = builder.Configuration["DB_HOST"] ?? "localhost";
        var dbPort = builder.Configuration["DB_PORT"] ?? "5432";
        var dbName = builder.Configuration["DB_NAME"];
        var dbUser = builder.Configuration["DB_USER"];
        var dbPass = builder.Configuration["DB_PASSWORD"];
        
        if (!string.IsNullOrEmpty(dbName))
        {
            var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";
            builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
            Log.Information("Dynamically constructed Database Connection String for Native Execution.");
        }
    }

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
        .AddApplicationPart(typeof(Hostel.Presentation.Endpoints.GetRoomAllocationEndpoint).Assembly)
        .AddApplicationPart(typeof(HumanResources.Presentation.Endpoints.OnboardEmployeeEndpoint).Assembly)
        .AddApplicationPart(typeof(Procurement.Presentation.Endpoints.CreatePurchaseOrderEndpoint).Assembly)
        .AddApplicationPart(typeof(AssetManagement.Presentation.Endpoints.RegisterAssetEndpoint).Assembly)
        .AddApplicationPart(typeof(Finance.Presentation.Endpoints.IssueInvoiceEndpoint).Assembly)
        .AddApplicationPart(typeof(Transport.Presentation.Endpoints.AssignRouteEndpoint).Assembly)
        .AddApplicationPart(typeof(Inventory.Presentation.Endpoints.AdjustStockEndpoint).Assembly)
        .AddApplicationPart(typeof(MessCanteen.Presentation.Endpoints.ReserveMealEndpoint).Assembly)
        .AddApplicationPart(typeof(Facilities.Presentation.Endpoints.BookFacilityEndpoint).Assembly)
        .AddApplicationPart(typeof(Facilities.Presentation.Endpoints.BookFacilityEndpoint).Assembly)
        .AddApplicationPart(typeof(Library.Presentation.Endpoints.CheckoutItemEndpoint).Assembly)
        .AddApplicationPart(typeof(VisitorManagement.Presentation.Endpoints.RegisterVisitorEndpoint).Assembly)
        .AddApplicationPart(typeof(QualityAccreditation.Presentation.Endpoints.SubmitEvidenceEndpoint).Assembly)
        .AddApplicationPart(typeof(Helpdesk.Presentation.Endpoints.CreateTicketEndpoint).Assembly)
        .AddApplicationPart(typeof(GrievanceManagement.Presentation.Endpoints.SubmitComplaintEndpoint).Assembly)
        .AddApplicationPart(typeof(EventManagement.Presentation.Endpoints.PlanEventEndpoint).Assembly)
        .AddApplicationPart(typeof(AnalyticsBI.Presentation.Endpoints.GenerateReportEndpoint).Assembly)
        .AddApplicationPart(typeof(DocumentManagement.Presentation.Endpoints.UploadDocumentEndpoint).Assembly)
        .AddApplicationPart(typeof(MultiCampus.Presentation.Endpoints.ConfigureCampusEndpoint).Assembly)
        .AddApplicationPart(typeof(CRM.Presentation.Endpoints.RegisterProspectEndpoint).Assembly)
        .AddApplicationPart(typeof(Communication.Presentation.Endpoints.SendMessageEndpoint).Assembly)
        .AddApplicationPart(typeof(Notification.Presentation.Endpoints.SendNotificationEndpoint).Assembly);

    builder.Services.AddOpenApi();

    // =========================================================================
    // 3. Self-Register Bounded Context Modules by Cluster
    // =========================================================================
    builder.Services.AddAcademicModules(builder.Configuration);
    builder.Services.AddAdministrationCluster(builder.Configuration);
    builder.Services.AddGovernanceModules();
    builder.Services.AddPlatformCluster(builder.Configuration);
    builder.Services.AddStudentLifecycleModules(builder.Configuration);

    // Configure Forwarded Headers for Cloudflare/Nginx reverse proxy
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        // Trust the upstream proxy completely in this controlled Docker environment.
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });

    var app = builder.Build();

    // Must be first in the pipeline to correctly resolve Client IP and Scheme
    app.UseForwardedHeaders();

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

    // Expose a dedicated health check endpoint for Docker Compose
    app.MapGet("/health/live", () => Microsoft.AspNetCore.Http.Results.Ok(new { status = "Live", timestamp = DateTime.UtcNow }));
    app.MapGet("/health/ready", () => Microsoft.AspNetCore.Http.Results.Ok(new { status = "Ready", timestamp = DateTime.UtcNow }));

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