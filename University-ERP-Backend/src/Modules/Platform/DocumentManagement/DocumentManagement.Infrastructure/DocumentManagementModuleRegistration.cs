namespace DocumentManagement.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DocumentManagement.Application.Abstractions;
using DocumentManagement.Infrastructure.Persistence;
using DocumentManagement.Infrastructure.Repositories;

public static class DocumentManagementModuleRegistration
{
    public static IServiceCollection AddDocumentManagementInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DocumentManagementDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "platform_documents")
            ));

        services.AddScoped<IDocumentRepository, DocumentRepository>();

        return services;
    }
}