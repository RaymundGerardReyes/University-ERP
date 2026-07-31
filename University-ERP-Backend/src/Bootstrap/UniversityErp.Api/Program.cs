using Scalar.AspNetCore;
using UniversityErp.Api.ModuleRegistration;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers (Discovers controllers from module Presentation assemblies)
builder.Services.AddControllers();

// 2. Register OpenAPI & Scalar Documentation
builder.Services.AddOpenApi();

// 3. Register Bounded Context Modules across Clusters
builder.Services.AddAcademicModules(builder.Configuration);

var app = builder.Build();

// 4. Configure HTTP Request Pipeline & OpenAPI Scalar UI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "University ERP API Reference";
        options.Theme = ScalarTheme.Purple;
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
