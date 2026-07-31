namespace AssetManagement.Application.Features.RegisterAsset;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record RegisterAssetCommand(string AssetName, string Category, string SerialNumber, decimal PurchaseValue) : IRequest<Result<Guid>>;

public sealed class RegisterAssetCommandHandler : IRequestHandler<RegisterAssetCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(RegisterAssetCommand request, CancellationToken cancellationToken)
    {
        var assetId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(assetId));
    }
}
