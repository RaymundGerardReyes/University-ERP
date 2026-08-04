namespace LmsOffline.Application.Features.Diagnostics;

using MediatR;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Application.Interfaces;

public sealed record SystemHealthDto(
    string DatabaseEngine, 
    bool IsEncrypted, 
    string StorageUsed, 
    bool NetworkReachable);

public sealed record GetSystemHealthQuery() : IRequest<SystemHealthDto>;

public sealed class GetSystemHealthQueryHandler : IRequestHandler<GetSystemHealthQuery, SystemHealthDto>
{
    private readonly ILocalStorageDiagnostics _diagnostics;

    public GetSystemHealthQueryHandler(ILocalStorageDiagnostics diagnostics)
    {
        _diagnostics = diagnostics;
    }

    public Task<SystemHealthDto> Handle(GetSystemHealthQuery request, CancellationToken cancellationToken)
    {
        long dbSize = _diagnostics.GetDatabaseSizeInBytes();
        bool isEncrypted = _diagnostics.IsEncryptionActive();

        var dto = new SystemHealthDto(
            DatabaseEngine: "SQLite (SQLCipher)",
            IsEncrypted: isEncrypted,
            StorageUsed: $"{dbSize / 1024 / 1024} MB",
            NetworkReachable: false // Offline mode default
        );

        return Task.FromResult(dto);
    }
}