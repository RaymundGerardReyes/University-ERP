namespace LmsOffline.Application.Features.PackageManager;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Application.Interfaces;

public sealed record VerifyPackageCommand(Guid PackageId, string FilePath) : IRequest<Result<bool>>;

public sealed class VerifyPackageCommandHandler : IRequestHandler<VerifyPackageCommand, Result<bool>>
{
    private readonly IPackageSecurityService _securityService;
    // Note: Inject IPackageRepository to fetch the CoursePackage aggregate in production

    public VerifyPackageCommandHandler(IPackageSecurityService securityService)
    {
        _securityService = securityService;
    }

    public async Task<Result<bool>> Handle(VerifyPackageCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch Package Aggregate (Simulated expected signature from manifest)
        string expectedSignature = "SERVER_GENERATED_ECDSA_SIGNATURE"; 

        // 2. Perform SHA-256 hash check against the local file
        bool isValid = await _securityService.VerifySignatureAsync(request.FilePath, expectedSignature, cancellationToken);

        if (!isValid)
        {
            return Result<bool>.Failure(new Error("Security.PackageTampered", "The package manifest does not match the digital signature. Halting installation."));
        }

        // 3. Mark aggregate as verified and persist (Simulated)
        return Result<bool>.Success(true);
    }
}