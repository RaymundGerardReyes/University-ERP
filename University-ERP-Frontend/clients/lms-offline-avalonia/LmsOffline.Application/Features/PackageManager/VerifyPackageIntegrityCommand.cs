namespace LmsOffline.Application.Features.PackageManager;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Application.Interfaces;

public sealed record VerifyPackageIntegrityCommand(Guid PackageId, string FilePath) : IRequest<Result<bool>>;

public sealed class VerifyPackageIntegrityCommandHandler : IRequestHandler<VerifyPackageIntegrityCommand, Result<bool>>
{
    private readonly IPackageVerifier _verifier;
    // In reality, inject IPackageRepository here to fetch the CoursePackage aggregate

    public VerifyPackageIntegrityCommandHandler(IPackageVerifier verifier)
    {
        _verifier = verifier;
    }

    public async Task<Result<bool>> Handle(VerifyPackageIntegrityCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch Package from DB (Simulated)
        string expectedSignature = "MOCK_ECDSA_SIGNATURE"; 

        // 2. Perform SHA-256 / ECDSA check against the local file
        bool isValid = await _verifier.VerifySignatureAsync(request.FilePath, expectedSignature, cancellationToken);

        if (!isValid)
        {
            return Result<bool>.Failure(new Error("Package.Corrupted", "The package manifest does not match the digital signature."));
        }

        return Result<bool>.Success(true);
    }
}