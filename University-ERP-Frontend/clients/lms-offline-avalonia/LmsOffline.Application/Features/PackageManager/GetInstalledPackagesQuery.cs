namespace LmsOffline.Application.Features.PackageManager;

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;

public record GetInstalledPackagesQuery() : IRequest<Result<List<CoursePackage>>>;

public class GetInstalledPackagesQueryHandler : IRequestHandler<GetInstalledPackagesQuery, Result<List<CoursePackage>>>
{
    private readonly ILocalPackageRepository _packageRepository;

    public GetInstalledPackagesQueryHandler(ILocalPackageRepository packageRepository)
    {
        _packageRepository = packageRepository;
    }

    public async Task<Result<List<CoursePackage>>> Handle(GetInstalledPackagesQuery request, CancellationToken cancellationToken)
    {
        var packages = await _packageRepository.GetAllInstalledAsync(cancellationToken);
        return Result<List<CoursePackage>>.Success(packages);
    }
}
