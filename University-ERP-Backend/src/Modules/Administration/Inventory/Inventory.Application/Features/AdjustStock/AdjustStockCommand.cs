namespace Inventory.Application.Features.AdjustStock;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AdjustStockCommand(Guid StockItemId, int Amount, string Reason) : IRequest<Result<bool>>;

public sealed class AdjustStockCommandHandler : IRequestHandler<AdjustStockCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<bool>.Success(true));
    }
}
