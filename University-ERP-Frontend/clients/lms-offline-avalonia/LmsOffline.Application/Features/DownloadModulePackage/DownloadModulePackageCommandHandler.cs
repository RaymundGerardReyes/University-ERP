namespace LmsOffline.Application.Features.DownloadModulePackage;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;

public class DownloadModulePackageCommandHandler : IRequestHandler<DownloadModulePackageCommand, Result<bool>>
{
    private readonly IOfflineModuleRepository _moduleRepository;

    public DownloadModulePackageCommandHandler(IOfflineModuleRepository moduleRepository)
    {
        _moduleRepository = moduleRepository;
    }

    public Task<Result<bool>> Handle(DownloadModulePackageCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}