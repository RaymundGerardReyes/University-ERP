namespace LmsOffline.Application.Features.DownloadModulePackage;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Infrastructure.Persistence;

public sealed class DownloadModulePackageCommandHandler : IRequestHandler<DownloadModulePackageCommand, Result<Guid>>
{
    private readonly EncryptedSqliteContext _context;

    public DownloadModulePackageCommandHandler(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(DownloadModulePackageCommand request, CancellationToken cancellationToken)
    {
        // 1. Instantiate the new Offline Module Aggregate
        var module = new OfflineModule(
            request.ModuleId, 
            request.CourseName, 
            request.ModuleTitle);

        // 2. Save it to the encrypted local database
        _context.Modules.Add(module);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(module.Id);
    }
}
